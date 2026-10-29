import { useEffect, useRef } from 'react'

const N = 16
const IDLE_MS = 3000
const FRAME_MS = 66 // ~15fps keeps it crunchy
const BLINK_MS = 180

/** Whether the face has ink at pixel centre (x, y). */
function ink(x: number, y: number, look: { x: number; y: number }, open: number) {
  const inDisc = (px: number, py: number) => Math.hypot(px - 8, py - 8) <= 7.6
  if (!inDisc(x, y)) return false
  // One pixel outline: disc pixels that touch the outside.
  if (!(inDisc(x - 1, y) && inDisc(x + 1, y) && inDisc(x, y - 1) && inDisc(x, y + 1))) return true

  // Eyes are 2x3 blocks that step toward where the cursor is.
  const lx = Math.round(look.x)
  const ly = Math.round(look.y)
  for (const ex of [5, 11]) {
    if (Math.abs(x - (ex + lx)) < 1) {
      if (open > 0.5 ? Math.abs(y - (7.5 + ly)) < 1.6 : Math.abs(y - 7.5) < 0.6) return true
    }
    // Brows
    if (Math.abs(x - ex) < 1.6 && Math.abs(y - 4.5) < 0.6) return true
  }

  // Mouth: a small smile.
  const my = Math.abs(x - 8) > 2 ? 11.5 : 12.5
  if (Math.abs(x - 8) < 2.6 && Math.abs(y - my) < 0.6) return true
  return false
}

/** Paints one frame of the face; `excited` swaps in raised brows and a wide open grin. */
function drawFace(
  ctx: CanvasRenderingContext2D,
  look: { x: number; y: number },
  open: number,
  excited = false,
) {
  const img = ctx.createImageData(N, N)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let on = ink(x + 0.5, y + 0.5, look, open)
      if (excited) {
        // Open grin: a D-shaped mouth, wide on top and tapering down.
        if (y >= 11 && y <= 13 && Math.abs(x - 7.5) < 4) {
          const half = [3, 2, 1][y - 11]
          on = Math.abs(x - 7.5) < half
        }
      }
      img.data.set([110, 106, 92, on ? 255 : 0], (y * N + x) * 4)
    }
  }
  ctx.putImageData(img, 0, 0)
}

/** A tiny pixel face: follows the cursor, blinks, and rests looking down when idle. */
export function PixelFace() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const img = ctx.createImageData(N, N)

    const look = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let lastMove = performance.now()
    let nextBlink = lastMove + 1250
    let blinkStart = -1

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const vx = e.clientX - (r.left + r.width / 2)
      const vy = e.clientY - (r.top + r.height / 2)
      const m = Math.hypot(vx, vy) || 1
      const k = Math.min(1, m / 160)
      target.x = (vx / m) * k
      target.y = (vy / m) * k
      lastMove = performance.now()
    }

    const draw = (now: number) => {
      const idle = now - lastMove > IDLE_MS
      if (idle) {
        // Resting: gaze down and smiling, still blinking.
        target.x = 0
        target.y = 0.9
      }
      look.x += (target.x - look.x) * 0.25
      look.y += (target.y - look.y) * 0.25

      if (blinkStart < 0 && now > nextBlink) blinkStart = now
      let open = 1
      if (blinkStart >= 0) {
        const t = (now - blinkStart) / BLINK_MS
        open = t >= 1 ? 1 : Math.abs(1 - t * 2)
        if (t >= 1) {
          blinkStart = -1
          nextBlink = now + 1100 + Math.random() * 1750
        }
      }

      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const on = ink(x + 0.5, y + 0.5, look, open)
          const i = (y * N + x) * 4
          img.data.set([110, 106, 92, on ? 255 : 0], i)
        }
      }
      ctx.putImageData(img, 0, 0)
    }

    draw(performance.now())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < FRAME_MS) return
      last = now
      draw(now)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="pixel-face" width={N} height={N} aria-hidden="true" />
}
