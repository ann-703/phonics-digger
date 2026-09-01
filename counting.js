// ============================================================
// Counting Digger — "give me N rocks"
// The digger asks for a number. Ten rocks sit in the dirt.
// The child taps rocks one at a time; each flies into the bucket.
// When the bucket holds the target, the leftovers lock and the
// celebration fires. Overshooting is impossible.
//
// Celebration effects (sprayDirt, spawnConfetti, spawnStars,
// playCelebrationSound, rumbleScreen) come from celebrate.js.
// ============================================================

const ROCK_COUNT   = 10;    // rocks in the dirt every round
const IDLE_HINT_MS = 10000; // pulse the target if nothing happens

// Rock face colours — a little variety so the pile doesn't look tiled
const ROCK_TONES = [
  { light: "#9E9E93", mid: "#7A7A70", dark: "#5C5C54" },
  { light: "#A8A096", mid: "#847C72", dark: "#635C54" },
  { light: "#96968E", mid: "#73736B", dark: "#575751" }
];

let TARGET_POOL = [1, 2, 3, 4, 5];  // numbers the parent chose
let target      = 3;                 // this round's ask
let lastTarget  = null;              // avoid repeating back to back
let inBucket    = 0;                 // rocks delivered this round
let locked      = false;             // target reached — ignore taps
let idleTimer   = null;

// --- DOM refs ---
const rockField    = document.getElementById("rock-field");
const divots       = document.getElementById("divots");
const bucket       = document.getElementById("bucket");
const targetNumber = document.getElementById("target-number");
const targetSign   = document.getElementById("target-sign");
const celebration  = document.getElementById("celebration");
const bigDigger    = document.getElementById("big-digger");
const celebText    = document.getElementById("celebration-text");

// ============================================================
// Parent setup
// ============================================================
function showSetup() {
  const overlay  = document.getElementById("count-setup");
  const input    = document.getElementById("count-input");
  const startBtn = document.getElementById("start-btn");
  const errorDiv = document.getElementById("setup-error");
  const rangeBtns = Array.from(document.querySelectorAll(".range-btn"));

  overlay.classList.remove("hidden");
  errorDiv.textContent = "";

  rangeBtns.forEach(btn => {
    btn.onclick = () => {
      rangeBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      input.value = "";          // a range and a custom list are alternatives
      errorDiv.textContent = "";
    };
  });

  // Typing a custom list clears the range choice
  input.oninput = () => {
    if (input.value.trim()) rangeBtns.forEach(b => b.classList.remove("selected"));
    errorDiv.textContent = "";
  };

  function start() {
    const raw = input.value.trim();

    if (raw) {
      const cleaned = raw.split(",").map(n => n.trim()).filter(n => n.length > 0);
      const bad = cleaned.find(n => !/^\d{1,2}$/.test(n));
      if (bad) {
        errorDiv.textContent = `"${bad}" is not a number — digits only please.`;
        return;
      }
      const parsed = cleaned
        .map(n => parseInt(n, 10))
        .filter(n => n >= 1 && n <= ROCK_COUNT);
      if (parsed.length === 0) {
        errorDiv.textContent = `Please use numbers between 1 and ${ROCK_COUNT}.`;
        return;
      }
      TARGET_POOL = parsed;
    } else {
      const selected = rangeBtns.find(b => b.classList.contains("selected"));
      const max = selected ? parseInt(selected.dataset.max, 10) : 5;
      TARGET_POOL = [];
      for (let n = 1; n <= max; n++) TARGET_POOL.push(n);
    }

    overlay.classList.add("hidden");
    lastTarget = null;
    startRound();
  }

  startBtn.onclick = start;
  input.onkeydown = e => { if (e.key === "Enter") start(); };
}

// ============================================================
// Round setup
// ============================================================
function pickTarget() {
  if (TARGET_POOL.length === 1) return TARGET_POOL[0];
  let n;
  do {
    n = TARGET_POOL[Math.floor(Math.random() * TARGET_POOL.length)];
  } while (n === lastTarget);
  return n;
}

function startRound() {
  target     = pickTarget();
  lastTarget = target;
  inBucket   = 0;
  locked     = false;

  targetNumber.textContent = target;
  bucket.innerHTML = "";
  divots.innerHTML = "";
  scatterRocks();
  resetIdleTimer();

  gsap.fromTo(targetSign,
    { scale: 0.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" }
  );
}

// Loose jittered scatter — a neat row invites tapping along it
// without counting, which is exactly what we don't want.
function scatterRocks() {
  rockField.innerHTML = "";

  const cols = 4, rows = 3;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push({ r, c });
  }
  // Shuffle, then keep ROCK_COUNT of the 12 cells
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  const marginX = 9, marginY = 14;         // % padding inside the field
  const cellW = (100 - marginX * 2) / cols;
  const cellH = (100 - marginY * 2) / rows;

  cells.slice(0, ROCK_COUNT).forEach((cell, i) => {
    const jitterX = (Math.random() - 0.5) * cellW * 0.45;
    const jitterY = (Math.random() - 0.5) * cellH * 0.45;
    const x = marginX + cell.c * cellW + cellW / 2 + jitterX;
    const y = marginY + cell.r * cellH + cellH / 2 + jitterY;

    rockField.appendChild(makeRock(x, y, i));
  });
}

function makeRock(xPct, yPct, index) {
  const tone = ROCK_TONES[index % ROCK_TONES.length];
  const size = 78 + Math.random() * 16;   // comfortably above a 72px tap target

  const el = document.createElement("div");
  el.className = "rock";
  el.style.left   = xPct + "%";
  el.style.top    = yPct + "%";
  el.style.width  = size + "px";
  el.style.height = (size * 0.84) + "px";
  el.style.transform = `translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 40}deg)`;
  el.innerHTML = rockSvg(tone);

  // pointerdown, not click — no tap delay, and it matches maths.js
  el.addEventListener("pointerdown", () => sendRock(el));
  return el;
}

function rockSvg(tone) {
  return `<svg viewBox="0 0 100 84" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,60 20,24 46,8 78,18 94,48 84,74 40,80" fill="${tone.mid}"/>
    <polygon points="20,24 46,8 78,18 62,38 30,42" fill="${tone.light}"/>
    <polygon points="8,60 30,42 62,38 40,80" fill="${tone.dark}" opacity="0.55"/>
    <polygon points="8,60 20,24 46,8 78,18 94,48 84,74 40,80"
             fill="none" stroke="${tone.dark}" stroke-width="3" stroke-linejoin="round"/>
  </svg>`;
}

// ============================================================
// Tap a rock → it flies into the bucket
// ============================================================
function sendRock(el) {
  if (locked || el.classList.contains("flying") || el.classList.contains("spent")) return;

  resetIdleTimer();
  leaveDivot(el);

  const from = el.getBoundingClientRect();
  const to   = nextBucketSlot();

  el.classList.add("flying");
  // Fix the rock to the viewport so it can fly across both panels
  el.style.position = "fixed";
  el.style.left = from.left + "px";
  el.style.top  = from.top  + "px";
  el.style.width  = from.width + "px";
  el.style.height = from.height + "px";
  el.style.transform = "none";

  const dx = to.x - (from.left + from.width / 2);
  const dy = to.y - (from.top + from.height / 2);
  const dur = 0.55;

  // Arc: x travels steadily while y rises then falls
  gsap.to(el, { x: dx, duration: dur, ease: "none" });
  gsap.to(el, { rotation: (Math.random() - 0.5) * 300, duration: dur, ease: "none" });
  gsap.timeline()
    .to(el, { y: dy - 150, duration: dur * 0.45, ease: "power2.out" })
    .to(el, { y: dy, duration: dur * 0.55, ease: "power2.in" })
    .call(() => landRock(el, to));
}

function landRock(el, slot) {
  el.classList.remove("flying");
  el.classList.add("spent");

  addBucketRock(slot);
  sprayDirt(bucket.getBoundingClientRect(), 8);

  inBucket++;

  if (inBucket >= target) {
    locked = true;
    clearTimeout(idleTimer);
    lockLeftoverRocks();
    setTimeout(celebrate, 550);
  }
}

// A hole where the rock used to be. The pile never reflows, so he can
// always see which rocks he has already sent.
function leaveDivot(el) {
  const hole = document.createElement("div");
  hole.className = "divot";
  hole.style.left   = el.style.left;
  hole.style.top    = el.style.top;
  hole.style.width  = el.style.width;
  hole.style.height = parseFloat(el.style.height) * 0.55 + "px";
  divots.appendChild(hole);
  gsap.to(hole, { opacity: 0.75, duration: 0.3 });
}

function lockLeftoverRocks() {
  rockField.querySelectorAll(".rock:not(.spent)").forEach(r => r.classList.add("locked"));
}

// ============================================================
// Bucket
// ============================================================
// Rocks stack in rows so the quantity stays countable on screen.
function nextBucketSlot() {
  const r = bucket.getBoundingClientRect();
  const perRow = 4;
  const idx = inBucket;
  const row = Math.floor(idx / perRow);
  const col = idx % perRow;

  // Fill from the bottom up
  const x = r.left + r.width * ((col + 0.5) / perRow);
  const y = r.bottom - r.height * 0.22 - row * (r.height * 0.30);
  return { x, y, localX: ((col + 0.5) / perRow) * 100, localY: y - r.top };
}

function addBucketRock(slot) {
  const tone = ROCK_TONES[Math.floor(Math.random() * ROCK_TONES.length)];
  const el = document.createElement("div");
  el.className = "bucket-rock";
  el.style.left = slot.localX + "%";
  el.style.top  = slot.localY + "px";
  el.innerHTML = rockSvg(tone);
  bucket.appendChild(el);

  gsap.to(el, { scale: 1, duration: 0.28, ease: "back.out(2.4)" });
  rumbleBucket();
}

function rumbleBucket() {
  gsap.fromTo(bucket,
    { y: 0 },
    { y: 5, duration: 0.09, yoyo: true, repeat: 1, ease: "power2.out" }
  );
}

// ============================================================
// Idle nudge — pulse the number, never give away the answer
// ============================================================
function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (locked) return;
    gsap.fromTo(targetSign,
      { scale: 1 },
      { scale: 1.12, duration: 0.4, yoyo: true, repeat: 3, ease: "power1.inOut" }
    );
    resetIdleTimer();
  }, IDLE_HINT_MS);
}

// ============================================================
// Celebration
// ============================================================
function celebrate() {
  rumbleScreen();
  celebText.textContent = `THAT'S ${target}!`;
  celebration.classList.add("active");

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
      document.getElementById("confetti-container").innerHTML = "";
      document.getElementById("stars-container").innerHTML = "";
      startRound();
    }
  });
}

// ============================================================
// Start
// ============================================================
document.getElementById("setup-btn-corner").addEventListener("click", () => {
  clearTimeout(idleTimer);
  showSetup();
});

window.addEventListener("DOMContentLoaded", showSetup);
