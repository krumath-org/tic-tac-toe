import { useRef } from "react";

import { Bot, Handshake, Trophy, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { useTranslation } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

export type GameOutcome = "win" | "lose" | "draw";

const RESULT: Record<GameOutcome, { icon: LucideIcon; titleKey: TranslationKey; brand: boolean }> =
  {
    win: { icon: Trophy, titleKey: "result.youWin", brand: true },
    lose: { icon: Bot, titleKey: "result.youLose", brand: false },
    draw: { icon: Handshake, titleKey: "result.draw", brand: false },
  };

/**
 * Game-over modal. The finished board stays behind a lightly blurred backdrop so
 * the result reads as a proper end-of-game moment without hiding the board
 * entirely. Dismissing it (Escape / backdrop / Play Again) leaves the board
 * visible with a restarted game or a compact Play Again button underneath.
 */
export function ResultDialog({
  open,
  outcome,
  score,
  onPlayAgain,
  onOpenChange,
}: {
  open: boolean;
  outcome: GameOutcome;
  score: { you: number; ai: number; draw: number };
  onPlayAgain: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslation();
  const playAgainRef = useRef<HTMLButtonElement>(null);
  const { icon: Icon, titleKey, brand } = RESULT[outcome];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        overlayClassName="bg-background/60 backdrop-blur-sm"
        // Focus the primary action rather than the dialog box itself.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          playAgainRef.current?.focus();
        }}
        className="w-[min(22rem,calc(100%-2rem))] max-w-none gap-0 rounded-2xl border-border bg-card p-6 text-center shadow-lg sm:rounded-2xl"
      >
        <div
          className={cn(
            "mx-auto flex size-16 items-center justify-center rounded-full",
            brand ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-8" aria-hidden="true" />
        </div>
        <DialogTitle className="mt-4 text-3xl font-bold tracking-tight">{t(titleKey)}</DialogTitle>
        <DialogDescription className="mt-2 text-sm">{t("result.summary", score)}</DialogDescription>
        <Button ref={playAgainRef} onClick={onPlayAgain} size="lg" className="mt-6">
          {t("game.playAgain")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
