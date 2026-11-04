import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '@/data/projects'

/*
 * The case studies as an ink-wash village seen from a little above, shared by the Projects panel and the Me page.
 * A road runs on the diagonal from the near foreground to the horizon past three stops: a farmhouse close by, a
 * storehouse under a pine in the middle distance, and a pagoda beyond a torii far off. A traveller walks it, smaller
 * and slower the further they go, resting at each stop and lighting its lantern. The scene is painted on stacked
 * layers that shift against each other with the pointer, so the near ground moves more than the hills. Each stop is
 * a link with a red "Read case study" flag planted at its foot, named for its case study for screen readers; pointing at or focusing one sends the traveller there.
 */

type P = [number, number]
const W = 1200
const H = 520
// a high horizon: the eye sits above the village and looks down across it
const HORIZON = 130

// the road is painted on its own sheet, set this far right and down in the scene; PATH is measured with it there
const ROAD_AT: P = [120, 60]
// the painted footpath's centre, measured from the painting row by row (near to far, in scene units)
const PATH: P[] = [
  [330, 570], [390, 510], [430, 460], [505, 415], [562, 376], [600, 352], [668, 322], [712, 300], [734, 284],
  [732, 270], [718, 255], [710, 240], [735, 223], [780, 212], [840, 200], [888, 185], [895, 166], [915, 148], [958, 132],
]
// a smooth curve through the traced points (Catmull-Rom, as cubic segments)
const SEGS: [P, P, P, P][] = PATH.slice(0, -1).map((p1, i) => {
  const p0 = PATH[i - 1] ?? p1
  const p2 = PATH[i + 1]
  const p3 = PATH[i + 2] ?? p2
  return [
    p1,
    [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
    [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
    p2,
  ]
})

const bez = (s: [P, P, P, P], t: number): P => {
  const u = 1 - t
  const [a, b, c, d] = s
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ]
}

// the centre line sampled into points with running length, so anything can be placed by how far along it is
const road: { x: number; y: number; len: number }[] = []
for (const s of SEGS) {
  for (let i = road.length ? 1 : 0; i <= 60; i++) {
    const [x, y] = bez(s, i / 60)
    const prev = road[road.length - 1]
    road.push({ x, y, len: prev ? prev.len + Math.hypot(x - prev.x, y - prev.y) : 0 })
  }
}
const TOTAL = road[road.length - 1].len

/** the point a fraction of the way along the road, with its direction */
function along(f: number) {
  const target = Math.max(0, Math.min(1, f)) * TOTAL
  let i = road.findIndex((p) => p.len >= target)
  if (i <= 0) i = 1
  const a = road[i - 1]
  const b = road[i]
  const k = (target - a.len) / (b.len - a.len || 1)
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, dx: b.x - a.x, dy: b.y - a.y }
}

// nearness: 0 at the horizon, 1 at the foot of the scene; it sets how large things are and how wide the road is
const near = (y: number) => Math.max(0, Math.min(1, (y - HORIZON) / (H - HORIZON)))
const sizeAt = (y: number) => 0.2 + 0.95 * near(y)
const widthAt = (y: number) => 3 + 280 * Math.pow(near(y), 1.35)

/** half the road's width measured across the screen, wider where the road runs on the slant */
function reach(f: number) {
  const p = along(f)
  const n = Math.hypot(p.dx, p.dy) || 1
  return (widthAt(p.y) / 2) * Math.min(3, n / (Math.abs(p.dy) || 1e-3))
}

// the painted pieces (ink on transparency, in /public/village) and how wide each stands, in scene units, up close
const art = {
  farm: { src: '/village/farm.webp', w: 720, h: 595, size: 240 },
  kura: { src: '/village/kura.webp', w: 560, h: 613, size: 160 },
  pagoda: { src: '/village/pagoda.webp', w: 420, h: 1005, size: 190 },
  pine: { src: '/village/pine.webp', w: 720, h: 763, size: 270 },
  torii: { src: '/village/torii.webp', w: 480, h: 624, size: 130 },
  hills: { src: '/village/hills.webp', w: 1792, h: 401, size: 1040 },
  road: { src: '/village/road.webp', w: 1800, h: 771, size: 1200 },
}
type Art = keyof typeof art
const tallOf = (a: Art) => (art[a].size * art[a].h) / art[a].w

// the three stops: how far along the road, which side, which painting, where its lantern hangs (as a fraction of
// the painting) and which layer it sits on
const stops = (
  [
    { f: 0.28, side: 1, gap: 10, art: 'farm', lamp: [0.1, 0.56], depth: 0.85 },
    { f: 0.58, side: -1, gap: 8, art: 'kura', lamp: [0.86, 0.62], depth: 0.5 },
    { f: 0.93, side: 1, gap: 4, art: 'pagoda', lamp: [0.86, 0.9], depth: 0.5 },
  ] as const
).map((s) => {
  const p = along(s.f)
  const k = sizeAt(p.y)
  const half = art[s.art].size / 2
  const x = p.x + s.side * (reach(s.f) + (s.gap + half) * k)
  return { ...s, half, tall: tallOf(s.art), x, y: p.y + 4, k }
})

// the cranes: a loose line of five, each flapping on its own beat (offset from the lead, size, beat in seconds)
const cranes = [
  [0, 0, 1, 1.0],
  [-40, -12, 0.92, 1.12],
  [-78, -22, 0.86, 0.96],
  [-44, 14, 0.95, 1.06],
  [-86, 26, 0.88, 1.18],
] as const
const FLIGHT = 26 // seconds to cross from the near sky into the far hills
const CRANE_W = 46 // a crane's width in scene units, up close

const SPEED = 46 // road units a second at the very front; further off, the same walk covers less of the screen
const DWELL = 2.8 // seconds spent at each stop

// the layers, back to front, and how far each one shifts with the pointer
const DEPTH = { sky: 0.05, hills: 0.15, mist: 0.25, ground: 0.5, near: 0.85 }

/** a painting standing on its foot at the given point, scaled by k; it inks in o seconds into the reveal */
function Piece({ a, x, y, k, o }: { a: Art; x: number; y: number; k: number; o: number }) {
  const w = art[a].size
  const h = tallOf(a)
  return (
    <g
      className={`vl-ink-in vl-${a}`}
      style={{ '--o': o } as CSSProperties}
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k.toFixed(3)})`}
    >
      <image href={art[a].src} x={-w / 2} y={-h * 0.97} width={w} height={h} />
    </g>
  )
}

function Layer({ d, className, children }: { d: number; className?: string; children: ReactNode }) {
  return (
    <div className={`vl-layer${className ? ` ${className}` : ''}`} style={{ '--d': d } as CSSProperties}>
      <svg viewBox={`0 0 ${W} ${H}`}>{children}</svg>
    </div>
  )
}

export function CaseList() {
  const id = useId().replace(/:/g, '')
  const u = (name: string) => `url(#${id}-${name})`
  const root = useRef<HTMLDivElement>(null)
  const walker = useRef<SVGGElement>(null)
  const flock = useRef<SVGGElement>(null)
  // the stop a pointer or focus is asking for; null lets the walk run on its own
  const want = useRef<number | null>(null)
  const resume = useRef(() => {})

  useEffect(() => {
    const el = root.current
    const who = walker.current
    const birds = flock.current
    if (!el || !who || !birds) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const marks = stops.map((s) => s.f)

    let f = still ? marks[0] : 0
    let leg = 0 // next stop on the walk; marks.length means walking on to the horizon
    let rest = 0
    let facing = 1
    let live = false
    let frame = 0
    let last = 0
    // the view: where the pointer asks it to look, and where it has eased to
    let aim: [number, number] | null = null
    const view: [number, number] = [0, 0]
    let clock = 0
    // the painting inks itself in the first time the scene is seen; the traveller sets off once it has dried
    let painted = false
    let wait = still ? 0 : 1.2
    const panel = el.closest('.panel')
    // the cranes cross now and then: the first a few seconds after the painting dries, then every 30 to 40 seconds
    let flying = -1
    let nextFlight = 5

    const place = (walking: boolean) => {
      const p = along(f)
      const k = sizeAt(p.y)
      // the traveller steps in at the front and thins into the haze over the last stretch of road
      const fade = f > 0.95 ? Math.max(0, (1 - f) / 0.05) : f < 0.03 ? f / 0.03 : 1
      who.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${(facing * k).toFixed(3)} ${k.toFixed(3)})`)
      who.style.opacity = fade.toFixed(2)
      el.dataset.at = String(marks.findIndex((m) => Math.abs(m - f) < 0.002))
      el.toggleAttribute('data-walking', walking)
    }

    const tick = (t: number) => {
      frame = 0
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 0
      last = t
      clock += dt
      if (!painted && (!panel || panel.classList.contains('open'))) {
        painted = true
        el.dataset.painted = ''
      }
      if (painted && wait > 0) wait -= dt

      const goal = want.current !== null ? marks[want.current] : leg < marks.length ? marks[leg] : 1
      const gap = goal - f
      let walking = false
      if (still) {
        if (want.current !== null) f = goal
      } else if (!painted || wait > 0) {
        // still drying: stay at the near edge of the road
      } else if (Math.abs(gap) > 0.0008) {
        const step = (SPEED * sizeAt(along(f).y) * dt) / TOTAL
        f += Math.sign(gap) * Math.min(Math.abs(gap), step)
        const dir = along(f).dx * Math.sign(gap)
        if (Math.abs(dir) > 0.05) facing = Math.sign(dir)
        rest = 0
        walking = true
      } else if (want.current === null) {
        f = goal
        rest += dt
        if (leg >= marks.length) {
          // gone over the horizon: a new traveller sets out from the front
          f = 0
          leg = 0
        } else if (rest > DWELL) {
          leg += 1
          rest = 0
        }
      }
      place(walking)

      // the flock flies from the near sky into the far hills, smaller and paler as it goes, then is gone
      if (painted && !still) {
        if (flying < 0 && wait <= 0 && (nextFlight -= dt) <= 0) flying = 0
        if (flying >= 0) {
          flying += dt / FLIGHT
          if (flying >= 1) {
            flying = -1
            nextFlight = 30 + Math.random() * 10
            birds.style.opacity = '0'
          } else {
            const x = -120 + 980 * flying
            const y = 74 + 40 * flying + Math.sin(flying * 7) * 6
            const k = 1 - 0.68 * flying
            const show = Math.min(1, flying / 0.08) * (flying > 0.7 ? (1 - flying) / 0.3 : 1)
            birds.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k.toFixed(3)})`)
            birds.style.opacity = (0.85 * show).toFixed(2)
          }
        }
      }

      // without a pointer the view sways a little on its own, so the depth still shows
      if (!still) {
        const [ax, ay] = aim ?? [Math.sin(clock / 6) * 0.6, Math.sin(clock / 8.5) * 0.4]
        view[0] += (ax - view[0]) * Math.min(1, dt * 3)
        view[1] += (ay - view[1]) * Math.min(1, dt * 3)
        el.style.setProperty('--px', view[0].toFixed(3))
        el.style.setProperty('--py', view[1].toFixed(3))
      }
      if (live) frame = requestAnimationFrame(tick)
    }

    // when a pointer or focus lets go, the walk carries on to the next stop ahead
    resume.current = () => {
      leg = marks.findIndex((m) => m > f + 0.001)
      if (leg < 0) leg = marks.length
      rest = 0
    }

    const look = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      aim = [((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1]
    }
    const away = () => (aim = null)
    el.addEventListener('pointermove', look)
    el.addEventListener('pointerleave', away)

    // only walks and sways while the scene is on screen
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting
      last = 0
      if (live && !frame) frame = requestAnimationFrame(tick)
    })
    io.observe(el)
    place(false)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', look)
      el.removeEventListener('pointerleave', away)
    }
  }, [])

  const go = (i: number | null) => () => {
    want.current = i
    if (i === null) resume.current()
  }

  const [farm, kura, pagoda] = stops
  const torii = along(0.82)
  const tk = sizeAt(torii.y)
  const pine = along(0.4)
  const pk = sizeAt(pine.y)
  // the pine leans over the paddies on the near side of the road, clear of the farmhouse
  const px = pine.x - reach(0.4) - 120 * pk
  const lamp = (s: (typeof stops)[number], i: number) => (
    <circle
      className="vl-glow"
      data-i={i}
      cx={s.x + (s.lamp[0] - 0.5) * art[s.art].size * s.k}
      cy={s.y - (1 - s.lamp[1]) * s.tall * s.k}
      r={Math.max(10, 26 * s.k)}
      fill={`url(#${id}-glow)`}
    />
  )

  return (
    <div className="vl" ref={root}>
      <div className="vl-stage">
        <Layer d={DEPTH.sky}>
          <defs>
            <filter id={`${id}-haze`} x="-30%" y="-100%" width="160%" height="300%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            {/* the hills thin out to nothing at both ends, so the range melts into the paper instead of stopping */}
          <linearGradient id={`${id}-sides`}>
            <stop offset="0" stopColor="#000" />
            <stop offset=".22" stopColor="#fff" />
            <stop offset=".8" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id={`${id}-melt`} maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill={`url(#${id}-sides)`} />
          </mask>
          {/* a soft-edged sweep that uncovers the road from its near end to its far end */}
            <linearGradient id={`${id}-sweep`}>
              <stop offset=".44" stopColor="#fff" />
              <stop offset=".56" stopColor="#000" />
            </linearGradient>
            <mask id={`${id}-reveal`} maskUnits="userSpaceOnUse" x="-400" y="-400" width="2000" height="1400">
              <g transform="rotate(-24 600 300)">
                <rect className="vl-reveal" x="-1600" y="-600" width="3200" height="1600" fill={`url(#${id}-sweep)`} />
              </g>
            </mask>
            <radialGradient id={`${id}-glow`}>
              <stop offset="0" stopColor="#e0563c" stopOpacity=".95" />
              <stop offset=".25" stopColor="#c8432e" stopOpacity=".55" />
              <stop offset="1" stopColor="#c8432e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="vl-sun vl-ink-in" style={{ '--o': 3 } as CSSProperties} cx="1068" cy="64" r="24" />
        </Layer>

        {/* far ranges, paler with distance, their feet lost in mist */}
        <Layer d={DEPTH.hills}>
          <image className="vl-hills vl-ink-in" mask={u('melt')} style={{ '--o': 0 } as CSSProperties} href={art.hills.src} x="-30" y="-44" width={art.hills.size} height={tallOf('hills')} />
        </Layer>

        {/* cranes in a loose line; four painted wing positions crossfade on each bird's own beat */}
      <Layer d={DEPTH.mist}>
        <g ref={flock} className="vl-flock" style={{ opacity: 0 }}>
          {cranes.map(([dx, dy, s, beat], i) => (
            <g key={i} transform={`translate(${dx} ${dy}) scale(${s})`}>
              <g className="vl-crane" style={{ '--beat': `${beat}s`, '--ph': `${-i * 0.37}s` } as CSSProperties}>
                {[0, 1, 2, 3].map((f) => (
                  <image
                    key={f}
                    href={`/village/crane-${f}.webp`}
                    x={-CRANE_W * 0.975}
                    y={-CRANE_W * 0.475}
                    width={CRANE_W}
                    height={CRANE_W * 0.98}
                    style={{ '--f': f } as CSSProperties}
                  />
                ))}
              </g>
            </g>
          ))}
        </g>
      </Layer>

      {/* mist drifting across the feet of the hills */}
        <Layer d={DEPTH.mist} className="vl-mist">
          <g filter={u('haze')} fill="#fff">
            <ellipse cx="220" cy="200" rx="280" ry="22" />
            <ellipse cx="840" cy="206" rx="320" ry="18" />
            <ellipse cx="520" cy="220" rx="240" ry="14" opacity=".8" />
          </g>
        </Layer>

        {/* the footpath on bare paper, then the pagoda, torii, storehouse and pine along it */}
        <Layer d={DEPTH.ground}>
          <image className="vl-road" mask={u('reveal')} href={art.road.src} x={ROAD_AT[0]} y={ROAD_AT[1]} width={art.road.size} height={tallOf('road')} />
          <Piece a="pagoda" x={pagoda.x} y={pagoda.y} k={pagoda.k} o={2.6} />
          {lamp(pagoda, 2)}
          {/* the painting stands its gate a little left of centre, so it is nudged right to straddle the road */}
          <Piece a="torii" x={torii.x + 40} y={torii.y + 2} k={tk} o={2.3} />
          <Piece a="kura" x={kura.x} y={kura.y} k={kura.k} o={1.8} />
          {lamp(kura, 1)}
          <Piece a="pine" x={px} y={pine.y + 6} k={pk} o={1.3} />
        </Layer>

        {/* the traveller walks on the land's layer: sedge hat, bundle, walking staff */}
        <Layer d={DEPTH.ground} className="vl-walk">
          <g ref={walker} className="vl-walker">
            <image className="vl-stride" href="/village/walker.webp" x="-12.5" y="-61" width="25" height="61" />
          </g>
        </Layer>

        {/* close by: the farmhouse under its deep thatch */}
        <Layer d={DEPTH.near}>
          <Piece a="farm" x={farm.x} y={farm.y} k={farm.k} o={1} />
          {lamp(farm, 0)}
        </Layer>

        <ol className="vl-stops">
          {projects.slice(0, 3).map((p, i) => {
            const s = stops[i]
            const style = {
              '--d': s.depth,
              left: `${((s.x - s.half * s.k) / W) * 100}%`,
              width: `${((2 * s.half * s.k) / W) * 100}%`,
              top: `${((s.y - s.tall * s.k) / H) * 100}%`,
              height: `${((s.tall * s.k) / H) * 100}%`,
            } as CSSProperties
            return (
              <li key={p.slug} style={style}>
                <Link
                  to={`/project/${p.slug}`}
                  className="vl-stop"
                  data-i={i}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && go(i)()}
                  onPointerLeave={go(null)}
                  onFocus={go(i)}
                  onBlur={go(null)}
                >
                  <span className="vl-flag">
                    <span className="vl-pennant">
                      Read case study
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 17 17 7M8 7h9v9" />
                      </svg>
                    </span>
                    {/* a washi slip tied under the pennant: the company's logo, what kind of work it is, and the summary;
                        it unrolls on hover, on focus, and where the traveller rests */}
                    <span className="vl-peek" aria-hidden="true">
                      <span className="vl-peek-paper">
                        {p.logo && <img className="vl-peek-logo" src={p.logo} alt="" />}
                        <span className="vl-peek-tag">{p.tag}</span>
                        <span className="vl-peek-sum">{p.summary}</span>
                      </span>
                    </span>
                  </span>
                  <span className="sr-only">: {p.title}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
