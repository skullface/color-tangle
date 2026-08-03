# Color Tangle

A color-name quiz: match the name to the swatch, score points, share your result.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Global Config

Runtime settings (palette, round count) load from [Vercel Global Config](https://vercel.com/docs/global-config) when connected. Without a store, local defaults in `lib/colors.ts` and `lib/config.ts` are used.

1. Create a Global Config store in the [Vercel dashboard](https://vercel.com/docs/global-config) or with `vercel global-config add <slug>`.
2. Connect it to this project — Vercel sets the `GLOBAL_CONFIG` env var automatically.
3. Optional keys:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `colors` | `{ name, hex }[]` | 22-color palette | Swatch pool |
| `rounds` | number | `10` | Rounds per run |

## Deploy on Vercel

Deploy with the Vercel CLI or Git integration. Enable Web Analytics and Speed Insights in the project settings for observability.
