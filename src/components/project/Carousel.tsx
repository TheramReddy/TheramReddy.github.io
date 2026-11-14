import { useState, type ReactNode } from 'react'

type CarouselProps = {
  id: string
  title: string
  /** singular name for the items, used in button labels */
  noun: string
  /** one accessible name per item */
  labels: string[]
  children: (active: number, go: (n: number) => void) => ReactNode
}

/**
 * One item open at a time. The way on is a clear button under the card, with a count beside it,
 * and on the last item the same button takes you back to the first.
 */
export function Carousel({ id, title, noun, labels, children }: CarouselProps) {
  const [active, setActive] = useState(0)
  const last = labels.length - 1
  const go = (n: number) => setActive(Math.max(0, Math.min(last, n)))
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <section className="problems" id={id} aria-label={title}>
      <div>
        <h3 className="in-action-title">{title}</h3>
        <div className="coverflow">{children(active, go)}</div>
        <div className="cf-controls">
          <p className="cf-count" aria-live="polite">{pad(active + 1)} / {pad(labels.length)}</p>
          <div className="cf-keys">
            <button type="button" className="key is-tall" aria-label={`Previous ${noun}`} disabled={active === 0} onClick={() => go(active - 1)}><span aria-hidden="true">←</span>back</button>
            <button type="button" className="key is-tall is-lit cf-next" aria-label={active === last ? `Back to the first ${noun}` : `Next ${noun}`} onClick={() => setActive(active === last ? 0 : active + 1)}>
              {active === last ? 'start over' : `next ${noun}`}<span className="cf-arrow" aria-hidden="true">{active === last ? '↺' : '→'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
