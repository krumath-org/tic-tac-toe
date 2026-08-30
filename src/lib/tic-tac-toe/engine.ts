export type Cell = "X" | "O" | null;
export type Board = Cell[];
export type Player = "X" | "O";

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const emptyBoard = (): Board => Array<Cell>(9).fill(null);

export const availableMoves = (board: Board): number[] =>
  board.reduce<number[]>((acc, c, i) => (c === null ? (acc.push(i), acc) : acc), []);

export const isValidMove = (board: Board, index: number): boolean =>
  index >= 0 && index < 9 && board[index] === null && getWinner(board) === null;

export const applyMove = (board: Board, index: number, player: Player): Board => {
  const next = board.slice();
  next[index] = player;
  return next;
};

export function getWinner(board: Board): { player: Player; line: readonly number[] } | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return { player: v, line };
  }
  return null;
}

export const isDraw = (board: Board): boolean =>
  getWinner(board) === null && board.every((c) => c !== null);

export const other = (p: Player): Player => (p === "X" ? "O" : "X");

export type GameStatus =
  | { kind: "playing"; turn: Player }
  | { kind: "won"; player: Player; line: readonly number[] }
  | { kind: "draw" };

export function getStatus(board: Board, turn: Player): GameStatus {
  const win = getWinner(board);
  if (win) return { kind: "won", player: win.player, line: win.line };
  if (isDraw(board)) return { kind: "draw" };
  return { kind: "playing", turn };
}
