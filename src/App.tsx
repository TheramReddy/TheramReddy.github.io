import { lazy, Suspense, useEffect } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { Chrome } from '@/components/layout/Chrome'
import { MePanel } from '@/components/panels/MePanel'
import { getProject } from '@/data/projects'
// design tokens for the arc components (tooltip, buttons)
import '@/components/arc/foundation.css'

// case study code (diagrams, carousels) loads after the first paint
const ProjectDetail = lazy(() => import('@/components/project/ProjectDetail').then((m) => ({ default: m.ProjectDetail })))

/** One page at /; a case study opens over it at /project/:slug so each one is deep-linkable. */
export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const match = useMatch('/project/:slug')
  const project = getProject(match?.params.slug)

  // stale links (old /me, /work, /projects or anything unknown) go home; a trailing slash on a case study is dropped
  useEffect(() => {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    const known = clean === '/' || (clean.startsWith('/project/') && !!project)
    if (!known) navigate('/', { replace: true })
    else if (clean !== pathname) navigate(clean, { replace: true })
  }, [pathname, project, navigate])

  useEffect(() => {
    // Escape closes an open case study, back to the page where it was left
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && pathname.startsWith('/project/') && navigate('/')
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
