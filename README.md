# Phonics Digger 🚜

A browser-based phonics app for toddlers learning to blend 3 and 4 letter words. Built for a 3.5-year-old.

**[Try it live →](https://phonics-digger.vercel.app)** · [Inspect deploy →](https://vercel.com/ankitasayal-4894s-projects/phonics-digger)

---

## What it does

A digger character moves through each letter of a word. The parent confirms each sound with a ✓ tap. The digger rolls to the next letter automatically. After the last sound, the digger drives into a mud pit, digs, sinks — then a giant digger erupts from the mud with confetti and stars.

No login. No install. Open in Chrome and play.

---

## Teaching method

Based on the [Toddlers Can Read](https://toddlerscanread.com) phonics approach:

- Child sounds out each letter individually ("huh" — "aah" — "t")
- Digger advances one letter at a time, keeping attention focused on a single sound
- After all sounds, child blends the full word
- Celebration is immediate and physical — the digger reward lands right as the word clicks

The separation of individual sounds from full-word blending is the core of the method. The digger makes each phoneme its own event so the child isn't trying to hold all the sounds at once.

---

## How to use

1. Open `index.html` in Chrome on an iPad or Android tablet (landscape)
2. The first letter lights up — child says the sound
3. Parent taps the green ✓ to confirm correct pronunciation
4. Digger rolls automatically to the next letter
5. Repeat until the mud pit celebration

Parent sits beside the child and acts as the speech judge for Phase 1. Microphone recognition (Phase 2) will automate this.

---

## Word source

Words are loaded from `words.xlsx`. Parent edits the sheet in Excel — no code changes needed.

| Column | What it is |
|---|---|
| `word` | The actual word (hat) |
| `phonemes` | Space-separated sounds the mic will match (h a t) |
| `display` | What appears on screen — space-separated (h a t) |
| `difficulty` | 1 = simple CVC, 2 = digraphs (sh/ch), 3 = blends (fr/cl) |

A starter CSV template (`words_template.csv`) is included — open in Excel and save as `.xlsx` to use.

---

## Stack

| Layer | Choice |
|---|---|
| HTML / CSS / JS | Vanilla — no framework, no build step |
| Animation | GSAP (CDN) |
| Excel parsing | SheetJS / xlsx.js (CDN) — Phase 2 |
| Speech recognition | Web Speech API (Chrome built-in) — Phase 2 |
| Audio | HTML5 `<audio>` — Phase 3 |

No React. No bundler. No backend. No API keys. Total monthly cost: $0.

---

## Build phases

**Phase 1 — MVP (current)**
Static word list, parent taps ✓ to confirm each phoneme, digger animates through letters, mud pit celebration.

**Phase 2 — Speech recognition**
Web Speech API wired to each letter. Child speaks into mic; app matches against a phoneme alias map to handle toddler pronunciation variation. Words load from `words.xlsx`.

**Phase 3 — Polish**
Audio phoneme models (child hears the sound before imitating), celebration audio, construction site background scene, full 30+ word list across all difficulty levels.

---

## Files

| File | What it does |
|---|---|
| `index.html` | App shell, SVG digger, letter blocks, mud pit, celebration overlay |
| `styles.css` | Construction site scene, letter block states, animations |
| `app.js` | State machine: listening → confirmed → advancing → mud pit → celebration |
| `words_template.csv` | Starter word list — open in Excel and save as `.xlsx` |

---

## Why I built this

My kid is 3.5 and obsessed with diggers. Every phonics app I found either talked down to toddlers, moved too fast, or buried the learning inside a game loop that distracted more than it taught.

This is the smallest possible version of the thing that actually works: one word, one letter at a time, one very satisfying digger at the end.

Built with Claude Code.
