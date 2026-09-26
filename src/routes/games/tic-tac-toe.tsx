import { createFileRoute, redirect } from "@tanstack/react-router";

// The game now lives at the project root (`/`). Keep this legacy path working
// for any bookmarked /games/tic-tac-toe URL.
export const Route = createFileRoute("/games/tic-tac-toe")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
