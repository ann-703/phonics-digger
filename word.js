const params = new URLSearchParams(window.location.search);
const digraphKey = params.get('d') || 'sh';
const wordParam = params.get('w') || '';

const backBtn = document.getElementById('back-btn');
backBtn.textContent = digraphKey;
backBtn.addEventListener('click', () => {
  window.location.href = `digraphs.html?d=${digraphKey}`;
});

const data = DIGRAPHS[digraphKey];
const entry = data && data.words.find(w => w.word === wordParam);

if (entry) {
  const heroCard = document.getElementById('hero-card');
  const canvas = document.getElementById('hero-canvas');
  const revealBtn = document.getElementById('reveal-btn');

  if (entry.image) {
    setupPixelReveal(canvas, revealBtn, entry.image);
  } else {
    canvas.remove();
    revealBtn.remove();
    heroCard.insertAdjacentHTML('beforeend', entry.svg);
  }

  const chunkRow = document.getElementById('chunk-row');
  chunkRow.innerHTML = entry.chunks.map(chunk => `
    <div class="chunk ${chunk === digraphKey ? 'digraph' : ''}">
      <div class="chunk-box">${chunk}</div>
      <div class="chunk-dot"></div>
    </div>
  `).join('');
}

// Draws `img` into the destination context cropped/scaled like CSS
// `object-fit: cover` for a box of size dw x dh.
function drawCover(ctx, img, dw, dh) {
  const imgRatio = img.width / img.height;
  const boxRatio = dw / dh;
  let sx, sy, sw, sh;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
}

function setupPixelReveal(canvas, revealBtn, src) {
  const img = new Image();
  img.onload = () => {
    const cardWidth = canvas.clientWidth;
    const cardHeight = canvas.clientHeight;
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    const ctx = canvas.getContext('2d');

    // Blocky pixelated preview: draw the image tiny, then blow it up
    // with smoothing off so each pixel becomes a big square.
    const PIXEL_COLS = 16;
    const pixelRows = Math.round(PIXEL_COLS * (cardHeight / cardWidth));
    const tiny = document.createElement('canvas');
    tiny.width = PIXEL_COLS;
    tiny.height = pixelRows;
    const tinyCtx = tiny.getContext('2d');
    drawCover(tinyCtx, img, PIXEL_COLS, pixelRows);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tiny, 0, 0, PIXEL_COLS, pixelRows, 0, 0, cardWidth, cardHeight);

    revealBtn.addEventListener('click', () => {
      ctx.imageSmoothingEnabled = true;
      drawCover(ctx, img, cardWidth, cardHeight);
      revealBtn.classList.add('hidden');
    });
  };
  img.src = src;
}
