import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { site } from '@/data/site'
import { scrollToSection } from '@/lib/me-section'
import { Flap, Pill, Prompt, WAYS } from '@/components/layout/Hero'

const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/* the curtain over the opening screen is a grid of squares this big (px); the portrait is this many blocks across */
const CELL = 48, COLS = 20
/* the badge on its lanyard is a spring: stiffness, damping, and the furthest it may swing (px) */
const PULL = 60, DRAG = 2.2, REACH = 44, PUSH = 340
/* the cord is elastic too: how hard it pulls the dropped badge back, and how soon the bounce dies */
const SNAP = 150, GIVE = 5.5
/* the statement lands a word at a time: a pause, then each word this long after the one before (ms) */
const WAIT = 250, BEAT = 30

/**
 * The landing: everything resolves from pixels.
 * A curtain of squares covers the opening screen until the portrait is in, then it breaks away left to right.
 * Behind it the portrait is built of blocks that shrink away in the same sweep, then the badge drops like a cartoon:
 * let go at the neck on an elastic cord, it stretches as it falls, overshoots, bounces and sways to rest. Afterwards
 * the portrait turns back to blocks under the pointer, the badge can be batted (it tips as it swings and comes back
 * square, so the pixel type rests crisp), and the pool of light leans towards the pointer. `onOpen` fires as the curtain starts to break. With reduced motion none of this runs.
 */
function useLanding(stage: RefObject<HTMLElement | null>, fig: RefObject<HTMLDivElement | null>, onOpen: () => void) {
  useLayoutEffect(() => {
    const root = stage.current, el = fig.current
    const img = el?.querySelector('img')
    const veil = root?.querySelector<HTMLCanvasElement>('.intro-veil')
    const cv = el?.querySelector<HTMLCanvasElement>('.intro-pixels')
    const cord = el?.querySelector('.badge-cord path')
    const card = el?.querySelector<HTMLElement>('.badge-card')
    const vx = veil?.getContext('2d'), px = cv?.getContext('2d')
    if (!root || !el || !img || !veil || !cv || !cord || !card || !vx || !px || still()) return

    const timers: number[] = []
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)) }
    const rafs = { veil: 0, blocks: 0, swing: 0 }

    // ---- the badge on its cord: x is the swing, y the bounce (0 is rest; the cord's own length above is the neck)
    let x = 0, v = 0, y = 0, vy = 0, last = 0, width = 1, cordLong = 1
    const draw = () => {
      const stretch = 1 + clamp(Math.abs(vy) / 2400, 0, 0.28)
      el.style.setProperty('--sx', `${x.toFixed(1)}px`)
      el.style.setProperty('--sy', `${y.toFixed(1)}px`)
      el.style.setProperty('--st', stretch.toFixed(3))
      el.style.setProperty('--sr', `${clamp(-v / 30, -9, 9).toFixed(2)}deg`)
      const fx = 50 + (x / width) * 100, fy = 100 + (y / cordLong) * 100
      cord.setAttribute('d', `M36 0 L${fx.toFixed(2)} ${fy.toFixed(2)} M64 0 L${fx.toFixed(2)} ${fy.toFixed(2)}`)
    }
    const swing = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.032)
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
      kick(170)
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

    // ---- the curtain: one canvas pixel per square, stretched over the opening screen
    const vc = Math.ceil(root.offsetWidth / CELL), vr = Math.ceil(root.offsetHeight / CELL)
    veil.width = vc
    veil.height = vr
    vx.fillStyle = '#0c0c0b'
    vx.fillRect(0, 0, vc, vr)
    root.dataset.land = 'veiled'
    el.dataset.state = 'loading'

    const open = () => {
      const t0 = performance.now()
      root.dataset.land = 'opening'
      el.dataset.state = 'sharp'
      onOpen()

      // the portrait's blocks let go left to right, a little ragged, just behind the curtain
      sample()
      for (let k = 0; k < heat.length; k++) {
        heat[k] = 1
        until[k] = t0 + 250 + (k % COLS) / COLS * 550 + Math.random() * 220 + Math.floor(k / COLS) / rows * 100
      }
      free = t0 + 1500
      wake()
      later(() => { drop(); el.dataset.badge = 'in' }, 1150)

      // each square of the curtain lights for a moment, then is gone
      const due = Float32Array.from({ length: vc * vr }, (_, k) => 80 + (k % vc) / vc * 620 + Math.random() * 260)
      const state = new Uint8Array(vc * vr)
      const part = (now: number) => {
        const t = now - t0
        let left = false
        for (let k = 0; k < due.length; k++) {
          if (state[k] === 2) continue
          const cx = k % vc, cy = Math.floor(k / vc)
          if (t >= due[k]) { vx.clearRect(cx, cy, 1, 1); state[k] = 2; continue }
          left = true
          if (state[k] === 0 && t >= due[k] - 80) { vx.fillStyle = Math.random() < 0.12 ? '#f2f2f0' : '#3a3a38'; vx.fillRect(cx, cy, 1, 1); state[k] = 1 }
        }
        if (left) rafs.veil = requestAnimationFrame(part)
        else { rafs.veil = 0; root.dataset.land = 'open' }
      }
      rafs.veil = requestAnimationFrame(part)
    }

    // the curtain breaks as soon as the portrait is in (or has failed to load)
    let off = false
    img.decode().catch(() => {}).then(() => { if (!off) open() })

    card.addEventListener('pointermove', bat)
    card.addEventListener('pointerdown', tap)
    el.addEventListener('pointermove', brush)
    root.addEventListener('pointermove', look)
    root.addEventListener('pointerleave', rest)
    window.addEventListener('resize', resize)
    return () => {
      off = true
      timers.forEach(clearTimeout)
      Object.values(rafs).forEach(cancelAnimationFrame)
      card.removeEventListener('pointermove', bat)
      card.removeEventListener('pointerdown', tap)
      el.removeEventListener('pointermove', brush)
      root.removeEventListener('pointermove', look)
      root.removeEventListener('pointerleave', rest)
      window.removeEventListener('resize', resize)
      delete root.dataset.land
      delete el.dataset.state
      delete el.dataset.badge
      for (const name of ['--sx', '--sy', '--st', '--sr']) el.style.removeProperty(name)
    }
  }, [stage, fig, onOpen])
}

/** True once the element has been on screen. With reduced motion it is true from the start. */
function useSeen(target: RefObject<HTMLElement | null>) {
  const [seen, setSeen] = useState(still)
  useEffect(() => {
    const el = target.current
    if (!el || seen) return
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) setSeen(true) }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, seen])
  return seen
}

/** The opening screen: the portrait wearing the role on an ID badge. */
export function Intro() {
  const stage = useRef<HTMLElement>(null)
  const fig = useRef<HTMLDivElement>(null)
  const say = useRef<HTMLParagraphElement>(null)
  const [opened, setOpened] = useState(still)
  const open = useCallback(() => setOpened(true), [])
  useLanding(stage, fig, open)
  // the statement lands once the curtain has opened and it is on screen (on a phone, once scrolled to)
  const go = useSeen(say) && opened

  // every word, chip and the link below take a number, in reading order
  let i = 0
  const nth = () => ({ '--i': i++ }) as CSSProperties
  // a live word plays just after it has landed
  const landed = () => WAIT + i * BEAT + 650
  const words = (text: string) => text.split(' ').map((word) => {
    const style = nth()
    return <Fragment key={i}><span className="w" style={style}>{word}</span>{' '}</Fragment>
  })

  return (
    <header className="intro" ref={stage} data-read={go ? 'go' : 'wait'} style={{ '--wait': `${WAIT}ms`, '--beat': `${BEAT}ms` } as CSSProperties}>
      {/* the page's heading: the badge on the portrait says it for the eye */}
      <h1 className="sr-only">{site.name}, {site.role}</h1>
      {/* the curtain of squares, shown only while the page lands */}
      <canvas className="intro-veil" aria-hidden="true" />
      <div className="intro-figure" ref={fig}>
        <img src="/me/portrait.webp" alt={`A low-poly 3D portrait of ${site.firstName}: curly hair, glasses, a green cardigan over a blue jumper`} width={896} height={1200} fetchPriority="high" draggable={false} />
        {/* the portrait as blocks: on landing, and wherever the pointer passes */}
        <canvas className="intro-pixels" aria-hidden="true" />
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

      <div className="intro-text">
        <p className="say" ref={say}>
          {words('I’ve spent')}
          <span className="w is-chip" style={nth()}><Pill>my career</Pill></span>{' '}
          {words('learning how people')}
          <em className="w" style={nth()}>actually</em>{' '}
          {words('use software, and how small decisions keep')}
          <span className="w is-chip" style={nth()}><Flap word="RESHAPING" armed={go} delay={landed()} /></span>{' '}
          {words('the way')}
          <span className="keep">{words('they')}<span className="w is-chip" style={nth()}><Prompt lines={WAYS} armed={go} delay={landed()} />.</span></span>{' '}
          {words('Because a well-crafted experience doesn’t just look good. It makes someone’s day a little easier.')}
        </p>
        <button type="button" className="say-link" style={nth()} onClick={() => scrollToSection('projects')}>see my work<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></button>
      </div>
    </header>
  )
}
