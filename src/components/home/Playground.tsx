import { Suspense, lazy, useEffect, useRef, useState, type RefObject } from 'react'
import { scrollToSection } from '@/lib/me-section'

/* The workspace is by far the heaviest thing on this page: the board, every card of work it holds and the icons
   it draws them with. It is also below the fold, so it is a chunk of its own that only starts loading once the
   section comes near. The placeholder is the same height as the board, so nothing shifts when it arrives. */
const Workspace = lazy(() => import('./Workspace'))

/** True once the element has come within `margin` of the viewport. */
function useNear(target: RefObject<HTMLElement | null>, margin = '800px') {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = target.current
    if (!el || near) return
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) setNear(true) }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [target, near, margin])
  return near
}

/** Playground: my work laid out as a small working app. */
export function Playground() {
  const cell = useRef<HTMLElement>(null)
  const near = useNear(cell)

  return (
    <section className="block play" data-nav="about" aria-label="Playground">
      <div className="col">
        <div className="play-card">
          <figure className="play-cell" ref={cell}>
            <Suspense fallback={<div className="play-hold" />}>
              {near ? <Workspace /> : <div className="play-hold" />}
            </Suspense>
            <figcaption>My work as an app.</figcaption>
          </figure>
        </div>
        <p className="play-more"><button type="button" className="key is-big" onClick={() => scrollToSection('projects')}>See the work</button></p>
      </div>
    </section>
  )
}
