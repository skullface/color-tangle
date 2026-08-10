# Color Tangle

A little trivia quiz game about weird color names! Each round shows a color name and four swatches. The player chooses the swatch that matches the color name. Inspired by the 🚂 Iron Tangle’s color lines in *Dungeon Crawler Carl: The Dungeon Anarchist’s Cookbook*.

## Playing

1. **Start**: Hit “Start game.” The server picks a fresh set of targets and options for the run.
2. **Guess**: For each name, choose one of four blobby swatches. After you pick, the app reveals the answer, a short description and etymology, and a source link.
3. **Move on**; Continue with “Next color,” or use the footer dots / arrow keys to revisit answered rounds. You can’t skip ahead.
4. **Results**: When every round is done, you get a percentage score and share options (link, Twitter/X, Instagram story image). Opening a shared link challenges a friend to beat that score.

The footer shows progress as dots plus a small face that unlocks once the run is complete. Keyboard: <kbd>←</kbd> / <kbd>→</kbd> to move between reachable rounds (and back from results).

## How it works

**Stack:** Next.js (App Router), React, Tailwind CSS 4, Base UI tooltips. Analytics and Speed Insights run on Vercel.

**Game session.** Starting a game calls a server action that samples targets from the palette, builds four options per round, and returns a signed *play token* (HMAC) that locks in the target names for that run. When you finish, another server action verifies the token, scores your picks server-side, and mints a short signed *share token* for the score. That keeps shared results from being edited in the URL.

**Harder than random distractors.** Wrong options aren’t just any other colors. The picker uses CIE Lab distance (ΔE) and prefers swatches that are clearly different from the correct answer and from each other (about ΔE ≥ 28), so the choices stay visually distinct.

**Swatches & themes.** Options are filled SVG blobs (predefined paths, shuffled per round) rather than plain rectangles. Near-white / near-black colors get a light edge so they still read in light and dark mode. Accent underlines and focus rings adapt with WCAG-ish contrast against the page background.

**Sharing.** `/s?t=…` is the challenge page: it validates the share token, shows a “beat your friend” prompt when valid, and sets Open Graph / Twitter metadata. Image routes render score-aware OG (`/s/og`) and portrait story (`/s/story`) cards with `next/og`. Instagram share downloads or Web-Shares that PNG when the browser allows it.

**Config.** Palette size and round count come from [Vercel Global Config](https://vercel.com/docs/global-config) when connected; otherwise defaults in `lib/colors.ts` / `lib/config.ts` apply (22 colors, 10 rounds). Sharing needs `SHARE_SECRET` set in the environment.

### Global Config keys

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `colors` | `{ name, hex }[]` | local palette | Swatch pool (names + hex; descriptions/etymology stay in code for defaults) |
| `rounds` | number | `10` | Rounds per run |

Create a store in the [Vercel dashboard](https://vercel.com/docs/global-config) or with `vercel global-config add <slug>`, then connect it to the project (`GLOBAL_CONFIG` is set automatically).

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
