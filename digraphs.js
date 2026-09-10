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
const pageDots = document.getElementById('page-dots');

const ORDER = ['sh', 'ch', 'th'];

// Flatten each digraph's words into screens of at most SLOTS.length words,
// so a digraph with more words than fit in one grid (e.g. sh, ch) spills
// onto additional screens instead of being silently cut off.
function buildScreens() {
  const screens = [];
  ORDER.forEach(key => {
    const words = (DIGRAPHS[key] && DIGRAPHS[key].words) || [];
    const pageCount = Math.max(1, Math.ceil(words.length / SLOTS.length));
    for (let p = 0; p < pageCount; p++) {
      screens.push({
        key,
        words: words.slice(p * SLOTS.length, (p + 1) * SLOTS.length),
        page: p,
        pageCount
      });
    }
  });
  return screens;
}

const SCREENS = buildScreens();

const requestedDigraph = new URLSearchParams(window.location.search).get('d');
let currentIndex = Math.max(0, SCREENS.findIndex(s => s.key === requestedDigraph));

function renderDigraph(screen) {
  const key = screen.key;

  // update the center hub letters
  hubLetters.innerHTML = key.split('').map(l => `<span>${l}</span>`).join('');

  // page dots — only shown when a digraph spans more than one screen.
  // Each dot is clickable: it jumps straight to that page of the same digraph.
  pageDots.innerHTML = '';
  if (screen.pageCount > 1) {
    for (let p = 0; p < screen.pageCount; p++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'page-dot' + (p === screen.page ? ' active' : '');
      dot.setAttribute('aria-label', `Page ${p + 1} of ${screen.pageCount}`);
      const targetIndex = SCREENS.findIndex(s => s.key === key && s.page === p);
      const jumpToPage = () => {
        if (targetIndex === -1) return;
        currentIndex = targetIndex;
        renderDigraph(SCREENS[currentIndex]);
      };
      dot.addEventListener('click', jumpToPage);
      dot.addEventListener('pointerup', jumpToPage);
      pageDots.appendChild(dot);
    }
  }

  // remove existing word cards, keep the hub
  grid.querySelectorAll('.word-card').forEach(el => el.remove());

  screen.words.forEach((entry, i) => {
    const slot = SLOTS[i];
    if (!slot) return;

    const card = document.createElement('div');
    card.className = 'word-card';
    card.style.gridColumn = slot.col;
    card.style.gridRow = slot.row;

    // Highlight the digraph wherever it falls — start (ship, chop) or
    // end (fish, much) — rather than assuming it always leads the word.
    const startRe = new RegExp('^' + key, 'i');
    const endRe = new RegExp(key + '$', 'i');
    let labelHtml;
    if (startRe.test(entry.word)) {
      labelHtml = entry.word.replace(startRe, m => `<span class="sh-part">${m}</span>`);
    } else if (endRe.test(entry.word)) {
      labelHtml = entry.word.replace(endRe, m => `<span class="sh-part">${m}</span>`);
    } else {
      labelHtml = entry.word;
    }

    card.innerHTML = `
      ${entry.isNew ? '<div class="new-digger-badge" title="New word!">🚜</div>' : ''}
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
  playClickSound();
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
  currentIndex = (currentIndex + 1) % SCREENS.length;
  renderDigraph(SCREENS[currentIndex]);
}
nextBtn.addEventListener('click', advanceDigraph);
nextBtn.addEventListener('pointerup', advanceDigraph);

renderDigraph(SCREENS[currentIndex]);
