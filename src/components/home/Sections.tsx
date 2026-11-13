import { useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects, type Project } from '@/data/projects'
import { site } from '@/data/site'
import { scrollToSection } from '@/lib/me-section'
import { useFit } from '@/lib/use-fit'
import { PixelField, Timeline } from './WorkWells'

/**
 * The well of a featured project: a paper card that leans toward the pointer and lifts a little under it. Pressing
 * the card turns it over to a link to the case study, and it holds still while turned. The arrow in the corner swaps the card for
 * a recording of the real screen, and back.
 */
function CardWell({ p }: { p: Project }) {
  const [turned, setTurned] = useState(false)
  const well = useRef<HTMLDivElement>(null)
  const lean = (e: React.PointerEvent) => {
    const el = well.current
    // the turned card stays still, so the link on its back is easy to press
    if (!el || turned || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -14).toFixed(2))
    el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 20).toFixed(2))
  }
  const rest = () => { well.current?.style.setProperty('--rx', '0'); well.current?.style.setProperty('--ry', '0') }
  const turn = () => { rest(); setTurned((t) => !t) }
  return (
    <div className="tile-shot" ref={well} onPointerMove={lean} onPointerLeave={rest}>
      {(
          <div className="biz" data-turned={turned || undefined}>
            <button type="button" className="biz-face" onClick={turn} tabIndex={turned ? -1 : 0} aria-hidden={turned} aria-label="Turn the card over">
              <span className="biz-top">
                {p.logo && <img src={p.logo} alt={p.client} draggable={false} />}
                <span className="biz-state"><i />Live</span>
              </span>
              <span className="biz-name">{p.title}</span>
              <span className="biz-line">{p.client}</span>
              <span className="biz-line is-soft">{p.role}</span>
            </button>
            <div className="biz-face is-back" aria-hidden={!turned}>
              <button type="button" className="biz-turn" onClick={turn} tabIndex={turned ? 0 : -1} aria-label="Turn the card back" />
              <Link className="biz-read" to={`/project/${p.slug}`} tabIndex={turned ? 0 : -1}>Read case study<ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" /></Link>
            </div>
          </div>
        )}
    </div>
  )
}

/** Work: one wide card per project, the pitch on the left and its screen in a well on the right. */
export function Work() {
  return (
    <section className="block work" data-nav="projects" aria-labelledby="work-h">
      <div className="col">
        <h2 className="px" id="work-h">work</h2>
        <p className="block-sub">Real products, start to finish.</p>
        <ol className="tiles">
          {projects.map((p, i) => {
            // the featured card: two keys and a small note under the pitch, and the paper card in the well
            const featured = p.slug === 'dso-modernization'
            return (
              <li className="tile" key={p.slug} data-rise="" style={{ '--d': i } as CSSProperties}>
                <div className="tile-text">
                  <h3>{p.title}</h3>
                  <p className="tile-sum">{p.summary.replace(' Coming soon to beta.', '')}</p>
                  <p className="tile-keys">
                    {p.link ? <a className="key is-tall is-lit" href={p.link.href} target="_blank" rel="noopener noreferrer"><Globe size={15} strokeWidth={1.7} aria-hidden="true" />Public page<span className="sr-only"> (opens in a new tab)</span></a>
                      : p.figma ? <a className="key is-tall is-lit" href={p.figma} target="_blank" rel="noopener noreferrer"><img src="/tools/figma.svg" alt="" width={15} height={15} draggable={false} />Figma file<span className="sr-only"> (opens in a new tab)</span></a>
                      : <span className="key is-tall is-off">Coming soon</span>}
                  </p>
                  {p.link ? <p className="tile-note">{p.link.note}</p>
                    : p.figma ? <p className="tile-note">The full library, open in Figma</p>
                    : null}
                  {/* an unpublished project has no page to open yet */}
                  {!p.soon && <Link className="tile-case" to={`/project/${p.slug}`}>View case study<ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" /></Link>}
                </div>
                {featured ? <CardWell p={p} />
                  : p.slug === 'scobin-design-system' ? <Timeline from={[2024, 0]} to={[2025, 1]} />
                  : <PixelField letter="T" note="coming soon" />}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** Footer: the invitation, the small print, then the name set as wide as the column. */
export function Foot() {
  const box = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLSpanElement>(null)
  useFit(box, word)
  return (
    <footer className="foot" data-nav="contact">
      <div className="col">
        <div className="foot-top">
          <p className="foot-say">Bring me the workflow<span>nobody wants to use.</span></p>
        </div>
        <div className="foot-row">
          <nav aria-label="Footer">
            <button type="button" onClick={() => scrollToSection('about')}>Playground</button>
            <button type="button" onClick={() => scrollToSection('projects')}>Work</button>
            <button type="button" onClick={() => scrollToSection('me')}>Back to top</button>
          </nav>
          <p>{site.location}</p>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
        <div className="foot-word" ref={box} aria-hidden="true"><span ref={word}>{site.firstName.toLowerCase()}</span></div>
      </div>
    </footer>
  )
}
