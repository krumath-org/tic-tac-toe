export type Cell = "X" | "O" | null;
export type Board = Cell[];
export type Player = "X" | "O";

export type BoardConfig = {
  /** Board width/height in cells. */
  size: number;
  /** Marks in a row required to win. */
  winLength: number;
};

const linesCache = new Map<string, readonly (readonly number[])[]>();

/** All winning lines for a square board of `size` with `winLength` in a row. */
export function getLines({ size, winLength }: BoardConfig): readonly (readonly number[])[] {
  const key = `${size}:${winLength}`;
  const cached = linesCache.get(key);
  if (cached) return cached;

  const lines: number[][] = [];
  const dirs = [
    [1, 0], // horizontal
    [0, 1], // vertical
    [1, 1], // diagonal down-right
    [1, -1], // diagonal up-right
  ];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const [dc, dr] of dirs) {
        const endR = r + (winLength - 1) * dr!;
        const endC = c + (winLength - 1) * dc!;
        if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;
        const line: number[] = [];
        for (let k = 0; k < winLength; k++) line.push((r + k * dr!) * size + (c + k * dc!));
        lines.push(line);
      }
    }
  }
  linesCache.set(key, lines);
  return lines;
}

export const emptyBoard = (config: BoardConfig): Board =>
  Array<Cell>(config.size * config.size).fill(null);

export const availableMoves = (board: Board): number[] =>
  board.reduce<number[]>((acc, c, i) => (c === null ? (acc.push(i), acc) : acc), []);

export const isValidMove = (board: Board, index: number, config: BoardConfig): boolean =>
  index >= 0 && index < board.length && board[index] === null && getWinner(board, config) === null;

export const applyMove = (board: Board, index: number, player: Player): Board => {
  const next = board.slice();
  next[index] = player;
  return next;
};

export function getWinner(
  board: Board,
  config: BoardConfig,
): { player: Player; line: readonly number[] } | null {
  for (const line of getLines(config)) {
    const v = board[line[0]!];
    if (!v) continue;
    let win = true;
    for (let i = 1; i < line.length; i++) {
      if (board[line[i]!] !== v) {
        win = false;
        break;
      }
    }
    if (win) return { player: v, line };
  }
  return null;
}

export const isDraw = (board: Board, config: BoardConfig): boolean =>
  getWinner(board, config) === null && board.every((c) => c !== null);

export const other = (p: Player): Player => (p === "X" ? "O" : "X");

export type GameStatus =
  | { kind: "playing"; turn: Player }
  | { kind: "won"; player: Player; line: readonly number[] }
  | { kind: "draw" };

export function getStatus(board: Board, turn: Player, config: BoardConfig): GameStatus {
  const win = getWinner(board, config);
  if (win) return { kind: "won", player: win.player, line: win.line };
  if (isDraw(board, config)) return { kind: "draw" };
  return { kind: "playing", turn };
}
