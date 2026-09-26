import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  applyMove,
  emptyBoard,
  getStatus,
  isValidMove,
  other,
  type Board,
  type Player,
} from "@/lib/tic-tac-toe/engine";
import { BOARDS, DIFFICULTIES, selectMove, type Difficulty } from "@/lib/tic-tac-toe/ai";
import { translate } from "@/lib/i18n/dictionary";
import { useTranslation } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

import { DifficultySelect } from "./DifficultySelect";
import { ResultDialog, type GameOutcome } from "./ResultDialog";

// Server-rendered head meta (English): the locale cannot be known before hydration.
export const TITLE = translate("en", "meta.title");
export const DESCRIPTION = translate("en", "meta.description");

const STORAGE_KEY = "krumath.ttt";

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

export function TicTacToePage() {
  const t = useTranslation();
  const human: Player = "X";
  const ai: Player = other(human);

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const config = BOARDS[difficulty];

  const [board, setBoard] = useState<Board>(() => emptyBoard(BOARDS.medium));
  const [turn, setTurn] = useState<Player>(human);
  const [score, setScore] = useState<Score>(ZERO);
  const [thinking, setThinking] = useState(false);
  const gameId = useRef(0);
  const scored = useRef(false);
  const [resultOpen, setResultOpen] = useState(false);

  useEffect(() => {
    const prefs = loadPrefs();
    setDifficulty(prefs.difficulty);
    setScore(prefs.score);
    setBoard(emptyBoard(BOARDS[prefs.difficulty]));
    setTurn(human);
    scored.current = false;
    gameId.current += 1;
  }, [human]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ difficulty, score }));
    } catch {
      /* storage unavailable — gameplay continues */
    }
  }, [difficulty, score]);

  // Keep the document title/description in step with the selected language. The
  // server-rendered head is always English (it cannot know the client choice).
  useEffect(() => {
    document.title = t("meta.title");
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t("meta.description"));
  }, [t]);

  const status = getStatus(board, turn, config);
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
    const timer = setTimeout(() => {
      if (id !== gameId.current) return;
      setBoard((b) => {
        if (getStatus(b, ai, config).kind !== "playing") return b;
        const move = selectMove(b, ai, difficulty);
        if (move === null || !isValidMove(b, move, config)) return b;
        return applyMove(b, move, ai);
      });
      setTurn(human);
      setThinking(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [turn, over, ai, human, difficulty, config]);

  const play = useCallback(
    (i: number) => {
      if (thinking || turn !== human || !isValidMove(board, i, config)) return;
      setBoard(applyMove(board, i, human));
      setTurn(ai);
    },
    [board, thinking, turn, human, ai, config],
  );

  const startGame = useCallback(
    (d: Difficulty) => {
      gameId.current += 1;
      scored.current = false;
      setThinking(false);
      setBoard(emptyBoard(BOARDS[d]));
      setTurn(human);
    },
    [human],
  );

  const reset = useCallback(() => startGame(difficulty), [startGame, difficulty]);

  const changeDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      startGame(d);
    },
    [startGame],
  );

  const winLine = status.kind === "won" ? status.line : [];
  const message = thinking ? t("game.status.thinking") : t("game.status.yourTurn");

  const outcome: GameOutcome | null =
    status.kind === "draw"
      ? "draw"
      : status.kind === "won"
        ? status.player === human
          ? "win"
          : "lose"
        : null;

  // Open the result modal once the game ends. Runs on the null -> result
  // transition, so a new game (which resets `outcome`) never reopens it.
  useEffect(() => {
    if (outcome) setResultOpen(true);
  }, [outcome]);

  // The board is square, so its width is also its height. Capping the width at
  // "viewport height minus everything around it" keeps the whole page on one
  // screen; `max()` then stops it shrinking into an unusable speck on very short
  // viewports (landscape phones), where the page is allowed to scroll instead.
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${config.size}, minmax(0, 1fr))`,
      maxWidth: "max(14rem, min(100%, calc(100dvh - 17rem)))",
    }),
    [config.size],
  );
  const markSize =
    config.size <= 3
      ? "text-4xl sm:text-5xl"
      : config.size <= 5
        ? "text-2xl sm:text-3xl"
        : "text-lg sm:text-2xl";
  const gap = config.size <= 5 ? "gap-2" : "gap-1";
  const radius = config.size <= 5 ? "rounded-xl" : "rounded-md";

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-4 sm:gap-6 sm:py-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t("game.title")}</h1>

      <div
        role="grid"
        aria-label={t("board.label", { size: config.size, winLength: config.winLength })}
        style={gridStyle}
        className={cn("grid w-full", gap)}
      >
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            role="gridcell"
            onClick={() => play(i)}
            disabled={over || cell !== null}
            aria-label={t("board.cell", {
              row: Math.floor(i / config.size) + 1,
              column: (i % config.size) + 1,
              value: cell ?? t("board.empty"),
            })}
            className={cn(
              "ttt-cell flex aspect-square items-center justify-center border border-border bg-card font-semibold text-foreground transition-colors",
              radius,
              markSize,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              !cell && !over && "hover:bg-accent",
              winLine.includes(i) && "border-primary bg-brand/10",
              cell === "O" && "text-muted-foreground",
            )}
          >
            {cell && <span className="ttt-mark">{cell}</span>}
          </button>
        ))}
      </div>

      {over ? (
        // Also sits behind the modal, so dismissing it never leaves the player
        // stranded on a finished board.
        <Button variant="outline" size="sm" onClick={reset}>
          {t("game.playAgain")}
        </Button>
      ) : (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {message}
        </p>
      )}

      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{t("game.score.summary", { you: score.you, draw: score.draw, ai: score.ai })}</span>
        <DifficultySelect value={difficulty} onChange={changeDifficulty} />
      </div>

      {outcome && (
        <ResultDialog
          open={resultOpen}
          outcome={outcome}
          score={{ you: score.you, ai: score.ai, draw: score.draw }}
          onOpenChange={setResultOpen}
          onPlayAgain={() => {
            setResultOpen(false);
            reset();
          }}
        />
      )}
    </main>
  );
}
