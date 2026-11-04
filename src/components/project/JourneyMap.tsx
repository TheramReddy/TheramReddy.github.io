import { ArrowUpRight } from 'lucide-react'

const SRC = '/projects/dso-modernization/journey.html'

/** The debt setoff pipeline as a pannable journey map; the full map opens in its own tab. */
export function JourneyMap() {
  return (
    <section className="problems journey" id="cs-journey" aria-label="Journey map">
      <h3 className="in-action-title">Journey map</h3>
      <p className="journey-lede">
        Getting a clearer view before stepping in gives the full picture.
      </p>
      <div className="journey-frame">
        <iframe src={SRC} title="DSO debt setoff journey map" loading="lazy" />
      </div>
      <a className="journey-open" href={SRC} target="_blank" rel="noopener noreferrer">
        Open the map full screen
        <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  )
}
