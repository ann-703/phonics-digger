// Sentence data (SENTENCES) comes from sentence-data.js, loaded before this file.

const params = new URLSearchParams(window.location.search);
const requestedId = params.get('s');
const requestedIndex = SENTENCES.findIndex(s => s.id === requestedId);
let currentIndex = requestedIndex >= 0 ? requestedIndex : 0;

const row = document.getElementById('sentence-row');
const heroImg = document.getElementById('hero-img');
const heroCard = document.getElementById('hero-card');
const starBtn = document.getElementById('star-btn');
const nextBtn = document.getElementById('next-sentence-btn');

let readCount = 0;
let totalWords = 0;

function renderSentence(index) {
  const sentence = SENTENCES[index];
  readCount = 0;
  totalWords = sentence.words.length;

  row.innerHTML = '';
  heroImg.classList.remove('revealed', 'alive');
  starBtn.classList.add('disabled');
  starBtn.classList.remove('hidden');

  heroImg.src = sentence.image;
  heroImg.alt = sentence.words.map(w => w.word).join(' ');

  sentence.words.forEach(entry => {
    const group = document.createElement('div');
    group.className = 'word-group';

    const chunksHtml = entry.chunks.map(chunk => `
      <div class="chunk-box ${chunk.length > 1 ? 'digraph' : ''}">${chunk}</div>
    `).join('');

    group.innerHTML = `
      <div class="word-chunks">${chunksHtml}</div>
      <div class="word-check">✓</div>
    `;

    group.addEventListener('click', () => markRead(group));

    row.appendChild(group);
  });
}

function markRead(group) {
  if (group.classList.contains('read')) return;
  group.classList.add('read');
  readCount++;

  if (readCount >= totalWords) {
    starBtn.classList.remove('disabled');
  }
}

starBtn.addEventListener('click', reveal);

function reveal() {
  if (starBtn.classList.contains('disabled') || starBtn.classList.contains('hidden')) return;

  heroImg.classList.add('revealed');
  burstSparkles(heroCard);

  setTimeout(() => {
    starBtn.classList.add('hidden');
    heroImg.classList.add('alive');
  }, 550);
}

function burstSparkles(card) {
  const emojis = ['✨', '⭐', '✨', '⭐'];
  emojis.forEach((e, i) => {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = e;
    s.style.left = 15 + i * 22 + '%';
    s.style.top = '40%';
    card.appendChild(s);

    if (window.gsap) {
      gsap.fromTo(s,
        { opacity: 0, y: 0, scale: 0.5 },
        { opacity: 1, y: -30, scale: 1.3, duration: 0.5, delay: i * 0.06,
          onComplete: () => gsap.to(s, { opacity: 0, duration: 0.3, delay: 0.2, onComplete: () => s.remove() }) }
      );
    } else {
      s.style.opacity = '1';
      setTimeout(() => s.remove(), 800);
    }
  });
}

// Bound to both 'click' and 'pointerup' — see digraphs.js for why.
let lastAdvanceAt = 0;
function advanceSentence() {
  const now = Date.now();
  if (now - lastAdvanceAt < 400) return;
  lastAdvanceAt = now;
  currentIndex = (currentIndex + 1) % SENTENCES.length;
  renderSentence(currentIndex);
}
nextBtn.addEventListener('click', advanceSentence);
nextBtn.addEventListener('pointerup', advanceSentence);

renderSentence(currentIndex);
