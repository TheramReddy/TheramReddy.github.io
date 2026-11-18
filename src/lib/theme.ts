import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { reducedMotion } from '@/lib/motion'

export type Theme = 'light' | 'dark'

const KEY = 'theme'
/** the page ground of each theme, for the browser's own chrome */
const GROUND: Record<Theme, string> = { light: '#ffffff', dark: '#0c0c0b' }
/** how long the new theme takes to open across the page, and the cross-fade where that cannot be drawn (ms) */
const TURN = 750, FADE = 500

const subs = new Set<() => void>()
const subscribe = (fn: () => void) => { subs.add(fn); return () => { subs.delete(fn) } }

/** The theme that is on. index.html sets it on <html> before the first paint: light unless the visitor chose dark. */
export const getTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(next: Theme) {
  document.documentElement.dataset.theme = next
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', GROUND[next])
  try { localStorage.setItem(KEY, next) } catch { /* private mode: the choice lasts for this visit */ }
  subs.forEach((fn) => fn())
  // for what is painted by hand (canvases) and so cannot follow the stylesheet
  window.dispatchEvent(new Event('themechange'))
}

let turning = false

/**
 * Switch theme. The new one opens out of `from` (the key that was pressed) as a growing circle over a snapshot of
 * the old one. Where the browser cannot do that the colours cross-fade in place, and with reduced motion they
 * simply change.
 */
export function setTheme(next: Theme, from?: { x: number; y: number }) {
  if (turning || next === getTheme()) return
  const root = document.documentElement
  if (reducedMotion()) { apply(next); return }
  if (!document.startViewTransition) {
    root.classList.add('theme-fade')
    apply(next)
    window.setTimeout(() => root.classList.remove('theme-fade'), FADE)
    return
  }

  turning = true
  root.classList.add('theme-turn')
  const x = from?.x ?? window.innerWidth / 2
  const y = from?.y ?? 0
  // far enough to reach the corner furthest from the key
  const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const turn = document.startViewTransition(() => flushSync(() => apply(next)))
  turn.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`] },
        { duration: TURN, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => { /* the snapshot could not be taken: the theme has still changed */ })
  void turn.finished.finally(() => {
    root.classList.remove('theme-turn')
    turning = false
  })
}

/** The theme that is on, kept current. */
export const useTheme = () => useSyncExternalStore(subscribe, getTheme, (): Theme => 'light')
