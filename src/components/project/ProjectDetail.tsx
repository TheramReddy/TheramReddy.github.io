import { useEffect, useRef, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { CONFETTI } from '@/components/layout/confetti'
import { projects, type Project } from '@/data/projects'
import { tools, type ToolId } from '@/data/tools'
import { cn } from '@/lib/utils'
import { Diagrams, diagramGifs } from './Diagrams'
import { PixelDesk } from './PixelDesk'

const projectTools: ToolId[] = ['figma', 'sketch', 'storybook', 'claude', 'rust', 'css', 'git', 'html']

/** Closing card: confetti pops once it scrolls into view, with a button to the next case study. */
function WalkthroughEnd({ slug, root }: { slug: string; root: RefObject<HTMLDivElement | null> }) {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, { root: root.current, threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [root])

  const i = projects.findIndex((x) => x.slug === slug)
  const next = projects[(i + 1) % projects.length]

  return (
    <div className="arc contact-done walkthrough-end" ref={ref}>
      {seen && (
        <div className="contact-burst" aria-hidden="true">
          {CONFETTI.map((st, n) => <i key={n} style={st} />)}
        </div>
      )}
      {seen && <span className="contact-done-icon"><Check size={22} strokeWidth={2} aria-hidden="true" /></span>}
      <p>That’s the walkthrough.</p>
      {next.slug !== slug && (
        <Button onClick={() => navigate(`/project/${next.slug}`)}>
          Next case study: {next.title}
        </Button>
      )}
    </div>
  )
}

/** Popup sheet with description, gallery and a scroll-progress ring. */
export function ProjectDetail({ project, open }: { project?: Project; open: boolean }) {
  const navigate = useNavigate()
  const sheet = useRef<HTMLDivElement>(null)
  const ring = useRef<SVGCircleElement>(null)

  // keep the last project mounted so the close animation has content
  const shown = useRef<Project | undefined>(undefined)
  if (project) shown.current = project
  const p = shown.current

  const progress = () => {
    const s = sheet.current
    if (!s || !ring.current) return
    const m = s.scrollHeight - s.clientHeight
    ring.current.style.strokeDashoffset = String(100 - (m > 0 ? s.scrollTop / m : 0) * 100)
  }

  useEffect(() => {
    if (open && sheet.current) {
      sheet.current.scrollTop = 0
      progress()
    }
  }, [open, p?.slug])

  return (
    <article
      className={cn('detail', open && 'open')}
      aria-hidden={!open}
      onClick={(e) => e.target === e.currentTarget && navigate('/projects')}
    >
      <button className="close" aria-label="Close project" onClick={() => navigate('/projects')}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <path d="M3 3l12 12M15 3L3 15" />
        </svg>
      </button>
      <div className="progress" aria-hidden="true">
        <svg viewBox="0 0 38 38">
          <circle className="bg" cx="19" cy="19" r="16" />
          <circle className="fg" ref={ring} cx="19" cy="19" r="16" pathLength={100} />
        </svg>
      </div>
      <div className="sheet" ref={sheet} onScroll={progress}>
        {p && (
          <div className="cols">
            <div className="info">
              {p.logo && <img className="proj-logo" src={p.logo} alt="Georgia Department of Human Services" />}
              <h2>{p.title}</h2>
              <p className="about-title">About project</p>
              <p className="desc">{p.description}</p>
              <div className="stack">
                <p className="stack-title">Tools used</p>
                <ul className="chips" aria-label="Tools used">
                  {projectTools.map((id) => (
                    <li className="chip" key={id}>
                      <img src={`/tools/${id}.svg`} alt="" width="18" height="18" />
                      {tools[id]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="scroll-hint" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l5-5 5 5" /></svg>
                <span>Scroll</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l5 5 5-5" /></svg>
              </div>
            </div>
            <div className="gallery">
              {p.features && <Diagrams features={p.features} />}
              {p.features?.filter((f) => !diagramGifs.includes(f.gif)).map((f) => (
                <figure className="feature" key={f.gif}>
                  <figcaption>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </figcaption>
                  <img src={f.gif} alt={f.alt} loading="lazy" />
                </figure>
              ))}
              {!p.features && (
                <div className="coming-soon">
                  <PixelDesk />
                  <div className="coming-marquee" aria-label="Work in progress">
                    <div className="track" aria-hidden="true">
                      {[0, 1].map((n) => (
                        <div className="run" key={n}>
                          {[...'work in progress'].map((ch, i) => <span key={i}>{ch === ' ' ? ' ' : ch}</span>)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {p.features && <WalkthroughEnd key={p.slug} slug={p.slug} root={sheet} />}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
