/**
 * Minimax move selection for Tic-Tac-Toe.
 *
 * Algorithm follows the classic depth-aware minimax formulation described in
 * the public-domain / MIT-licensed tutorials commonly published as
 * "Tic Tac Toe with Minimax" (e.g. https://github.com/beaucarnes/fcc-project-tutorials,
 * MIT License). No third-party code is bundled; this is an original
 * implementation written against that well-known approach.
 */
import {
  applyMove,
  availableMoves,
  getWinner,
  isDraw,
  other,
  type Board,
  type Player,
} from "./engine";

export type Difficulty = "beginner" | "easy" | "medium" | "hard" | "expert" | "impossible";

export const DIFFICULTIES: Difficulty[] = [
  "beginner",
  "easy",
  "medium",
  "hard",
  "expert",
  "impossible",
];

const CORNERS = [0, 2, 6, 8];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

function minimax(board: Board, current: Player, me: Player, depth: number, maxDepth: number): number {
  const win = getWinner(board);
  if (win) return win.player === me ? 10 - depth : depth - 10;
  if (isDraw(board)) return 0;
  if (depth >= maxDepth) return 0;

  const moves = availableMoves(board);
  const scores = moves.map((m) =>
    minimax(applyMove(board, m, current), other(current), me, depth + 1, maxDepth),
  );
  return current === me ? Math.max(...scores) : Math.min(...scores);
}

function bestMoves(board: Board, me: Player, maxDepth: number): number[] {
  const moves = availableMoves(board);
  let best = -Infinity;
  let result: number[] = [];
  for (const m of moves) {
    const score = minimax(applyMove(board, m, me), other(me), me, 1, maxDepth);
    if (score > best) {
      best = score;
      result = [m];
    } else if (score === best) {
      result.push(m);
    }
  }
  return result;
}

/** Immediate winning move for `player`, if any. */
function winningMove(board: Board, player: Player): number | null {
  for (const m of availableMoves(board)) {
    if (getWinner(applyMove(board, m, player))?.player === player) return m;
  }
  return null;
}

function heuristicMove(board: Board, me: Player): number {
  const moves = availableMoves(board);
  const win = winningMove(board, me);
  if (win !== null) return win;
  const block = winningMove(board, other(me));
  if (block !== null) return block;
  if (moves.includes(4)) return 4;
  const corners = CORNERS.filter((c) => moves.includes(c));
  if (corners.length) return pick(corners);
  return pick(moves);
}

/** Chance the AI plays a random legal move instead of its best move. */
const NOISE: Record<Difficulty, number> = {
  beginner: 0.85,
  easy: 0.55,
  medium: 0.25,
  hard: 0.1,
  expert: 0.02,
  impossible: 0,
};

const SEARCH_DEPTH: Record<Difficulty, number> = {
  beginner: 0,
  easy: 0,
  medium: 0,
  hard: 4,
  expert: 9,
  impossible: 9,
};

export function selectMove(board: Board, me: Player, difficulty: Difficulty): number | null {
  const moves = availableMoves(board);
  if (moves.length === 0) return null;

  if (Math.random() < NOISE[difficulty]) {
    // Beginner blunders freely; the rest still take a free win when offered.
    if (difficulty !== "beginner") {
      const win = winningMove(board, me);
      if (win !== null) return win;
    }
    return pick(moves);
  }

  const depth = SEARCH_DEPTH[difficulty];
  if (depth === 0) return heuristicMove(board, me);
  return pick(bestMoves(board, me, depth));
}
