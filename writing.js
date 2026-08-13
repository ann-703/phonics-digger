// ---- Geometry helpers (all coordinates live in a 300x300 logical box) ----

function lineStroke(x1, y1, x2, y2, n) {
  const points = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    points.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
  }
  return { points, svgPath: `M${x1},${y1} L${x2},${y2}` };
}

function circleStroke(cx, cy, r, n) {
  const points = [];
  // Start at top (-90deg), go clockwise a full turn.
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const angle = -Math.PI / 2 + t * Math.PI * 2;
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  const top = `${cx},${cy - r}`;
  const bottom = `${cx},${cy + r}`;
  const svgPath = `M${top} A${r},${r} 0 1,1 ${bottom} A${r},${r} 0 1,1 ${top}`;
  return { points, svgPath };
}

function bezierStroke(p0, p1, p2, p3, n) {
  const points = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const mt = 1 - t;
    const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
    const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
    points.push({ x, y });
  }
  const svgPath = `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  return { points, svgPath };
}

// ---- Shape definitions (OT pre-writing order, diagonals excluded for now) ----

const SHAPES = [
  {
    id: "vertical",
    label: "Straight Line Down",
    strokes: [lineStroke(150, 40, 150, 260, 40)],
  },
  {
    id: "horizontal",
    label: "Straight Line Across",
    strokes: [lineStroke(40, 150, 260, 150, 40)],
  },
  {
    id: "circle",
    label: "Circle",
    strokes: [circleStroke(150, 150, 100, 72)],
  },
  {
    id: "cross",
    label: "Cross",
    strokes: [
      lineStroke(150, 60, 150, 240, 40),
      lineStroke(60, 150, 240, 150, 40),
    ],
  },
  {
    id: "curvy",
    label: "Curvy Line",
    strokes: [bezierStroke({ x: 40, y: 150 }, { x: 100, y: 60 }, { x: 200, y: 240 }, { x: 260, y: 150 }, 60)],
  },
];

const REPS_PER_SHAPE = 3;
const ERASE_TOLERANCE = 40;   // logical units — how far off-path a touch can still erase
const COVER_RADIUS = 22;      // logical units — how close a touch must get to mark a sample "covered"
const BRUSH_RADIUS = 26;      // logical units — visual size of the eraser brush
const COMPLETE_FRACTION = 0.8;

// ---- State ----

let shapeIndex = 0;
let repIndex = 0;
let covered = [];       // covered[strokeIdx] = boolean[] matching stroke.points
let repCompleted = false;
let isDrawing = false;

// ---- DOM refs ----

const guideSvg = document.getElementById("guide-svg");
const shapeLabel = document.getElementById("shape-label");
const dirtCanvas = document.getElementById("dirt-canvas");
const ctx = dirtCanvas.getContext("2d");
const refillBtn = document.getElementById("refill-btn");
const repDots = document.querySelectorAll(".rep-dot");
const diggerEl = document.getElementById("writing-digger");

const SCALE = dirtCanvas.width / 300; // canvas is drawn at 2x logical resolution for crispness

// ---- Guide panel (left) ----

const SVG_NS = "http://www.w3.org/2000/svg";

function renderGuide(shape) {
  guideSvg.innerHTML = "";
  shapeLabel.textContent = shape.label;

  shape.strokes.forEach((stroke, i) => {
    const pathId = `guide-path-${shape.id}-${i}`;

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("id", pathId);
    path.setAttribute("d", stroke.svgPath);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#4CAF50");
    path.setAttribute("stroke-width", "10");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    guideSvg.appendChild(path);

    // Dot lives inside the same SVG (and viewBox) as the guide path, so it
    // always tracks the path correctly regardless of on-screen panel size —
    // a separate CSS-positioned element with its own offset-path would drift
    // out of sync since CSS motion-path coordinates aren't viewBox-scaled.
    const dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttribute("r", "9");
    dot.setAttribute("fill", "#FF6B35");
    dot.style.filter = "drop-shadow(0 0 5px rgba(255,107,53,0.8))";

    const motion = document.createElementNS(SVG_NS, "animateMotion");
    motion.setAttribute("dur", "2.4s");
    motion.setAttribute("repeatCount", "indefinite");

    const mpath = document.createElementNS(SVG_NS, "mpath");
    mpath.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${pathId}`);
    mpath.setAttribute("href", `#${pathId}`);

    motion.appendChild(mpath);
    dot.appendChild(motion);
    guideSvg.appendChild(dot);
  });
}

// ---- Dirt panel (right) ----

function resetDirtCanvas() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, dirtCanvas.width, dirtCanvas.height);
  ctx.scale(SCALE, SCALE);

  // The bright reveal color lives on #dirt-box behind the canvas (see
  // writing.html) — erasing dirt here exposes it directly, since a single
  // canvas layer can't preserve "what was under" an erased pixel itself.
  const dirtGradient = ctx.createLinearGradient(0, 0, 0, 300);
  dirtGradient.addColorStop(0, "#8B6914");
  dirtGradient.addColorStop(1, "#6B4F10");
  ctx.fillStyle = dirtGradient;
  ctx.fillRect(0, 0, 300, 300);
}

function resetCoverage(shape) {
  covered = shape.strokes.map((s) => new Array(s.points.length).fill(false));
}

function loadShape() {
  const shape = SHAPES[shapeIndex];
  repCompleted = false;
  renderGuide(shape);
  resetDirtCanvas();
  resetCoverage(shape);
  updateRepDots();
}

function refillCurrentRep() {
  repCompleted = false;
  resetDirtCanvas();
  resetCoverage(SHAPES[shapeIndex]);
}

function updateRepDots() {
  repDots.forEach((dot, i) => dot.classList.toggle("filled", i < repIndex));
}

// ---- Pointer tracing ----

function canvasPoint(evt) {
  const rect = dirtCanvas.getBoundingClientRect();
  const x = ((evt.clientX - rect.left) / rect.width) * 300;
  const y = ((evt.clientY - rect.top) / rect.height) * 300;
  return { x, y };
}

function nearestDistance(strokePoints, x, y) {
  let min = Infinity;
  for (const p of strokePoints) {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < min) min = d;
  }
  return min;
}

function handlePointerMove(evt) {
  if (!isDrawing || repCompleted) return;
  const { x, y } = canvasPoint(evt);
  const shape = SHAPES[shapeIndex];

  let withinTolerance = false;
  shape.strokes.forEach((stroke, si) => {
    const dist = nearestDistance(stroke.points, x, y);
    if (dist <= ERASE_TOLERANCE) {
      withinTolerance = true;
      stroke.points.forEach((p, pi) => {
        if (!covered[si][pi] && Math.hypot(p.x - x, p.y - y) <= COVER_RADIUS) {
          covered[si][pi] = true;
        }
      });
    }
  });

  if (withinTolerance) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  checkCompletion();
}

function checkCompletion() {
  let total = 0;
  let done = 0;
  covered.forEach((arr) => {
    total += arr.length;
    done += arr.filter(Boolean).length;
  });
  if (total > 0 && done / total >= COMPLETE_FRACTION) {
    completeRep();
  }
}

function completeRep() {
  if (repCompleted) return;
  repCompleted = true;
  cheerDigger();
  setTimeout(advance, 900);
}

function advance() {
  if (repIndex < REPS_PER_SHAPE - 1) {
    repIndex++;
    refillCurrentRep();
    updateRepDots();
  } else {
    repIndex = 0;
    shapeIndex = (shapeIndex + 1) % SHAPES.length;
    loadShape();
  }
}

function cheerDigger() {
  gsap.fromTo(
    diggerEl,
    { rotation: -8, transformOrigin: "50% 100%" },
    {
      rotation: 8,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: "none",
      onComplete: () => gsap.set(diggerEl, { rotation: 0 }),
    }
  );
}

// ---- Wire up events ----

dirtCanvas.addEventListener("pointerdown", (e) => {
  isDrawing = true;
  handlePointerMove(e);
});
window.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", () => { isDrawing = false; });
window.addEventListener("pointercancel", () => { isDrawing = false; });

refillBtn.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
  refillCurrentRep();
});

// ---- Init ----

loadShape();
