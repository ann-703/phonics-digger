// Word data (DIGRAPHS, DETAIL_PAGE_READY) comes from digraph-words.js,
// loaded before this file.

// Fixed grid slots around the center hub (col, row) in the 4-col grid.
// Hub occupies col 2-3, row 2. Words fill row 1 first, then the row-2
// sides, then row 3 under the hub — digraphs with fewer than 8 words
// (ch, th) just leave the later slots empty.
const SLOTS = [
  { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 4, row: 1 },
  { col: 1, row: 2 },                                          { col: 4, row: 2 },
                       { col: 2, row: 3 }, { col: 3, row: 3 }
];

const grid = document.getElementById('digraph-grid');
const hubLetters = document.getElementById('hub-letters');
const nextBtn = document.getElementById('next-digraph-btn');

const ORDER = ['sh', 'ch', 'th'];
const requestedDigraph = new URLSearchParams(window.location.search).get('d');
let currentIndex = Math.max(0, ORDER.indexOf(requestedDigraph));

function renderDigraph(key) {
  // update the center hub letters
  hubLetters.innerHTML = key.split('').map(l => `<span>${l}</span>`).join('');

  // remove existing word cards, keep the hub
  grid.querySelectorAll('.word-card').forEach(el => el.remove());

  const data = DIGRAPHS[key];
  if (!data || !data.words.length) return;

  data.words.forEach((entry, i) => {
    const slot = SLOTS[i];
    if (!slot) return;

    const card = document.createElement('div');
    card.className = 'word-card';
    card.style.gridColumn = slot.col;
    card.style.gridRow = slot.row;

    const labelHtml = entry.word.replace(
      new RegExp('^' + key, 'i'),
      match => `<span class="sh-part">${match}</span>`
    );

    card.innerHTML = `
      ${entry.svg}
      <div class="word-label">${labelHtml}</div>
    `;

    card.addEventListener('click', () => colorize(card, key, entry.word));

    grid.appendChild(card);
  });
}

function colorize(card, digraphKey, word) {
  if (card.classList.contains('colored')) return;
  card.classList.add('colored');
  burstSparkles(card);

  if (DETAIL_PAGE_READY.includes(word)) {
    setTimeout(() => {
      window.location.href = `word.html?d=${digraphKey}&w=${word}`;
    }, 650);
  }
}

function burstSparkles(card) {
  const emojis = ['✨', '⭐', '✨'];
  emojis.forEach((e, i) => {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = e;
    s.style.left = 20 + i * 25 + '%';
    s.style.top = '10%';
    card.appendChild(s);

    if (window.gsap) {
      gsap.fromTo(s,
        { opacity: 0, y: 0, scale: 0.5 },
        { opacity: 1, y: -20, scale: 1.2, duration: 0.4, delay: i * 0.05,
          onComplete: () => gsap.to(s, { opacity: 0, duration: 0.3, delay: 0.2, onComplete: () => s.remove() }) }
      );
    } else {
      s.style.opacity = '1';
      setTimeout(() => s.remove(), 700);
    }
  });
}

// Bound to both 'click' and 'pointerup': on some mobile browsers a tap
// near the screen edge gets intercepted by the back/forward swipe
// gesture and never fires 'click', so 'pointerup' is a fallback. The
// timestamp guard stops the two from double-advancing when both fire.
let lastAdvanceAt = 0;
function advanceDigraph() {
  const now = Date.now();
  if (now - lastAdvanceAt < 400) return;
  lastAdvanceAt = now;
  currentIndex = (currentIndex + 1) % ORDER.length;
  renderDigraph(ORDER[currentIndex]);
}
nextBtn.addEventListener('click', advanceDigraph);
nextBtn.addEventListener('pointerup', advanceDigraph);

renderDigraph(ORDER[currentIndex]);
