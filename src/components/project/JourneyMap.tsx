/** A case study's journey map, pannable inside a frame. */
export function JourneyMap({ src, title, lede, level = 3 }: { src: string; title: string; lede: string; level?: 3 | 4 }) {
  const H = level === 4 ? 'h4' : 'h3'
  return (
    <section className="problems journey" id="cs-journey" aria-label="Journey map">
      <H className="in-action-title">Journey map</H>
      <p className="journey-lede">{lede}</p>
      <div className="journey-frame">
        <iframe src={src} title={title} loading="lazy" />
      </div>
    </section>
  )
}
