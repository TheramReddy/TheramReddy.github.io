import Lenis from 'lenis'
import Snap from 'lenis/snap'
import { flowTop, setSmoother } from '@/lib/me-section'

const clamp = (v: number) => Math.min(1, Math.max(0, v))
// a soft ease-in-out, so each block starts and settles gently under the scroll
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
/** Progress through [from, to] of a sheet's arrival, eased. */
const span = (a: number, from: number, to: number) => ease(clamp((a - from) / (to - from)))

const sheetsOf = (page: HTMLElement) => [...page.querySelectorAll<HTMLElement>('.me-first, .me-more > section')]

/**
 * The wheel glides: Lenis eases the page's scroll so the stacked sheets slide instead of stepping (touch keeps its own
 * momentum). A scroll that stops just short of (or just past) a screen glides the last stretch into place; anywhere else
 * it stays where the reader left it, so a short nudge is never pulled back. A sheet taller than the screen settles at
 * its top and its bottom.
 */
export function smoothScroll(page: HTMLElement, content: HTMLElement) {
  const lenis = new Lenis({ wrapper: page, content, lerp: 0.085, wheelMultiplier: 0.9, autoRaf: true })
  const snap = new Snap(lenis, { type: 'proximity', distanceThreshold: '15%', duration: 0.9, debounce: 180 })
  setSmoother(lenis)

  let points: (() => void)[] = []
  const place = () => {
    points.forEach((remove) => remove())
    // phones don't stack the sections, so they have no hand-offs to settle on
    if (innerWidth <= 760) return void (points = [])
    points = sheetsOf(page).flatMap((s) => {
      const top = flowTop(page, s)
      const end = top + s.offsetHeight - page.clientHeight
      return end > top ? [snap.add(top), snap.add(end)] : [snap.add(top)]
    })
  }
  const ro = new ResizeObserver(place)
  ro.observe(content)
  place()

  return () => {
    ro.disconnect()
    snap.destroy()
    setSmoother(null)
    lenis.destroy()
  }
}

/**
 * Stacks the screens (desktop). A sheet taller than the screen pins once its bottom reaches the bottom (--stick), so
 * none of it is hidden. With `motion`, the content moves with the scroll: each sheet's arrival runs 0 → 1 as its top
 * travels from the bottom of the screen to the top; its heading rises in first and its body a beat behind, and the
 * sheet beneath sinks back on that same arrival. Positions come from the page flow, since a pinned sheet no longer
 * sits where it scrolls to. Blocks at rest carry no inline style, so tooltips and hovers inside behave as before.
 */
export function stackSheets(page: HTMLElement, motion: boolean) {
  const sheets = sheetsOf(page).map((el) => ({
    el,
    head: el.querySelector<HTMLElement>(':scope > .hero, :scope > .me-head'),
    body: el.querySelector<HTMLElement>(':scope > [data-reveal]:not(.me-head), :scope > .jobs'),
    top: 0,
  }))
  let height = 0
  const measure = () => {
    height = page.clientHeight
    sheets.forEach((s) => {
      s.top = flowTop(page, s.el)
      s.el.style.setProperty('--stick', `${Math.min(0, height - s.el.offsetHeight)}px`)
    })
  }

  const set = (el: HTMLElement | null, rise: number, sink: number) => {
    if (!el) return
    if (rise === 1 && sink === 0) {
      el.style.opacity = el.style.transform = ''
      return
    }
    el.style.opacity = String(rise * (1 - sink))
    el.style.transform = `translateY(${(1 - rise) * 56 - sink * height * 0.08}px) scale(${1 - sink * 0.04})`
  }

  let frame = 0
  const draw = () => {
    frame = 0
    if (!motion) return
    const y = page.scrollTop
    // the hero is on screen from the start, so it arrives already in place
    const arrival = sheets.map((s, i) => (i === 0 ? 1 : clamp((y - (s.top - height)) / height)))
    sheets.forEach((s, i) => {
      const sink = span(arrival[i + 1] ?? 0, 0, 1)
      set(s.head, span(arrival[i], 0.25, 0.9), sink)
      set(s.body, span(arrival[i], 0.4, 1), sink)
    })
  }
  const queue = () => {
    if (!frame) frame = requestAnimationFrame(draw)
  }
  const ro = new ResizeObserver(() => {
    measure()
    queue()
  })
  ro.observe(page)
  sheets.forEach((s) => ro.observe(s.el))
  measure()
  draw()
  page.addEventListener('scroll', queue, { passive: true })

  return () => {
    cancelAnimationFrame(frame)
    ro.disconnect()
    page.removeEventListener('scroll', queue)
    sheets.forEach((s) => {
      s.el.style.removeProperty('--stick')
      ;[s.head, s.body].forEach((el) => el && (el.style.opacity = el.style.transform = ''))
    })
  }
}
