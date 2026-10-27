import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Page scroll drives a sticky carousel: one step per slice of its tall wrapper. */
function useCarousel(count: number) {
  const [active, setActive] = useState(0)
  const wrap = useRef<HTMLElement>(null)
  const stick = useRef<HTMLDivElement>(null)
  const last = Math.max(1, count - 1)

  /** Where the sticky stage starts inside the page, and how far it can scroll. */
  const track = () => {
    const w = wrap.current, st = stick.current
    const sheet = w?.closest('.sheet') as HTMLElement | null
    if (!w || !st || !sheet) return null
    const top = w.getBoundingClientRect().top - sheet.getBoundingClientRect().top + sheet.scrollTop
    return { sheet, top, range: Math.max(1, w.offsetHeight - st.offsetHeight) }
  }

  useEffect(() => {
    if (!track()) return
    const onScroll = () => {
      const k = track()
      if (!k) return
      const p = Math.max(0, Math.min(1, (k.sheet.scrollTop - k.top) / k.range))
      setActive(Math.round(p * last))
    }
    const sheet = track()!.sheet
    sheet.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => sheet.removeEventListener('scroll', onScroll)
  }, [last])

  const go = (n: number) => {
    const k = track()
    const i = Math.max(0, Math.min(count - 1, n))
    if (k) k.sheet.scrollTo({ top: k.top + (i / last) * k.range, behavior: 'smooth' })
    else setActive(i)
  }

  return { wrap, stick, active, go }
}

const Arrow = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)

type CarouselProps = {
  id: string
  title: string
  /** singular name for the items, used in button labels */
  noun: string
  /** one accessible name per item, for the dots */
  labels: string[]
  children: (active: number, go: (n: number) => void) => ReactNode
}

/** Sticky coverflow driven by page scroll, with arrows and dots. Items render as `.diagram` articles. */
export function Carousel({ id, title, noun, labels, children }: CarouselProps) {
  const { wrap, stick, active, go } = useCarousel(labels.length)
  return (
    <section className="problems" id={id} aria-label={title} ref={wrap} style={{ '--n': labels.length } as CSSProperties}>
      <div className="problems-stick" ref={stick}>
        <h3 className="in-action-title">{title}</h3>
        <div className="cf-controls">
          <button className="cf-btn" aria-label={`Previous ${noun}`} disabled={active === 0} onClick={() => go(active - 1)}><Arrow d="M10 3 5 8l5 5" /></button>
          <span className="cf-label">Scroll</span>
          <button className="cf-btn" aria-label={`Next ${noun}`} disabled={active === labels.length - 1} onClick={() => go(active + 1)}><Arrow d="m6 3 5 5-5 5" /></button>
        </div>
        <div className="coverflow">{children(active, go)}</div>
        <div className="cf-dots" role="tablist" aria-label={`Choose a ${noun}`}>
          {labels.map((label, i) => (
            <button key={label} role="tab" aria-selected={i === active} aria-label={label} className={cn('cf-dot', i === active && 'on')} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
