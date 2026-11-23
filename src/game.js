const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

// PUBLIC_INTERFACE
export function createGame() {
  /** Return an independent, empty X-first round. */
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'playing',
    winner: null,
    winningLine: [],
  };
}

// PUBLIC_INTERFACE
export function evaluateBoard(board) {
  /** Evaluate a nine-cell board, prioritizing a win over a full-board draw. */
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return { status: 'won', winner: board[a], winningLine: [...line] };
    }
  }
  return {
    status: board.every(cell => cell !== null) ? 'draw' : 'playing',
    winner: null,
    winningLine: [],
  };
}

// PUBLIC_INTERFACE
export function playMove(state, index) {
  /** Return a new legal move state; invalid or terminal moves preserve identity. */
  if (
    state.status !== 'playing' || !Number.isInteger(index) ||
    index < 0 || index > 8 || state.board[index] !== null
  ) return state;

  const board = [...state.board];
  board[index] = state.currentPlayer;
  const result = evaluateBoard(board);
  return {
    board,
    ...result,
    currentPlayer: result.status === 'playing'
      ? (state.currentPlayer === 'X' ? 'O' : 'X')
      : state.currentPlayer,
  };
}
