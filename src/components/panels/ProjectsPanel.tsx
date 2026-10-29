import { Link } from 'react-router-dom'
import { lazy, Suspense, type CSSProperties } from 'react'
import { projects } from '@/data/projects'
import { cn } from '@/lib/utils'

// rocket, tour and status code load only once Projects is first opened
const FunComponents = lazy(() => import('./FunComponents').then((m) => ({ default: m.FunComponents })))

/** Projects: one case-study card per project, opening the project popup. */
export function ProjectsPanel({ open }: { open: boolean }) {
  return (
    <section className={cn('panel projects', open && 'open')} aria-label="Projects" inert={!open}>
      <div className="inner">
        <h2 className="cs-heading">Selected case studies</h2>
        <ul className="cs-list">
          {projects.slice(0, 3).map((p, i) => (
            <li key={p.slug} style={{ '--i': i } as CSSProperties}>
              <Link to={`/project/${p.slug}`} className="cs" tabIndex={open ? 0 : -1}>
                <span className="cs-body">
                  <span className="cs-title">{p.title}</span>
                  <span className="cs-summary">{p.summary}</span>
                  <span className="cs-foot">
                    <span className="cs-go">
                      Read case study
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 17 17 7M8 7h9v9" />
                      </svg>
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {open && (
          <Suspense fallback={null}>
            <FunComponents />
          </Suspense>
        )}
      </div>
    </section>
  )
}
