import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '@/components/layout/Hero'
import { MeMore } from '@/components/layout/MeMore'
import { scrollToSection, sectionOf, setMeSection, type MeSection } from '@/lib/me-section'

/**
 * The whole site on one page: the hero holds the first screen, and scrolling on shows how I work, my jobs and the
 * case studies. /work and /projects land on their sections; `covered` is set while a case study is open over it.
 */
export function MePanel({ covered }: { covered: boolean }) {
  const panel = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const first = useRef(true)

  // a path names a section: go there, straight away on first load and smoothly after that
  useEffect(() => {
    const section = sectionOf(pathname)
    if (!section) return
    const smooth = !first.current
    first.current = false
    requestAnimationFrame(() => scrollToSection(section, smooth))
  }, [pathname])

  // the nav marks whichever section fills most of the screen
  useEffect(() => {
    const root = panel.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setMeSection((e.target as HTMLElement).dataset.nav as MeSection)
      },
      { root, rootMargin: '-50% 0px -50% 0px' },
    )
    root.querySelectorAll('[data-nav]').forEach((el) => io.observe(el))
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
