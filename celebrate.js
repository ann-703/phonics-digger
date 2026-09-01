// ============================================================
// Shared celebration effects
// Used by maths.js and counting.js. All container elements are
// looked up at call time so any page can use these.
// ============================================================

const CONFETTI_COLORS = ["#FF6B35", "#F5A623", "#4CAF50", "#2196F3", "#E91E63", "#9C27B0", "#00BCD4"];

// Short rising chime — no audio file needed
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

// Dirt puffs bursting from a screen rect
function sprayDirt(rect, count) {
  const dirtPuffs = document.getElementById("dirt-puffs");
  if (!dirtPuffs) return;

  const cx = rect.left + rect.width * 0.7;
  const cy = rect.top + rect.height * 0.45;

  for (let i = 0; i < (count || 14); i++) {
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

function spawnConfetti() {
  const confettiCont = document.getElementById("confetti-container");
  if (!confettiCont) return;

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
  const starsCont = document.getElementById("stars-container");
  if (!starsCont) return;

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

// Short screen shake
function rumbleScreen() {
  document.body.classList.add("rumble");
  setTimeout(() => document.body.classList.remove("rumble"), 450);
}
