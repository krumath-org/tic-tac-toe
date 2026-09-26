export type Locale = "en" | "km";

export const LOCALES: readonly Locale[] = ["en", "km"] as const;

export const LOCALE_STORAGE_KEY = "krumath.ttt.locale";

const en = {
  "meta.title": "Tic-Tac-Toe | KruMath",
  "meta.description": "Play Tic-Tac-Toe online against the computer.",
  "meta.rootTitle": "KruMath",
  "meta.rootDescription": "Interactive games and learning tools from KruMath.",

  "game.title": "Tic-Tac-Toe",
  "game.status.yourTurn": "Your turn",
  "game.status.thinking": "AI thinking…",
  "game.status.youWin": "You win",
  "game.status.aiWins": "AI wins",
  "game.status.draw": "Draw",
  "game.playAgain": "Play Again",
  "game.score.summary": "You {you} · Draw {draw} · AI {ai}",
  "result.youWin": "You Win!",
  "result.youLose": "You Lose",
  "result.draw": "Draw",
  "result.summary": "You {you} · AI {ai} · Draw {draw}",
  "game.difficulty.label": "Difficulty",
  "game.difficulty.option": "{name} · {size}×{size}",

  "difficulty.beginner": "Beginner",
  "difficulty.easy": "Easy",
  "difficulty.medium": "Medium",
  "difficulty.hard": "Hard",
  "difficulty.expert": "Expert",
  "difficulty.impossible": "Impossible",

  "board.label": "Tic-Tac-Toe board, {size} by {size}, {winLength} in a row to win",
  "board.cell": "Row {row}, column {column}, {value}",
  "board.empty": "empty",

  "nav.home": "KruMath",
  "nav.homeAria": "KruMath home",
  "nav.github": "View source on GitHub",
  "nav.donate": "Support KruMath",
  "nav.language": "Language",

  "lang.en": "EN",
  "lang.km": "ខ្មែរ",
  "lang.switchToEn": "Switch to English",
  "lang.switchToKm": "Switch to Khmer",

  "theme.label": "Theme",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",

  "account.label": "Account",
  "account.fallbackName": "KruMath account",
  "account.settings": "Account settings",
  "account.signOut": "Log out",
  "account.signIn": "Sign In",

  "auth.checking": "Loading…",
  "auth.redirecting": "Redirecting to sign in…",

  "error.notFoundTitle": "Page not found",
  "error.notFoundBody": "The page you're looking for doesn't exist or has been moved.",
  "error.loadTitle": "This page didn't load",
  "error.loadBody": "Something went wrong on our end. You can try refreshing or head back home.",
  "error.tryAgain": "Try again",
  "error.goHome": "Go home",
  "error.goToKruMath": "Go to KruMath",
} as const;

export type TranslationKey = keyof typeof en;

/**
 * Khmer strings, reviewed and approved by the project owner. Keep the keys in the same
 * order as `en` so the two stay easy to diff. `{placeholders}` must match `en` exactly.
 */
const km: Record<TranslationKey, string> = {
  "meta.title": "Tic-Tac-Toe | KruMath",
  "meta.description": "លេងហ្គេម Tic-Tac-Toe លើអ៊ីនធឺណិតទល់នឹងកុំព្យូទ័រ។",
  "meta.rootTitle": "KruMath",
  "meta.rootDescription": "ហ្គេមអន្តរកម្ម និងឧបករណ៍សិក្សាពី KruMath។",

  "game.title": "Tic-Tac-Toe",
  "game.status.yourTurn": "វេនរបស់អ្នក",
  "game.status.thinking": "AI កំពុងគិត…",
  "game.status.youWin": "អ្នកឈ្នះ",
  "game.status.aiWins": "AI ឈ្នះ",
  "game.status.draw": "ស្មើ",
  "game.playAgain": "លេងម្តងទៀត",
  "game.score.summary": "អ្នក {you} · ស្មើ {draw} · AI {ai}",
  "result.youWin": "អ្នកឈ្នះ!",
  "result.youLose": "អ្នកចាញ់",
  "result.draw": "ស្មើ",
  "result.summary": "អ្នក {you} · AI {ai} · ស្មើ {draw}",
  "game.difficulty.label": "កម្រិតលំបាក",
  "game.difficulty.option": "{name} · {size}×{size}",

  "difficulty.beginner": "កម្រិតដំបូង",
  "difficulty.easy": "ងាយស្រួល",
  "difficulty.medium": "មធ្យម",
  "difficulty.hard": "ពិបាក",
  "difficulty.expert": "ជំនាញ",
  "difficulty.impossible": "មិនអាចយកឈ្នះបាន",

  "board.label": "ក្តារ Tic-Tac-Toe, ទំហំ {size} គុណ {size}, តម្រៀបជាប់គ្នា {winLength} ដើម្បីឈ្នះ",
  "board.cell": "ជួរដេក {row}, ជួរឈរ {column}, {value}",
  "board.empty": "ទទេ",

  "nav.home": "KruMath",
  "nav.homeAria": "ទំព័រដើម KruMath",
  "nav.github": "មើលកូដប្រភពលើ GitHub",
  "nav.donate": "គាំទ្រ KruMath",
  "nav.language": "ភាសា",

  "lang.en": "EN",
  "lang.km": "ខ្មែរ",
  "lang.switchToEn": "ប្តូរទៅជាភាសាអង់គ្លេស",
  "lang.switchToKm": "ប្តូរទៅជាភាសាខ្មែរ",

  "theme.label": "របៀបបង្ហាញ",
  "theme.light": "ភ្លឺ",
  "theme.dark": "ងងឹត",
  "theme.system": "តាមប្រព័ន្ធ",

  "account.label": "គណនី",
  "account.fallbackName": "គណនី KruMath",
  "account.settings": "ការកំណត់គណនី",
  "account.signOut": "ចាកចេញ",
  "account.signIn": "ចូលគណនី",

  "auth.checking": "កំពុងផ្ទុក…",
  "auth.redirecting": "កំពុងបញ្ជូនបន្តទៅទំព័រចូលគណនី…",

  "error.notFoundTitle": "រកមិនឃើញទំព័រទេ",
  "error.notFoundBody": "ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។",
  "error.loadTitle": "មិនអាចផ្ទុកទំព័រនេះបានទេ",
  "error.loadBody":
    "មានបញ្ហាមួយចំនួនបានកើតឡើង។ អ្នកអាចសាកល្បងផ្ទុកទំព័រឡើងវិញ ឬត្រឡប់ទៅកាន់ទំព័រដើម។",
  "error.tryAgain": "ព្យាយាមម្តងទៀត",
  "error.goHome": "ត្រឡប់ទៅទំព័រដើម",
  "error.goToKruMath": "ទៅកាន់ KruMath",
};

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, km };

export type TranslationParams = Record<string, string | number>;

/** Replace `{placeholder}` tokens, leaving unknown ones untouched. */
export function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

export function translate(locale: Locale, key: TranslationKey, params?: TranslationParams): string {
  const dictionary = dictionaries[locale] ?? dictionaries.en;
  return interpolate(dictionary[key] ?? dictionaries.en[key] ?? key, params);
}

/** Translation key for a difficulty level, e.g. `difficulty.medium`. */
export const difficultyKey = (difficulty: string): TranslationKey =>
  `difficulty.${difficulty}` as TranslationKey;
