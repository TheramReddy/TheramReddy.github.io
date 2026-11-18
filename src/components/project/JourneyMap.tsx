import { useEffect, useRef } from 'react'
import { useTheme } from '@/lib/theme'

/** A case study's journey map, pannable inside a frame. The map is a page of its own, so it is told the theme. */
export function JourneyMap({ src, title, lede, level = 3 }: { src: string; title: string; lede: string; level?: 3 | 4 }) {
  const H = level === 4 ? 'h4' : 'h3'
  const frame = useRef<HTMLIFrameElement>(null)
  const theme = useTheme()
  // the map reads the theme itself when it loads; this carries a change made while it is open
  useEffect(() => {
    try {
      const doc = frame.current?.contentDocument?.documentElement
      if (doc) doc.dataset.theme = theme
    } catch { /* a map from another origin keeps its own theme */ }
  }, [theme])
  return (
    <section className="problems" id="cs-journey" aria-label="Journey map">
      <H className="in-action-title">Journey map</H>
      <p className="journey-lede">{lede}</p>
      <div className="journey-frame">
        <iframe ref={frame} src={src} title={title} loading="lazy" />
      </div>
    </section>
  )
}
