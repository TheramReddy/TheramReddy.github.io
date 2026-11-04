import { useLocation } from 'react-router-dom'
import { site } from '@/data/site'
import { scrollToSection, useMeSection } from '@/lib/me-section'

/** Fixed corner navigation: name, Me / Projects. Each item scrolls the page to its section; the mark follows
 * the section on screen. */
export function Chrome() {
  const { pathname } = useLocation()
  const section = useMeSection()

  return (
    <div className={pathname.startsWith('/project/') ? 'ui hidden-ui' : 'ui'}>
      <div className="row top">
        <button type="button" className="label" aria-label={site.name} onClick={() => scrollToSection('me')}>
          <img className="logo" src="/brand/logo.svg" alt="" width={96} height={25} />
        </button>
        <nav className="nav" aria-label="Primary">
          <button className="label" data-tour="me" aria-current={section === 'me'} onClick={() => scrollToSection('me')}>
            Me
            <Ink />
          </button>
          <button className="label" data-tour="projects" aria-current={section === 'projects'} onClick={() => scrollToSection('projects')}>
            Projects
            <Ink />
          </button>
        </nav>
      </div>
    </div>
  )
}

/** Desktop nav mark: pencil hint on hover, red ink stroke under the current page. */
function Ink() {
  const d = 'M2 5.2 C 20 3.4, 38 6.2, 56 4.6 S 88 3.8, 98 4.9'
  return (
    <svg className="ink" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
      <path className="ink-hint" d={d} />
      <path className="ink-mark" d={d} pathLength={1} />
    </svg>
  )
}
