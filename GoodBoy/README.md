# GOODBOY — The Good Boy Economy ($GOODBOY)

You pet dog. Dog becomes more good. Goodness becomes an economy. Eventually: **GOD BOY**.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
```

Deploy: push to GitHub and import into Vercel (framework preset: **Vite**). No settings needed.

## Where to change things

| What | File |
|---|---|
| Levels, thresholds, which dog image per level, level lines | `src/config/levels.ts` |
| Upgrades (name, description, cost, GBP/sec, icon) | `src/config/upgrades.ts` |
| Achievements | `src/config/achievements.ts` |
| Random events + how often they happen | `src/config/events.ts` |
| Dog dialogue | `src/config/dialogue.ts` |
| Contract address (CA), pump.fun / X / Telegram links | `src/config/token.ts` |
| Pet power / offline cap / math | `src/game/engine.ts` |
| Colors, fonts, layout | `src/styles.css` |

## Contract address (CA), pump.fun & DEX Screener

Everything lives in `src/config/token.ts`.

- **Before launch** (`CA: ''`): the site shows **CA: NOT ANNOUNCED YET** and greyed-out PUMP.FUN / DEXSCREENER buttons marked SOON.
- **After launch**: paste the address → `CA: 'YOUR_CA'`. You get a copy button, and the PUMP.FUN and DEXSCREENER buttons link to the coin automatically.
- Optional `x` and `telegram` links appear as extra buttons when filled in.
- **Logos**: save the official logos as `public/art/logos/pumpfun.png` and `public/art/logos/dexscreener.png`. Until those files exist, a generic icon is shown.

Commit + push → Vercel redeploys.

## Art

All art lives in `public/art/` (cut from the GOODBOY sprite sheet):

- `art/dog/*.png` — one image per level (600×600, transparent, dog bottom-aligned).
  Replace any file with a higher-res version **using the same name** and it just works.
  If an image is missing the game shows a placeholder instead of breaking.
- `art/upgrades/*.png` — upgrade icons. Upgrades without an icon (Department, IMF, Intergalactic Authority) use an emoji until you add one: put `department.png` in the folder and set `icon: 'department'` in `upgrades.ts`.
- `art/icons/`, `art/emotes/`, `art/pfp.png` — currency coin, resource icons, emotes, profile picture.

## Global counter (real, shared)

`GLOBAL GOOD BOY POINTS` counts every pet by everyone. It needs a tiny database:

1. Vercel → your project → **Storage** → add **Upstash (Redis)** (free tier) → connect to the project.
2. Redeploy.

That's it — `api/global.ts` picks up the env vars automatically. Until then the site honestly shows **NOT CONNECTED YET** (it never fakes a number).
Each pet adds 1 to the global count regardless of upgrades; the server caps how much one browser can add per request.

## Saves

Progress is saved in the browser (`localStorage`, key `goodboy.save.v1`) every 5 seconds and when the tab closes.
Passive GBP keeps accruing while away (capped at 24 hours) and is shown on return.
