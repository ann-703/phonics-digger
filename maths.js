// ============================================================
// Maths Digger — Number Recognition 1–20
// Numbers appear sequentially. Parent taps ✓ after child
// says the number. N digger icons appear for number N.
// ============================================================

const MAX_NUMBER = 20;

let state = {
  current: 1,
  phase: "idle", // idle | listening | confirmed | celebrating
};

// --- DOM refs ---
const numberBlock  = document.getElementById("number-block");
const diggerGrid   = document.getElementById("digger-grid");
const confirmBtn   = document.getElementById("confirm-btn");
const celebration  = document.getElementById("celebration");
const bigDigger    = document.getElementById("big-digger");
const wordBanner   = document.getElementById("word-banner");
const confettiCont = document.getElementById("confetti-container");
const starsCont    = document.getElementById("stars-container");

// --- Mini digger SVG (inline, same design as the main digger) ---
function miniDiggerSVG() {
  return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="30" width="70" height="30" rx="6" fill="#F5A623"/>
    <rect x="45" y="15" width="35" height="25" rx="4" fill="#F5A623"/>
    <rect x="50" y="19" width="25" height="15" rx="3" fill="#AEE4FF" opacity="0.85"/>
    <rect x="78" y="22" width="12" height="8" rx="2" fill="#E8941A"/>
    <line x1="84" y1="26" x2="108" y2="18" stroke="#E8941A" stroke-width="6" stroke-linecap="round"/>
    <polygon points="104,14 114,14 110,26 100,26" fill="#D4800A"/>
    <rect x="46" y="8" width="5" height="9" rx="2" fill="#333"/>
    <circle cx="22" cy="62" r="11" fill="#333"/>
    <circle cx="22" cy="62" r="6" fill="#555"/>
    <circle cx="22" cy="62" r="2" fill="#888"/>
    <circle cx="62" cy="62" r="11" fill="#333"/>
    <circle cx="62" cy="62" r="6" fill="#555"/>
    <circle cx="62" cy="62" r="2" fill="#888"/>
    <rect x="10" y="58" width="72" height="8" rx="4" fill="#222"/>
  </svg>`;
}

// --- Render number and its digger grid ---
function renderNumber(n) {
  numberBlock.textContent = n;
  numberBlock.style.fontSize = n < 10 ? "82px" : "58px";

  diggerGrid.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const icon = document.createElement("div");
    icon.className = "digger-icon";
    icon.innerHTML = miniDiggerSVG();
    diggerGrid.appendChild(icon);
  }
}

// --- Phase machine ---
function setPhase(newPhase) {
  state.phase = newPhase;

  switch (newPhase) {

    case "listening":
      confirmBtn.classList.remove("hidden");

      // Number block pops in
      gsap.fromTo(numberBlock,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
      );

      // Digger icons stagger in from below
      const icons = diggerGrid.querySelectorAll(".digger-icon");
      if (icons.length > 0) {
        gsap.fromTo(icons,
          { scale: 0, opacity: 0, y: 18 },
          {
            scale: 1, opacity: 1, y: 0,
            duration: 0.35,
            ease: "back.out(1.8)",
            stagger: 0.07,
            delay: 0.3
          }
        );
      }
      break;

    case "confirmed":
      confirmBtn.classList.add("hidden");

      // Diggers bounce up then land, staggered
      const allIcons = diggerGrid.querySelectorAll(".digger-icon");
      gsap.to(allIcons, {
        y: -16,
        duration: 0.18,
        ease: "power2.out",
        stagger: 0.06,
        onComplete: () => {
          gsap.to(allIcons, {
            y: 0,
            duration: 0.3,
            ease: "bounce.out",
            stagger: 0.06,
            onComplete: () => setTimeout(() => setPhase("celebrating"), 250)
          });
        }
      });
      break;

    case "celebrating":
      celebrate();
      break;
  }
}

// --- Celebration ---
function celebrate() {
  celebration.classList.add("active");
  confettiCont.innerHTML = "";
  starsCont.innerHTML = "";

  gsap.to(celebration, { opacity: 1, duration: 0.4 });

  // Big digger rises from the mud
  gsap.fromTo(bigDigger,
    { scale: 0.1, y: 100 },
    { scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
  );

  // Show number at the top
  wordBanner.textContent = state.current;
  wordBanner.style.opacity = "1";
  wordBanner.style.pointerEvents = "none";

  spawnConfetti();
  spawnStars();

  setTimeout(nextNumber, 4000);
}

// --- Advance to next number ---
function nextNumber() {
  gsap.to(celebration, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      celebration.classList.remove("active");
      gsap.set(bigDigger, { scale: 0 });
    }
  });

  wordBanner.style.opacity = "0";
  confettiCont.innerHTML = "";
  starsCont.innerHTML = "";

  state.current = state.current < MAX_NUMBER ? state.current + 1 : 1;
  confirmBtn.classList.remove("hidden");

  renderNumber(state.current);

  // Small pause so celebration can fade before new number animates in
  setTimeout(() => setPhase("listening"), 450);
}

// --- Confetti ---
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

function spawnStars() {
  const emojis = ["⭐", "🌟", "✨", "💫"];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("div");
    el.className = "star";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left  = (5  + Math.random() * 90) + "vw";
    el.style.top   = (10 + Math.random() * 70) + "vh";
    starsCont.appendChild(el);

    gsap.fromTo(el,
      { opacity: 0, scale: 0 },
      {
        opacity: 1, scale: 1.5, duration: 0.4,
        delay: 0.3 + Math.random() * 0.8,
        ease: "back.out(2)",
        onComplete: () => gsap.to(el, { opacity: 0, scale: 0, duration: 0.3, delay: 1.5 + Math.random() })
      }
    );
  }
}

// --- Confirm button ---
confirmBtn.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
  if (state.phase !== "listening") return;
  setPhase("confirmed");
});

// --- Start ---
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(init, 150);
});

function init() {
  renderNumber(state.current);
  setPhase("listening");
}
