import { useCallback, useRef, useState, type ReactNode } from 'react'
import { NowStatus } from '@/components/layout/NowStatus'
import { RocketFlight, RocketPad } from '@/components/layout/Rocket'
import { Tour } from '@/components/layout/Tour'

/** One tile in the grid: the live component on top, its name and a one-line hint below. */
function Tile({ name, hint, wide, children }: { name: string; hint: string; wide?: boolean; children: ReactNode }) {
  return (
    <li className={wide ? 'fun-tile wide' : 'fun-tile'}>
      <div className="fun-stage">{children}</div>
      <p className="fun-name">{name}</p>
      <p className="fun-hint">{hint}</p>
    </li>
  )
}

/** The pad rocket lifts off, curves over and lands on the Next button of the site tour, which opens beneath it. */
function RocketTour() {
  const pad = useRef<HTMLCanvasElement>(null)
  const [from, setFrom] = useState<DOMRect | null>(null)
  const [tour, setTour] = useState(false)
  const closeTour = useCallback(() => setTour(false), [])
  const land = () => { setFrom(null); closeTour() }
  const flying = !!from

  const launch = () => {
    if (flying || !pad.current) return
    setTour(true)
    // wait a frame so the tour card (the landing spot) is on screen before the rocket measures it
    requestAnimationFrame(() => pad.current && setFrom(pad.current.getBoundingClientRect()))
  }

  return (
    <>
      <div className="fx-rocket">
        <RocketPad hidden={flying} canvasRef={pad} />
        <button className="fx-launch" onClick={launch} disabled={flying}>Launch</button>
      </div>
      {from && <RocketFlight from={from} target=".tour-next" onDone={land} />}
      <Tour open={tour} onClose={closeTour} />
    </>
  )
}

/** Small interactive pieces I build for fun. */
export function FunComponents() {
  const [open, setOpen] = useState(false)
  return (
    <div className={open ? 'fun open' : 'fun'}>
      <div className="fun-head">
        <button className="fun-toggle" aria-expanded={open} aria-controls="fun-body" onClick={() => setOpen((o) => !o)}>
          <span className="fun-label"><span className="cs-eyebrow">Fun components</span></span>
          <span className="fun-chev"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </button>
      </div>
      <div className="fun-body" id="fun-body" inert={!open}>
        <div className="fun-inner">
          <p className="fun-intro">Go on, poke them.</p>
          <ul className="fun-grid">
            <Tile name="Rocket and site tour" hint="Launch it, it lands on the tour"><RocketTour /></Tile>
            <Tile name="What I'm up to" hint="Changes with my day" wide><NowStatus /></Tile>
          </ul>
        </div>
      </div>
    </div>
  )
}
