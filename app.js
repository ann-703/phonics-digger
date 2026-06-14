// ============================================================
// Phonics Digger — Phase 1 MVP
// One hardcoded word. Parent taps ✓ to confirm each phoneme.
// Child taps digger to advance. Mud pit + big digger celebration.
// ============================================================

// --- Word data (Phase 2 will load from words.xlsx) ---
const WORDS = [
  { word: "hat", display: ["h", "a", "t"] },
  { word: "big", display: ["b", "i", "g"] },
  { word: "cup", display: ["c", "u", "p"] },
  { word: "sun", display: ["s", "u", "n"] },
  { word: "cat", display: ["c", "a", "t"] },
];

// --- State ---
let state = {
  wordIndex: 0,
  currentWord: null,
  currentPhoneme: 0,    // which letter we're on (0-based)
  phonemeConfirmed: false,
  phase: "idle",        // idle | listening | confirmed | advancing | mudpit | celebrating
};

// --- DOM refs ---
const wordTrack    = document.getElementById("word-track");
const diggerWrap   = document.getElementById("digger-wrapper");
const digger       = document.getElementById("digger");
const tapHint      = document.getElementById("tap-hint");
const confirmBtn   = document.getElementById("confirm-btn");
const mudpit       = document.getElementById("mudpit");
const celebration  = document.getElementById("celebration");
const bigDigger    = document.getElementById("big-digger");
const celebText    = document.getElementById("celebration-text");
const wordBanner   = document.getElementById("word-banner");
const confettiCont = document.getElementById("confetti-container");
const starsCont    = document.getElementById("stars-container");
const dirtPuffs    = document.getElementById("dirt-puffs");

// --- Layout constants (calculated after render) ---
const LETTER_BLOCK_W = 100;
const LETTER_GAP = 24;
const DIGGER_W = 120;
const DIGGER_H = 80;
const TRACK_Y_CENTER = 0; // set after render

// --- Init ---
function init() {
  state.currentWord = WORDS[state.wordIndex];
  renderLetterBlocks();
  positionElements();
  placeDiggerAtIndex(0, false);
  setPhase("listening");
}

// --- Render letter blocks ---
function renderLetterBlocks() {
  wordTrack.innerHTML = "";
  state.currentWord.display.forEach((letter, i) => {
    const block = document.createElement("div");
    block.className = "letter-block" + (i === 0 ? " active" : "");
    block.dataset.index = i;
    block.textContent = letter;
    wordTrack.appendChild(block);
  });
}

// --- Position mud pit and get block positions ---
function positionElements() {
  // Word track is already centered via CSS
  // We need absolute coords of each block for digger movement
  // Let the browser lay out first
}

function getBlockRect(index) {
  const blocks = wordTrack.querySelectorAll(".letter-block");
  if (!blocks[index]) return null;
  return blocks[index].getBoundingClientRect();
}

function getMudpitTarget() {
  const blocks = wordTrack.querySelectorAll(".letter-block");
  const last = blocks[blocks.length - 1];
  if (!last) return { x: 0, y: 0 };
  const r = last.getBoundingClientRect();
  return {
    x: r.right + LETTER_GAP * 2,
    y: r.top + r.height / 2
  };
}

// --- Place digger below a letter block ---
function placeDiggerAtIndex(index, animated) {
  const rect = getBlockRect(index);
  if (!rect) return;

  const targetX = rect.left + rect.width / 2 - DIGGER_W / 2;
  const targetY = rect.bottom + 12;

  if (!animated) {
    diggerWrap.style.left = targetX + "px";
    diggerWrap.style.top  = targetY + "px";
  }

  return { x: targetX, y: targetY };
}

// --- Phase machine ---
function setPhase(newPhase) {
  state.phase = newPhase;

  switch (newPhase) {
    case "listening":
      // Waiting for parent to confirm
      confirmBtn.classList.remove("hidden");
      // Highlight current block
      highlightBlock(state.currentPhoneme);
      // Digger arrival bounce (drops down into place)
      gsap.fromTo(diggerWrap,
        { y: -16 },
        { y: 0, duration: 0.35, ease: "bounce.out" }
      );
      break;

    case "confirmed":
      // Parent hit ✓ — animate success then auto-advance
      confirmBtn.classList.add("hidden");
      markBlockDone(state.currentPhoneme);
      playDirtPuff();
      wiggleDigger();
      // Short celebration pause then auto-advance
      setTimeout(() => setPhase("advancing"), 700);
      break;

    case "advancing":
      // Move to next letter or mud pit
      const nextIndex = state.currentPhoneme + 1;

      if (nextIndex >= state.currentWord.display.length) {
        // All phonemes done — go to mud pit
        setPhase("mudpit");
      } else {
        state.currentPhoneme = nextIndex;
        rollDiggerToIndex(nextIndex, () => {
          setPhase("listening");
        });
      }
      break;

    case "mudpit":
      // Drive to mud pit, dig, sink
      driveToMudpit();
      break;

    case "celebrating":
      celebrate();
      break;
  }
}

// --- Block highlight helpers ---
function highlightBlock(index) {
  wordTrack.querySelectorAll(".letter-block").forEach((b, i) => {
    b.classList.toggle("active", i === index);
  });
}

function markBlockDone(index) {
  const block = wordTrack.querySelectorAll(".letter-block")[index];
  if (block) {
    block.classList.remove("active");
    block.classList.add("done");
    // Mini pop animation
    gsap.fromTo(block, { scale: 1.2 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
  }
}

// --- Roll digger to letter index ---
function rollDiggerToIndex(index, onComplete) {
  const target = placeDiggerAtIndex(index, false);
  const rect = getBlockRect(index);
  if (!rect) return;

  const targetX = rect.left + rect.width / 2 - DIGGER_W / 2;
  const targetY = rect.bottom + 12;

  // Bounce wheels with a slight hop
  gsap.to(diggerWrap, {
    left: targetX,
    top: targetY - 10,
    duration: 0.25,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(diggerWrap, {
        top: targetY,
        duration: 0.2,
        ease: "bounce.out",
        onComplete: onComplete || null
      });
    }
  });

  // Spin wheels
  spinWheels();
}

// --- Drive to mud pit ---
function driveToMudpit() {
  const lastRect = getBlockRect(state.currentWord.display.length - 1);
  if (!lastRect) return;

  // Mud pit position: to the right of last block
  const mudX = lastRect.right + LETTER_GAP * 2;
  const mudY  = lastRect.bottom + 12;

  // Position mud pit SVG below and after the last block
  mudpit.style.left = (mudX - 10) + "px";
  mudpit.style.top  = (lastRect.bottom + 10) + "px";
  mudpit.style.position = "fixed";

  // Speed into mud pit
  gsap.to(diggerWrap, {
    left: mudX - DIGGER_W / 2,
    top: mudY,
    duration: 0.8,
    ease: "power3.in",
    onComplete: startDigging
  });

  spinWheels(true);
}

// --- Digging animation ---
function startDigging() {
  // Screen rumble
  document.body.classList.add("rumble");
  setTimeout(() => document.body.classList.remove("rumble"), 450);

  // Bucket lowers (arm boom tilts down) — simple GSAP on transform
  const bucket = document.getElementById("bucket");
  const boom   = document.getElementById("arm-boom");

  gsap.to([bucket, boom], {
    y: 18,
    duration: 0.4,
    ease: "power2.out"
  });

  // Dirt sprays upward
  sprayDirt(diggerWrap.getBoundingClientRect());

  // Digger sinks into pit
  gsap.to(diggerWrap, {
    top: "+=" + 60,
    opacity: 0,
    duration: 0.7,
    delay: 0.3,
    ease: "power2.in",
    onComplete: () => {
      // Reset bucket/boom
      gsap.set([bucket, boom], { y: 0 });
      setPhase("celebrating");
    }
  });
}

// --- Celebration ---
function celebrate() {
  celebration.classList.add("active");
  confettiCont.innerHTML = "";
  starsCont.innerHTML = "";

  const word = state.currentWord.word;

  // Fade in overlay
  gsap.to(celebration, { opacity: 1, duration: 0.4 });

  // Big digger rises from mud
  gsap.fromTo(bigDigger,
    { scale: 0.1, y: 100 },
    { scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
  );


  // Confetti
  spawnConfetti();
  spawnStars();

  // Word banner at top
  wordBanner.textContent = word;
  wordBanner.style.opacity = "1";
  wordBanner.style.pointerEvents = "none";

  // Auto-advance to next word after 4 seconds
  setTimeout(nextWord, 4200);
}

// --- Advance to next word ---
function nextWord() {
  // Fade out celebration
  gsap.to(celebration, {
    opacity: 0, duration: 0.5,
    onComplete: () => {
      celebration.classList.remove("active");
      gsap.set(bigDigger, { scale: 0 });
      gsap.set(celebText, { opacity: 0 });
    }
  });

  wordBanner.style.opacity = "0";
  confettiCont.innerHTML = "";
  starsCont.innerHTML = "";

  // Next word (loop around)
  state.wordIndex = (state.wordIndex + 1) % WORDS.length;
  state.currentPhoneme = 0;
  state.phonemeConfirmed = false;

  // Restore digger
  gsap.set(diggerWrap, { opacity: 1 });
  confirmBtn.classList.remove("hidden");

  state.currentWord = WORDS[state.wordIndex];
  renderLetterBlocks();

  // Small delay before repositioning digger
  setTimeout(() => {
    placeDiggerAtIndex(0, false);
    setPhase("listening");
  }, 600);
}

// --- Digger wiggle (correct phoneme) ---
function wiggleDigger() {
  gsap.fromTo(diggerWrap,
    { rotation: -8 },
    { rotation: 8, duration: 0.1, yoyo: true, repeat: 5, ease: "none",
      onComplete: () => gsap.set(diggerWrap, { rotation: 0 }) }
  );
}

// --- Wheel spin ---
let wheelTimeline = null;
function spinWheels(fast) {
  // Wheels are circles — simulate by rotating the whole digger body slightly
  const dur = fast ? 0.06 : 0.12;
  if (wheelTimeline) wheelTimeline.kill();
  wheelTimeline = gsap.to("#digger", { rotation: 3, duration: dur, yoyo: true, repeat: 8, ease: "none",
    onComplete: () => gsap.set("#digger", { rotation: 0 })
  });
}

// --- Dirt puff on correct phoneme ---
function playDirtPuff() {
  const rect = diggerWrap.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height;

  for (let i = 0; i < 6; i++) {
    const puff = document.createElement("div");
    puff.className = "puff";
    puff.style.left = (cx + (Math.random() - 0.5) * 40) + "px";
    puff.style.top  = cy + "px";
    dirtPuffs.appendChild(puff);

    gsap.fromTo(puff,
      { opacity: 0.8, scale: 0.5, x: 0, y: 0 },
      {
        opacity: 0,
        scale: 1.8,
        x: (Math.random() - 0.5) * 60,
        y: -(20 + Math.random() * 30),
        duration: 0.6 + Math.random() * 0.3,
        ease: "power2.out",
        onComplete: () => puff.remove()
      }
    );
  }
}

// --- Dirt spray during dig ---
function sprayDirt(rect) {
  const cx = rect.left + rect.width;
  const cy = rect.top + rect.height * 0.6;

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
        opacity: 0,
        scale: 2,
        x: (Math.random() - 0.3) * 80,
        y: -(30 + Math.random() * 70),
        duration: 0.8 + Math.random() * 0.4,
        ease: "power3.out",
        onComplete: () => puff.remove()
      }
    );
  }
}

// --- Confetti ---
const CONFETTI_COLORS = ["#FF6B35", "#F5A623", "#4CAF50", "#2196F3", "#E91E63", "#9C27B0", "#00BCD4"];

function spawnConfetti() {
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.left = (10 + Math.random() * 80) + "vw";
    el.style.top  = "-20px";
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
    gsap.to(el, { opacity: 1, duration: 0.1, delay: Math.random() * 0.5 });
  }
}

function spawnStars() {
  const starEmojis = ["⭐", "🌟", "✨", "💫"];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("div");
    el.className = "star";
    el.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
    el.style.left = (5 + Math.random() * 90) + "vw";
    el.style.top  = (10 + Math.random() * 70) + "vh";
    starsCont.appendChild(el);

    gsap.fromTo(el,
      { opacity: 0, scale: 0 },
      {
        opacity: 1, scale: 1.5,
        duration: 0.4,
        delay: 0.3 + Math.random() * 0.8,
        ease: "back.out(2)",
        onComplete: () => gsap.to(el, { opacity: 0, scale: 0, duration: 0.3, delay: 1.5 + Math.random() })
      }
    );
  }
}

// --- Event Listeners ---

// Parent ✓ button
confirmBtn.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
  if (state.phase !== "listening") return;
  setPhase("confirmed");
});

// --- Start ---
window.addEventListener("DOMContentLoaded", () => {
  // Short delay so layout is ready before we read getBoundingClientRect
  setTimeout(init, 150);
});
