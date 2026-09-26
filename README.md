# Krumath Games: Tic-Tac-Toe

You are a senior frontend engineer, UI/UX designer, and game-development engineer.

I want you to build a production-ready Tic-Tac-Toe game as a new feature for my website:

https://krumath.com

==================================================

1. IMPORTANT — INSPECT BEFORE BUILDING

==================================================

DO NOT immediately start coding.

First inspect the existing Krumath website/codebase and understand:

- Framework and technology stack

- Project structure

- Routing

- Existing components

- Design system

- Typography

- Colours

- Spacing

- Buttons

- Cards

- Icons

- Animations

- Responsive behaviour

- Dark/light mode

- State management

- Local storage patterns

- Existing Games or interactive features

- Existing coding conventions

The new Tic-Tac-Toe game must feel like a native Krumath feature.

Do NOT redesign unrelated parts of the website.

Do NOT introduce a new UI framework if Krumath already has one.

Do NOT introduce unnecessary dependencies.

Before implementation, briefly identify:

1. Existing architecture relevant to this feature.

2. Where the game should be integrated.

3. Existing components/styles that should be reused.

4. Files likely to be created or modified.

5. Whether an existing open-source Tic-Tac-Toe/Minimax implementation can be safely reused or adapted.

Then proceed with implementation.

==================================================

2. PRODUCT PHILOSOPHY

==================================================

The core product principle is:

SIMPLE.

MINIMAL.

CLEAN.

FAST.

This is NOT intended to be a feature-heavy game platform.

The user should be able to:

Open → See board → Tap → Play.

There should be almost no configuration.

Do NOT add unnecessary:

- Settings

- Instructions

- Text

- Cards

- Panels

- Menus

- Popups

- Statistics

- Badges

- Icons

- Decorations

- Animations

- Configuration screens

Every visible element must have a clear purpose.

If something does not materially improve the game experience, remove it.

==================================================

3. CORE GAME

==================================================

Create:

Tic-Tac-Toe

Preferred route:

/games/tic-tac-toe

If Krumath uses another routing convention, follow the existing convention.

Primary mode:

Player vs Computer

Default:

Player = X

Computer = O

Difficulty = Medium

The board must be immediately playable when the page opens.

The user must NOT be required to configure anything before playing.

==================================================

4. IDEAL USER EXPERIENCE

==================================================

The ideal flow is:

Open Tic-Tac-Toe

        ↓

Board is immediately ready

        ↓

Tap a cell

        ↓

Computer responds

        ↓

Game ends

        ↓

Tap "Play Again"

        ↓

Play again

No unnecessary setup.

No tutorial.

No registration.

No login.

No configuration wizard.

No unnecessary modal.

==================================================

5. MINIMAL UI

==================================================

The board must be the primary visual focus.

The ideal page is approximately:

              Tic-Tac-Toe

        ┌─────┬─────┬─────┐

        │     │     │     │

        ├─────┼─────┼─────┤

        │     │  X  │     │

        ├─────┼─────┼─────┤

        │     │     │  O  │

        └─────┴─────┴─────┘

               Your turn

             [ Play Again ]

Keep the actual implementation visually consistent with Krumath.

Do not literally reproduce this layout if Krumath's existing design suggests a better solution.

The important principle is minimalism.

==================================================

6. DIFFICULTY

==================================================

The game must support six genuine AI difficulty levels:

1. Beginner

2. Easy

3. Medium

4. Hard

5. Expert

6. Impossible

However, difficulty must NOT become a configuration burden.

Default:

Medium

The game should start immediately at Medium.

If difficulty selection can be integrated cleanly, use a compact control such as:

Difficulty: Medium

or:

Easy · Medium · Hard · Expert · Impossible

Do NOT create a large settings panel.

Do NOT show long descriptions.

Do NOT force the user to choose difficulty before starting.

If necessary, hide the difficulty selector behind a small unobtrusive control.

The board must remain the dominant element.

==================================================

7. AI IMPLEMENTATION — OPEN SOURCE FIRST

==================================================

Before implementing the AI from scratch, investigate whether a suitable open-source Tic-Tac-Toe/Minimax implementation can be safely reused or adapted.

Look for a simple, reputable implementation with a permissive licence such as:

- MIT

- BSD

- Apache-2.0

Prefer small, understandable implementations over large game frameworks.

Potential reference implementations may include:

- TicTacToeAI

- Tic-Tac-Toe with Minimax

- Other small MIT-licensed Tic-Tac-Toe/Minimax implementations

IMPORTANT:

Do NOT copy an existing game's UI.

Do NOT copy its styling.

Do NOT copy unnecessary application architecture.

Do NOT blindly install an old dependency just because it exists.

Instead:

1. Inspect the implementation.

2. Verify its licence.

3. Verify compatibility with the Krumath stack.

4. Determine whether the algorithm is still appropriate.

5. Reuse or adapt only the relevant game/AI logic.

If using an external package would add unnecessary complexity, implement a small clean Minimax engine directly inside the Krumath codebase using the open-source implementation as a reference.

The final result should be lightweight and maintainable.

==================================================

8. AI ARCHITECTURE

==================================================

Keep the AI separate from the UI.

Conceptually:

Game UI

   ↓

Game State

   ↓

Game Engine

   ↓

AI Controller

   ↓

Move Evaluation

The game engine should handle:

- Board state

- Turn management

- Valid moves

- Move execution

- Win detection

- Draw detection

- Game reset

- Game result

The AI should handle:

- Available moves

- Board evaluation

- Move selection

- Difficulty behaviour

Do not put the Minimax algorithm directly inside UI components.

==================================================

9. DIFFICULTY BEHAVIOUR

==================================================

Each difficulty must genuinely behave differently.

BEGINNER

Very weak.

- Mostly random moves.

- Frequently misses obvious winning opportunities.

- Frequently fails to block.

- Player should win easily.

EASY

Weak but somewhat intelligent.

- Can identify some immediate wins.

- Can sometimes block.

- Uses simple heuristics.

- Intentionally makes mistakes.

MEDIUM

Default difficulty.

- Detect immediate wins.

- Detect immediate threats.

- Block the player.

- Prefer centre.

- Prefer corners.

- Understand basic tactical situations.

- Occasionally make suboptimal moves.

HARD

Strong.

- Uses deeper strategic evaluation.

- Makes very few tactical mistakes.

- Strong lookahead.

EXPERT

Very strong.

- Uses strong Minimax-based decision-making.

- Makes highly optimal moves.

IMPOSSIBLE

Perfect play.

- Full optimal Minimax.

- Never intentionally makes a losing move.

- Never makes an illegal move.

- Cannot be defeated through legal play.

- Perfect human play should result in a draw.

Do not fake difficulty by simply changing labels.

==================================================

10. PLAYER SYMBOL

==================================================

Default:

Player = X

Computer = O

Do NOT require the user to select X/O before starting.

If an X/O switch can be added without making the interface cluttered, implement it as a small unobtrusive option.

If adding it harms simplicity, leave X as the default.

If the player chooses O:

- Computer becomes X.

- Computer automatically makes the first move.

==================================================

11. PLAYER VS PLAYER

==================================================

Player vs Computer is the primary experience.

Player vs Player may be supported if it can be added without clutter.

If implemented:

- Two players share the same device.

- Clearly indicate the current turn.

- No account required.

- No online multiplayer.

Do NOT make Player vs Player more prominent than Player vs Computer.

Do NOT implement real-time multiplayer in this version.

However, keep the game architecture reasonably extensible for future multiplayer support.

==================================================

12. GAME STATUS

==================================================

Use very little text.

Allowed examples:

Your turn

AI thinking...

Your win

AI wins

Draw

Avoid verbose messages.

Do NOT write:

"Congratulations! You have successfully defeated the computer!"

Use:

"You win"

Instead.

==================================================

13. GAME END

==================================================

When the game ends, clearly show:

You win

or:

AI wins

or:

Draw

Then provide:

[ Play Again ]

Prefer an inline result state.

Avoid large modal dialogs unless the existing Krumath design system strongly suggests them.

==================================================

14. SCORE

==================================================

A simple scoreboard may be included if it fits naturally.

Example:

You  3   Draw  1   AI  2

If the scoreboard makes the UI feel cluttered, omit it.

The board and gameplay take priority.

Do NOT create:

- Statistics dashboard

- Win percentage

- Game history

- Charts

- Leaderboards

- Achievements

- Streak systems

If score is implemented, use localStorage where appropriate.

==================================================

15. RESET

==================================================

Provide:

Play Again

This resets:

- Board

- Turn

- Game status

But preserves:

- Difficulty

- Score

- Current preferences

If score is implemented, optionally provide a very subtle:

Reset score

Do not make reset controls visually prominent.

==================================================

16. BOARD DESIGN

==================================================

The board is the centre of the experience.

Requirements:

- 3 × 3

- Large cells

- Clear grid

- Strong visual hierarchy

- Generous whitespace

- Touch-friendly

- Responsive

- Keyboard accessible

X and O should be visually clean and distinctive.

Winning cells should receive a subtle visual treatment.

Do not over-design the board.

Avoid unnecessary:

- Gradients

- 3D effects

- Decorative graphics

- Large shadows

- Excessive borders

Follow Krumath's existing visual language.

==================================================

17. RESPONSIVE DESIGN

==================================================

Mobile-first.

Test at:

- 320px

- 375px

- 390px

- 430px

- Tablet

- Desktop

Mobile requirements:

- Board fits viewport.

- No horizontal scrolling.

- Cells are easy to tap.

- Controls remain compact.

- Text remains minimal.

- No cramped layout.

Desktop:

- Board should be centred.

- Board should not become unnecessarily huge.

- Maintain generous whitespace.

==================================================

18. ACCESSIBILITY

==================================================

Maintain accessibility without adding visual clutter.

Implement:

- Keyboard navigation

- Visible focus state

- Semantic buttons

- Appropriate ARIA labels

- Screen-reader-friendly status

- Good colour contrast

- Touch-friendly targets

Each cell should have a meaningful accessible label.

Examples:

"Top left, empty"

"Centre, X"

"Bottom right, O"

Do not add unnecessary visible accessibility text.

==================================================

19. ANIMATION

==================================================

Use subtle animation only.

Good examples:

- X/O placement

- Winning state

- Small result transition

Avoid:

- Particle explosions

- Excessive bouncing

- Flashing

- Long animations

- Large visual effects

The game should feel responsive.

Respect:

prefers-reduced-motion

==================================================

20. SOUND

==================================================

Do NOT add sound unless Krumath already has an appropriate sound system.

Sound is not necessary for this feature.

==================================================

21. Krumath DESIGN SYSTEM

==================================================

The game must use the existing Krumath design system.

Reuse where possible:

- Typography

- Colours

- Buttons

- Spacing

- Border radius

- Icons

- Theme

- Components

- Navigation

Do not invent a separate design language.

The finished game should look as though it was designed specifically for Krumath.

==================================================

22. STATE MANAGEMENT

==================================================

Use the existing Krumath state-management approach.

If local component state is sufficient, keep it local.

Do NOT introduce Redux, Zustand, or another global state library just for this game.

Only maintain state that is actually required.

Conceptually:

board

currentPlayer

gameStatus

difficulty

playerSymbol

gameMode

score

isComputerThinking

Adapt to the actual project architecture.

==================================================

23. LOCAL STORAGE

==================================================

If consistent with the existing application, persist:

- Difficulty

- Score

Do not store personal information.

If localStorage is unavailable, the game must continue working normally.

==================================================

24. SEO

==================================================

Add appropriate metadata.

Title:

Tic-Tac-Toe | Krumath

Description:

Play Tic-Tac-Toe online against the computer.

Keep SEO content concise.

Do not add large visible SEO sections.

==================================================

25. PERFORMANCE

==================================================

The game should be lightweight.

Avoid unnecessary dependencies.

The AI must run locally in the browser.

No backend is required.

No API calls are required for gameplay.

Tic-Tac-Toe has a very small search space, so the AI should respond essentially immediately.

==================================================

26. SECURITY

==================================================

No user account is required.

No personal data is required.

Do not create a backend/database simply to store game results.

Client-side scores are not authoritative and should be treated as local gameplay data.

==================================================

27. ERROR HANDLING

==================================================

Handle gracefully:

- Invalid moves

- Occupied cells

- Game already finished

- Rapid clicks

- AI thinking state

- Reset during AI turn

- localStorage failure

- Unexpected state

Never allow:

- Two moves in one turn

- Moves after game over

- AI moving after a reset

- Duplicate AI moves

- Illegal AI moves

- Stale asynchronous AI actions

==================================================

28. TESTING

==================================================

Thoroughly test:

GAME ENGINE

- Horizontal wins

- Vertical wins

- Diagonal wins

- Draw

- Invalid moves

- Occupied cells

- Game reset

- Game-over protection

AI

- Beginner

- Easy

- Medium

- Hard

- Expert

- Impossible

Verify that difficulty levels actually differ.

Verify:

Impossible cannot lose through legal play.

Verify:

Perfect human play against Impossible produces a draw.

MODES

- Player vs Computer

- Player vs Player, if implemented

- Player as X

- Player as O, if implemented

UI

- Mobile

- Tablet

- Desktop

- Mouse

- Touch

- Keyboard

- Dark mode if supported

- Reduced motion

STATE

- Page refresh

- Score persistence

- Difficulty persistence

- Reset

Also check:

- No console errors

- No TypeScript errors

- No lint errors

- No broken routes

- No broken existing Krumath functionality

==================================================

29. VISUAL QA

==================================================

After implementation, inspect the actual rendered page.

Do not judge the UI only from source code.

Ask:

- Is the board immediately visible?

- Is the board the dominant element?

- Is there too much text?

- Are there unnecessary controls?

- Are there unnecessary cards?

- Are there unnecessary borders?

- Are there unnecessary icons?

- Does anything look like a generic template?

- Does it feel native to Krumath?

- Is the page visually calm?

- Is the game immediately understandable?

Then simplify further if necessary.

Use this rule:

If something can be removed without hurting usability, remove it.

==================================================

30. DO NOT OVERENGINEER

==================================================

This is a small game.

Do NOT create:

- User accounts

- Database

- Backend

- Real-time multiplayer

- Leaderboards

- Achievements

- Complex statistics

- Tutorials

- Large settings panels

- Game history

- Heavy animation systems

- Large game frameworks

Build a small, polished game.

==================================================

31. OPEN-SOURCE LICENSING

==================================================

If you use or adapt open-source code:

- Verify the licence.

- Prefer MIT/BSD/Apache-2.0.

- Preserve required copyright/licence notices.

- Do not remove attribution where the licence requires it.

- Do not copy proprietary code.

- Do not copy another project's visual design.

If the implementation is adapted substantially, keep the relevant licence information in the appropriate project location.

Before using any third-party library, explain briefly:

- Name

- Repository

- Licence

- What part is being reused

- Why it is appropriate

If no dependency is necessary, prefer a small native implementation based on the open-source Minimax approach.

==================================================

32. FUTURE EXTENSIBILITY

==================================================

Do not implement these now:

- Online multiplayer

- Tournaments

- Leaderboards

- 4×4 board

- 5×5 board

- Timed games

- Achievements

- Daily challenges

But avoid structuring the code in a way that makes future expansion unnecessarily difficult.

==================================================

33. NAVIGATION

==================================================

Integrate the game into the existing Krumath Games area.

If a Games page exists:

Add:

Tic-Tac-Toe

If no Games section exists:

Create the smallest appropriate integration consistent with Krumath's current navigation.

Do not modify unrelated navigation.

==================================================

34. FINAL QUALITY STANDARD

==================================================

The final feature should feel like:

A polished, minimalist web game.

Not:

A complicated game dashboard.

The user should not need to think about how to use it.

They should simply play.

==================================================

35. FINAL AUDIT

==================================================

Before declaring the feature complete, perform a final audit.

Confirm:

1. Game works correctly.

2. Board is immediately playable.

3. UI is minimalist.

4. Text is minimal.

5. No unnecessary settings exist.

6. Medium is the default.

7. Difficulty levels genuinely differ.

8. Impossible is genuinely unbeatable.

9. Player can restart with one click.

10. Mobile experience is excellent.

11. Desktop experience is clean.

12. Accessibility works.

13. AI is fast.

14. No unnecessary dependency was added.

15. Any open-source code has a compatible licence.

16. Krumath's existing design system is respected.

17. Existing functionality is unaffected.

18. No console errors remain.

19. No lint/type errors remain.

20. No unnecessary UI remains.

If you find unnecessary elements during this audit, remove them.

==================================================

36. FINAL DELIVERABLE

==================================================

Actually implement the feature in the Krumath codebase.

Do not merely provide sample code.

Do not stop at a prototype.

Build it, run it, test it, inspect the rendered result, and fix issues.

At the end, provide a concise implementation report:

1. What was built.

2. Files created.

3. Files modified.

4. AI implementation.

5. Open-source code/library used, if any.

6. Licence of any reused code.

7. Difficulty behaviour.

8. Testing performed.

9. Any remaining issues.

Most important:

BUILD A SIMPLE, CLEAN, MINIMALIST TIC-TAC-TOE GAME THAT FEELS LIKE A NATIVE PART OF KRUMATH.

The sophistication should be underneath the interface.

The user should see almost none of the complexity.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
