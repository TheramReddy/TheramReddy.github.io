import { useEffect, useRef } from 'react'
import { Hero } from '@/components/layout/Hero'
import { MeMore } from '@/components/layout/MeMore'
import { smoothScroll, stackSheets } from '@/lib/sheets'
import { getSmoother, setMeSection, type MeSection } from '@/lib/me-section'

/**
 * The whole site on one page: the hero holds the first screen, and scrolling on shows how I work, my jobs and the
 * case studies. `covered` is set while a case study is open over it.
 */
export function MePanel({ covered }: { covered: boolean }) {
  const panel = useRef<HTMLElement>(null)
  // the wheel glides (reduced motion keeps the scroll 1:1)
  useEffect(() => {
    const root = panel.current
    const content = root?.querySelector<HTMLElement>('.inner')
    if (!root || !content || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return smoothScroll(root, content)
  }, [])

  // on desktop the screens stack, their content moving with the scroll unless motion is reduced; phones read it still
  useEffect(() => {
    const root = panel.current
    if (!root) return
    const desk = matchMedia('(min-width: 761px)')
    const still = matchMedia('(prefers-reduced-motion: reduce)')
    let stop: (() => void) | undefined
    const apply = () => {
      stop?.()
      stop = desk.matches ? stackSheets(root, !still.matches) : undefined
    }
    apply()
    desk.addEventListener('change', apply)
    still.addEventListener('change', apply)
    return () => {
      desk.removeEventListener('change', apply)
      still.removeEventListener('change', apply)
      stop?.()
    }
  }, [])

  // a case study opened over the page holds the smoothing so wheel input goes to the case study
  useEffect(() => {
    if (covered) getSmoother()?.stop()
    else getSmoother()?.start()
  }, [covered])

  // the nav marks the section on screen. Sheets stay pinned under the ones covering them, so the last section (in
  // page order) that crosses the middle of the screen is the one in view.
  useEffect(() => {
    const root = panel.current
    if (!root) return
    const targets = [...root.querySelectorAll<HTMLElement>('[data-nav]')]
    const crossing = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? crossing.add(e.target) : crossing.delete(e.target)
        const top = targets.filter((t) => crossing.has(t)).pop()
        if (top) setMeSection(top.dataset.nav as MeSection)
      },
      { root, rootMargin: '-50% 0px -50% 0px' },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={panel} className="panel me open" aria-label="About me" inert={covered}>
      <div className="inner">
        <div className="me-first" data-nav="me">
          <Hero />
          <p className="me-cue" aria-hidden="true">
            Keep scrolling for the longer version
            <svg viewBox="0 0 12 28"><path d="M6 1 V25 M1.5 20.5 L6 25 L10.5 20.5" /></svg>
          </p>
        </div>
        <MeMore />
      </div>
    </section>
  )
}
