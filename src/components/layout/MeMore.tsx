import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ApproachDefs, ListenArt, SketchArt, ShapeArt, ShipArt } from './ApproachArt'
import { CaseList } from '@/components/panels/CaseList'

const steps: { verb: string; line: string; art: ReactNode }[] = [
  {
    verb: 'Listen',
    line: 'Tea first. Questions before screens.',
    art: <ListenArt />,
  },
  {
    verb: 'Sketch',
    line: 'Rough lines, many of them, quickly.',
    art: <SketchArt />,
  },
  {
    verb: 'Shape',
    line: 'Structure that folds and unfolds.',
    art: <ShapeArt />,
  },
  {
    verb: 'Ship',
    line: 'Fold it once more, then let it fly.',
    art: <ShipArt />,
  },
]

/**
 * Marks [data-reveal] and [data-watch] children "in" once they scroll into view, and [data-live] while they are on
 * screen. It measures on every scroll frame and looks the elements up fresh each time, so a block that remounts or a
 * missed observer callback can never leave content stuck invisible.
 */
function useReveal() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    const scroller = el?.closest('.panel')
    if (!el || !scroller) return
    let frame = 0
    const check = () => {
      frame = 0
      const fold = innerHeight * 0.88
      el.querySelectorAll<HTMLElement>('[data-reveal], [data-watch]').forEach((t) => {
        const r = t.getBoundingClientRect()
        // a pinned section stays put under the one covering it: once the next section reaches the top, it is hidden
        const next = t.matches('section') ? t.nextElementSibling : null
        const covered = !!next && next.getBoundingClientRect().top <= 0
        const seen = r.top < fold && r.bottom > 0 && !covered
        if (seen) t.setAttribute(t.hasAttribute('data-reveal') ? 'data-reveal' : 'data-watch', 'in')
        t.toggleAttribute('data-live', seen)
      })
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    check()
    scroller.addEventListener('scroll', queue, { passive: true })
    addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(frame)
      scroller.removeEventListener('scroll', queue)
      removeEventListener('resize', queue)
    }
  }, [])
  return root
}

/** What goes into each step, in step order: the strip over the steps lights the one that is current. */
const facets: { label: string; items: string[] }[] = [
  { label: 'Research', items: ['Interviews', 'Observation', 'Usability testing'] },
  { label: 'I deliver', items: ['User flows', 'Wireframes', 'Prototypes', 'Specs'] },
  { label: 'Built in', items: ['Accessibility', 'Empty, loading, error states'] },
  { label: 'I work with', items: ['Product', 'Engineering', 'Real users, from day one'] },
]

const STEP_MS = 5200

/**
 * One scene at a time, like the hero's single stamp: the steps list on the left, the current scene framed on the
 * right. It walks through the steps on its own whenever it is on screen; pointing at, focusing or clicking a step
 * jumps there, and the walk waits until the pointer or focus leaves the list, then carries on from it.
 */
function Approach() {
  const [active, setActive] = useState(0)
  const [live, setLive] = useState(false)
  // the walk holds while a pointer rests on the steps or focus is inside them, so nobody reads a moving target
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const running = live && !reduced && !hovered && !focused
  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setActive((i) => (i + 1) % steps.length), STEP_MS)
    return () => clearTimeout(t)
  }, [running, active])

  const pick = (i: number) => setActive(i)

  return (
    <div className={`ap${running ? ' is-auto' : ''}`} ref={box} style={{ '--step-ms': `${STEP_MS}ms` } as CSSProperties}>
      {/* the strip follows the walk; pointing at a column jumps there too (keyboard users have the step buttons) */}
      <dl
        className="ap-facets"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {facets.map((f, i) => (
          <div
            key={f.label}
            data-on={i === active || undefined}
            onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)}
          >
            <dt>{f.label}</dt>
            <dd>
              <ul>
                {f.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
            {i === active && <span className="ap-timer" key={active} aria-hidden="true" />}
          </div>
        ))}
      </dl>
      <ol
        className="ap-list"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      >
        {steps.map((s, i) => (
          <li key={s.verb}>
            <button
              type="button"
              className="ap-item"
              aria-pressed={i === active}
              onClick={() => pick(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)}
              onFocus={() => pick(i)}
            >
              <span className="ap-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="ap-verb">{s.verb}</span>
              <span className="ap-line">{s.line}</span>
              {i === active && <span className="ap-timer" key={active} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ol>
      <div className="ap-stage" aria-hidden="true">
        {steps.map((s, i) => (
          <div key={s.verb} className="ap-scene" data-on={i === active || undefined} data-live={(i === active && live) || undefined}>
            {s.art}
          </div>
        ))}
      </div>
    </div>
  )
}

/** The rest of the page below the hero, one full screen each: how I work, then the case studies. */
export function MeMore() {
  const root = useReveal()
  return (
    <div className="me-more" ref={root}>
      <section className="me-approach" aria-labelledby="me-approach-h" data-nav="me">
        <ApproachDefs />
        <header className="me-head" data-reveal="">
          <h2 id="me-approach-h">How I work</h2>
        </header>
        {/* the reveal sits on a wrapper this component owns, so a remounted Approach can't strand it unseen */}
        <div data-reveal="">
          <Approach />
        </div>
      </section>

      <section className="me-cases" aria-labelledby="me-cases-h" data-nav="projects" data-watch="">
        <header className="me-head" data-reveal="">
          <h2 id="me-cases-h">Case studies</h2>
        </header>
        <div data-reveal="">
          <CaseList />
        </div>
      </section>
    </div>
  )
}
