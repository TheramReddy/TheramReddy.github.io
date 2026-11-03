import { lazy, Suspense, useEffect } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { Chrome } from '@/components/layout/Chrome'
import { MePanel } from '@/components/panels/MePanel'
import { getProject } from '@/data/projects'
// design tokens for the arc components (tooltip, buttons)
import '@/components/arc/foundation.css'

// case study code (diagrams, carousels) loads after the first paint
const ProjectDetail = lazy(() => import('@/components/project/ProjectDetail').then((m) => ({ default: m.ProjectDetail })))

const ROUTES = ['/', '/me', '/work', '/projects']

/**
 * One page: /, /me and /projects are places on it (the page scrolls to them; old /work links land on /projects), and
 * a case study opens over it at /project/:slug, so every view is deep-linkable.
 */
export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const match = useMatch('/project/:slug')
  const project = getProject(match?.params.slug)

  // GitHub Pages redirects /projects to /projects/ (public/projects exists), and stale links can point anywhere:
  // drop trailing slashes and send unknown paths home so a panel is always open.
  useEffect(() => {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    const known = ROUTES.includes(clean) || (clean.startsWith('/project/') && !!project)
    if (!known) navigate('/', { replace: true })
    else if (clean !== pathname) navigate(clean, { replace: true })
  }, [pathname, project, navigate])

  useEffect(() => {
    // Escape closes an open case study, back to the case studies on the page
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && pathname.startsWith('/project/') && navigate('/projects')
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [navigate, pathname])

  return (
    <>
      <Chrome />
      <MePanel covered={!!project} />
      <Suspense fallback={null}>
        <ProjectDetail project={project} open={!!project} />
      </Suspense>
    </>
  )
}
