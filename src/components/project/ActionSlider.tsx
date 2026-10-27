import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { Feature } from '@/data/projects'
import { Carousel } from './Carousel'

/** The GIF walkthrough as a scroll-driven slider, same coverflow as the problems above it. */
export function ActionSlider({ features }: { features: Feature[] }) {
  return (
    <Carousel id="cs-action" title="See it in action" noun="clip" labels={features.map((f) => f.title)} wide>
      {(active, go) => features.map((f, i) => {
        const d = i - active
        const o = Math.max(-2, Math.min(2, d))
        return (
          <article
            className={cn('diagram', o === 0 && 'is-active')}
            key={f.gif}
            style={{ '--o': o } as CSSProperties}
            aria-hidden={o !== 0}
            onClick={() => o !== 0 && go(i)}
          >
            <div className="d-art d-shot">
              {/* only the two nearest neighbours each side load; remounting on activation restarts the clip */}
              {Math.abs(d) <= 2 && <img decoding="async" key={o === 0 ? 'on' : 'off'} src={f.gif} alt={f.alt} />}
            </div>
            <div className="d-copy">
              <p className="d-tag"><span>{String(i + 1).padStart(2, '0')}</span>of {features.length}</p>
              <h4>{f.title}</h4>
              <p>{f.body}</p>
            </div>
          </article>
        )
      })}
    </Carousel>
  )
}
