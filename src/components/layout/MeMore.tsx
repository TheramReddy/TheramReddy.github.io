import { useEffect, useRef } from 'react'
import { CaseList } from '@/components/panels/CaseList'

/** The rest of the page below the hero: the case studies, one full screen. */
export function MeMore() {
  const section = useRef<HTMLElement>(null)

  // marks the section [data-live] while it is on screen, so the village scene only animates when seen
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.toggleAttribute('data-live', e.isIntersecting), {
      rootMargin: '0px 0px -12% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="me-more">
      <section className="me-cases" ref={section} aria-labelledby="me-cases-h" data-nav="projects">
        <header className="me-head" data-reveal="">
          <h2 id="me-cases-h">Case studies</h2>
        </header>
        <div data-reveal="">
          <CaseList />
        </div>
      </section>
    </div>
  )
}
