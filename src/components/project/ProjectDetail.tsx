import { useEffect, useRef, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Check, CircleAlert, FileText, Gauge, Play, type LucideIcon } from 'lucide-react'
import { Banner } from '@/components/arc/banner/banner'
import { Button } from '@/components/arc/button/button'
import { CONFETTI } from '@/components/layout/confetti'
import { projects, type Project } from '@/data/projects'
import { tools, type ToolId } from '@/data/tools'
import { cn } from '@/lib/utils'
import { ActionSlider } from './ActionSlider'
import { Diagrams } from './Diagrams'
import { PixelDesk } from './PixelDesk'
import { ScobinStory } from './ScobinStory'

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
    <div className="kit contact-done walkthrough-end" ref={ref}>
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

const sections: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'cs-overview', label: 'Overview', Icon: FileText },
  { id: 'cs-glance', label: 'What changed', Icon: Gauge },
  { id: 'cs-problems', label: 'The problems', Icon: CircleAlert },
  { id: 'cs-action', label: 'In action', Icon: Play },
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
function SheetScrollbar({ root }: { root: RefObject<HTMLDivElement | null> }) {
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
  }, [root])

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

/** Note at the top of a case study saying the screens are recreated, not the real product. */
function Disclaimer() {
  return (
    <div className="disclaimer">
      <Banner
        restoreLabel="Show disclaimer"
        more={<>
          This case study is a fictional recreation made for portfolio purposes only. It does not show, copy, or disclose any real system, software, data, or confidential information belonging to a past employer or client.
          <br /><br />
          Menus, option names, field labels, workflows, and all data (names, records, amounts) have been changed or invented.
        </>}
      >
        These screens are not the real product.<br />Every screen, menu option, label, and piece of data has been changed or made up.
      </Banner>
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
      inert={!open}
      onClick={(e) => e.target === e.currentTarget && navigate('/projects')}
    >
      <div className="progress" aria-hidden="true">
        <svg viewBox="0 0 38 38">
          <circle className="bg" cx="19" cy="19" r="16" />
          <circle className="fg" ref={ring} cx="19" cy="19" r="16" pathLength={100} />
        </svg>
      </div>
      <div className="sheet" ref={sheet} onScroll={progress}>
        <SheetScrollbar root={sheet} />
        {p?.features && <Disclaimer />}
        <div className="close-rail">
          <button className="close" aria-label="Close project" onClick={() => navigate('/projects')}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l12 12M15 3L3 15" />
            </svg>
          </button>
        </div>
        {p?.features && <SectionNav root={sheet} />}
        {p && (
          <div className="cols">
            <div className="info" id="cs-overview">
              {p.logo && <img className="proj-logo" src={p.logo} alt={p.client} />}
              <h2>{p.title}</h2>
              <p className="about-title">About project</p>
              <p className="desc">{p.description}</p>
              {p.figma && (
                <a className="figma-link" href={p.figma} target="_blank" rel="noopener noreferrer">
                  <img src="/tools/figma.svg" alt="" />
                  <span>
                    Open the Figma file
                    <small>Every component, token and sample screen</small>
                  </span>
                  <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
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
            </div>
            <div className="gallery">
              {p.metrics && !p.story && (
                <section className="metrics" id="cs-glance" aria-label="What changed for users">
                  <h3>What changed for the people using it</h3>
                  <dl>
                    {p.metrics.map((m) => (
                      <div className="metric" key={m.label}>
                        <dt>{m.label}</dt>
                        <dd>{m.value}</dd>
                        <p>{m.note}</p>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
              {p.features && <Diagrams />}
              {p.features && <ActionSlider features={p.features} />}
              {p.story && <ScobinStory />}
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
