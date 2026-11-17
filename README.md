# Portfolio

Vite + React + TypeScript + Tailwind v4, deployed to GitHub Pages by `.github/workflows/deploy.yml`.

    npm run dev        # http://localhost:5173
    npm run build      # typecheck + production build -> dist/ (also copies index.html to 404.html for deep links)
    npm run preview    # serve the built site
    npm run typecheck

## Where things live
- `src/data/projects.ts`: the case studies. Add one entry per project; each shows as a tile in Work, and `soon: true` keeps its page closed.
- `src/data/work.ts`: the jobs on the timeline. `src/data/site.ts`: name, role and location.
- `src/data/cards.ts`, `laws.ts`, `tools.ts`: the work app's cards, the psychology principles they cite, and the tool logos.
- `public/projects/`: recordings and images, referenced by absolute path (e.g. `/projects/scobin/semantic.png`). The two `journey.html` pages there are static journey maps shown in an iframe; they share `journey-theme.css`.
- `public/tools/`: tool logos, a mono set and a colour set in `color/`.
- `src/components/{home,project,layout,ui}`: site pieces. `src/lib/`: small shared helpers.
- `src/styles/`: tokens in `globals.css`, one css file per feature.

Routes: `/` (one page) and `/project/:slug`.
