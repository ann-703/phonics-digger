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
    id: 'cat-is-sad',
    words: [
      { word: 'Cat', chunks: ['c', 'a', 't'] },
      { word: 'is', chunks: ['i', 's'] },
      { word: 'sad', chunks: ['s', 'a', 'd'] }
    ],
    image: 'sentences/cat-is-sad.jpg'
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
    id: 'shark-eats-fish',
    words: [
      { word: 'Shark', chunks: ['sh', 'a', 'r', 'k'] },
      { word: 'eats', chunks: ['ea', 't', 's'] },
      { word: 'fish', chunks: ['f', 'i', 'sh'] }
    ],
    image: 'sentences/shark-eats-fish.jpg'
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
  },
  // ---- Halloween set: ee / sh / ch / th words + "and" (4 words max) ----
  {
    id: 'three-bats-in-tree',
    words: [
      { word: 'Three', chunks: ['th', 'r', 'ee'] },
      { word: 'bats', chunks: ['b', 'a', 't', 's'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'tree', chunks: ['t', 'r', 'ee'] }
    ],
    image: 'sentences/three-bats-in-tree.jpg'
  },
  {
    id: 'sheep-and-chick-shop',
    words: [
      { word: 'Sheep', chunks: ['sh', 'ee', 'p'] },
      { word: 'and', chunks: ['a', 'n', 'd'] },
      { word: 'chick', chunks: ['ch', 'i', 'ck'] },
      { word: 'shop', chunks: ['sh', 'o', 'p'] }
    ],
    image: 'sentences/sheep-and-chick-shop.jpg'
  },
  {
    id: 'bee-sits-on-web',
    words: [
      { word: 'Bee', chunks: ['b', 'ee'] },
      { word: 'sits', chunks: ['s', 'i', 't', 's'] },
      { word: 'on', chunks: ['o', 'n'] },
      { word: 'web', chunks: ['w', 'e', 'b'] }
    ],
    image: 'sentences/bee-sits-on-web.jpg'
  },
  {
    id: 'bat-and-fish-chomp',
    words: [
      { word: 'Bat', chunks: ['b', 'a', 't'] },
      { word: 'and', chunks: ['a', 'n', 'd'] },
      { word: 'fish', chunks: ['f', 'i', 'sh'] },
      { word: 'chomp', chunks: ['ch', 'o', 'm', 'p'] }
    ],
    image: 'sentences/bat-and-fish-chomp.jpg'
  },
  {
    id: 'bat-has-big-teeth',
    words: [
      { word: 'Bat', chunks: ['b', 'a', 't'] },
      { word: 'has', chunks: ['h', 'a', 's'] },
      { word: 'big', chunks: ['b', 'i', 'g'] },
      { word: 'teeth', chunks: ['t', 'ee', 'th'] }
    ],
    image: 'sentences/bat-has-big-teeth.jpg'
  }
];
