// ---- Sentence Reader data ----
// `chunks` per word follow the same decoding convention as digraph-words.js:
// the digraph together as one chunk, each other letter as its own chunk.
// `image` = the "comes to life" scene image, revealed by tapping the check.
const SENTENCES = [
  {
    id: 'sam-sat-on-log',
    words: [
      { word: 'Sam', chunks: ['s', 'a', 'm'] },
      { word: 'sat', chunks: ['s', 'a', 't'] },
      { word: 'on', chunks: ['o', 'n'] },
      { word: 'log', chunks: ['l', 'o', 'g'] }
    ],
    image: 'sentences/sam-sat-on-log.jpg'
  },
  {
    id: 'cat-puts-on-hat',
    words: [
      { word: 'Cat', chunks: ['c', 'a', 't'] },
      { word: 'puts', chunks: ['p', 'u', 't', 's'] },
      { word: 'on', chunks: ['o', 'n'] },
      { word: 'hat', chunks: ['h', 'a', 't'] }
    ],
    image: 'sentences/cat-puts-on-hat.jpg'
  },
  {
    id: 'pig-dug-big-pit',
    words: [
      { word: 'Pig', chunks: ['p', 'i', 'g'] },
      { word: 'dug', chunks: ['d', 'u', 'g'] },
      { word: 'big', chunks: ['b', 'i', 'g'] },
      { word: 'pit', chunks: ['p', 'i', 't'] }
    ],
    image: 'sentences/pig-dug-big-pit.jpg'
  },
  {
    id: 'sun-is-hot',
    words: [
      { word: 'Sun', chunks: ['s', 'u', 'n'] },
      { word: 'is', chunks: ['i', 's'] },
      { word: 'hot', chunks: ['h', 'o', 't'] }
    ],
    image: 'sentences/sun-is-hot.jpg'
  },
  {
    id: 'chick-sat-in-shed',
    words: [
      { word: 'Chick', chunks: ['ch', 'i', 'ck'] },
      { word: 'sat', chunks: ['s', 'a', 't'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'shed', chunks: ['sh', 'e', 'd'] }
    ],
    image: 'sentences/chick-sat-in-shed.jpg'
  },
  {
    id: 'shark-bit-thumb',
    words: [
      { word: 'shark', chunks: ['sh', 'a', 'r', 'k'] },
      { word: 'bit', chunks: ['b', 'i', 't'] },
      { word: 'thumb', chunks: ['th', 'u', 'm', 'b'] }
    ],
    image: 'sentences/shark-bit-thumb.jpg'
  },
  {
    id: 'fish-hid-in-shell',
    words: [
      { word: 'Fish', chunks: ['f', 'i', 'sh'] },
      { word: 'hid', chunks: ['h', 'i', 'd'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'shell', chunks: ['sh', 'e', 'l'] }
    ],
    image: 'sentences/fish-hid-in-shell.jpg'
  },
  {
    id: 'ship-sank-in-mud',
    words: [
      { word: 'Ship', chunks: ['sh', 'i', 'p'] },
      { word: 'sank', chunks: ['s', 'a', 'n', 'k'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'mud', chunks: ['m', 'u', 'd'] }
    ],
    image: 'sentences/ship-sank-in-mud.jpg'
  },
  {
    id: 'dog-jump-on-sofa',
    words: [
      { word: 'Dog', chunks: ['d', 'o', 'g'] },
      { word: 'jump', chunks: ['j', 'u', 'm', 'p'] },
      { word: 'on', chunks: ['o', 'n'] },
      { word: 'sofa', chunks: ['s', 'o', 'f', 'a'] }
    ],
    image: 'sentences/dog-jump-on-sofa.jpg'
  }
];
