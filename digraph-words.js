// ---- Shared digraph word data (used by digraphs.html and word.html) ----
// `chunks` = how the word is decoded: the digraph together as one chunk,
// each other letter/sound as its own chunk.
// `image` = real photo/illustration for the big detail page (optional —
// falls back to the flat `svg` icon on the grid + detail page until added).
const DIGRAPHS = {
  sh: {
    words: [
      {
        word: 'ship',
        chunks: ['sh', 'i', 'p'],
        image: 'vehicles/ship.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 62 L110 62 L98 84 L22 84 Z" fill="#3D7DCB"/>
          <rect x="30" y="34" width="14" height="30" rx="2" fill="#E5E5E5"/>
          <rect x="50" y="20" width="14" height="44" rx="2" fill="#E5E5E5"/>
          <rect x="70" y="40" width="14" height="24" rx="2" fill="#E5E5E5"/>
          <path d="M64 20 L64 10 L86 20 Z" fill="#E53935"/>
          <ellipse cx="60" cy="88" rx="52" ry="6" fill="#AEE4FF"/>
        </svg>`
      },
      {
        word: 'shop',
        chunks: ['sh', 'o', 'p'],
        image: 'vehicles/shop.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="42" width="84" height="46" rx="3" fill="#E8C17A"/>
          <path d="M12 42 L60 14 L108 42 Z" fill="#E53935"/>
          <rect x="12" y="42" width="96" height="10" fill="#fff"/>
          <rect x="46" y="60" width="28" height="28" fill="#7C4DFF"/>
          <circle cx="70" cy="74" r="2.5" fill="#fff"/>
          <rect x="22" y="52" width="18" height="16" rx="2" fill="#AEE4FF"/>
          <rect x="80" y="52" width="18" height="16" rx="2" fill="#AEE4FF"/>
        </svg>`
      },
      {
        word: 'shed',
        chunks: ['sh', 'e', 'd'],
        image: 'vehicles/shed.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="48" width="80" height="38" rx="2" fill="#B5834A"/>
          <path d="M14 48 L60 22 L106 48 Z" fill="#8B5E3C"/>
          <rect x="48" y="60" width="18" height="26" fill="#5C3A21"/>
          <circle cx="61" cy="73" r="1.8" fill="#E8C84A"/>
          <rect x="76" y="56" width="14" height="14" rx="1" fill="#AEE4FF"/>
        </svg>`
      },
      {
        word: 'shell',
        chunks: ['sh', 'e', 'l'],
        image: 'vehicles/shell.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 20 C30 20 16 48 16 72 C16 84 34 84 40 74 C44 84 52 84 56 74 C60 84 68 84 72 74 C76 84 94 84 94 68 C94 44 84 20 60 20 Z" fill="#FF8A65"/>
          <path d="M60 24 L60 72 M60 30 L36 68 M60 30 L84 68 M60 40 L26 70 M60 40 L94 66" stroke="#E8552E" stroke-width="2.5" fill="none"/>
        </svg>`
      },
      {
        word: 'shark',
        chunks: ['sh', 'a', 'r', 'k'],
        image: 'vehicles/shark.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 60 C8 40 34 26 66 26 C92 26 108 44 112 58 C104 56 96 56 90 60 C96 62 104 66 108 74 C96 76 84 74 76 66 C60 74 30 76 8 60 Z" fill="#78909C"/>
          <path d="M60 26 L68 8 L74 28 Z" fill="#607D8B"/>
          <circle cx="30" cy="50" r="3" fill="#222"/>
          <path d="M12 58 Q30 68 50 60" stroke="#455A64" stroke-width="2.5" fill="none"/>
          <ellipse cx="60" cy="66" rx="40" ry="8" fill="#B0BEC5" opacity="0.7"/>
        </svg>`
      }
    ]
  },
  ch: { words: [] },
  th: { words: [] }
};

// Words with a finished, ready-to-open detail page (word.html).
// Add a word here once its dedicated page has been approved.
const DETAIL_PAGE_READY = ['ship', 'shop', 'shed', 'shell', 'shark'];
