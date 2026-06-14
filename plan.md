# Phonics Digger — Build Plan

## What It Is

A browser-based phonics app for a 3.5-year-old learning to blend 3 and 4 letter words. The child uses a digger character to move through each letter sound, speaks each phoneme into the microphone, and when the full word is blended correctly, a mud pit dig triggers a big digger celebration.

Runs in Chrome on iPad and Android tablet. No install, no login — open URL and play.

---

## Teaching Method

Based on the "Toddlers Can Read" phonics approach:
- Child sounds out each phoneme individually (e.g. "huh", "aah", "t")
- Digger moves to each letter as the child masters the sound
- After all phonemes, child blends the full word ("hat")
- Correct blend triggers celebration

---

## Interaction Flow

```
WORD LOADS
  → 3 or 4 letters appear in a row on screen
  → Mud pit visible at the end of the row
  → Small digger sits at letter 1, pulses to signal "your turn"

PHONEME LISTEN (each letter)
  → Mic opens automatically when digger arrives at a letter
  → Child says the phoneme sound (e.g. "huh" for H)
  → ✓ correct → digger does happy wiggle + dirt puff animation
  → Mic closes, digger pulses "tap me!"

TAP TO ADVANCE
  → Child taps the digger
  → Digger rolls to next letter (animated, with tyre rumble sound)
  → Repeat for each letter

BLEND PROMPT (after last letter)
  → App plays audio: "Now say the whole word!"
  → Child says full word into mic
  → ✓ correct → digger wiggles, child taps digger

MUD PIT SEQUENCE
  → Digger speeds toward mud pit
  → Hits edge → screen rumble
  → Bucket lowers, dirt sprays upward
  → Digger sinks into mud

CELEBRATE
  → Big digger rises from mud pit (3x size)
  → Horn sound + confetti + stars
  → "You read [WORD]!" spoken aloud
  → 4 seconds → next word loads
```

---

## Failure Handling

| Situation | Response |
|---|---|
| Wrong pronunciation | Digger shakes head gently, letter flashes, mic re-opens |
| 2 misses on same phoneme | Small ✓ override button appears in corner for parent |
| Tap before correct pronunciation | Nothing happens — digger stays still |
| Mic not picking up | Same as wrong — no punishment, just retry |

---

## Word Source

Words are loaded from an `.xlsx` Excel file — no code changes needed to add/edit words.

**File:** `words.xlsx` (kept in the same folder as the app)

**Sheet structure:**

| word | phonemes | display | difficulty |
|---|---|---|---|
| hat | h,a,t | H,A,T | 1 |
| ship | sh,i,p | SH,I,P | 2 |
| frog | f,r,o,g | F,R,O,G | 3 |
| clap | cl,a,p | CL,A,P | 3 |

- `phonemes` — comma-separated sounds the mic matches against (one per digger stop)
- `display` — what appears on screen (comma-separated letter groups)
- `difficulty` — used to order/filter words (1 = simplest CVC, 2 = digraphs, 3 = blends)

Words are served in difficulty order. Parent edits the sheet to add new words.

---

## Speech Recognition

**API:** Web Speech API (built into Chrome — no key, no cost)

**Phoneme matching strategy:**

Each phoneme has an alias list to handle toddler speech variation:

```js
const PHONEME_ALIASES = {
  h:  ["huh", "h", "ha", "her", "he"],
  a:  ["ah", "a", "aah", "at", "and"],
  t:  ["t", "tuh", "tea", "the", "to"],
  sh: ["sh", "shh", "shoe", "she"],
  // ... all phonemes mapped
}
```

For full word blend: exact or close match against the target word (e.g. "hat", "hatt", "hat!").

**Layers:**
1. Fuzzy alias match — cast wide net for toddler pronunciation
2. 3-second timeout → gentle retry prompt
3. After 2 misses → parent override ✓ button

---

## Animation Plan

**Library:** GSAP (free CDN, no account needed)

| Moment | Animation |
|---|---|
| Digger arrives at letter | Bounce + dirt puff |
| Correct phoneme | Happy wiggle, small star burst |
| Wrong phoneme | Side-to-side shake |
| Tap to advance | Smooth roll to next letter with tyre sound |
| Mud pit approach | Digger speeds up (ease-in) |
| Mud dig | Bucket lowers, dirt particles spray up, digger sinks |
| Big digger rise | Scale 0.1 → 3x, ease-out bounce, from pit center |
| Celebration | Confetti rain, stars, horn, word appears as letter blocks |

All celebration assets preloaded — no delay when the moment hits.

---

## Frontend Stack

| Layer | Choice |
|---|---|
| HTML/CSS/JS | Vanilla — no framework, no build step |
| Animation | GSAP (CDN) |
| Excel parsing | SheetJS / xlsx.js (CDN) |
| Speech | Web Speech API (Chrome built-in) |
| Audio | HTML5 `<audio>` with preloaded MP3s |
| Digger graphics | SVG (scales on any screen, animatable) |

**No React. No bundler. No backend. No API keys.**

---

## File Structure

```
Phonics Digger/
├── plan.md               ← this file
├── words.xlsx            ← word list (parent edits this)
├── index.html            ← app shell + layout
├── styles.css            ← all styles + letter/digger layout
├── app.js                ← state machine, speech, animation logic
├── phonemes.js           ← phoneme alias map for all sounds
├── audio/
│   ├── phonemes/         ← mp3 of each phoneme sound (model for child)
│   ├── correct.mp3       ← chime for correct phoneme
│   ├── celebrate.mp3     ← horn + cheer for celebration
│   └── rumble.mp3        ← mud pit rumble
└── images/
    ├── digger-small.svg  ← digger used during blending
    ├── digger-big.svg    ← digger for celebration
    ├── mudpit.svg        ← mud pit graphic
    └── particles/        ← dirt/confetti SVGs for animation
```

---

## MVP Definition

The MVP is the smallest version a 3.5-year-old can actually use end-to-end with a parent sitting next to them.

**MVP = one word, fully playable, no mic**

Specifically:
- One hardcoded word (e.g. "HAT") appears on screen
- Digger sits at H, child taps it, digger rolls to A, child taps, digger rolls to T, child taps
- Parent sits beside child and taps the ✓ button after each correct sound (parent is the mic for now)
- After the third ✓, child taps digger, digger drives into mud pit
- Mud pit dig plays, big digger rises, celebration runs
- Loop resets to same word

**MVP is done when:** a parent and child can sit with an iPad, open the URL in Chrome, play through one word start to finish, and the child responds to the celebration with excitement.

**MVP does NOT include:** microphone, multiple words, Excel loading, audio phoneme models, difficulty levels, or word progression.

---

## Build Phases

### Phase 1 — MVP (layout + tap interaction + celebration)

**What we're building:**
- `words.xlsx` template (created but not yet loaded by app — for reference)
- Static layout: 3 letters in a row, mud pit at end, small digger SVG at letter 1
- Tap digger → digger animates and rolls to next letter (tyre sound)
- Parent ✓ button confirms each phoneme (visible, easy to tap)
- After letter 3 confirmed → child taps → mud pit dig sequence
- Big digger celebration animation
- Loop back to start

**What we are NOT building in Phase 1:**
- Mic / speech recognition
- Multiple words
- Loading from Excel
- Audio phoneme models

---

**Phase 1 QA Plan**

| Test | How to test | Pass condition |
|---|---|---|
| Layout renders correctly in Chrome on iPad | Open on iPad in Chrome landscape | Letters spaced evenly, digger visible at letter 1, mud pit visible at end |
| Layout renders correctly in Chrome on Android tablet | Open on Android in Chrome landscape | Same as above |
| Tap digger moves it to next letter | Tap digger with finger | Digger rolls smoothly to next letter, stops accurately |
| Tap before ✓ does nothing | Tap digger without pressing ✓ | Digger does not move |
| ✓ button visible and tappable | Parent tries tapping ✓ | Registers tap, digger pulses "tap me" |
| Digger advances through all 3 letters | Complete full word flow | Digger stops at H, A, T in sequence |
| Mud pit sequence triggers after letter 3 | Complete letter 3 + tap | Digger speeds to pit, digs, sinks |
| Big digger celebration plays | Complete mud pit sequence | Big digger rises, confetti, sound plays |
| Celebration loops back to start | Wait for celebration to finish | Word resets, small digger back at letter 1 |
| No crashes or freezes mid-flow | Run 5 consecutive times | App stable throughout |
| 3.5-year-old responds positively to celebration | Sit with child, run once | Child shows excitement / wants to do it again |

---

### Phase 2 — Speech Recognition (mic integration)

**What we're building:**
- Web Speech API wired up — mic auto-opens when digger arrives at each letter
- `phonemes.js` — alias map for all phoneme sounds
- Correct phoneme → digger wiggle, mic closes, digger pulses "tap me"
- Wrong phoneme → digger shakes, letter flashes, mic re-opens automatically
- After 2 misses → parent ✓ override button appears
- Full word blend detection after all phonemes complete
- Replace hardcoded word with SheetJS loading from `words.xlsx`
- Word progression: complete one word → next word loads
- 10 starter words across difficulty 1 and 2

**What we are NOT building in Phase 2:**
- Audio phoneme model sounds (child imitation prompts)
- Difficulty filtering UI
- Session history / progress tracking

---

**Phase 2 QA Plan**

| Test | How to test | Pass condition |
|---|---|---|
| Chrome requests mic permission on first load | Open app fresh in Chrome | Browser mic permission prompt appears |
| Mic opens automatically when digger arrives at letter | Complete tap-to-advance | Mic icon appears, listening starts within 1 second |
| Correct phoneme recognised | Say "huh" for H clearly | Digger wiggles, mic closes, digger pulses tap prompt |
| Wrong phoneme handled gracefully | Say wrong sound deliberately | Digger shakes gently, mic re-opens, no error state |
| Parent override appears after 2 misses | Say wrong sound twice | ✓ override button appears in corner |
| Parent override works | Tap ✓ after 2 misses | Digger accepts as correct, flow continues |
| Digraph phoneme recognised (e.g. "sh") | Load word "ship", say "shh" | Recognised correctly against SH alias list |
| Full word blend recognised | Say "hat" after all phonemes | App detects word, triggers mud pit |
| Words load from words.xlsx | Place xlsx in folder, open app | Words from sheet appear in app, not hardcoded |
| Word progression works | Complete one word | Next word loads automatically after celebration |
| 10 words cycle correctly | Complete all 10 words | All words play in difficulty order without crash |
| Toddler speech recognised at least 70% of the time | Child uses app for 10 phoneme attempts | At least 7 recognised without parent override |

---

### Phase 3 — Polish & Audio

**What we're building:**
- Audio phoneme model sounds: app plays the correct sound when digger arrives at each letter (child hears "huh", then imitates)
- Correct chime sound on successful phoneme
- Horn + cheer audio for celebration
- Mud pit rumble sound
- Tyre roll sound on digger movement
- Difficulty ordering from xlsx `difficulty` column
- Screen orientation lock (landscape, prompt if portrait)
- Full starter word list loaded (30+ words across all 3 difficulty levels)
- Light visual polish: background scene (construction site), sky, ground

---

**Phase 3 QA Plan**

| Test | How to test | Pass condition |
|---|---|---|
| Phoneme model audio plays on digger arrival | Watch + listen at each letter | Correct sound plays within 0.5s of arrival |
| Audio does not play before first tap | Load app, do nothing | No sound until child/parent interacts |
| Correct chime plays on phoneme success | Get a phoneme right | Chime plays immediately |
| Celebration audio plays in full | Complete a word | Horn + cheer plays, no cutoff |
| All audio preloaded (no delay) | Complete word quickly | No audio lag at any point |
| Difficulty ordering respected | Check word sequence | Difficulty 1 words appear before difficulty 2 and 3 |
| Portrait orientation shows rotation prompt | Rotate tablet to portrait | Clear prompt to rotate back to landscape |
| Landscape orientation removes prompt | Rotate back to landscape | Prompt disappears, app usable |
| 30+ words all play correctly | Cycle through full word list | No broken phoneme maps, no missing display text |
| Construction site background renders | Open app | Background visible, not blocking letters or digger |
| Full session with child (end-to-end) | Parent + child sit together for 10 mins | Child completes 5+ words, stays engaged, no confusion |

---

## Platform

- **Browser:** Chrome only (iPad + Android tablet)
- **Orientation:** Landscape
- **Input:** Touch (finger tap on digger)
- **No install, no login** — open URL in Chrome and play

---

## Starter Word List (for words.xlsx)

### Difficulty 1 — Simple CVC
cat, hat, mat, bat, sat, big, dig, pig, wig, cup, sun, run, hot, pot, top

### Difficulty 2 — Digraphs
ship, shop, chip, chin, chat, that, then, with, when, fish, wish, dash, cash

### Difficulty 3 — Blends
frog, trip, clap, flag, slip, grab, snap, drum, flat, glad, plan, slim, spin, step
