import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { reducedMotion } from '@/lib/motion'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const ROW = 40

/** every month from `from` to `to` (each [year, month 0–11]), with a few either side to fade into */
function span(from: [number, number], to: [number, number], pad = 5) {
  const first = from[0] * 12 + from[1] - pad
  const last = to[0] * 12 + to[1] + pad
  return Array.from({ length: last - first + 1 }, (_, i) => {
    const n = first + i
    return { year: Math.floor(n / 12), month: n % 12, live: i >= pad && i <= last - first - pad }
  })
}

/**
 * A ruler of months that runs behind a pill showing the one in the middle. It drifts through the project's months
 * while idle; moving the pointer up and down the well (or the arrow keys) scrubs it by hand.
 */
export function Timeline({ from, to }: { from: [number, number]; to: [number, number] }) {
  const pad = 5
  const rows = span(from, to, pad)
  const count = rows.length - pad * 2
  const [at, setAt] = useState(0)
  const [held, setHeld] = useState(false)
  const well = useRef<HTMLDivElement>(null)

  // idle: step a month at a time, only while on screen
  useEffect(() => {
    const el = well.current
    if (!el || held || reducedMotion()) return
    let id = 0
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id)
      if (e.isIntersecting) id = window.setInterval(() => setAt((a) => (a + 1) % count), 1500)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); window.clearInterval(id) }
  }, [held, count])

  const scrub = (e: React.PointerEvent) => {
    const el = well.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const k = Math.min(1, Math.max(0, (e.clientY - r.top - 40) / (r.height - 80)))
    setHeld(true)
    setAt(Math.round(k * (count - 1)))
  }
  const keys = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    setHeld(true)
    setAt((a) => Math.min(count - 1, Math.max(0, a + step)))
  }

  const now = rows[at + pad]
  return (
    <div
      className="tile-shot timeline" ref={well} role="slider" tabIndex={0} aria-label="Project timeline"
      aria-valuemin={0} aria-valuemax={count - 1} aria-valuenow={at} aria-valuetext={`${MONTHS[now.month]} ${now.year}`}
      onPointerMove={scrub} onPointerLeave={() => setHeld(false)} onKeyDown={keys} onBlur={() => setHeld(false)}
    >
      <div className="tl-mask"><ol className="tl-ruler" style={{ '--y': `${-(at + pad) * ROW}px` } as CSSProperties} aria-hidden="true">
        {rows.map((m) => (
          <li key={`${m.year}-${m.month}`} data-year={m.month === 0 || undefined} data-off={!m.live || undefined}>
            {m.month === 0 && <span>{m.year}</span>}
            <i /><b /><b /><b />
          </li>
        ))}
      </ol></div>
      <p className="tl-pill" aria-hidden="true">{MONTHS[now.month]} {now.year}</p>
    </div>
  )
}

// the letter, one string per row of cells
const GLYPHS: Record<string, string[]> = {
  T: [
    '#############', '#############', '#############',
    '.....###.....', '.....###.....', '.....###.....', '.....###.....', '.....###.....', '.....###.....',
    '.....###.....', '.....###.....', '.....###.....', '.....###.....', '.....###.....', '.....###.....', '.....###.....',
  ],
}

// a steady pseudo-random number in 0–1 for a cell
const rand = (x: number, y: number, s = 0) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453
  return n - Math.floor(n)
}

/**
 * A field of small squares: scattered dim ones that twinkle, and a letter made of bright ones in the middle.
 * Squares near the pointer are pushed outward and turned, so the pointer leaves a ripple as it crosses.
 */
export function PixelField({ letter, note }: { letter: keyof typeof GLYPHS; note: string }) {
  const well = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const box = well.current
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!box || !cv || !ctx) return
    const still = reducedMotion()
    const glyph = GLYPHS[letter]
    const CELL = 14, GAP = 2, REACH = 78
    let w = 0, h = 0, frame = 0, wait = 0, seen = false
    // the pointer, and where the ripple currently is (it eases after the pointer)
    let px = -999, py = -999, rx = -999, ry = -999
    // the squares are the page's type colour, whichever theme is on
    let tint = '242 242 240'
    const retint = () => { tint = getComputedStyle(box).getPropertyValue('--d-fg-c').trim() || tint; kick() }

    const size = () => {
      const r = box.getBoundingClientRect()
      const dpr = Math.min(2, devicePixelRatio || 1)
      w = r.width
      h = r.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t: number) => {
      frame = 0
      ctx.clearRect(0, 0, w, h)
      rx += (px - rx) * 0.16
      ry += (py - ry) * 0.16
      const cols = Math.floor(w / CELL), rows = Math.floor(h / CELL)
      const ox = (w - cols * CELL) / 2, oy = (h - rows * CELL) / 2
      const gx = Math.floor((cols - glyph[0].length) / 2), gy = Math.floor((rows - glyph.length) / 2)
      const beat = Math.floor(t / 900)
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const lit = glyph[y - gy]?.[x - gx] === '#'
          let a: number
          if (lit) a = 0.96
          else {
            // about one cell in six shows, and each of those changes brightness now and then
            if (rand(x, y) > 0.17) continue
            const phase = Math.floor(rand(x, y, 3) * 7)
            a = 0.1 + rand(x, y, Math.floor((beat + phase) / 3)) * 0.32
          }
          let cx = ox + x * CELL + CELL / 2, cy = oy + y * CELL + CELL / 2
          let turn = 0, scale = 1
          const dx = cx - rx, dy = cy - ry
          const d = Math.hypot(dx, dy)
          if (d < REACH) {
            const k = (1 - d / REACH) ** 2
            cx += (dx / (d || 1)) * k * 16
            cy += (dy / (d || 1)) * k * 16
            turn = k * 0.9 * (rand(x, y, 9) > 0.5 ? 1 : -1)
            scale = 1 - k * 0.35
            a *= 1 - k * 0.55
          }
          const s = (CELL - GAP) * scale
          ctx.fillStyle = `rgb(${tint} / ${a.toFixed(3)})`
          if (turn) {
            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(turn)
            ctx.fillRect(-s / 2, -s / 2, s, s)
            ctx.restore()
          } else ctx.fillRect(cx - s / 2, cy - s / 2, s, s)
        }
      }
      // off screen, or under an open case study, the field pauses
      if (!seen || still || document.querySelector('.detail.open')) return
      // every frame while the ripple is catching up with the pointer; otherwise once per beat, when the twinkle changes
      if (Math.abs(px - rx) > 0.5 || Math.abs(py - ry) > 0.5) frame = requestAnimationFrame(draw)
      else wait = window.setTimeout(kick, 900 - (t % 900))
    }
    const kick = () => { clearTimeout(wait); if (!frame) frame = requestAnimationFrame(draw) }

    const move = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      px = e.clientX - r.left
      py = e.clientY - r.top
      if (still) { rx = px; ry = py }
      kick()
    }
    const leave = () => { px = py = -999; kick() }
    const ro = new ResizeObserver(() => { size(); kick() })
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) kick() })
    size()
    retint()
    ro.observe(box)
    io.observe(box)
    window.addEventListener('home-uncovered', kick)
    window.addEventListener('themechange', retint)
    box.addEventListener('pointermove', move)
    box.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(wait)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('home-uncovered', kick)
      window.removeEventListener('themechange', retint)
      box.removeEventListener('pointermove', move)
      box.removeEventListener('pointerleave', leave)
    }
  }, [letter])

  return (
    <div className="tile-shot pixels" ref={well}>
      <canvas ref={canvas} aria-hidden="true" />
      <p className="pixels-note"><i />{note}</p>
    </div>
  )
}
