// ============================================================
// Maths Digger — Drag-a-Number Game
// Parent enters up to 5 numbers. Child drags each number tile
// onto the big digger. The digger BOOMS with stars. When all
// numbers are dug, a full celebration plays and the tray refills.
// ============================================================

const MAX_NUMBERS = 5;
const TILE_COLORS = ["#FF6B35", "#4CAF50", "#2196F3", "#E91E63", "#7C4DFF"];

let SESSION_NUMBERS = [];   // numbers the parent entered
let remaining = 0;          // how many tiles still to dig this round

// --- DOM refs ---
const tray         = document.getElementById("number-tray");
const dropDigger   = document.getElementById("drop-digger");
const dropGlow     = document.getElementById("drop-glow");
const numberFlash  = document.getElementById("number-flash");
const dirtPuffs    = document.getElementById("dirt-puffs");
const celebration  = document.getElementById("celebration");
const bigDigger    = document.getElementById("big-digger");
const celebText    = document.getElementById("celebration-text");
const confettiCont = document.getElementById("confetti-container");
const starsCont    = document.getElementById("stars-container");

// ============================================================
// Parent setup screen
// ============================================================
function showSetup() {
  const overlay  = document.getElementById("number-setup");
  const input    = document.getElementById("number-input");
  const btn      = document.getElementById("setup-btn");
  const errorDiv = document.getElementById("setup-error");

  overlay.style.display = "flex";
  setTimeout(() => input.focus(), 300);

  function tryStart() {
    const raw = input.value.trim();
    if (!raw) {
      errorDiv.textContent = "Please type at least one number!";
      return;
    }

    const cleaned = raw
      .split(",")
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const bad = cleaned.find(n => !/^\d{1,3}$/.test(n));
    if (bad) {
      errorDiv.textContent = `"${bad}" is not a number — digits only please.`;
      return;
    }

    const parsed = cleaned.map(n => String(parseInt(n, 10))).slice(0, MAX_NUMBERS);
    if (parsed.length === 0) {
      errorDiv.textContent = "Please type at least one number!";
      return;
    }

    SESSION_NUMBERS = parsed;
    overlay.style.display = "none";
    startRound();
  }

  btn.addEventListener("pointerdown", (e) => { e.stopPropagation(); tryStart(); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryStart(); });
}

// ============================================================
// Round setup — build the tray of draggable number tiles
// ============================================================
function startRound() {
  tray.innerHTML = "";
  remaining = SESSION_NUMBERS.length;

  SESSION_NUMBERS.forEach((value, i) => {
    const tile = document.createElement("div");
    tile.className = "num-tile";
    tile.textContent = value;
    tile.dataset.value = value;
    tile.style.background = TILE_COLORS[i % TILE_COLORS.length];
    tile.addEventListener("pointerdown", (e) => startDrag(e, tile));
    tray.appendChild(tile);

    // Pop each tile in
    gsap.fromTo(tile,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", delay: 0.1 + i * 0.08 }
    );
  });
}

// ============================================================
// Drag handling (pointer events — works on touch + mouse)
// ============================================================
let drag = null;  // { tile, clone, offsetX, offsetY, value }

function startDrag(e, tile) {
  if (drag || tile.classList.contains("done")) return;
  e.preventDefault();

  const rect = tile.getBoundingClientRect();
  const clone = tile.cloneNode(true);
  clone.classList.add("drag-clone");
  clone.style.left   = rect.left + "px";
  clone.style.top    = rect.top + "px";
  clone.style.width  = rect.width + "px";
  clone.style.height = rect.height + "px";
  document.body.appendChild(clone);

  tile.style.opacity = "0.25";

  drag = {
    tile,
    clone,
    value: tile.dataset.value,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
  };

  window.addEventListener("pointermove", onDragMove);
  window.addEventListener("pointerup", onDragEnd);
  window.addEventListener("pointercancel", onDragEnd);
}

function onDragMove(e) {
  if (!drag) return;
  drag.clone.style.left = (e.clientX - drag.offsetX) + "px";
  drag.clone.style.top  = (e.clientY - drag.offsetY) + "px";

  // Highlight the digger when the finger hovers over it
  dropDigger.classList.toggle("drop-ready", isOverDigger(e.clientX, e.clientY));
}

function onDragEnd(e) {
  if (!drag) return;
  window.removeEventListener("pointermove", onDragMove);
  window.removeEventListener("pointerup", onDragEnd);
  window.removeEventListener("pointercancel", onDragEnd);

  const over = isOverDigger(e.clientX, e.clientY);
  dropDigger.classList.remove("drop-ready");

  if (over) {
    dropOnDigger(drag);
  } else {
    snapBack(drag);
  }
  drag = null;
}

// Generous hit area so little hands don't have to be precise
function isOverDigger(x, y) {
  const r = dropDigger.getBoundingClientRect();
  const pad = 50;
  return x >= r.left - pad && x <= r.right + pad &&
         y >= r.top - pad  && y <= r.bottom + pad;
}

function snapBack(d) {
  const homeRect = d.tile.getBoundingClientRect();
  gsap.to(d.clone, {
    left: homeRect.left,
    top: homeRect.top,
    duration: 0.3,
    ease: "back.out(1.5)",
    onComplete: () => {
      d.clone.remove();
      d.tile.style.opacity = "1";
    }
  });
}

// ============================================================
// Successful drop — BOOM!
// ============================================================
function dropOnDigger(d) {
  d.clone.remove();
  d.tile.classList.add("done");

  remaining--;

  playCelebrationSound();
  boomDigger();
  flashNumber(d.value);
  sprayDirt(dropDigger.getBoundingClientRect());
  spawnStars(8);

  if (remaining <= 0) {
    setTimeout(finalCelebration, 900);
  }
}

function boomDigger() {
  document.body.classList.add("rumble");
  setTimeout(() => document.body.classList.remove("rumble"), 450);

  const bucket = document.getElementById("dd-bucket");
  const boom   = document.getElementById("dd-boom");

  // Bucket scoops down then back
  gsap.timeline()
    .to([bucket, boom], { y: 10, duration: 0.15, ease: "power2.out" })
    .to([bucket, boom], { y: 0,  duration: 0.4,  ease: "bounce.out" });

  // Whole digger pops
  gsap.fromTo(dropDigger,
    { scale: 1 },
    { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out",
      transformOrigin: "center center" }
  );
}

function flashNumber(value) {
  const r = dropDigger.getBoundingClientRect();
  numberFlash.textContent = value;
  numberFlash.style.left = (r.left + r.width / 2) + "px";
  numberFlash.style.top  = (r.top + r.height * 0.35) + "px";

  gsap.fromTo(numberFlash,
    { opacity: 0, scale: 0.3, y: 0 },
    { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)",
      onComplete: () => {
        gsap.to(numberFlash, { opacity: 0, scale: 1.4, y: -60, duration: 0.7, delay: 0.5, ease: "power2.in" });
      }
    }
  );
}

// ============================================================
// Final celebration (all numbers dug) + refill
// ============================================================
function finalCelebration() {
  celebration.classList.add("active");
  confettiCont.innerHTML = "";
  starsCont.innerHTML = "";

  gsap.to(celebration, { opacity: 1, duration: 0.4 });
  gsap.fromTo(bigDigger,
    { scale: 0.1, y: 100 },
    { scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
  );
  gsap.fromTo(celebText,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.7 }
  );

  spawnConfetti();
  spawnStars(14);
  playCelebrationSound();

  setTimeout(endCelebration, 4000);
}

function endCelebration() {
  gsap.to(celebration, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      celebration.classList.remove("active");
      gsap.set(bigDigger, { scale: 0 });
      confettiCont.innerHTML = "";
      starsCont.innerHTML = "";
      startRound();   // refill the tray with the same numbers
    }
  });
}

// ============================================================
// Celebration sound (Web Audio API, no file needed)
// ============================================================
function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.6, 329.6, 392.0, 523.3];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.10;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.35, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  } catch (e) { /* audio unavailable — skip */ }
}

// ============================================================
// Particle effects
// ============================================================
function sprayDirt(rect) {
  const cx = rect.left + rect.width * 0.7;
  const cy = rect.top + rect.height * 0.45;

  for (let i = 0; i < 14; i++) {
    const puff = document.createElement("div");
    puff.className = "puff";
    puff.style.left = cx + "px";
    puff.style.top  = cy + "px";
    puff.style.width  = (12 + Math.random() * 16) + "px";
    puff.style.height = puff.style.width;
    dirtPuffs.appendChild(puff);

    gsap.fromTo(puff,
      { opacity: 0.9, scale: 0.4 },
      {
        opacity: 0, scale: 2,
        x: (Math.random() - 0.4) * 120,
        y: -(30 + Math.random() * 80),
        duration: 0.8 + Math.random() * 0.4,
        ease: "power3.out",
        onComplete: () => puff.remove()
      }
    );
  }
}

const CONFETTI_COLORS = ["#FF6B35", "#F5A623", "#4CAF50", "#2196F3", "#E91E63", "#9C27B0", "#00BCD4"];

function spawnConfetti() {
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.left = (10 + Math.random() * 80) + "vw";
    el.style.top = "-20px";
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    confettiCont.appendChild(el);

    gsap.to(el, {
      y: "110vh",
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 720,
      opacity: 1,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.8,
      ease: "power1.in",
      onComplete: () => el.remove()
    });
  }
}

function spawnStars(count) {
  const emojis = ["⭐", "🌟", "✨", "💫"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "star";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = (5  + Math.random() * 90) + "vw";
    el.style.top  = (10 + Math.random() * 70) + "vh";
    starsCont.appendChild(el);

    gsap.fromTo(el,
      { opacity: 0, scale: 0 },
      {
        opacity: 1, scale: 1.5, duration: 0.4,
        delay: Math.random() * 0.5,
        ease: "back.out(2)",
        onComplete: () => gsap.to(el, { opacity: 0, scale: 0, duration: 0.3, delay: 1 + Math.random(), onComplete: () => el.remove() })
      }
    );
  }
}

// ============================================================
// Start
// ============================================================
window.addEventListener("DOMContentLoaded", showSetup);
