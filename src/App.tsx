import { lazy, Suspense, useEffect } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { Chrome } from '@/components/layout/Chrome'
import { Loader } from '@/components/layout/Loader'
import { Tour } from '@/components/layout/Tour'
import { ContactPanel } from '@/components/panels/ContactPanel'
import { MePanel } from '@/components/panels/MePanel'
import { ProjectsPanel } from '@/components/panels/ProjectsPanel'
import { WorkPanel } from '@/components/panels/WorkPanel'
import { getProject } from '@/data/projects'

// case study code (diagrams, carousels) loads after the first paint
const ProjectDetail = lazy(() => import('@/components/project/ProjectDetail').then((m) => ({ default: m.ProjectDetail })))

const ROUTES = ['/', '/me', '/work', '/projects', '/contact']

/**
 * Me, Work, Projects, Contact and project popups are route-driven overlays
 * (/me, /work, /projects, /contact, /project/:slug) so every view is deep-linkable.
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
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && navigate(pathname.startsWith('/project/') ? '/projects' : '/')
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [navigate, pathname])

  return (
    <>
      <Loader />
      <Chrome />
      <Tour />
      <MePanel open={pathname === '/' || pathname === '/me'} />
      <WorkPanel open={pathname === '/work'} />
      <ProjectsPanel open={pathname === '/projects'} />
      <ContactPanel open={pathname === '/contact'} />
      <Suspense fallback={null}>
        <ProjectDetail project={project} open={!!project} />
      </Suspense>
    </>
  )
}
