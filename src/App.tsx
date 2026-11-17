import { lazy, Suspense, useEffect, useRef } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { Nav } from '@/components/home/Nav'
import { Home } from '@/components/home/Home'
import { getProject } from '@/data/projects'
import { fresh } from '@/lib/fresh'
// the few component tokens the case study's done state reads
import '@/components/arc/foundation.css'

// case study code (diagrams, carousels) loads after the first paint
const ProjectDetail = lazy(fresh(() => import('@/components/project/ProjectDetail').then((m) => ({ default: m.ProjectDetail }))))

/** One page at /; a case study opens over it at /project/:slug so each one is deep-linkable. */
export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const match = useMatch('/project/:slug')
  const project = getProject(match?.params.slug)

  // what had focus when a case study opened gets it back when the study closes. Read while rendering: once the
  // study is open the page under it is inert, and focus has already left it
  const opener = useRef<Element | null>(null)
  const wasOpen = useRef(false)
  if (!!project !== wasOpen.current) {
    if (project) opener.current = document.activeElement
    wasOpen.current = !!project
  }
  useEffect(() => {
    if (project || !(opener.current instanceof HTMLElement)) return
    if (opener.current.isConnected) opener.current.focus({ preventScroll: true })
    opener.current = null
  }, [project])

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
      <Nav />
      <Home covered={!!project} />
      <Suspense fallback={null}>
        <ProjectDetail project={project} open={!!project} />
      </Suspense>
    </>
  )
}
