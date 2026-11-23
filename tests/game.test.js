import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, evaluateBoard, playMove } from '../src/game.js';

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
  [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
];

test('fresh games are independent and start with X', () => {
  const state = createGame();
  assert.deepEqual(state, {
    board: Array(9).fill(null), currentPlayer: 'X',
    status: 'playing', winner: null, winningLine: [],
  });
  assert.notEqual(state.board, createGame().board);
});

test('legal moves alternate and never mutate the supplied state', () => {
  const state = createGame();
  Object.freeze(state.board);
  Object.freeze(state.winningLine);
  Object.freeze(state);
  const next = playMove(state, 0);
  assert.equal(next.board[0], 'X');
  assert.equal(next.currentPlayer, 'O');
  assert.equal(state.board[0], null);
  assert.equal(playMove(next, 4).board[4], 'O');
  assert.equal(playMove(next, 4).currentPlayer, 'X');
});

test('invalid indexes and occupied cells preserve state identity', () => {
  const state = playMove(createGame(), 0);
  for (const index of [-1, 9, 1.5, NaN, Infinity, '1', null, undefined, 0]) {
    assert.equal(playMove(state, index), state);
  }
});

for (const player of ['X', 'O']) {
  for (const line of lines) {
    test(`${player} wins line ${line}`, () => {
      const board = Array(9).fill(null);
      for (const index of line) board[index] = player;
      const result = evaluateBoard(board);
      assert.deepEqual(result, { status: 'won', winner: player, winningLine: line });
      assert.notEqual(result.winningLine, line);
      const state = { ...createGame(), board, ...result };
      assert.equal(playMove(state, board.indexOf(null)), state);
    });
  }
}

test('winning move produces terminal state without toggling winner', () => {
  const state = [0, 3, 1, 4, 2].reduce(playMove, createGame());
  assert.equal(state.status, 'won');
  assert.equal(state.winner, 'X');
  assert.equal(state.currentPlayer, 'X');
  assert.deepEqual(state.winningLine, [0, 1, 2]);
  assert.equal(playMove(state, 8), state);
});

test('full-board draw locks moves and a fresh game resets everything', () => {
  const state = [0, 1, 2, 4, 3, 5, 7, 6, 8].reduce(playMove, createGame());
  assert.equal(state.status, 'draw');
  assert.equal(state.winner, null);
  assert.deepEqual(state.winningLine, []);
  assert.equal(playMove(state, 0), state);
  assert.deepEqual(createGame().board, Array(9).fill(null));
  assert.equal(createGame().currentPlayer, 'X');
});

test('a win on the ninth move takes precedence over draw', () => {
  const state = [0, 1, 4, 2, 3, 5, 7, 6, 8].reduce(playMove, createGame());
  assert.equal(state.status, 'won');
  assert.equal(state.winner, 'X');
});

test('an unfinished nonwinning board remains playing', () => {
  assert.deepEqual(evaluateBoard(['X', 'O', null, null, null, null, null, null, null]), {
    status: 'playing', winner: null, winningLine: [],
  });
});
