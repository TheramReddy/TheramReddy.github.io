import { useState, type ReactNode } from 'react'

const Arrow = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)

type CarouselProps = {
  id: string
  title: string
  /** singular name for the items, used in button labels */
  noun: string
  /** one accessible name per item */
  labels: string[]
  children: (active: number, go: (n: number) => void) => ReactNode
}

/** One item open at a time, stepped by the arrows. Items render as `.diagram` articles. */
export function Carousel({ id, title, noun, labels, children }: CarouselProps) {
  const [active, setActive] = useState(0)
  const go = (n: number) => setActive(Math.max(0, Math.min(labels.length - 1, n)))
  return (
    <section className="problems" id={id} aria-label={title}>
      <div>
        <h3 className="in-action-title">{title}</h3>
        <div className="cf-controls">
          <button className="cf-btn" aria-label={`Previous ${noun}`} disabled={active === 0} onClick={() => go(active - 1)}><Arrow d="M10 3 5 8l5 5" /></button>
          <button className="cf-btn" aria-label={`Next ${noun}`} disabled={active === labels.length - 1} onClick={() => go(active + 1)}><Arrow d="m6 3 5 5-5 5" /></button>
        </div>
        <div className="coverflow">{children(active, go)}</div>
      </div>
    </section>
  )
}
