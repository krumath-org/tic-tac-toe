/**
 * Move selection for Tic-Tac-Toe / m,n,k-games.
 *
 * Small boards (3x3) use exhaustive depth-aware minimax; larger boards use a
 * threat-based line evaluation with a shallow negamax search over candidate
 * cells near existing stones. Original implementation, no third-party code.
 */
import {
  applyMove,
  availableMoves,
  getLines,
  getWinner,
  isDraw,
  other,
  type Board,
  type BoardConfig,
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

/** Board size + win length per difficulty. */
export const BOARDS: Record<Difficulty, BoardConfig> = {
  beginner: { size: 3, winLength: 3 },
  easy: { size: 4, winLength: 4 },
  medium: { size: 5, winLength: 5 },
  hard: { size: 6, winLength: 5 },
  expert: { size: 7, winLength: 5 },
  impossible: { size: 8, winLength: 5 },
};

/** Chance the AI plays a random legal move instead of its best move. */
const NOISE: Record<Difficulty, number> = {
  beginner: 0.85,
  easy: 0.5,
  medium: 0.2,
  hard: 0.08,
  expert: 0.02,
  impossible: 0,
};

/** Search depth in plies (0 = pure heuristic, exhaustive minimax on 3x3). */
const SEARCH_DEPTH: Record<Difficulty, number> = {
  beginner: 0,
  easy: 2,
  medium: 2,
  hard: 2,
  expert: 4,
  impossible: 4,
};

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

const WIN = 1_000_000;

/* ---------------- exhaustive minimax (3x3 only) ---------------- */

function minimax(
  board: Board,
  current: Player,
  me: Player,
  depth: number,
  config: BoardConfig,
): number {
  const win = getWinner(board, config);
  if (win) return win.player === me ? 10 - depth : depth - 10;
  if (isDraw(board, config)) return 0;

  const scores = availableMoves(board).map((m) =>
    minimax(applyMove(board, m, current), other(current), me, depth + 1, config),
  );
  return current === me ? Math.max(...scores) : Math.min(...scores);
}

function bestMinimaxMoves(board: Board, me: Player, config: BoardConfig): number[] {
  let best = -Infinity;
  let result: number[] = [];
  for (const m of availableMoves(board)) {
    const score = minimax(applyMove(board, m, me), other(me), me, 1, config);
    if (score > best) {
      best = score;
      result = [m];
    } else if (score === best) {
      result.push(m);
    }
  }
  return result;
}

/* ---------------- heuristic evaluation ---------------- */

// Value of having n of my marks in an otherwise empty winning line.
const LINE_SCORE = [0, 1, 12, 150, 2000, 25000, 25000, 25000, 25000];

function evaluate(board: Board, me: Player, config: BoardConfig): number {
  const opp = other(me);
  let score = 0;
  for (const line of getLines(config)) {
    let mine = 0;
    let theirs = 0;
    for (const idx of line) {
      const v = board[idx];
      if (v === me) mine++;
      else if (v === opp) theirs++;
    }
    if (mine && theirs) continue;
    if (mine) score += LINE_SCORE[Math.min(mine, LINE_SCORE.length - 1)]!;
    else if (theirs) score -= LINE_SCORE[Math.min(theirs, LINE_SCORE.length - 1)]! * 1.2;
  }
  return score;
}

/** Empty cells within `radius` of an occupied cell (whole board if empty). */
function candidates(board: Board, config: BoardConfig, radius = 1, limit = 14): number[] {
  const { size } = config;
  const occupied = board.some((c) => c !== null);
  if (!occupied) {
    const mid = Math.floor(size / 2);
    return [mid * size + mid];
  }
  const near: number[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const i = r * size + c;
      if (board[i] !== null) continue;
      let touching = false;
      for (let dr = -radius; dr <= radius && !touching; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
          if (board[nr * size + nc] !== null) {
            touching = true;
            break;
          }
        }
      }
      if (touching) near.push(i);
    }
  }
  const list = near.length ? near : availableMoves(board);
  if (list.length <= limit) return list;
  // Keep the most promising by static one-ply gain.
  return list
    .map((m) => ({ m, s: quickGain(board, m, config) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.m);
}

function quickGain(board: Board, move: number, config: BoardConfig): number {
  const a = evaluate(applyMove(board, move, "X"), "X", config);
  const b = evaluate(applyMove(board, move, "O"), "O", config);
  return a + b;
}

function negamax(
  board: Board,
  current: Player,
  me: Player,
  depth: number,
  alpha: number,
  beta: number,
  config: BoardConfig,
): number {
  const win = getWinner(board, config);
  if (win) return win.player === me ? WIN + depth : -WIN - depth;
  if (depth === 0 || availableMoves(board).length === 0) return evaluate(board, me, config);

  const maximizing = current === me;
  let best = maximizing ? -Infinity : Infinity;
  for (const m of candidates(board, config)) {
    const score = negamax(
      applyMove(board, m, current),
      other(current),
      me,
      depth - 1,
      alpha,
      beta,
      config,
    );
    if (maximizing) {
      if (score > best) best = score;
      if (best > alpha) alpha = best;
    } else {
      if (score < best) best = score;
      if (best < beta) beta = best;
    }
    if (alpha >= beta) break;
  }
  return best;
}

/** Immediate winning move for `player`, if any. */
function winningMove(board: Board, player: Player, config: BoardConfig): number | null {
  for (const m of availableMoves(board)) {
    if (getWinner(applyMove(board, m, player), config)?.player === player) return m;
  }
  return null;
}

function heuristicMove(board: Board, me: Player, config: BoardConfig): number {
  const moves = availableMoves(board);
  const win = winningMove(board, me, config);
  if (win !== null) return win;
  const block = winningMove(board, other(me), config);
  if (block !== null) return block;
  const cands = candidates(board, config);
  let best = -Infinity;
  let picks: number[] = [];
  for (const m of cands) {
    const s = evaluate(applyMove(board, m, me), me, config);
    if (s > best) {
      best = s;
      picks = [m];
    } else if (s === best) picks.push(m);
  }
  return picks.length ? pick(picks) : pick(moves);
}

export function selectMove(board: Board, me: Player, difficulty: Difficulty): number | null {
  const config = BOARDS[difficulty];
  const moves = availableMoves(board);
  if (moves.length === 0) return null;

  if (Math.random() < NOISE[difficulty]) {
    if (difficulty !== "beginner") {
      const win = winningMove(board, me, config);
      if (win !== null) return win;
    }
    return pick(moves);
  }

  // Always take a win, always block one.
  const win = winningMove(board, me, config);
  if (win !== null) return win;
  const block = winningMove(board, other(me), config);
  if (block !== null) return block;

  if (config.size === 3) return pick(bestMinimaxMoves(board, me, config));

  const depth = SEARCH_DEPTH[difficulty];
  if (depth <= 0) return heuristicMove(board, me, config);

  let best = -Infinity;
  let picks: number[] = [];
  for (const m of candidates(board, config)) {
    const s = negamax(
      applyMove(board, m, me),
      other(me),
      me,
      depth - 1,
      -Infinity,
      Infinity,
      config,
    );
    if (s > best) {
      best = s;
      picks = [m];
    } else if (s === best) picks.push(m);
  }
  return picks.length ? pick(picks) : heuristicMove(board, me, config);
}
