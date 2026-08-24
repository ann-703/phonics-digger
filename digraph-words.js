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
      },
      {
        // No `image` yet — falls back to the flat svg icon on the grid
        // (and skips the word.html detail page) until a photo is added
        // and the word is listed in DETAIL_PAGE_READY below.
        word: 'shut',
        chunks: ['sh', 'u', 't'],
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="34" y="12" width="52" height="76" rx="3" fill="#8B5E3C"/>
          <rect x="34" y="12" width="52" height="76" rx="3" fill="none" stroke="#5C3A21" stroke-width="3"/>
          <circle cx="76" cy="50" r="3" fill="#F5C542"/>
        </svg>`
      },
      {
        word: 'shin',
        chunks: ['sh', 'i', 'n'],
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="46" y="10" width="28" height="58" rx="10" fill="#FFCBA4"/>
          <ellipse cx="60" cy="80" rx="22" ry="14" fill="#FFCBA4"/>
          <path d="M50 26 L50 60" stroke="#E8A97A" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`
      },
      {
        word: 'shack',
        chunks: ['sh', 'a', 'ck'],
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="26" y="52" width="60" height="34" rx="2" fill="#A9744F"/>
          <path d="M18 52 L60 30 L102 52 Z" fill="#7A5230"/>
          <rect x="46" y="64" width="16" height="22" fill="#4A2F1A"/>
          <rect x="70" y="58" width="12" height="12" rx="1" fill="#AEE4FF"/>
        </svg>`
      }
    ]
  },
  ch: {
    words: [
      {
        word: 'chop',
        chunks: ['ch', 'o', 'p'],
        image: 'vehicles/chop.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="70" width="36" height="14" rx="3" fill="#8B5E3C"/>
          <rect x="54" y="66" width="10" height="30" rx="2" fill="#B5834A" transform="rotate(-25 59 81)"/>
          <path d="M56 30 L92 30 L84 52 L48 52 Z" fill="#9E9E9E"/>
          <rect x="88" y="14" width="8" height="42" rx="3" fill="#8B5E3C" transform="rotate(28 92 35)"/>
        </svg>`
      },
      {
        word: 'chin',
        chunks: ['ch', 'i', 'n'],
        image: 'vehicles/chin.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="50" r="34" fill="#FFCBA4"/>
          <circle cx="48" cy="42" r="4" fill="#222"/>
          <circle cx="72" cy="42" r="4" fill="#222"/>
          <path d="M48 62 Q60 70 72 62" stroke="#C97B5A" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`
      },
      {
        word: 'chick',
        chunks: ['ch', 'i', 'ck'],
        image: 'vehicles/chick.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="60" rx="30" ry="26" fill="#FFD54F"/>
          <circle cx="60" cy="34" r="18" fill="#FFD54F"/>
          <circle cx="53" cy="30" r="3" fill="#222"/>
          <circle cx="65" cy="30" r="3" fill="#222"/>
          <path d="M56 36 L64 36 L60 42 Z" fill="#FB8C00"/>
          <path d="M60 12 L52 22 L68 22 Z" fill="#E53935"/>
        </svg>`
      },
      {
        word: 'chess',
        chunks: ['ch', 'e', 'ss'],
        image: 'vehicles/chess.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="70" width="60" height="16" fill="#8B5E3C"/>
          <path d="M42 70 C38 50 46 38 40 26 C52 22 66 30 62 46 C70 50 68 62 60 70 Z" fill="#D7A86E"/>
        </svg>`
      },
      {
        word: 'check',
        chunks: ['ch', 'e', 'ck'],
        image: 'vehicles/check.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="50" r="36" fill="#7CB342"/>
          <path d="M40 52 L54 66 L82 34" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      }
    ]
  },
  th: {
    words: [
      {
        word: 'thick',
        chunks: ['th', 'i', 'ck'],
        image: 'vehicles/thick.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="32" y="14" width="56" height="72" rx="4" fill="#E07A3F"/>
          <rect x="32" y="14" width="56" height="72" rx="4" fill="none" stroke="#A85426" stroke-width="3"/>
          <rect x="40" y="26" width="40" height="6" rx="2" fill="#FBE3C7"/>
          <rect x="40" y="38" width="40" height="6" rx="2" fill="#FBE3C7"/>
        </svg>`
      },
      {
        word: 'thin',
        chunks: ['th', 'i', 'n'],
        image: 'vehicles/thin.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="48" y="14" width="24" height="72" rx="3" fill="#3D7DCB"/>
          <rect x="48" y="14" width="24" height="72" rx="3" fill="none" stroke="#28578F" stroke-width="2.5"/>
          <rect x="53" y="30" width="14" height="4" rx="1.5" fill="#FBE3C7"/>
        </svg>`
      },
      {
        word: 'thumb',
        chunks: ['th', 'u', 'm', 'b'],
        image: 'vehicles/thumb.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="42" y="40" width="30" height="46" rx="14" fill="#FFCBA4"/>
          <path d="M50 40 C50 20 68 20 68 40" fill="none" stroke="#FFCBA4" stroke-width="18" stroke-linecap="round"/>
        </svg>`
      },
      {
        word: 'thorn',
        chunks: ['th', 'o', 'r', 'n'],
        image: 'vehicles/thorn.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 86 C56 60 50 40 68 16 C74 40 66 62 66 86 Z" fill="#66BB6A"/>
        </svg>`
      },
      {
        word: 'throw',
        chunks: ['th', 'r', 'o', 'w'],
        image: 'vehicles/throw.jpg',
        svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="30" r="16" fill="#E53935"/>
          <path d="M80 14 A16 16 0 0 1 80 46" fill="#FFF176"/>
          <path d="M20 70 Q40 50 62 44" stroke="#90A4AE" stroke-width="3" fill="none" stroke-dasharray="4 5"/>
        </svg>`
      }
    ]
  }
};

// Words with a finished, ready-to-open detail page (word.html).
// Add a word here once its dedicated page has been approved.
const DETAIL_PAGE_READY = ['ship', 'shop', 'shed', 'shell', 'shark', 'chop', 'chin', 'chick', 'chess', 'check', 'thick', 'thin', 'thumb', 'thorn', 'throw'];
