import { useSyncExternalStore } from 'react'
import type Lenis from 'lenis'

/** Which nav item the section on screen in the Me page belongs to, so the nav can mark it while you scroll. */
export type MeSection = 'me' | 'projects'

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

/** The page's smooth scroller (Lenis), while it runs: programmatic scrolls go through it so the two never disagree. */
let smoother: Lenis | null = null
export const setSmoother = (l: Lenis | null) => (smoother = l)
export const getSmoother = () => smoother

/** Where a pinned section rests in the page's scroll: its parent's place plus everything above it in the flow. */
export function flowTop(page: HTMLElement, el: HTMLElement) {
  const parent = el.parentElement
  if (!parent) return 0
  let top = parent.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop
  for (let s = el.previousElementSibling; s; s = s.previousElementSibling) top += (s as HTMLElement).offsetHeight
  return top
}

/**
 * Scrolls the page to a section: Me is the top, Work and Projects their sections further down. The sections pin as
 * they stack, so a section's place is measured from the flow (everything above it), not from where it sits now.
 */
export function scrollToSection(name: MeSection, smooth = true) {
  const page = document.querySelector<HTMLElement>('.panel.me')
  if (!page) return
  const target = name === 'me' ? null : page.querySelector<HTMLElement>(`section[data-nav="${name}"]`)
  const top = target ? flowTop(page, target) : 0
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (smoother) smoother.scrollTo(top, { immediate: !smooth || still, duration: 1.4 })
  else page.scrollTo({ top, behavior: smooth && !still ? 'smooth' : 'auto' })
}
