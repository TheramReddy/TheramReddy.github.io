import { useSyncExternalStore } from 'react'
import { reducedMotion } from '@/lib/motion'
import type Lenis from 'lenis'

/** Which nav item the section on screen in the Me page belongs to, so the nav can mark it while you scroll. */
export type MeSection = 'me' | 'about' | 'projects' | 'contact'

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

/**
 * Scrolls the page so `target` sits `gap` pixels under its top edge; with no target, to the very top.
 */
export function scrollPageTo(target: HTMLElement | null, { gap = 0, smooth = true, duration = 1.4 } = {}) {
  const page = document.querySelector<HTMLElement>('.panel.me')
  if (!page) return
  const top = target ? target.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - gap : 0
  const still = reducedMotion()
  if (smoother) smoother.scrollTo(top, { immediate: !smooth || still, duration })
  else page.scrollTo({ top, behavior: smooth && !still ? 'smooth' : 'auto' })
}

/**
 * Scrolls the page to a section: Me is the top, the others are the blocks marked [data-nav].
 */
export function scrollToSection(name: MeSection, smooth = true) {
  const target = name === 'me' ? null : document.querySelector<HTMLElement>(`.panel.me [data-nav="${name}"]`)
  scrollPageTo(target, { smooth })
}
