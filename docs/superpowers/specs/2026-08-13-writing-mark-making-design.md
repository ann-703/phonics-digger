# Writing Module — Mark Making (Module 1) — Design

## What It Is

A new top-level "Writing" subject in Phonics Digger, alongside the existing Phonics and Maths modules. Teaches Pranik (3) finger-trace mark-making as pre-handwriting practice, using the same dirt/digger visual theme as the rest of the app.

Runs in Chrome on iPad and Android tablet, landscape orientation, touch-only. No install, no login.

## Teaching Method

Based on standard occupational-therapy pre-writing stroke progression, adapted to Pranik's age (3):

1. Vertical straight line (top → bottom)
2. Horizontal straight line (left → right)
3. Circle
4. Cross (+)
5. Curvy line (single wave — lead-in to letters like c/s/e)

Diagonal lines are deliberately excluded from this first module — OT research places them at ~4.5yo, later than Pranik's current age. Order and ages are sourced from OT pre-writing developmental references (griffinot.com, empoweringotresources.com, hoggtherapy.com).

## App Structure

- New files: `writing.html`, `writing.js` — mirror the existing `phonics.html`/`app.js` and `maths.html`/`maths.js` pattern (vanilla JS, no framework, no build step, pointer events for touch)
- `index.html` gets a third home card, "WRITING", positioned alongside the existing Phonics and Maths cards, reusing the same mini-digger SVG icon with a new accent color for visual consistency
- No changes to `phonics.html`, `maths.html`, `app.js`, or `maths.js`

## Screen Layout

- **Left panel** — static example: the current shape drawn in a bright guide color, with a small animated start-point/direction indicator (e.g. a pulsing dot or arrow) that loops, showing Pranik where to start and which way to move before he tries
- **Right panel** — the "dirt pad": a `<canvas>` filled with a brown dirt color/texture. The shape's path is drawn underneath in a bright reveal color, hidden by the dirt layer on top.

## Trace Mechanic

- Pointer events (`pointerdown` / `pointermove` / `pointerup`) drive the dirt pad, matching the pattern already used in `maths.js`
- As Pranik drags his finger, the canvas erases dirt along the pointer path using `globalCompositeOperation = "destination-out"`, revealing the bright color beneath — a scratch-off effect
- Erasing is constrained to a tolerance corridor (~40px radius) around the guide path's centerline, so dragging off-path does not clear unrelated areas of the canvas — this keeps the activity feeling like "tracing the shape" rather than free scribbling
- **Completion** for one rep = roughly 80% of the guide path's length has been revealed (measured by sampling points along the path and checking whether each has been cleared)

## Repetition & Progression

- Each shape is attempted **3 times (reps)** before advancing, to build motor memory (per OT guidance on repetition)
- Between reps: the dirt pad quickly refills/resets to solid dirt, guide path stays the same
- After the 3rd successful rep of a shape: a short digger cheer animation plays (reuse `digger-small.svg`'s wiggle animation from the Phonics module), then the module auto-advances (~1 second delay) to the next shape — no manual "next" button, to keep momentum for a 3-year-old's attention span
- After all 5 shapes × 3 reps are complete, the module loops back to shape 1 — matching the session-loop pattern already used in Phonics and Maths. No separate "session complete" screen for this MVP.

## Audio

None. This module is visual-only, unlike Phonics which uses spoken phoneme cues. No audio assets are required.

## Failure Handling / Edge Cases

- No punishment state. If Pranik's trace wanders off the tolerance corridor or never reaches 80% coverage, nothing negative happens — the dirt pad simply stays partially cleared until he continues tracing within the corridor.
- There is no "wrong" animation or sound for this module, consistent with the app's general no-punishment philosophy already used in Phonics' phoneme handling.
- Portrait orientation: if the codebase already has a rotation-prompt pattern (used elsewhere in the app), reuse it here. If not, this is out of scope for the MVP and can be added later.

## Frontend Stack (matches existing app)

| Layer | Choice |
|---|---|
| HTML/CSS/JS | Vanilla — no framework, no build step |
| Touch input | Pointer events (`pointerdown`/`pointermove`/`pointerup`) |
| Dirt reveal | HTML5 `<canvas>`, `globalCompositeOperation: destination-out` |
| Digger graphics | Reuse existing `digger-small.svg` |

## MVP Scope

**In scope:**
- 5 shapes in fixed order, 3 reps each
- Scratch-off dirt reveal with tolerance-corridor detection
- Digger cheer + auto-advance between shapes
- Session loop back to shape 1
- New WRITING home card

**Out of scope for this module:**
- Voice/audio prompts
- Diagonal lines, square, X, triangle (future mark-making modules)
- Progress tracking / persistence across sessions
- Reward-vehicle integration (unlike Phonics/Maths, this module does not currently tie into the vehicle reward system)
- Portrait-orientation handling (unless an existing pattern can be trivially reused)

## Testing Plan

| Test | How to test | Pass condition |
|---|---|---|
| WRITING card appears on home page | Open `index.html` | Third card visible, styled consistently with Phonics/Maths, links to `writing.html` |
| Shape 1 (vertical line) loads first | Open `writing.html` | Left panel shows vertical line example, right panel shows dirt pad |
| Tracing within tolerance reveals color | Drag finger along the guide path | Dirt clears progressively along the path |
| Tracing off-path does not reveal | Drag finger far from guide path | No dirt clears outside the tolerance corridor |
| Rep completes at ~80% coverage | Trace most of the shape | Dirt pad registers rep as complete, resets to solid dirt |
| 3 reps required before advancing | Complete reps 1 and 2 | Module stays on the same shape until rep 3 completes |
| Digger cheer plays after 3rd rep | Complete rep 3 | Digger wiggle animation plays |
| Auto-advance to next shape | Wait after cheer animation | Next shape (horizontal line) loads within ~1s, no tap required |
| All 5 shapes cycle in order | Complete all shapes | Order matches: vertical, horizontal, circle, cross, curvy |
| Session loops after shape 5 | Complete curvy line's 3rd rep | Module returns to shape 1 (vertical line) |
| No crash on rapid/erratic input | Scribble quickly across the canvas | App remains stable, no errors |
| Works in Chrome on iPad, landscape | Open on iPad in Chrome | Layout renders correctly, touch tracing responsive |
| 3-year-old can complete one shape unassisted | Sit with Pranik, run once | He can trace and clear one shape with minimal parent help |
