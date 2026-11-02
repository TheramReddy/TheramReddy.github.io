import { jobs } from '@/data/work'
import { tools } from '@/data/tools'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '@/components/arc/tooltip/tooltip'
import { cn } from '@/lib/utils'

// the wind: ink leaves ride slow gusts across the back of the panel, each one drifting, bobbing and
// tumbling on its own clock so the motion never repeats in step; smaller leaves sit further back and fade
const leaves = [
  { top: '12%', d: 34, delay: -4, s: 1, sway: 5.2, flip: 3.1, shape: 0 },
  { top: '30%', d: 42, delay: -22, s: 0.8, sway: 6.4, flip: 2.6, shape: 1 },
  { top: '52%', d: 38, delay: -12, s: 1.2, sway: 4.8, flip: 3.8, shape: 0 },
  { top: '68%', d: 48, delay: -33, s: 0.9, sway: 7.1, flip: 2.9, shape: 1 },
  { top: '84%', d: 40, delay: -26, s: 0.75, sway: 5.7, flip: 3.4, shape: 0 },
  { top: '20%', d: 52, delay: -44, s: 0.65, sway: 6.8, flip: 2.4, shape: 1 },
  { top: '44%', d: 45, delay: -8, s: 0.7, sway: 5.4, flip: 3.6, shape: 1 },
  { top: '76%', d: 36, delay: -17, s: 1.05, sway: 6.1, flip: 2.8, shape: 0 },
]
const leafShapes = [
  <>
    <path d="M4 20C4 11 10 4 20 4c0 10-7 16-16 16Z" />
    <path d="M4 20 14 10" />
  </>,
  <>
    <path d="M12 2c5 4 6 10 0 20C6 12 7 6 12 2Z" />
    <path d="M12 6v16M12 11l-3-2M12 15l3-2" />
  </>,
]

export function WorkPanel({ open }: { open: boolean }) {
  return (
    <section className={cn('panel work', open && 'open')} aria-label="Work" inert={!open}>
      <div className="leaves" aria-hidden="true">
        {leaves.map((l, i) => (
          <span
            key={i}
            style={{ top: l.top, '--d': `${l.d}s`, '--delay': `${l.delay}s`, '--s': l.s, '--sway': `${l.sway}s`, '--flip': `${l.flip}s` } as CSSProperties}
          >
            <i>
              <svg viewBox="0 0 24 24">{leafShapes[l.shape]}</svg>
            </i>
          </span>
        ))}
      </div>
      <div className="inner">
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
                <h4 className="sr-only">{j.company}</h4>
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
      </div>
    </section>
  )
}
