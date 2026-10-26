import { useEffect, useRef } from 'react'

const N = 16
const IDLE_MS = 3000
const FRAME_MS = 66 // ~15fps keeps it crunchy
const BLINK_MS = 180

/** Whether the face has ink at pixel centre (x, y). */
function ink(x: number, y: number, look: { x: number; y: number }, open: number, thinking: number) {
  const d = Math.hypot(x - 8, y - 8)
  if (d > 7.6) return false
  if (d > 6.5) return true // outline

  // Eyes are 2x3 blocks that step toward where the cursor is.
  const lx = Math.round(look.x)
  const ly = Math.round(look.y)
  for (const ex of [5, 11]) {
    if (Math.abs(x - (ex + lx)) < 1) {
      if (open > 0.5 ? Math.abs(y - (7.5 + ly)) < 1.6 : Math.abs(y - 7.5) < 0.6) return true
    }
    // Brows: the right one lifts when pondering.
    const by = 4.5 - (ex > 8 ? Math.round(thinking) : 0)
    if (Math.abs(x - ex) < 1.6 && Math.abs(y - by) < 0.6) return true
  }

  // Mouth: a small smile, flat when thinking.
  const my = Math.abs(x - 8) > 2 && thinking < 0.5 ? 11.5 : 12.5
  return Math.abs(x - 8) < 2.6 && Math.abs(y - my) < 0.6
}

/** A tiny pixel face: follows the cursor, blinks, and ponders when idle. */
export function PixelFace() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const img = ctx.createImageData(N, N)

    const look = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let thinking = 0
    let lastMove = performance.now()
    let nextBlink = lastMove + 2500
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
        target.x = -0.9
        target.y = -0.9
      }
      look.x += (target.x - look.x) * 0.25
      look.y += (target.y - look.y) * 0.25
      thinking += ((idle ? 1 : 0) - thinking) * 0.1

      if (blinkStart < 0 && now > nextBlink) blinkStart = now
      let open = 1
      if (blinkStart >= 0) {
        const t = (now - blinkStart) / BLINK_MS
        open = t >= 1 ? 1 : Math.abs(1 - t * 2)
        if (t >= 1) {
          blinkStart = -1
          nextBlink = now + 2200 + Math.random() * 3500
        }
      }

      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const on = ink(x + 0.5, y + 0.5, look, open, thinking)
          const i = (y * N + x) * 4
          img.data.set([10, 10, 10, on ? 255 : 0], i)
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
