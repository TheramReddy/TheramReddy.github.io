import { useEffect, useState } from 'react'
import { site } from '@/data/site'

/* The front door of the app: the signature in the middle with who I am under it, one way in, and a line at the
   foot of the screen that says it asks for nothing. */

/** The sign-in screen, the same size as the app it opens. `onEnter` is called once the way in has been chosen. */
export function SignIn({ onEnter }: { onEnter: () => void }) {
  const [going, setGoing] = useState(false)

  // a short beat after the press, so entering reads as a hand-off rather than a swap
  useEffect(() => {
    if (!going) return
    const id = window.setTimeout(onEnter, 720)
    return () => window.clearTimeout(id)
  }, [going, onEnter])

  return (
    <div className="toy door" role="group" data-way={going || undefined} aria-label="Sign in">
      <div className="door-glow" aria-hidden="true" />
      <div className="door-grid" aria-hidden="true" />
      <div className="door-body">
        <img className="door-sign" src="/brand/logo.svg" alt={site.name} width={152} height={40} draggable={false} />
        <p className="door-hint">{site.role}</p>
        <div className="door-ways">
          <button type="button" className="door-btn is-main" disabled={going} onClick={() => setGoing(true)}>
            {going && <i className="door-spin" aria-hidden="true" />}
            <span>{going ? 'Opening' : 'Continue as guest'}</span>
          </button>
        </div>
      </div>
      <p className="door-foot">No credentials needed.</p>
    </div>
  )
}
