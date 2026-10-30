import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Bot, BossBot } from './Bot'
import { AGENTS, FLIGHT, dirBetween, reducedMotion, throwTarget, useCrew, type AgentId, type Beat, type Id } from './crew'
import './crew.css'

export const NAMES: Record<AgentId, string> = { converter: 'Converter', structurer: 'Structurer', linker: 'Linker', organizer: 'Organizer' }

/** Natural width of the strip; it scales down to fit narrower columns. */
const NATURAL = 724
const SLAB = 4
const FLYERS = 10

type Pt = { x: number; y: number }

/** A thrown packet's path: an arc from one desk to another, optionally missing and being scooped up. */
function arc(from: Pt, to: Pt, lift: number, spin: number, miss = false): Keyframe[] {
  const landing = { x: to.x + 11, y: to.y + 2 }
  return Array.from({ length: 15 }, (_, i) => {
    const c = i / 14
    let x: number
    let y: number
    if (miss && c > 0.7) {
      const e = (c - 0.7) / 0.3
      x = landing.x + (to.x - landing.x) * e
      y = landing.y + (to.y - landing.y) * e - 20 * e * (1 - e)
    } else {
      const r = miss ? c / 0.7 : c
      const t = miss ? landing : to
      x = from.x + (t.x - from.x) * r
      y = from.y + (t.y - from.y) * r - 4 * lift * r * (1 - r)
    }
    const opacity = c < 0.08 ? c / 0.08 : c > 0.94 ? (1 - c) / 0.06 : 1
    return { transform: `translate(${x}px, ${y}px) rotate(${spin * c}deg) scale(${1 + 0.15 * Math.sin(c * Math.PI)})`, opacity, offset: c }
  })
}

const working = (b: Beat) => b.act !== 'sit' && b.act !== 'pass' && b.act !== 'catch'

/** The boss hands documents to four agents, who work, talk and pass them along. */
export function Mission({ className, away }: { className?: string; away?: AgentId | null }) {
  const root = useRef<HTMLDivElement>(null)
  const fit = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const cards = useRef<Partial<Record<Id, HTMLElement | null>>>({})
  const piles = useRef<Record<string, HTMLElement | null>>({})
  const flyers = useRef<(HTMLElement | null)[]>([])
  const flyIndex = useRef(0)
  const scale = useRef(1)
  const prev = useRef<ReturnType<typeof useCrew> | null>(null)
  const [active, setActive] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [height, setHeight] = useState<number>()

  const crew = useCrew(active)

  // only run while on screen
  useEffect(() => {
    const el = root.current
    if (!el || !('IntersectionObserver' in window)) { setActive(true); return }
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // scale down to the column
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => {
      const z = Math.min(1, el.clientWidth / NATURAL)
      scale.current = z
      setZoom(z)
      setHeight(fit.current ? fit.current.offsetHeight * z : undefined)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // throw packets whenever something is handed over or picked up
  useEffect(() => {
    const before = prev.current
    prev.current = crew
    const box = body.current?.getBoundingClientRect()
    if (!before || !box || reducedMotion() || !active) return
    const z = scale.current

    const centre = (el: Element | null | undefined, floor?: number): Pt | null => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      const x = (r.left + r.width / 2 - box.left) / z
      return floor === undefined ? { x, y: (r.top + r.height / 2 - box.top) / z } : { x, y: (r.bottom - box.top) / z - floor * SLAB - 2 }
    }
    const bot = (id: Id) => centre(id === 'boss' ? cards.current.boss?.querySelector('.ap-boss-orb') : cards.current[id]?.querySelector('.bot'))
    const pile = (id: Id, side: 'in' | 'out', n: number) => (id === 'boss' ? bot(id) : centre(piles.current[`${id}:${side}`], n))
    const fly = (id: Id, from: Pt | null, to: Pt | null, ms: number, o: { lift?: number; spin?: number; miss?: boolean } = {}) => {
      const el = flyers.current[flyIndex.current++ % FLYERS]
      if (!el || !from || !to || typeof el.animate !== 'function') return
      el.style.setProperty('--c', id === 'boss' ? 'var(--neutral-600)' : `var(--a-${id})`)
      el.animate(arc(from, to, o.lift ?? Math.min(36, 14 + Math.hypot(to.x - from.x, to.y - from.y) * 0.12), o.spin ?? 200, o.miss), { duration: ms, easing: 'linear', fill: 'both' })
    }

    for (const id of Object.keys(crew.piles) as Id[]) {
      const was = before.piles[id]
      const now = crew.piles[id]
      if (id !== 'boss' && now.in < was.in) fly(id, pile(id, 'in', now.in + 1), bot(id), 380, { lift: 9, spin: 90 })
      if (crew.sent[id] > before.sent[id]) {
        for (let n = before.sent[id], stack = was.out; n < crew.sent[id]; n++, stack--) {
          const to = throwTarget(id, n)
          fly(id, pile(id, 'out', Math.max(stack, 1)), pile(to, 'in', crew.piles[to].in + 1), FLIGHT, { miss: n % 3 === 2 })
        }
      }
    }
  }, [crew, active])

  const boss = crew.beats.boss
  const bossSay = crew.says.boss
  const bossText = bossSay?.text ?? boss.label

  return (
    <div className={`crew${className ? ` ${className}` : ''}`} ref={root} style={{ height }} role="img" aria-label="Four agents, Converter, Structurer, Linker and Organizer, take documents from a boss, work on them, talk to each other and pass them along">
      <div className="crew-fit" ref={fit} style={{ transform: `scale(${zoom})` }}>
        <div className="ap-mission-body" ref={body}>
          <div className="ap-boss-card" ref={(el) => { cards.current.boss = el }}>
            <span className="ap-boss-stage">
              <span className="ap-bubble" key={bossText} data-say={bossSay ? dirBetween('boss', bossSay.to) : undefined}>{bossText}</span>
              <span className="ap-boss-orb" data-state={boss.act}><BossBot /></span>
            </span>
          </div>

          <div className="ap-tiles">
            {AGENTS.map((id) => {
              const b = crew.beats[id]
              const say = crew.says[id]
              const text = say?.text ?? b.label
              return (
                <div
                  key={id}
                  className="ap-tile"
                  data-working={working(b) ? 'true' : undefined}
                  style={{ '--c': `var(--a-${id})` } as CSSProperties}
                  ref={(el) => { cards.current[id] = el }}
                  data-name={NAMES[id]}
                >
                  <span className="ap-piles" data-kind={id}>
                    {(['in', 'out'] as const).map((side) => {
                      const n = crew.piles[id][side]
                      return (
                        <span className="ap-pile" data-side={side} key={side} ref={(el) => { piles.current[`${id}:${side}`] = el }}>
                          {Array.from({ length: Math.min(n, 5) }, (_, i) => <i className="ap-slab" key={i} />)}
                        </span>
                      )
                    })}
                  </span>
                  <span className="ap-tile-stage" style={away === id ? { visibility: 'hidden' } : undefined}>
                    <span className="ap-bubble" key={text} data-say={say ? dirBetween(id, say.to) : undefined}>{text}</span>
                    <Bot act={b.act} dir={b.dir} look={crew.looks[id]} />
                  </span>
                  <span className="ap-trail">{working(b) && <span className="ap-trail-fill" key={b.from} style={{ animationDuration: `${b.to - b.from}ms` }} />}</span>
                </div>
              )
            })}
          </div>

          {Array.from({ length: FLYERS }, (_, i) => <span className="ap-flyer" aria-hidden="true" key={i} ref={(el) => { flyers.current[i] = el }} />)}
        </div>
      </div>
    </div>
  )
}
