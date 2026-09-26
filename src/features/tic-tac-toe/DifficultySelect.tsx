import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { difficultyKey } from "@/lib/i18n/dictionary";
import { useTranslation } from "@/lib/i18n/hooks";
import { BOARDS, DIFFICULTIES, type Difficulty } from "@/lib/tic-tac-toe/ai";

/**
 * Difficulty picker rendered as a real control instead of the bare native
 * `<select>`. Options read "Medium · 5×5"; the trigger truncates so long Khmer
 * names never break the score row, and everything follows the active theme.
 */
export function DifficultySelect({
  value,
  onChange,
}: {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}) {
  const t = useTranslation();
  const label = (difficulty: Difficulty) =>
    t("game.difficulty.option", {
      name: t(difficultyKey(difficulty)),
      size: BOARDS[difficulty].size,
    });

  return (
    <Select value={value} onValueChange={(next) => onChange(next as Difficulty)}>
      <SelectTrigger
        aria-label={t("game.difficulty.label")}
        className="h-9 w-auto max-w-[13rem] gap-1.5 rounded-lg border-input bg-background px-2.5 text-sm shadow-sm hover:bg-accent"
      >
        <SelectValue>{label(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="max-h-72">
        {DIFFICULTIES.map((difficulty) => (
          <SelectItem key={difficulty} value={difficulty} className="cursor-pointer text-sm">
            {label(difficulty)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
