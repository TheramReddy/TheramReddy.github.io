import Lenis from 'lenis'
import { setSmoother } from '@/lib/me-section'

/**
 * The wheel glides: Lenis eases the page's scroll (touch keeps its own momentum). Scrollable areas inside the page,
 * like the work app's columns, keep the wheel for themselves.
 */
export function smoothScroll(page: HTMLElement, content: HTMLElement) {
  const lenis = new Lenis({ wrapper: page, content, lerp: 0.085, wheelMultiplier: 0.9, autoRaf: true, allowNestedScroll: true })
  setSmoother(lenis)
  return () => {
    setSmoother(null)
    lenis.destroy()
  }
}
