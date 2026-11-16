import { Suspense, lazy, useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { scrollPageTo, scrollToSection } from '@/lib/me-section'
import { SignIn } from './SignIn'

/* The workspace is by far the heaviest thing on this page: the board, every card of work it holds and the icons
   it draws them with. It is a chunk of its own that only loads once someone signs in; until then the page carries
   the door alone. The placeholder is the same height as the board, so nothing shifts when it arrives. */
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

/** Playground: my work laid out as a small working app, behind a sign-in screen that asks for nothing. */
export function Playground() {
  const cell = useRef<HTMLElement>(null)
  const near = useNear(cell)
  const [inside, setInside] = useState(false)
  const enter = useCallback(() => {
    setInside(true)
    // on a phone the app stands as tall as the screen under the menu, so signing in brings it there: its own lists then scroll in full view
    if (cell.current && matchMedia('(max-width: 640px)').matches) scrollPageTo(cell.current, { gap: 72, duration: 0.8 })
  }, [])
  const leave = useCallback(() => setInside(false), [])

  return (
    <section className="block play" data-nav="about" aria-labelledby="play-h">
      <div className="col">
        <h2 className="px" id="play-h">my work as an app</h2>
        <div className="play-card">
          <figure className="play-cell" ref={cell}>
            {!near ? <div className="play-hold" />
              : !inside ? <SignIn onEnter={enter} />
              : <div className="play-in"><Suspense fallback={<div className="play-hold" />}><Workspace onSignOut={leave} /></Suspense></div>}
          </figure>
        </div>
        <p className="play-more"><button type="button" className="key is-big" onClick={() => scrollToSection('projects')}>See the work</button></p>
      </div>
    </section>
  )
}
