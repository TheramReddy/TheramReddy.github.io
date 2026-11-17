import { useEffect, useRef } from 'react'
import { reducedMotion } from '@/lib/motion'
import { smoothScroll } from '@/lib/sheets'
import { getSmoother, setMeSection, type MeSection } from '@/lib/me-section'
import { Intro } from './Intro'
import { Playground } from './Playground'
import { Foot, Work } from './Sections'

/**
 * The whole site on one dark scrolling page: the intro, the playground, the work, the footer.
 * `covered` is set while a case study is open over the page.
 */
export function Home({ covered }: { covered: boolean }) {
  const panel = useRef<HTMLElement>(null)

  // the wheel glides (reduced motion keeps the scroll 1:1)
  useEffect(() => {
    const root = panel.current
    const content = root?.querySelector<HTMLElement>('.inner')
    if (!root || !content || reducedMotion()) return
    return smoothScroll(root, content)
  }, [])

  // a case study opened over the page holds the smoothing so wheel input goes to the case study
  useEffect(() => {
    if (covered) getSmoother()?.stop()
    else { getSmoother()?.start(); window.dispatchEvent(new Event('home-uncovered')) }
  }, [covered])

  // blocks marked [data-rise] come up once, the first time they scroll into view
  useEffect(() => {
    const root = panel.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }),
      { root, rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    root.querySelectorAll('[data-rise]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // the nav marks the section crossing the middle of the screen
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
    <section ref={panel} className="panel me home open" aria-label="Portfolio" inert={covered}>
      <div className="inner">
        <div data-nav="me"><Intro /></div>
        <Playground />
        <Work />
        <Foot />
      </div>
    </section>
  )
}
