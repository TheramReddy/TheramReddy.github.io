import { jobs } from '@/data/work'
import { tools } from '@/data/tools'
import { Fragment, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '@/components/arc/tooltip/tooltip'
import { cn } from '@/lib/utils'

export function WorkPanel({ open }: { open: boolean }) {
  return (
    <section className={cn('panel work', open && 'open')} aria-label="Work" aria-hidden={!open}>
      <div className="inner">
        <div className="tl">
          {jobs.map((j, i) => (
            <div className="job" key={j.company} style={{ '--i': i } as CSSProperties}>
              <div className="when">
                <small>
                  {j.where.split('>').map((w, k) => (
                    <Fragment key={w}>
                      {k > 0 && <span className="sep">&gt;</span>}
                      {w}
                    </Fragment>
                  ))}
                </small>
                {j.when}
              </div>
              <div className="logos">
                {j.logos.map((l) => (
                  <i key={l.label} className={l.src ? 'img' : undefined} style={{ background: l.color }}>
                    {l.src ? <img src={l.src} alt="" /> : l.label}
                  </i>
                ))}
              </div>
              <h4>
                {j.company} {j.current && (
                  <em className="chip-live">
                    <span className="dot" aria-hidden="true" />
                    Current
                  </em>
                )}
              </h4>
              <p className="role">{j.role}</p>
              <p className="about">{j.about}</p>
              {j.projects.map((p) => (
                <div className="proj" key={p.slug}>
                  <Link to={`/project/${p.slug}`} className="view">
                    View project
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </Link>
                </div>
              ))}
              <div className="tools-wrap">
                <p className="tools-title">Tools used:</p>
                <ul className="tools" aria-label="Tools used">
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
          ))}
        </div>
      </div>
    </section>
  )
}
