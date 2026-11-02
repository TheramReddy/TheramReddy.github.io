import { useSyncExternalStore } from 'react'

/** Which nav item the section on screen in the Me page belongs to, so the nav can mark it while you scroll. */
export type MeSection = 'me' | 'work' | 'projects'

let current: MeSection = 'me'
const listeners = new Set<() => void>()

export function setMeSection(next: MeSection) {
  if (next === current) return
  current = next
  listeners.forEach((l) => l())
}

export function useMeSection() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )
}

/** The section a path points at: the whole site is one page, and /work and /projects are places on it. */
export function sectionOf(pathname: string): MeSection | null {
  if (pathname === '/' || pathname === '/me') return 'me'
  if (pathname === '/work') return 'work'
  if (pathname === '/projects') return 'projects'
  return null
}

/** Scrolls the page to a section: Me is the top, Work and Projects their sections further down. */
export function scrollToSection(name: MeSection, smooth = true) {
  const page = document.querySelector<HTMLElement>('.panel.me')
  if (!page) return
  const target = name === 'me' ? null : page.querySelector<HTMLElement>(`section[data-nav="${name}"]`)
  const top = target ? target.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop : 0
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  page.scrollTo({ top, behavior: smooth && !still ? 'smooth' : 'auto' })
}
