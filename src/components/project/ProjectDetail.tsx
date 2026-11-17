import { useEffect, useRef, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, CircleAlert, FileText, BookOpen, Gauge, Info, Route, type LucideIcon } from 'lucide-react'
import { CONFETTI } from '@/components/layout/confetti'
import { published, type Project } from '@/data/projects'
import { tools, type ToolId } from '@/data/tools'
import { cn } from '@/lib/utils'
import { Approach } from './Approach'
import { Gallery } from './Gallery'
import { MetricCards } from './MetricCards'
import { Diagrams } from './Diagrams'
import { JourneyMap } from './JourneyMap'
import { PixelDesk } from './PixelDesk'
import { Mission } from './crew/Mission'
import { ScobinStory } from './ScobinStory'
import { TelemetricStory } from './TelemetricStory'

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

  const i = published.findIndex((x) => x.slug === slug)
  const next = published[(i + 1) % published.length]

  return (
    <div className="kit contact-done walkthrough-end" ref={ref}>
      {seen && (
        <div className="contact-burst" aria-hidden="true">
          {CONFETTI.map((st, n) => <i key={n} style={st} />)}
        </div>
      )}
      {seen && <span className="contact-done-icon px-plate"><svg viewBox="0 0 8 7" width="24" height="21" shapeRendering="crispEdges" fill="currentColor" aria-hidden="true"><rect x="6" y="0" width="2" height="1" /><rect x="5" y="1" width="3" height="1" /><rect x="0" y="2" width="2" height="1" /><rect x="4" y="2" width="3" height="1" /><rect x="0" y="3" width="3" height="1" /><rect x="4" y="3" width="2" height="1" /><rect x="1" y="4" width="5" height="1" /><rect x="2" y="5" width="3" height="1" /><rect x="3" y="6" width="1" height="1" /></svg></span>}
      <p>That’s the case study.</p>
      {next.slug !== slug && (
        <button type="button" className="key is-big is-lit" onClick={() => navigate(`/project/${next.slug}`)}>next: {next.title}</button>
      )}
    </div>
  )
}

const sections: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'cs-overview', label: 'Overview', Icon: FileText },
  { id: 'cs-glance', label: 'What changed', Icon: Gauge },
  { id: 'cs-problems', label: 'Problems', Icon: CircleAlert },
  { id: 'cs-journey', label: 'Journey', Icon: Route },
  { id: 'cs-action', label: 'Approach', Icon: BookOpen },
]

/** Side menu that stays in view and jumps between the case study sections. */
function SectionNav({ root }: { root: RefObject<HTMLDivElement | null> }) {
  const [current, setCurrent] = useState(sections[0].id)

  useEffect(() => {
    const sheet = root.current
    if (!sheet) return
    const onScroll = () => {
      const line = sheet.getBoundingClientRect().top + sheet.clientHeight * 0.4
      let id = sections[0].id
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) id = s.id
      }
      setCurrent(id)
    }
    sheet.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => sheet.removeEventListener('scroll', onScroll)
  }, [root])

  return (
    <div className="side-nav-rail">
      <nav className="side-nav" aria-label="Case study sections">
        {sections.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={cn('side-nav-btn', current === id && 'on')}
            aria-label={label}
            aria-current={current === id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

/** Custom page scrollbar for the sheet: draggable thumb, click the track to jump. */
function SheetScrollbar({ root, slug }: { root: RefObject<HTMLDivElement | null>; slug?: string }) {
  const bar = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sheet = root.current
    if (!sheet) return
    const sync = () => {
      const b = bar.current, t = thumb.current
      if (!b || !t) return
      const max = sheet.scrollHeight - sheet.clientHeight
      const h = Math.max(48, (sheet.clientHeight / sheet.scrollHeight) * b.clientHeight)
      t.style.height = `${h}px`
      t.style.top = `${max > 0 ? (sheet.scrollTop / max) * (b.clientHeight - h) : 0}px`
    }
    sheet.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(sheet)
    for (const c of Array.from(sheet.children)) ro.observe(c)
    sync()
    return () => { sheet.removeEventListener('scroll', sync); ro.disconnect() }
    // observe again when a case study opens: its content was not there to observe at mount
  }, [root, slug])

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const sheet = root.current, b = bar.current, t = thumb.current
    if (!sheet || !b || !t) return
    const max = sheet.scrollHeight - sheet.clientHeight
    const room = b.clientHeight - t.offsetHeight
    if (max <= 0 || room <= 0) return
    const grab = e.target === t ? e.clientY - t.getBoundingClientRect().top : t.offsetHeight / 2
    const to = (y: number) => {
      sheet.scrollTop = Math.max(0, Math.min(1, (y - b.getBoundingClientRect().top - grab) / room)) * max
    }
    b.setPointerCapture(e.pointerId)
    b.classList.add('drag')
    to(e.clientY)
    const move = (ev: PointerEvent) => to(ev.clientY)
    const up = () => {
      b.classList.remove('drag')
      b.removeEventListener('pointermove', move)
      b.removeEventListener('pointerup', up)
      b.removeEventListener('pointercancel', up)
    }
    b.addEventListener('pointermove', move)
    b.addEventListener('pointerup', up)
    b.addEventListener('pointercancel', up)
  }

  return (
    <div className="sheet-bar-rail" aria-hidden="true">
      <div className="sheet-bar" ref={bar} onPointerDown={onDown}>
        <span className="sheet-bar-thumb" ref={thumb} />
      </div>
    </div>
  )
}

/** The case study page: description and gallery under the site's top bar, over the home page. */
export function ProjectDetail({ project, open }: { project?: Project; open: boolean }) {
  const sheet = useRef<HTMLDivElement>(null)

  // keep the last project mounted so the close animation has content
  const shown = useRef<Project | undefined>(undefined)
  if (project) shown.current = project
  const p = shown.current

  useEffect(() => {
    if (open && sheet.current) {
      sheet.current.scrollTop = 0
      // the page underneath is inert now, so the keyboard starts from the sheet
      sheet.current.focus({ preventScroll: true })
    }
  }, [open, p?.slug])

  return (
    <article
      className={cn('detail', open && 'open')}
      inert={!open}
    >
      <div className="sheet" ref={sheet} tabIndex={-1}>
        <SheetScrollbar root={sheet} slug={p?.slug} />
        {p?.features && <SectionNav root={sheet} />}
        {p && (
          <div className="cols">
            <div className="info" id="cs-overview">
              {p.slug === 'telemetric' && <Mission className="info-crew" />}
              {p.logo && <img className="proj-logo" src={p.logo} alt={p.client} />}
              <h2>{p.title}</h2>
              <p className="cs-lede">{p.summary}</p>
              <div className="id-card px-plate">
                <span className="id-slot" aria-hidden="true" />
                <dl className="cs-meta">
                  <div><dt>Role</dt><dd>{p.role}</dd></div>
                  <div><dt>Client</dt><dd>{p.client}</dd></div>
                  <div><dt>Year</dt><dd>{p.year}</dd></div>
                </dl>
                <div className="stack">
                  <p className="stack-title">Tools used</p>
                  <ul className="chips" aria-label="Tools used">
                    {(p.tools ?? projectTools).map((id) => (
                      <li className="chip" key={id}>
                        <img src={`/tools/${id}.svg`} alt="" width="18" height="18" />
                        {tools[id]}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="id-bars" aria-hidden="true" />
              </div>
              <p className="about-title">About the project</p>
              <p className="desc">{p.description}</p>
              {p.figma && (
                <a className="figma-link px-plate" href={p.figma} target="_blank" rel="noopener noreferrer">
                  <img src="/tools/figma.svg" alt="" />
                  <span>
                    Open the Figma file
                    <small>Every component, token and sample screen</small>
                  </span>
                  <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {p.link && (
                <a className="figma-link page-link px-plate" href={p.link.href} target="_blank" rel="noopener noreferrer">
                  <Info size={20} strokeWidth={1.6} className="link-info" aria-hidden="true" />
                  <span>
                    {p.link.title}
                    <small>{p.link.note}</small>
                  </span>
                  <ArrowUpRight size={18} strokeWidth={1.8} className="link-arrow" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
            <div className="gallery">
              {p.metrics && !p.story && (
                <section className="metrics" id="cs-glance" aria-label="What changed">
                  <h3>What changed</h3>
                  <MetricCards items={p.metrics} />
                </section>
              )}
              {p.features && <Diagrams />}
              {p.slug === 'dso-modernization' && (
                <JourneyMap
                  src="/projects/dso-modernization/journey.html"
                  title="DSO debt setoff journey map"
                  lede="The whole journey, mapped before I changed anything."
                />
              )}
              {p.features && <Approach />}
              {p.features && <Gallery features={p.features} />}
              {p.story && (p.slug === 'telemetric' ? <TelemetricStory /> : <ScobinStory />)}
              {!p.features && !p.story && (
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
              {(p.features || p.story) && <WalkthroughEnd key={p.slug} slug={p.slug} root={sheet} />}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
