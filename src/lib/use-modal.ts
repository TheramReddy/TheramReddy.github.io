import { useEffect, useState, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Makes the element behave as a modal for the keyboard while it is mounted: Tab stays inside it, and when it closes
 * focus goes back to whatever had it before. If that was nothing in particular, focus goes to the nearest focusable
 * ancestor, so keyboard shortcuts handled there keep working.
 */
export function useModal(ref: RefObject<HTMLElement | null>) {
  // read during the first render: by the time effects run, an autofocused field inside has already taken focus
  const [before] = useState(() => document.activeElement)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const host = el.parentElement?.closest<HTMLElement>('[tabindex]')
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const stops = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!stops.length) { e.preventDefault(); return }
      const first = stops[0], last = stops[stops.length - 1]
      const at = document.activeElement
      if (e.shiftKey && (at === first || !el.contains(at))) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && (at === last || !el.contains(at))) { e.preventDefault(); first.focus() }
    }
    el.addEventListener('keydown', trap)
    return () => {
      el.removeEventListener('keydown', trap)
      // still in the page means this is not a close (StrictMode re-runs effects in development): leave focus alone
      if (el.isConnected) return
      const back = before instanceof HTMLElement && before !== document.body && before.isConnected ? before : host
      back?.focus({ preventScroll: true })
    }
  }, [ref, before])
}
