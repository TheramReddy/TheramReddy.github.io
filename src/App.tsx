import { useEffect } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { Chrome } from '@/components/layout/Chrome'
import { Loader } from '@/components/layout/Loader'
import { Tour } from '@/components/layout/Tour'
import { ContactPanel } from '@/components/panels/ContactPanel'
import { MePanel } from '@/components/panels/MePanel'
import { ProjectsPanel } from '@/components/panels/ProjectsPanel'
import { WorkPanel } from '@/components/panels/WorkPanel'
import { ProjectDetail } from '@/components/project/ProjectDetail'
import { getProject } from '@/data/projects'

/**
 * Me, Work, Projects, Contact and project popups are route-driven overlays
 * (/me, /work, /projects, /contact, /project/:slug) so every view is deep-linkable.
 */
export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const match = useMatch('/project/:slug')
  const project = getProject(match?.params.slug)

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
      <ProjectDetail project={project} open={!!project} />
    </>
  )
}
