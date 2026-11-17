import { useEffect, useRef, useState } from 'react'
import type { Metric } from '@/data/projects'
import { reducedMotion } from '@/lib/motion'
import { Bot } from './crew/Bot'
import './crew/crew.css'

const WALK = 1200
const LOOK = 2400
const BOT_H = 40

/**
 * The headline numbers as four pixel cards. One small agent patrols them: it walks along the top
 * edge of a card, stops, looks it over with a lens, the card lights up, then it moves on to the next.
 */
export function MetricCards({ items }: { items: Metric[] }) {
  const grid = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const [at, setAt] = useState(0)
  const [looking, setLooking] = useState(false)
  const [left, setLeft] = useState(false)
  const bot = useRef<HTMLDivElement>(null)
  const from = useRef(0)
  const [live, setLive] = useState(false)
  const calm = reducedMotion()

  // patrol only while the cards are on screen
  useEffect(() => {
    const el = grid.current
    if (!el || calm) return
    // a closed case study stays mounted and hidden, and still counts as on screen, so its open state is checked too
    const detail = el.closest('.detail')
    let seen = false
    const sync = () => setLive(seen && (!detail || detail.classList.contains('open')))
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync() }, { threshold: 0.25 })
    io.observe(el)
    const mo = new MutationObserver(sync)
    if (detail) mo.observe(detail, { attributes: true, attributeFilter: ['class'] })
    return () => { io.disconnect(); mo.disconnect() }
  }, [calm])

  // stand on the top edge of the current card, and re-measure when the layout changes
  useEffect(() => {
    const place = () => {
      const g = grid.current, c = cards.current[at], b = bot.current
      if (!g || !c || !b) return
      const gb = g.getBoundingClientRect(), cb = c.getBoundingClientRect()
      const x = cb.left - gb.left + 28, y = cb.top - gb.top - BOT_H + 3
      // moved straight on the compositor: no re-render per step
      b.style.transform = `translate3d(${x}px, ${y}px, 0)`
      setLeft((was) => (x < from.current ? true : x > from.current ? false : was))
      from.current = x
    }
    place()
    const ro = new ResizeObserver(place)
    if (grid.current) ro.observe(grid.current)
    return () => ro.disconnect()
  }, [at])

  // walk, look, move on
  useEffect(() => {
    if (!live) return
    setLooking(false)
    const arrive = setTimeout(() => setLooking(true), WALK)
    const next = setTimeout(() => setAt((i) => (i + 1) % items.length), WALK + LOOK)
    return () => { clearTimeout(arrive); clearTimeout(next) }
  }, [at, live, items.length])

  return (
    <div className="metric-grid" ref={grid}>
      <dl>
        {items.map((m, i) => (
          <div className="metric px-plate" key={m.label} ref={(el) => { cards.current[i] = el }} data-on={calm ? undefined : (live && looking && at === i) || undefined}>
            {m.group && <span className="metric-group">{m.group}</span>}
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
            <p>{m.note}</p>
          </div>
        ))}
      </dl>
      {!calm && (
        <div className="crew metric-bot" aria-hidden="true" ref={bot}>
          <Bot act={live && looking ? 'find' : 'search'} dir={left ? 'l' : 'r'} look="d" size={34} />
        </div>
      )}
    </div>
  )
}
