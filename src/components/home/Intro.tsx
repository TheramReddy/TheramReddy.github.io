import { site } from '@/data/site'
import { scrollToSection } from '@/lib/me-section'
import { Flap, Pill, Prompt, WAYS } from '@/components/layout/Hero'

/** The opening screen: the portrait wearing the role on an ID badge. */
export function Intro() {
  return (
    <header className="intro">
      {/* the page's heading: the badge on the portrait says it for the eye */}
      <h1 className="sr-only">{site.name}, {site.role}</h1>
      <div className="intro-figure">
        <img src="/me/portrait.webp" alt={`A low-poly 3D portrait of ${site.firstName}: curly hair, glasses, a green cardigan over a blue jumper`} width={896} height={1200} fetchPriority="high" draggable={false} />
        {/* a glint on the ear stud, every few seconds */}
        <svg className="intro-stud" viewBox="-12 -12 24 24" aria-hidden="true">
          <path d="M0 -11 C1 -3 3 -1 11 0 C3 1 1 3 0 11 C-1 3 -3 1 -11 0 C-3 -1 -1 -3 0 -11Z" />
        </svg>
        {/* the role, on an ID badge: a lanyard from both sides of the neck, a clip, and a pixel-cornered card */}
        <div className="badge" aria-hidden="true">
          <svg className="badge-cord" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M36 0 L50 100 M64 0 L50 100" />
          </svg>
          <i className="badge-clip" />
          <div className="badge-card">
            <i className="badge-slot" />
            <b>product<br />designer</b>
            <i className="badge-bars" />
          </div>
        </div>
      </div>

      <p className="say">
        I’ve spent <Pill>my career</Pill> learning how people <em>actually</em> use software, and
        how small decisions keep <Flap word="RESHAPING" /> the way they <Prompt lines={WAYS} />. Because a
        well-crafted experience doesn’t just look good. It makes someone’s day a little easier.
      </p>
      <button type="button" className="say-link" onClick={() => scrollToSection('projects')}>check my work<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></button>
    </header>
  )
}
