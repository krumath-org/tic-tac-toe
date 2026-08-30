import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  applyMove,
  emptyBoard,
  getStatus,
  isValidMove,
  other,
  type Board,
  type Player,
} from "@/lib/tic-tac-toe/engine";
import { DIFFICULTIES, selectMove, type Difficulty } from "@/lib/tic-tac-toe/ai";
import { cn } from "@/lib/utils";

const TITLE = "Tic-Tac-Toe | Krumath";
const DESCRIPTION = "Play Tic-Tac-Toe online against the computer.";

export const Route = createFileRoute("/games/tic-tac-toe")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TicTacToePage,
});

const STORAGE_KEY = "krumath.ttt";
const CELL_NAMES = [
  "Top left",
  "Top centre",
  "Top right",
  "Middle left",
  "Centre",
  "Middle right",
  "Bottom left",
  "Bottom centre",
  "Bottom right",
];

type Score = { you: number; draw: number; ai: number };
const ZERO: Score = { you: 0, draw: 0, ai: 0 };

function loadPrefs(): { difficulty: Difficulty; score: Score } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { difficulty: "medium", score: ZERO };
    const parsed = JSON.parse(raw) as Partial<{ difficulty: Difficulty; score: Score }>;
    return {
      difficulty: DIFFICULTIES.includes(parsed.difficulty as Difficulty)
        ? (parsed.difficulty as Difficulty)
        : "medium",
      score: { ...ZERO, ...(parsed.score ?? {}) },
    };
  } catch {
    return { difficulty: "medium", score: ZERO };
  }
}

function TicTacToePage() {
  const human: Player = "X";
  const ai: Player = other(human);

  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<Player>(human);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState<Score>(ZERO);
  const [thinking, setThinking] = useState(false);
  const gameId = useRef(0);
  const scored = useRef(false);

  useEffect(() => {
    const prefs = loadPrefs();
    setDifficulty(prefs.difficulty);
    setScore(prefs.score);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ difficulty, score }));
    } catch {
      /* storage unavailable — gameplay continues */
    }
  }, [difficulty, score]);

  const status = getStatus(board, turn);
  const over = status.kind !== "playing";

  // Record result once per finished game.
  useEffect(() => {
    if (!over || scored.current) return;
    scored.current = true;
    setScore((s) =>
      status.kind === "draw"
        ? { ...s, draw: s.draw + 1 }
        : status.kind === "won" && status.player === human
          ? { ...s, you: s.you + 1 }
          : { ...s, ai: s.ai + 1 },
    );
  }, [over, status, human]);

  // AI turn.
  useEffect(() => {
    if (over || turn !== ai) return;
    const id = gameId.current;
    setThinking(true);
    const t = setTimeout(() => {
      if (id !== gameId.current) return;
      setBoard((b) => {
        if (getStatus(b, ai).kind !== "playing") return b;
        const move = selectMove(b, ai, difficulty);
        if (move === null || !isValidMove(b, move)) return b;
        return applyMove(b, move, ai);
      });
      setTurn(human);
      setThinking(false);
    }, 280);
    return () => clearTimeout(t);
  }, [turn, over, ai, human, difficulty]);

  const play = useCallback(
    (i: number) => {
      if (thinking || turn !== human || !isValidMove(board, i)) return;
      setBoard(applyMove(board, i, human));
      setTurn(ai);
    },
    [board, thinking, turn, human, ai],
  );

  const reset = useCallback(() => {
    gameId.current += 1;
    scored.current = false;
    setThinking(false);
    setBoard(emptyBoard());
    setTurn(human);
  }, [human]);

  const winLine = status.kind === "won" ? status.line : [];
  const message =
    status.kind === "draw"
      ? "Draw"
      : status.kind === "won"
        ? status.player === human
          ? "You win"
          : "AI wins"
        : thinking
          ? "AI thinking…"
          : "Your turn";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-8 px-5 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Tic-Tac-Toe</h1>

      <div
        role="grid"
        aria-label="Tic-Tac-Toe board"
        className="grid w-full grid-cols-3 gap-2"
      >
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            role="gridcell"
            onClick={() => play(i)}
            disabled={over || cell !== null}
            aria-label={`${CELL_NAMES[i]}, ${cell ?? "empty"}`}
            className={cn(
              "ttt-cell flex aspect-square items-center justify-center rounded-xl border border-border bg-card text-4xl font-semibold text-foreground transition-colors sm:text-5xl",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              !cell && !over && "hover:bg-accent",
              winLine.includes(i) && "border-primary bg-accent",
              cell === "O" && "text-muted-foreground",
            )}
          >
            {cell && <span className="ttt-mark">{cell}</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {message}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Play Again
        </button>
      </div>

      <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
        <span>
          You {score.you} · Draw {score.draw} · AI {score.ai}
        </span>
        <label className="flex items-center gap-1">
          <span className="sr-only">Difficulty</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="cursor-pointer rounded-md bg-transparent px-1 py-0.5 capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d} className="capitalize">
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>
    </main>
  );
}
