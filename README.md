# Lightning Tic Tac Toe

A local two-player game rendered with Lightning JS 3 / Blits and WebGL.
No backend, accounts, network asset service, or persistent state is required.

## Setup and run

Verified with Node.js 18.20.8 and npm 10.8.2.

```sh
npm ci
```

For a local development session, start Vite and open the URL it prints:

```sh
npx --no-install vite --host 127.0.0.1
```

Platform previews should use their allocated host and port:
`npx --no-install vite --host <host> --port <port>`.
No platform manifest was supplied; this project does not override platform runtime configuration.

## Play

- Arrow keys move the mint focus outline. Enter selects a cell.
- Players alternate X and O; X starts every round.
- Left/right do not wrap between rows. Up stops at the top edge.
- Down from the bottom row selects **New round**.
- Up from **New round** returns to the bottom-middle cell.
- Enter on **New round** clears the game and focuses the first cell.
- Occupied cells and completed rounds reject board moves.
- Three matching marks win; winning squares have a green background.
- A full board without a winner is a draw.

Keyboard/remote interaction is intentional; mouse and touch controls are not implemented.
Reloading clears the round. The logical stage is 1920×1080 and scales to 1280×720.

## Verify

```sh
node --test tests/*.test.js
npx --no-install vite build
```

The production bundle is written to `dist/`. The built-in Node suite has 35 tests
covering all eight lines for both players, draws, immutable moves, invalid moves,
terminal lockout, and the complete navigation table.

Chromium/WebGL verification also covered visible rendering at 1920×1080 and
1280×720, keyboard wins and draws, occupied-cell rejection, post-win lockout,
and active/terminal restarts. A stale reactive winner label discovered during
visual verification was corrected and the winning screen rechecked.

## Structure

- `src/main.js`: renderer launch, local font, and keyboard mapping.
- `src/App.js`: authoritative round and focus state, controls, and status.
- `src/components/GameBoard.js`: registered presentation-only board.
- `src/game.js`: pure immutable game rules.
- `src/navigation.js`: pure bounded navigation.
- `tests/`: dependency-free Node regression tests.

Blits 2.9.0 pins renderer 3.3.1, compatible with Node 18. Vite is pinned to 6.4.1.
The bundled Lato font is licensed under the SIL Open Font License; see
[public/fonts/OFL.txt](public/fonts/OFL.txt).
