# Counting Digger — Design

**Date:** 2026-09-01
**Module:** `counting.html` / `counting.js`
**For:** Pranik (4)

## What it is

A "give me N" counting game. The digger shows a target number. Ten rocks sit in
the dirt on the left. The child taps rocks one at a time — each one flies into
the digger's bucket — and stops when the bucket holds the target number.

This is deliberately *not* "count the objects on screen". It is the **Give-N
task**: the standard measure of whether a child understands cardinality rather
than just reciting the counting sequence. A child who can chant "1-2-3-4-5" will
often still hand over a fistful when asked for three. Making him stop at the
right number is the harder and more meaningful skill.

## Pedagogy this is built on

- **One-to-one correspondence** — one number word per object. Research is
  consistent that *touching or moving* each object is what builds this, so every
  rock physically responds to a tap and visibly relocates.
- **Cardinality** — the target number is the whole task, not an afterthought.
- **Counted objects must change state** — a tapped rock leaves a divot behind
  and the pile does not reflow, so the child can always see what he has already
  sent.

The app stays **silent**. The parent asks the child to count aloud and judges
whether he counted clearly. No speech recognition, no text-to-speech — this
keeps the module consistent with every other module in the app, none of which
use speech APIs.

## Screen layout (landscape)

```
┌──────────────────────────┬───────────────────────────┐
│  ⌂ Home            ⚙     │        ╔═══════╗          │
│   🪨   🪨    🪨    🪨      │        ║   3   ║          │
│     🪨    🪨   🪨         │         ┌─────┐           │
│   🪨    🪨    🪨          │         │ 🪨🪨 │           │
│  ▔▔▔▔ dirt ▔▔▔▔▔▔▔▔▔     │  ▔▔▔▔  🚜 ▔▔▔▔▔▔▔         │
└──────────────────────────┴───────────────────────────┘
```

Always 10 rocks, in a loose jittered scatter rather than a neat row — a row
invites tapping along it without counting. Tap targets are large (min 72px).

## Round flow

1. Round starts: 10 rocks, a target number on the digger body.
2. Child taps a rock → it arcs across the screen (~550ms) and drops into the
   bucket with a dirt puff. Parent and child count aloud together.
3. The tapped rock leaves a **divot** at its original position. The pile does
   not reflow.
4. Rocks stack visibly in the bucket, so the quantity is countable on screen.
5. The Nth rock lands → remaining rocks fade to 35% and stop accepting taps →
   celebration fires: big digger rises with confetti and stars, and **the
   number itself pops up on the digger's body** (3, 7, 2...). No text banner —
   the numeral is the reward, tying the quantity he just built to its symbol.
6. ~4s later: rocks reset to 10 and the **next number in the parent's list**
   loads. Rounds walk the typed list in order.
7. When the list runs out, the game returns to the **parent setup screen**
   with an "All done! Great counting." message, rather than looping forever.
   This gives a session a natural end and hands the tablet back to the parent.

## No-fail behaviour

- **Overshoot is impossible.** Rocks lock the instant the target is reached.
- **Undershoot is not punished.** If he stops at 2, nothing happens and nothing
  scolds him. After 10s idle the target number pulses — a nudge to look again,
  not the answer.
- Taps on in-flight or already-sent rocks are ignored. No double-fire.

## Parent setup

Same overlay pattern as `maths.js`'s `showSetup()`, kept deliberately plain:

- A single text field — type the numbers for this session (`2, 5, 3`)
- The field is **cleared and focused every time the screen opens**, so the
  parent never has to delete the last session's numbers first
- Numbers must be 1–10; an empty submit is rejected with a message rather
  than starting an empty session
- A ⚙ button in the corner reopens setup mid-session without going home

Setup produces a `TARGET_POOL` array. Rounds consume it in order via
`roundIndex`; when the index passes the end of the list, `startRound()` shows
the setup screen again instead of starting a round.

## Files

| File | Change |
|------|--------|
| `counting.html` | New — layout, styles, setup overlay, celebration markup |
| `counting.js` | New — round state, rock scatter, tap-and-fly, lock, celebration |
| `celebrate.js` | New — shared celebration helpers extracted from `maths.js` |
| `maths.html` | Loads `celebrate.js` before `maths.js` |
| `maths.js` | Duplicated helpers removed, now uses `celebrate.js` |
| `index.html` | Sixth card: COUNTING, teal `#00BCD4` |

`maths.html` stays a separate card: Maths is *numeral recognition* (symbol →
symbol), Counting is *quantity* (quantity → symbol). Different skills.

### Shared celebration module

`sprayDirt`, `spawnConfetti`, `spawnStars` and `playCelebrationSound` — about
100 lines — are needed verbatim by both modules. They move to `celebrate.js`
rather than being copy-pasted, so the celebration cannot drift apart in two
places. Functions look their container elements up at call time, so either page
can use them.

## Out of scope

Voice input, text-to-speech, scoring, streaks, progress tracking, subitizing
rounds, and the explicit DIG! button (the true Give-N variant where the child
declares he is finished, with a real fail state). All are easy to add once we
have watched him play.
