# Portfolio

Vite + React + TypeScript + Tailwind v4. 

    npm run dev        # http://localhost:5173
    npm run build      # typecheck + production build -> dist/

## Where things live
- `src/data/projects.ts`: the projects. Add one entry per project; the first three show on the home gallery.
- `src/data/work.ts`: the Work timeline. `src/data/site.ts`: name and disciplines.
- `public/projects/<slug>/`: images (reference as `/projects/<slug>/x.jpg`)
- `src/components/{gallery,panels,project,layout}`: site pieces
- `src/styles/`: tokens in `globals.css`, one css file per feature


Routes: `/`, `/work`, `/contact`, `/project/:slug`.
