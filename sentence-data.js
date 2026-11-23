// ---- Sentence Reader data ----
// `chunks` per word follow the same decoding convention as digraph-words.js:
// the digraph (sh, ch, th, ee, ai, ck) together as one chunk, each other letter as its own chunk.
// `image` = the "comes to life" scene image, revealed by tapping the check.
// Sentences are 3-4 words; id = kebab-case of the sentence, image = sentences/<id>.jpg.
const SENTENCES = [
  {
    id: 'rat-has-red-hat',
    words: [
      { word: 'Rat', chunks: ['r', 'a', 't'] },
      { word: 'has', chunks: ['h', 'a', 's'] },
      { word: 'red', chunks: ['r', 'e', 'd'] },
      { word: 'hat', chunks: ['h', 'a', 't'] }
    ],
    image: 'sentences/rat-has-red-hat.jpg'
  },
  {
    id: 'fox-is-in-box',
    words: [
      { word: 'Fox', chunks: ['f', 'o', 'x'] },
      { word: 'is', chunks: ['i', 's'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'box', chunks: ['b', 'o', 'x'] }
    ],
    image: 'sentences/fox-is-in-box.jpg'
  },
  {
    id: 'pig-and-duck-run',
    words: [
      { word: 'Pig', chunks: ['p', 'i', 'g'] },
      { word: 'and', chunks: ['a', 'n', 'd'] },
      { word: 'duck', chunks: ['d', 'u', 'ck'] },
      { word: 'run', chunks: ['r', 'u', 'n'] }
    ],
    image: 'sentences/pig-and-duck-run.jpg'
  },
  {
    id: 'hen-sat-on-egg',
    words: [
      { word: 'Hen', chunks: ['h', 'e', 'n'] },
      { word: 'sat', chunks: ['s', 'a', 't'] },
      { word: 'on', chunks: ['o', 'n'] },
      { word: 'egg', chunks: ['e', 'g', 'g'] }
    ],
    image: 'sentences/hen-sat-on-egg.jpg'
  },
  {
    id: 'chimp-can-paint',
    words: [
      { word: 'Chimp', chunks: ['ch', 'i', 'm', 'p'] },
      { word: 'can', chunks: ['c', 'a', 'n'] },
      { word: 'paint', chunks: ['p', 'ai', 'n', 't'] }
    ],
    image: 'sentences/chimp-can-paint.jpg'
  },
  {
    id: 'snail-is-in-rain',
    words: [
      { word: 'Snail', chunks: ['s', 'n', 'ai', 'l'] },
      { word: 'is', chunks: ['i', 's'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'rain', chunks: ['r', 'ai', 'n'] }
    ],
    image: 'sentences/snail-is-in-rain.jpg'
  },
  {
    id: 'dog-wags-tail',
    words: [
      { word: 'Dog', chunks: ['d', 'o', 'g'] },
      { word: 'wags', chunks: ['w', 'a', 'g', 's'] },
      { word: 'tail', chunks: ['t', 'ai', 'l'] }
    ],
    image: 'sentences/dog-wags-tail.jpg'
  },
  {
    id: 'big-ship-can-sail',
    words: [
      { word: 'Big', chunks: ['b', 'i', 'g'] },
      { word: 'ship', chunks: ['sh', 'i', 'p'] },
      { word: 'can', chunks: ['c', 'a', 'n'] },
      { word: 'sail', chunks: ['s', 'ai', 'l'] }
    ],
    image: 'sentences/big-ship-can-sail.jpg'
  },
  {
    id: 'three-red-trains',
    words: [
      { word: 'Three', chunks: ['th', 'r', 'ee'] },
      { word: 'red', chunks: ['r', 'e', 'd'] },
      { word: 'trains', chunks: ['t', 'r', 'ai', 'n', 's'] }
    ],
    image: 'sentences/three-red-trains.jpg'
  },
  {
    id: 'sheep-sat-in-rain',
    words: [
      { word: 'Sheep', chunks: ['sh', 'ee', 'p'] },
      { word: 'sat', chunks: ['s', 'a', 't'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'rain', chunks: ['r', 'ai', 'n'] }
    ],
    image: 'sentences/sheep-sat-in-rain.jpg'
  },
  {
    id: 'bee-sits-on-snail',
    words: [
      { word: 'Bee', chunks: ['b', 'ee'] },
      { word: 'sits', chunks: ['s', 'i', 't', 's'] },
      { word: 'on', chunks: ['o', 'n'] },
      { word: 'snail', chunks: ['s', 'n', 'ai', 'l'] }
    ],
    image: 'sentences/bee-sits-on-snail.jpg'
  },
  {
    id: 'fish-has-red-tail',
    words: [
      { word: 'Fish', chunks: ['f', 'i', 'sh'] },
      { word: 'has', chunks: ['h', 'a', 's'] },
      { word: 'red', chunks: ['r', 'e', 'd'] },
      { word: 'tail', chunks: ['t', 'ai', 'l'] }
    ],
    image: 'sentences/fish-has-red-tail.jpg'
  },
  {
    id: 'chick-is-on-chain',
    words: [
      { word: 'Chick', chunks: ['ch', 'i', 'ck'] },
      { word: 'is', chunks: ['i', 's'] },
      { word: 'on', chunks: ['o', 'n'] },
      { word: 'chain', chunks: ['ch', 'ai', 'n'] }
    ],
    image: 'sentences/chick-is-on-chain.jpg'
  },
  {
    id: 'moth-got-wet',
    words: [
      { word: 'Moth', chunks: ['m', 'o', 'th'] },
      { word: 'got', chunks: ['g', 'o', 't'] },
      { word: 'wet', chunks: ['w', 'e', 't'] }
    ],
    image: 'sentences/moth-got-wet.jpg'
  },
  {
    id: 'bee-is-in-tree',
    words: [
      { word: 'Bee', chunks: ['b', 'ee'] },
      { word: 'is', chunks: ['i', 's'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'tree', chunks: ['t', 'r', 'ee'] }
    ],
    image: 'sentences/bee-is-in-tree.jpg'
  },
  {
    id: 'sheep-has-green-hat',
    words: [
      { word: 'Sheep', chunks: ['sh', 'ee', 'p'] },
      { word: 'has', chunks: ['h', 'a', 's'] },
      { word: 'green', chunks: ['g', 'r', 'ee', 'n'] },
      { word: 'hat', chunks: ['h', 'a', 't'] }
    ],
    image: 'sentences/sheep-has-green-hat.jpg'
  },
  {
    id: 'feet-in-deep-mud',
    words: [
      { word: 'Feet', chunks: ['f', 'ee', 't'] },
      { word: 'in', chunks: ['i', 'n'] },
      { word: 'deep', chunks: ['d', 'ee', 'p'] },
      { word: 'mud', chunks: ['m', 'u', 'd'] }
    ],
    image: 'sentences/feet-in-deep-mud.jpg'
  },
  {
    id: 'frog-sees-red-jeep',
    words: [
      { word: 'Frog', chunks: ['f', 'r', 'o', 'g'] },
      { word: 'sees', chunks: ['s', 'ee', 's'] },
      { word: 'red', chunks: ['r', 'e', 'd'] },
      { word: 'jeep', chunks: ['j', 'ee', 'p'] }
    ],
    image: 'sentences/frog-sees-red-jeep.jpg'
  }
];
