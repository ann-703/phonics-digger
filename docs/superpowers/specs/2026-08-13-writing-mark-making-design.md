# Writing Module — Mark Making (Module 1) — Design

## What It Is

A new top-level "Writing" subject in Phonics Digger, alongside the existing Phonics and Maths modules. Teaches Pranik (3) finger-trace mark-making as pre-handwriting practice, using the same dirt/digger visual theme as the rest of the app.

Runs in Chrome on iPad and Android tablet, landscape orientation, touch-only. No install, no login.

## Teaching Method

Starting point was standard occupational-therapy pre-writing stroke progression (adapted to Pranik's age of 3), which orders shapes as: vertical → horizontal → circle → cross → curvy. Ankita subsequently reordered it, moving circle to last:

1. Vertical straight line (top → bottom)
2. Horizontal straight line (left → right)
3. Cross (+)
4. Curvy line (single wave — lead-in to letters like c/s/e)
5. Circle

Diagonal lines are deliberately excluded from this first module — OT research places them at ~4.5yo, later than Pranik's current age. OT reference order/ages are sourced from griffinot.com, empoweringotresources.com, hoggtherapy.com; the final in-app order above is Ankita's preference, not a strict OT sequence.

## App Structure

- New files: `writing.html`, `writing.js` — mirror the existing `phonics.html`/`app.js` and `maths.html`/`maths.js` pattern (vanilla JS, no framework, no build step, pointer events for touch)
- `index.html` gets a third home card, "WRITING", positioned alongside the existing Phonics and Maths cards, reusing the same mini-digger SVG icon with a new accent color for visual consistency
- No changes to `phonics.html`, `maths.html`, `app.js`, or `maths.js`

## Screen Layout

- **Left panel** — static example: the current shape drawn in a bright guide color, with a small animated start-point/direction indicator (e.g. a pulsing dot or arrow) that loops, showing Pranik where to start and which way to move before he tries
- **Right panel** — the "dirt pad": a `<canvas>` filled with a brown dirt color/texture. The shape's path is drawn underneath in a bright reveal color, hidden by the dirt layer on top. Sized generously (large, responsive to viewport) rather than a small fixed box, so it's comfortable for a 3-year-old's finger.

## Trace Mechanic

- Pointer events (`pointerdown` / `pointermove` / `pointerup`) drive the dirt pad, matching the pattern already used in `maths.js`
- As Pranik drags his finger, the canvas erases dirt along the pointer path using `globalCompositeOperation = "destination-out"`, revealing the bright color beneath — a scratch-off effect
- Erasing is constrained to a tolerance corridor (~40px radius) around the guide path's centerline, so dragging off-path does not clear unrelated areas of the canvas — this keeps the activity feeling like "tracing the shape" rather than free scribbling
- There is **no automatic completion check**. The app does not measure how much of the shape has been traced and does not auto-advance — see Progression below.

## Progression (parent-controlled)

- No reps, no automatic "correct" detection, no checkmark. The parent watches and decides when Pranik is done with a shape.
- A **"Next Shape ▶" button** sits below the dirt pad. Tapping it plays a short digger cheer animation (reuse `digger-small.svg`'s wiggle animation from the Phonics module) and advances to the next shape in the sequence, loading a fresh dirt pad.
- A **"Refill Dirt" button** sits alongside it, letting Pranik or a parent manually reset the current shape's dirt pad back to solid dirt at any time — e.g. to redo a messy attempt without moving on.
- After the 5th shape (circle), tapping "Next Shape" loops back to shape 1 — matching the session-loop pattern already used in Phonics and Maths. No separate "session complete" screen for this MVP.

## Audio

None. This module is visual-only, unlike Phonics which uses spoken phoneme cues. No audio assets are required.

## Failure Handling / Edge Cases

- No punishment state, and no "wrong" detection at all — since there's no automatic completion check, there's nothing to fail. If Pranik's trace wanders off the tolerance corridor, nothing happens; the dirt pad simply stays partially cleared until he continues tracing within the corridor or a parent taps Refill Dirt / Next Shape.
- There is no "wrong" animation or sound for this module, consistent with the app's general no-punishment philosophy already used in Phonics' phoneme handling.
- Portrait orientation: if the codebase already has a rotation-prompt pattern (used elsewhere in the app), reuse it here. If not, this is out of scope for the MVP and can be added later.

## Frontend Stack (matches existing app)

| Layer           | Choice                                                           |
| --------------- | ---------------------------------------------------------------- |
| HTML/CSS/JS     | Vanilla — no framework, no build step                           |
| Touch input     | Pointer events (`pointerdown`/`pointermove`/`pointerup`)   |
| Dirt reveal     | HTML5`<canvas>`, `globalCompositeOperation: destination-out` |
| Digger graphics | Reuse existing`digger-small.svg`                               |

## MVP Scope

**In scope:**

- 5 shapes in fixed order, parent controls pacing
- Scratch-off dirt reveal with tolerance-corridor detection (no completion/coverage check)
- Manual "Refill Dirt" reset button
- Manual "Next Shape ▶" button with digger cheer
- Session loop back to shape 1 after the 5th
- New WRITING home card
- Large, responsive dirt pad and guide panel sizing

**Out of scope for this module:**

- Voice/audio prompts
- Diagonal lines, square, X, triangle (future mark-making modules)
- Progress tracking / persistence across sessions
- Reward-vehicle integration (unlike Phonics/Maths, this module does not currently tie into the vehicle reward system)
- Portrait-orientation handling (unless an existing pattern can be trivially reused)

## Testing Plan

| Test                                         | How to test                        | Pass condition                                                                       |
| -------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| WRITING card appears on home page            | Open`index.html`                 | Third card visible, styled consistently with Phonics/Maths, links to`writing.html` |
| Shape 1 (vertical line) loads first          | Open`writing.html`               | Left panel shows vertical line example, right panel shows dirt pad                   |
| Tracing within tolerance reveals color       | Drag finger along the guide path   | Dirt clears progressively along the path                                             |
| Tracing off-path does not reveal             | Drag finger far from guide path    | No dirt clears outside the tolerance corridor                                        |
| No auto-advance ever happens                 | Fully trace a shape, wait          | Shape stays on screen indefinitely until the parent taps Next Shape                  |
| Refill Dirt button resets current shape      | Partially trace, tap Refill Dirt   | Dirt pad returns to fully covered, same shape stays loaded                           |
| Next Shape button advances + cheers          | Tap Next Shape                     | Digger wiggle plays, next shape loads with a fresh dirt pad                          |
| All 5 shapes cycle in order                  | Tap Next Shape 5 times             | Order matches: vertical, horizontal, cross, curvy, circle                            |
| Session loops after shape 5                  | Tap Next Shape on circle           | Module returns to shape 1 (vertical line)                                            |
| No crash on rapid/erratic input              | Scribble quickly across the canvas | App remains stable, no errors                                                        |
| Dirt pad is large and responsive             | Resize browser / test on iPad and phone-sized viewport | Pad scales up on large screens, stays usable and fully visible on small ones |
| Works in Chrome on iPad, landscape           | Open on iPad in Chrome             | Layout renders correctly, touch tracing responsive                                   |
| 3-year-old can complete one shape unassisted | Sit with Pranik, run once          | He can trace a shape with minimal parent help; parent taps Next Shape when ready     |
