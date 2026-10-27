import { Link, useLocation, useNavigate } from 'react-router-dom'
import { site } from '@/data/site'
import { PixelFace } from './PixelFace'

/** Fixed corner navigation: name, Me / Work / Projects, Contact. */
export function Chrome() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const toggle = (to: string) => navigate(pathname === to ? '/' : to)

  return (
    <div className={pathname.startsWith('/project/') ? 'ui hidden-ui' : 'ui'}>
      <div className="row top">
        <Link to="/" className="label" aria-label={site.name}>
          <span className="wordmark">
            <PixelFace />
            {site.firstName}
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <button className="label" data-tour="me" aria-current={pathname === '/' || pathname === '/me'} onClick={() => navigate('/')}>
            Me
          </button>
          <button className="label" data-tour="work" aria-current={pathname === '/work'} onClick={() => toggle('/work')}>
            Work
          </button>
          <button className="label" data-tour="projects" aria-current={pathname === '/projects'} onClick={() => toggle('/projects')}>
            Projects
          </button>
        </nav>
      </div>
      <div className="row bottom">
        <span />
        <button className="label" data-tour="contact" aria-expanded={pathname === '/contact'} onClick={() => toggle('/contact')}>
          {pathname === '/contact' ? 'Close' : 'Contact'}
        </button>
      </div>
    </div>
  )
}
