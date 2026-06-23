// ============================================================
// Phonics Digger — Phase 1 MVP
// One hardcoded word. Parent taps ✓ to confirm each phoneme.
// Child taps digger to advance. Mud pit + big digger celebration.
// ============================================================

// --- Word data ---
const ALL_WORDS = [
  { word: "hat", display: ["h", "a", "t"] },
  { word: "cat", display: ["c", "a", "t"] },
  { word: "mat", display: ["m", "a", "t"] },
  { word: "bat", display: ["b", "a", "t"] },
  { word: "sat", display: ["s", "a", "t"] },
  { word: "big", display: ["b", "i", "g"] },
  { word: "dig", display: ["d", "i", "g"] },
  { word: "pig", display: ["p", "i", "g"] },
  { word: "cup", display: ["c", "u", "p"] },
  { word: "sun", display: ["s", "u", "n"] },
  { word: "hot", display: ["h", "o", "t"] },
  { word: "pot", display: ["p", "o", "t"] },
];

// Word → inline SVG illustration for the bucket badge
const WORD_SVG = {
  hat: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect x="7" y="30" width="30" height="6" rx="3" fill="#1a1a2e"/>
    <rect x="15" y="12" width="14" height="18" rx="2" fill="#16213e"/>
    <line x1="15" y1="21" x2="29" y2="21" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  cat: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <polygon points="12,20 9,8 19,17" fill="#FF8C42"/>
    <polygon points="32,20 35,8 25,17" fill="#FF8C42"/>
    <circle cx="22" cy="26" r="13" fill="#FF8C42"/>
    <circle cx="17" cy="24" r="2.5" fill="#222"/>
    <circle cx="27" cy="24" r="2.5" fill="#222"/>
    <circle cx="17.8" cy="23.2" r="0.9" fill="#fff"/>
    <circle cx="27.8" cy="23.2" r="0.9" fill="#fff"/>
    <ellipse cx="22" cy="30" rx="3" ry="2" fill="#FF6B9D"/>
    <line x1="22" y1="30" x2="22" y2="33" stroke="#FF6B9D" stroke-width="1.5"/>
  </svg>`,

  mat: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect x="4" y="15" width="36" height="18" rx="3" fill="#7B5533"/>
    <rect x="7" y="18" width="30" height="12" rx="2" fill="#9E6B44"/>
    <line x1="13" y1="18" x2="13" y2="30" stroke="#7B5533" stroke-width="2.5"/>
    <line x1="19" y1="18" x2="19" y2="30" stroke="#7B5533" stroke-width="2.5"/>
    <line x1="25" y1="18" x2="25" y2="30" stroke="#7B5533" stroke-width="2.5"/>
    <line x1="31" y1="18" x2="31" y2="30" stroke="#7B5533" stroke-width="2.5"/>
  </svg>`,

  bat: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M22,22 Q14,12 4,17 Q10,24 18,23" fill="#5B3A8A"/>
    <path d="M22,22 Q30,12 40,17 Q34,24 26,23" fill="#5B3A8A"/>
    <ellipse cx="22" cy="26" rx="5" ry="6.5" fill="#5B3A8A"/>
    <polygon points="18,19 16,11 21,18" fill="#5B3A8A"/>
    <polygon points="26,19 28,11 23,18" fill="#5B3A8A"/>
    <circle cx="19.5" cy="23" r="1.8" fill="#FF4444"/>
    <circle cx="24.5" cy="23" r="1.8" fill="#FF4444"/>
  </svg>`,

  sat: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect x="10" y="10" width="4" height="14" rx="2" fill="#8B4513"/>
    <rect x="10" y="21" width="24" height="5" rx="2" fill="#A0522D"/>
    <rect x="10" y="26" width="4" height="13" rx="2" fill="#8B4513"/>
    <rect x="30" y="26" width="4" height="13" rx="2" fill="#8B4513"/>
  </svg>`,

  big: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <ellipse cx="20" cy="30" rx="11" ry="8" fill="#8FAACC"/>
    <circle cx="26" cy="20" r="10" fill="#A0B8D8"/>
    <path d="M24 29 Q32 32 31 40" stroke="#8FAACC" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="23" cy="17" r="2" fill="#222"/>
    <circle cx="23.8" cy="16.2" r="0.7" fill="#fff"/>
    <ellipse cx="30" cy="13" rx="3" ry="4" fill="#A0B8D8"/>
  </svg>`,

  dig: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect x="20" y="6" width="5" height="22" rx="2.5" fill="#8B4513"/>
    <rect x="19" y="27" width="7" height="3" rx="1" fill="#666"/>
    <path d="M16 30 Q16 40 22 40 Q28 40 28 30 Z" fill="#888"/>
    <rect x="14" y="26" width="5" height="3" rx="1.5" fill="#8B4513"/>
  </svg>`,

  pig: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <ellipse cx="13" cy="17" rx="5" ry="6" fill="#FFB6C1"/>
    <ellipse cx="31" cy="17" rx="5" ry="6" fill="#FFB6C1"/>
    <circle cx="22" cy="25" r="13" fill="#FFB6C1"/>
    <ellipse cx="22" cy="30" rx="6.5" ry="4.5" fill="#FF9BAA"/>
    <circle cx="20" cy="29" r="1.5" fill="#CC4466"/>
    <circle cx="24" cy="29" r="1.5" fill="#CC4466"/>
    <circle cx="16.5" cy="22" r="2.5" fill="#222"/>
    <circle cx="27.5" cy="22" r="2.5" fill="#222"/>
    <circle cx="17.2" cy="21.3" r="0.9" fill="#fff"/>
    <circle cx="28.2" cy="21.3" r="0.9" fill="#fff"/>
  </svg>`,

  cup: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M11 15 L14 37 L30 37 L33 15 Z" fill="#E74C3C"/>
    <rect x="9" y="12" width="26" height="5" rx="2.5" fill="#C0392B"/>
    <path d="M33 19 Q41 19 41 26 Q41 33 33 33" stroke="#C0392B" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <line x1="15" y1="21" x2="29" y2="21" stroke="#FF8080" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  sun: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <line x1="22" y1="3" x2="22" y2="10" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <line x1="22" y1="34" x2="22" y2="41" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <line x1="3" y1="22" x2="10" y2="22" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <line x1="34" y1="22" x2="41" y2="22" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <line x1="7.5" y1="7.5" x2="12.4" y2="12.4" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <line x1="31.6" y1="31.6" x2="36.5" y2="36.5" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <line x1="36.5" y1="7.5" x2="31.6" y2="12.4" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <line x1="7.5" y1="36.5" x2="12.4" y2="31.6" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <circle cx="22" cy="22" r="9" fill="#FFD700"/>
    <circle cx="22" cy="22" r="6" fill="#FFF176"/>
  </svg>`,

  hot: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M22 39 Q9 30 13 19 Q15 27 20 23 Q16 15 22 7 Q25 16 29 13 Q37 22 31 31 Q33 24 27 27 Q31 35 22 39Z" fill="#FF4500"/>
    <path d="M22 35 Q15 28 18 22 Q19 27 22 24 Q20 17 22 13 Q24 20 27 18 Q32 25 27 30 Q29 24 25 27 Q27 31 22 35Z" fill="#FFD700"/>
  </svg>`,

  pot: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect x="16" y="9" width="12" height="5" rx="2.5" fill="#546E7A"/>
    <path d="M10 19 Q10 39 22 39 Q34 39 34 19 Z" fill="#607D8B"/>
    <ellipse cx="22" cy="19" rx="12" ry="4" fill="#78909C"/>
    <line x1="5" y1="24" x2="10" y2="24" stroke="#455A64" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="34" y1="24" x2="39" y2="24" stroke="#455A64" stroke-width="4.5" stroke-linecap="round"/>
  </svg>`,
};

// Deck shuffle: Fisher-Yates, returns a new shuffled copy
function shuffleDeck(arr) {
  const deck = [...arr];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

let SESSION_WORDS = []; // set at session start from parent input
let WORDS = [];

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
const celebEmoji   = document.getElementById("celebration-emoji");

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

  // Big illustration pops in above the digger
  celebEmoji.innerHTML = WORD_SVG[word] || "";
  gsap.fromTo(celebEmoji,
    { opacity: 0, scale: 0, y: 40 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2)", delay: 0.7 }
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
      gsap.set(celebEmoji, { opacity: 0, scale: 0 });
    }
  });

  wordBanner.style.opacity = "0";
  confettiCont.innerHTML = "";
  starsCont.innerHTML = "";

  // Next word — cycle through session words, reshuffling when exhausted
  state.wordIndex++;
  if (state.wordIndex >= WORDS.length) {
    WORDS = shuffleDeck([...SESSION_WORDS]);
    state.wordIndex = 0;
  }
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
    showBucketImage(state.currentWord.word);
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

// --- Word setup screen ---
function showSetup() {
  const overlay   = document.getElementById("word-setup");
  const input     = document.getElementById("word-input");
  const btn       = document.getElementById("setup-btn");
  const errorDiv  = document.getElementById("setup-error");

  overlay.style.display = "flex";
  setTimeout(() => input.focus(), 300);

  function tryStart() {
    const raw = input.value.trim();
    if (!raw) {
      errorDiv.textContent = "Please type at least one word!";
      return;
    }
    const parsed = raw
      .split(",")
      .map(w => w.trim().toLowerCase().replace(/[^a-z]/g, ""))
      .filter(w => w.length >= 2)
      .slice(0, 5);

    if (parsed.length === 0) {
      errorDiv.textContent = "No valid words found — letters only, at least 2 each.";
      return;
    }

    SESSION_WORDS = parsed.map(w => ({ word: w, display: w.split("") }));
    WORDS = shuffleDeck([...SESSION_WORDS]);
    state.wordIndex = 0;

    overlay.style.display = "none";
    setTimeout(init, 150);
  }

  btn.addEventListener("pointerdown", (e) => { e.stopPropagation(); tryStart(); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryStart(); });
}

// --- Start ---
window.addEventListener("DOMContentLoaded", () => {
  showSetup();
});
