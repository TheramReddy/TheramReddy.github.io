import { Link, useLocation, useNavigate } from 'react-router-dom'
import { site } from '@/data/site'
import { scrollToSection, useMeSection, type MeSection } from '@/lib/me-section'

/** Fixed corner navigation: name, Me / Projects. Each item scrolls the page to its section; the mark follows
 * the section on screen. */
export function Chrome() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const section = useMeSection()
  // the path changing scrolls the page; clicking the item already in the path scrolls back to it
  const go = (to: string, s: MeSection) => () => (pathname === to ? scrollToSection(s) : navigate(to))

  return (
    <div className={pathname.startsWith('/project/') ? 'ui hidden-ui' : 'ui'}>
      <div className="row top">
        <Link to="/" className="label" aria-label={site.name}>
          <img className="logo" src="/brand/logo.svg" alt="" width={96} height={25} />
        </Link>
        <nav className="nav" aria-label="Primary">
          <button className="label" data-tour="me" aria-current={section === 'me'} onClick={go('/', 'me')}>
            Me
            <Ink />
          </button>
          <button className="label" data-tour="projects" aria-current={section === 'projects'} onClick={go('/projects', 'projects')}>
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
