import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { jobs } from '@/data/work'
import { tools } from '@/data/tools'
import { Tooltip } from '@/components/arc/tooltip/tooltip'
import { cn } from '@/lib/utils'

/** The job cards, shared by the Work panel and the Me page; `heading` sets the hidden company heading's level. */
export function JobList({ heading: H = 'h2' }: { heading?: 'h2' | 'h3' }) {
  return (
    <ul className="jobs">
      {jobs.map((j, i) => (
        <li
          className={cn('job', j.current && 'current', j.projects.length > 0 && 'linked')}
          key={j.company}
          style={{ '--i': i } as CSSProperties}
        >
          <div className="card">
            <p className="when">
              {j.when}
              {j.current && <span className="sr-only"> (current)</span>}
            </p>
            <div className="logos">
              {j.logos.map((l) => (
                <i key={l.label} className={l.src ? 'img' : undefined} style={{ background: l.color }}>
                  {l.src ? <img src={l.src} alt="" /> : l.label}
                </i>
              ))}
            </div>
            <H className="sr-only">{j.company}</H>
            <p className="title">{j.title}</p>
            <p className="role">{j.role}</p>
            {j.projects.map((p) => (
              <Link to={`/project/${p.slug}`} className="view" key={p.slug}>
                Explore the project
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            ))}
            <div className="foot">
              <ul className="tools" aria-label="Key tools">
                {j.tools.map((id) => (
                  <li key={id}>
                    <Tooltip label={tools[id]}>
                      <img src={`/tools/${id}.svg`} alt={tools[id]} tabIndex={0} />
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
