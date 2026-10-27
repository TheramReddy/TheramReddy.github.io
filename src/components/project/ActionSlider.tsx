import type { Feature } from '@/data/projects'

/** The GIF walkthrough as a plain vertical list: one clip and its note per row. */
export function ActionSlider({ features }: { features: Feature[] }) {
  return (
    <section className="action" id="cs-action" aria-label="See it in action">
      <h3 className="in-action-title">See it in action</h3>
      <ol className="action-list">
        {features.map((f) => (
          <li className="action-item" key={f.gif}>
            <div className="action-shot">
              <img loading="lazy" decoding="async" src={f.gif} alt={f.alt} />
            </div>
            <div className="action-copy">
              <h4>{f.title}</h4>
              <p>{f.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
