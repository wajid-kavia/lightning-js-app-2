import test from 'node:test';
import assert from 'node:assert/strict';
import { nextFocus } from '../src/navigation.js';

const transitions = [
  [0, 0, 1, 0, 3],
  [1, 0, 2, 1, 4],
  [2, 1, 2, 2, 5],
  [3, 3, 4, 0, 6],
  [4, 3, 5, 1, 7],
  [5, 4, 5, 2, 8],
  [6, 6, 7, 3, 'restart'],
  [7, 6, 8, 4, 'restart'],
  [8, 7, 8, 5, 'restart'],
  ['restart', 'restart', 'restart', 7, 'restart'],
];

for (const [target, ...expected] of transitions) {
  test(`all directions from ${target}`, () => {
    ['left', 'right', 'up', 'down'].forEach((direction, i) => {
      assert.equal(nextFocus(target, direction), expected[i]);
    });
  });
}

test('restart is reachable and returns to the board', () => {
  assert.equal(nextFocus(nextFocus(nextFocus(0, 'down'), 'down'), 'down'), 'restart');
  assert.equal(nextFocus('restart', 'up'), 7);
});

test('unknown directions are inert and invalid targets recover to first cell', () => {
  assert.equal(nextFocus(4, 'unknown'), 4);
  for (const invalid of [-1, 9, null, undefined, '0', 0.1]) {
    assert.equal(nextFocus(invalid, 'down'), 0);
  }
});
