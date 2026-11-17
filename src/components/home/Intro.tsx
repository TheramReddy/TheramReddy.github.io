import { Fragment, useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { site } from '@/data/site'
import { scrollToSection } from '@/lib/me-section'
import { reducedMotion } from '@/lib/motion'
import { useSeen } from '@/lib/use-seen'
import { Flap, Pill, Prompt, WAYS } from '@/components/layout/Hero'

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/* under the pointer the portrait turns to blocks: this many across */
const COLS = 20
/* the badge on its lanyard is a spring: stiffness, damping, and the furthest it may swing (px) */
const PULL = 60, DRAG = 3, REACH = 44, PUSH = 340
/* the cord gives a little too: how hard it pulls the dropped badge back, and how soon the settle dies */
const SNAP = 150, GIVE = 9
/* the portrait leads: the badge drops this long after it starts to develop, the statement starts this long after,
   then lands a word at a time, each this long after the one before (ms) */
const DROP = 900, WAIT = 500, BEAT = 30
/* the build plays only where there is room and a mouse */
const roomy = () => window.matchMedia('(min-width: 1000px) and (hover: hover) and (pointer: fine)').matches

/** How the live words start: 'paced' waits for the statement to land around them, 'quick' starts at once. */
type Arm = 'paced' | 'quick'

/**
 * The landing: one quiet take.
 * Nothing shows until the portrait is in. Then it develops: wiped in from the bottom while it settles from large and
 * soft to sharp, with the pool of light blooming under it. Just behind, the badge is let go at the neck on its cord,
 * slides down, overshoots a touch and sways to rest; the statement follows a word at a time. Afterwards the portrait
 * turns to blocks under the pointer, the badge can be batted (it tips as it swings and comes back square, so the
 * pixel type rests crisp), and the pool of light leans towards the pointer. `onOpen` fires when the statement should
 * start to land and `onArm` when its live words should start. With reduced motion none of this runs and everything
 * is simply there.
 *
 * On a wide screen with a mouse, the same pieces are instead put together by a team of pointers:
 * see build.ts. There the portrait arrives as blocks that resolve, and the badge is hung last.
 */
function useLanding(stage: RefObject<HTMLElement | null>, fig: RefObject<HTMLDivElement | null>, onOpen: () => void, onArm: (how: Arm) => void) {
  useLayoutEffect(() => {
    const root = stage.current, el = fig.current
    const img = el?.querySelector('img')
    const cv = el?.querySelector<HTMLCanvasElement>('.intro-pixels')
    const cord = el?.querySelector('.badge-cord path')
    const card = el?.querySelector<HTMLElement>('.badge-card')
    const px = cv?.getContext('2d')
    if (!root || !el || !img || !cv || !cord || !card || !px || reducedMotion()) return

    const timers: number[] = []
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)) }
    const rafs = { blocks: 0, swing: 0 }

    // ---- the badge on its cord: x is the swing, y the bounce (0 is rest; the cord's own length above is the neck)
    let x = 0, v = 0, y = 0, vy = 0, last = 0, width = 1, cordLong = 1
    const draw = () => {
      const stretch = 1 + clamp(Math.abs(vy) / 3000, 0, 0.1)
      el.style.setProperty('--sx', `${x.toFixed(1)}px`)
      el.style.setProperty('--sy', `${y.toFixed(1)}px`)
      el.style.setProperty('--st', stretch.toFixed(3))
      el.style.setProperty('--sr', `${clamp(-v / 30, -9, 9).toFixed(2)}deg`)
      const fx = 50 + (x / width) * 100, fy = 100 + (y / cordLong) * 100
      cord.setAttribute('d', `M36 0 L${fx.toFixed(2)} ${fy.toFixed(2)} M64 0 L${fx.toFixed(2)} ${fy.toFixed(2)}`)
    }
    const swing = (t: number) => {
      // a frame's time can be earlier than the moment the swing was started: never step backwards
      const dt = clamp((t - last) / 1000, 0, 0.032)
      last = t
      v += (-PULL * x - DRAG * v) * dt
      x = clamp(x + v * dt, -REACH, REACH)
      vy += (-SNAP * y - GIVE * vy) * dt
      y += vy * dt
      if (Math.abs(x) < 0.4 && Math.abs(v) < 5 && Math.abs(y) < 0.4 && Math.abs(vy) < 5) { x = v = y = vy = 0; rafs.swing = 0; draw(); return }
      draw()
      rafs.swing = requestAnimationFrame(swing)
    }
    const move = () => {
      if (rafs.swing) return
      width = el.offsetWidth || 1
      cordLong = (img.offsetHeight || 1) * 0.245
      last = performance.now()
      rafs.swing = requestAnimationFrame(swing)
    }
    const kick = (by: number) => { v = clamp(v + by, -PUSH, PUSH); move() }
    // the drop: the tag starts up at the neck and is let go, a little to one side
    const drop = () => {
      cordLong = (img.offsetHeight || 1) * 0.245
      y = -cordLong
      vy = 0
      kick(110)
      draw()
    }
    const bat = (e: PointerEvent) => { if (e.pointerType === 'mouse') kick(e.movementX * 16) }
    const tap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      const r = card.getBoundingClientRect()
      kick(e.clientX < r.left + r.width / 2 ? 240 : -240)
    }

    // ---- the light and the lean
    const look = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', clamp((e.clientX - r.left - r.width / 2) / (window.innerWidth / 2), -1, 1).toFixed(3))
      el.style.setProperty('--my', clamp((e.clientY - r.top - r.height / 2) / (window.innerHeight / 2), -1, 1).toFixed(3))
    }
    const rest = () => { el.style.setProperty('--mx', '0'); el.style.setProperty('--my', '0') }

    // ---- the portrait as blocks: each has a colour, a size from 0 to 1 (heat), and a time until which it holds
    let cell = 1, rows = 1, dpr = 1, blast = 0, free = Infinity
    let fill: (string | null)[] = [], heat = new Float32Array(0), until = new Float32Array(0)
    const measure = () => {
      const w = el.offsetWidth || 1, h = img.offsetHeight || 1
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cell = w / COLS
      rows = Math.ceil(h / cell)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      return h / cell
    }
    const sample = () => {
      const tall = measure()
      const low = document.createElement('canvas')
      low.width = COLS
      low.height = rows
      const lx = low.getContext('2d')
      heat = new Float32Array(COLS * rows)
      until = new Float32Array(COLS * rows)
      fill = Array.from({ length: COLS * rows }, () => null)
      try {
        lx!.drawImage(img, 0, 0, COLS, tall)
        const d = lx!.getImageData(0, 0, COLS, rows).data
        fill = fill.map((_, k) => (d[k * 4 + 3] > 110 ? `rgb(${d[k * 4]} ${d[k * 4 + 1]} ${d[k * 4 + 2]})` : null))
      } catch { /* a portrait that failed to load has no blocks; everything else still plays */ }
    }
    const blocks = (now: number) => {
      const dt = Math.min(now - blast, 50)
      blast = now
      px.clearRect(0, 0, cv.width, cv.height)
      let hot = false
      for (let k = 0; k < heat.length; k++) {
        const paint = fill[k]
        if (!paint || heat[k] <= 0) continue
        if (now > until[k]) heat[k] -= dt / 380
        if (heat[k] <= 0) continue
        hot = true
        // four sizes only, so a block steps down instead of gliding
        const size = cell * dpr * Math.ceil(heat[k] * 4) / 4
        const cx = (k % COLS + 0.5) * cell * dpr, cy = (Math.floor(k / COLS) + 0.5) * cell * dpr
        px.fillStyle = paint
        px.fillRect(Math.round(cx - size / 2), Math.round(cy - size / 2), Math.ceil(size), Math.ceil(size))
      }
      rafs.blocks = hot ? requestAnimationFrame(blocks) : 0
    }
    const wake = () => { if (!rafs.blocks) { blast = performance.now(); rafs.blocks = requestAnimationFrame(blocks) } }
    // the pointer turns the portrait back to blocks where it passes
    const brush = (e: PointerEvent) => {
      const now = performance.now()
      if (e.pointerType !== 'mouse' || now < free) return
      const r = cv.getBoundingClientRect()
      const gx = (e.clientX - r.left) / cell, gy = (e.clientY - r.top) / cell
      for (let row = Math.max(0, Math.floor(gy - 3)); row <= Math.min(rows - 1, gy + 3); row++) {
        for (let col = Math.max(0, Math.floor(gx - 3)); col <= Math.min(COLS - 1, gx + 3); col++) {
          const d = Math.hypot(col + 0.5 - gx, row + 0.5 - gy), k = row * COLS + col
          if (d > 2.4 || 1 - d / 3 < heat[k]) continue
          heat[k] = 1 - d / 3
          until[k] = now + 90
        }
      }
      wake()
    }
    const resize = () => { measure(); wake() }
    // the whole portrait as blocks, each letting go at its own moment
    const mosaic = () => {
      const now = performance.now()
      for (let k = 0; k < heat.length; k++) if (fill[k]) { heat[k] = 1; until[k] = now + 250 + Math.random() * 550 }
      free = now + 1200
      wake()
    }
    const hang = () => { drop(); el.dataset.badge = 'in' }

    el.dataset.state = 'loading'

    // the portrait develops (in CSS), the badge drops onto it, and the statement follows
    const open = () => {
      el.dataset.state = 'sharp'
      onOpen()
      onArm('paced')
      sample()
      free = performance.now() + 1700
      later(hang, DROP)
    }

    // or the team builds it: the stage starts as an empty wireframe, and the build calls each piece in
    const crewed = roomy()
    if (crewed) root.dataset.build = ''
    let stop = () => {}
    const crew = () => import('./build').then(({ build }) => {
      if (off) return
      stop = build(root, {
        type: onOpen,
        art: () => { el.dataset.state = 'built'; sample(); mosaic() },
        chips: () => onArm('quick'),
        badge: hang,
      })
    }).catch(() => { delete root.dataset.build; open() })

    // all of it waits for the portrait to be in (or to have failed to load), and for the tab to be the one in front
    let off = false
    const start = () => {
      if (off) return
      if (document.hidden) { document.addEventListener('visibilitychange', start, { once: true }); return }
      void (crewed ? crew : open)()
    }
    img.decode().catch(() => {}).then(start)

    card.addEventListener('pointermove', bat)
    card.addEventListener('pointerdown', tap)
    el.addEventListener('pointermove', brush)
    root.addEventListener('pointermove', look)
    root.addEventListener('pointerleave', rest)
    window.addEventListener('resize', resize)
    return () => {
      off = true
      document.removeEventListener('visibilitychange', start)
      stop()
      delete root.dataset.build
      timers.forEach(clearTimeout)
      Object.values(rafs).forEach(cancelAnimationFrame)
      card.removeEventListener('pointermove', bat)
      card.removeEventListener('pointerdown', tap)
      el.removeEventListener('pointermove', brush)
      root.removeEventListener('pointermove', look)
      root.removeEventListener('pointerleave', rest)
      window.removeEventListener('resize', resize)
      delete el.dataset.state
      delete el.dataset.badge
      for (const name of ['--sx', '--sy', '--st', '--sr']) el.style.removeProperty(name)
    }
  }, [stage, fig, onOpen, onArm])
}

/** The opening screen, as two cards: the portrait wearing the role on an ID badge, and the statement beside it. */
export function Intro() {
  const stage = useRef<HTMLElement>(null)
  const fig = useRef<HTMLDivElement>(null)
  const say = useRef<HTMLParagraphElement>(null)
  const [opened, setOpened] = useState(reducedMotion)
  const [arm, setArm] = useState<Arm | null>(() => (reducedMotion() ? 'paced' : null))
  const open = useCallback(() => setOpened(true), [])
  useLanding(stage, fig, open, setArm)
  // the statement lands once the portrait has started to develop and it is on screen (on a phone, once scrolled to)
  // with reduced motion the line counts as seen from the start
  const go = useSeen(say, { threshold: 0.25, start: reducedMotion() }) && opened

  // every word, chip and the link below take a number, in reading order
  let i = 0
  const nth = () => ({ '--i': i++ }) as CSSProperties
  // a live word plays just after it has landed; switched on by the build, it plays at once
  const live = go && arm !== null
  const landed = () => (arm === 'quick' ? 0 : WAIT + i * BEAT + 650)
  const words = (text: string) => text.split(' ').map((word) => {
    const style = nth()
    return <Fragment key={i}><span className="w" style={style}>{word}</span>{' '}</Fragment>
  })

  return (
    <header className="intro" ref={stage} data-read={go ? 'go' : 'wait'} style={{ '--wait': `${WAIT}ms`, '--beat': `${BEAT}ms` } as CSSProperties}>
      {/* the page's heading: the badge on the portrait says it for the eye */}
      <h1 className="sr-only">{site.name}, {site.role}</h1>
      <div className="intro-card is-me">
        <div className="intro-figure" ref={fig}>
          {/* the wireframe's box for the portrait: it stays behind it, faint */}
          <i className="intro-ghost" aria-hidden="true" />
          {/* the frame the portrait is wiped into on landing */}
          <div className="intro-art">
            <img src="/me/portrait.webp" alt={`A low-poly 3D portrait of ${site.firstName}: curly hair, glasses, a green cardigan over a blue jumper`} width={896} height={1200} fetchPriority="high" draggable={false} />
            {/* the portrait as blocks, wherever the pointer passes */}
            <canvas className="intro-pixels" aria-hidden="true" />
          </div>
          {/* a glint on the ear stud, every few seconds */}
          <svg className="intro-stud" viewBox="-12 -12 24 24" aria-hidden="true">
            <path d="M0 -11 C1 -3 3 -1 11 0 C3 1 1 3 0 11 C-1 3 -3 1 -11 0 C-3 -1 -1 -3 0 -11Z" />
          </svg>
          {/* the role, on an ID badge: a lanyard from both sides of the neck, a clip, and a pixel-cornered card */}
          <div className="badge" aria-hidden="true">
            <svg className="badge-cord" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M36 0 L50 100 M64 0 L50 100" />
            </svg>
            <i className="badge-clip" />
            <div className="badge-card">
              <i className="badge-slot" />
              <b>product<br />designer</b>
              <i className="badge-bars" />
            </div>
          </div>
        </div>
      </div>

      <div className="intro-card intro-text">
        <p className="say" ref={say}>
          {words('The best interface is one')}
          {/* the draft is the phrase the build types first and then takes back */}
          <span className="w is-chip is-plain" style={nth()}><i className="draft" aria-hidden="true">that looks good</i><Pill>nobody notices</Pill>.</span>{' '}
          {words('You open it,')}
          <em className="w" style={nth()}>finish</em>{' '}
          {words('what you came to do, and get on with your day. I design everything that makes that possible: the')}
          <span className="w is-chip is-live" style={nth()}><Flap word="FLOW" armed={live} delay={landed()} />,</span>{' '}
          {words('the layout, the')}
          <span className="keep">{words('moment')}<span className="w is-chip is-live" style={nth()}><Prompt lines={WAYS} armed={live} delay={landed()} />.</span></span>
        </p>
        <button type="button" className="say-link" style={nth()} onClick={() => scrollToSection('projects')}>see my work<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></button>
      </div>
    </header>
  )
}
