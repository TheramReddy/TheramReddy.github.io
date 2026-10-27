import { useEffect, useRef, useState } from 'react'

const IDLE_MS = 1800
const LAND_SCALE = 0.35 // keep in step with --land in loader.css

// The small passenger who hops out after landing.
const GUY = ['.###.', '#...#', '#...#', '.###.', '#####', '.#.#.', '.#.#.']

// A little rocket, nose up, with a porthole. '#' is ink, '.' is empty. The flame is drawn below it.
const ROCKET = [
  '.......##.......',
  '......####......',
  '.....######.....',
  '.....######.....',
  '....########....',
  '....########....',
  '....########....',
  '....###..###....',
  '....##....##....',
  '....##....##....',
  '....###..###....',
  '....########....',
  '...##########...',
  '..############..',
  '..##.######.##..',
  '..##.######.##..',
  '.....######.....',
  '....##....##....',
]
const W = 16
const FLAME_ROWS = 8
const H = ROCKET.length + FLAME_ROWS
const PX = 5 // canvas pixel size on screen, keep in step with loader.css

type Burn = 'idle' | 'boost' | 'off'

function drawRocket(ctx: CanvasRenderingContext2D, spin: number, burn: Burn) {
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#6e6a5c'
  ROCKET.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === '#') ctx.fillRect(x, y, 1, 1)
  })
  // Exhaust under the nozzle: a short flicker on the pad, a long forked plume when boosting.
  const plume = ['####', '####', '####', '.##.', '.##.', '.##.', '.##.', spin ? '..#.' : '.#..']
  const len = burn === 'off' ? 0 : burn === 'boost' ? (spin ? 8 : 6) : spin ? 3 : 2
  for (let i = 0; i < len; i++) {
    const row = i === len - 1 && len > 3 ? (spin ? '..#.' : '.#..') : plume[i]
    for (let x = 0; x < 4; x++) if (row[x] === '#') ctx.fillRect(6 + x, ROCKET.length + i, 1, 1)
  }
  // Sparks flick off the plume while boosting.
  if (burn === 'boost') ctx.fillRect(spin ? 4 : 11, ROCKET.length + (spin ? 2 : 4), 1, 1)
}

/** Intro: a pixel rocket idles on the pad, then lifts off and lands on the tour's Next button. */
export function Loader() {
  const [go, setGo] = useState(false)
  const [gone, setGone] = useState(false)
  const rocket = useRef<HTMLCanvasElement>(null)
  const guy = useRef<HTMLCanvasElement>(null)
  const fx = useRef<HTMLDivElement>(null)
  const burn = useRef<Burn>('idle')

  useEffect(() => {
    const ctx = rocket.current?.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    drawRocket(ctx, 0, 'idle')
    const g = guy.current?.getContext('2d')
    if (g) {
      g.fillStyle = '#d8d6cf'
      GUY.forEach((row, y) => [...row].forEach((c, x) => c === '#' && g.fillRect(x, y, 1, 1)))
    }
    let n = 0
    const flicker = reduce ? 0 : window.setInterval(() => drawRocket(ctx, ++n % 2 ? 2 : 0, burn.current), 70)
    // Smoke dropped behind the rocket while the booster is firing.
    const trail = reduce
      ? 0
      : window.setInterval(() => {
          const el = rocket.current
          const box = fx.current
          if (!el || !box || burn.current !== 'boost') return
          const r = el.getBoundingClientRect()
          const b = document.createElement('b')
          b.className = 'trail'
          b.style.left = `${r.left + r.width / 2 - 5 + (Math.random() * 8 - 4)}px`
          b.style.top = `${r.bottom - r.height * 0.25}px`
          b.addEventListener('animationend', () => b.remove())
          box.appendChild(b)
        }, 70)
    const t = setTimeout(() => {
      // Blast off, curve over to the tour card and touch down on its Next button.
      const el = rocket.current
      const next = document.querySelector('.tour-next') ?? document.querySelector('[data-tour="me"]')
      if (el && next) {
        const a = el.getBoundingClientRect()
        const b = next.getBoundingClientRect()
        // It lands upright. The nozzle bell ends (ROCKET.length - H / 2) canvas pixels below the canvas centre, and the
        // canvas shrinks about its centre as it lands.
        const landX = b.left + b.width / 2 - 15 // the passenger lands 30px to the right, so this centres the pair on the button
        const dx = landX - (a.left + a.width / 2)
        const dy = b.top - (ROCKET.length - H / 2) * PX * LAND_SCALE - (a.top + a.height / 2)
        el.style.setProperty('--dx', `${dx}px`)
        el.style.setProperty('--dy', `${dy}px`)
        fx.current?.style.setProperty('--gx', `${landX}px`)
        fx.current?.style.setProperty('--gy', `${b.top}px`)
      }
      burn.current = 'boost'
      setTimeout(() => (burn.current = 'off'), reduce ? 0 : 1950)
      setGo(true)
      setTimeout(() => setGone(true), 4200)
    }, reduce ? 600 : IDLE_MS)
    return () => {
      clearTimeout(t)
      clearInterval(flicker)
      clearInterval(trail)
    }
  }, [])

  return (
    <>
    <div className={go ? 'loader done' : 'loader'} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((n) => (
        <b key={n} className="puff" style={{ animationDelay: `${0.12 + n * 0.1}s` }} />
      ))}
      <i />
      <i />
      <i />
    </div>
    {!gone && (
      <canvas
        ref={rocket}
        className={go ? 'loader-rocket go' : 'loader-rocket'}
        width={W}
        height={H}
        aria-hidden="true"
      />
    )}
    {!gone && (
      <div ref={fx} className={go ? 'loader-fx go' : 'loader-fx'} aria-hidden="true">
        <canvas ref={guy} className="loader-guy" width={5} height={7} />
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <b key={n} className="poof" />
        ))}
      </div>
    )}
    </>
  )
}
