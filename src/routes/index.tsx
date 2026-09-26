import { createFileRoute } from "@tanstack/react-router";

import { DESCRIPTION, TITLE, TicTacToePage } from "@/features/tic-tac-toe/TicTacToePage";

export const Route = createFileRoute("/")({
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
