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
  return (
    <div className="fun">
      <p className="cs-eyebrow">Fun components</p>
      <p className="fun-intro">Little things I made for fun. Go on, poke them.</p>
      <ul className="fun-grid">
        <Tile name="Rocket and site tour" hint="Launch it, it lands on the tour"><RocketTour /></Tile>
        <Tile name="What I'm up to" hint="Changes with my day" wide><NowStatus /></Tile>
      </ul>
    </div>
  )
}
