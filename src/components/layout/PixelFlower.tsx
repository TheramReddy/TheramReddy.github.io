import { useEffect, useRef } from 'react'

const N = 40
const C = (N - 1) / 2
// outer petal, outer edge, inner petal, ring, seeds
const [PETAL, PETAL_EDGE, INNER, RING, SEED] = [[226, 156, 160], [196, 122, 130], [236, 200, 150], [240, 224, 170], [120, 84, 76]]

/** A pixel-art flower drawn on a tiny canvas, slowly turning. The canvas is scaled up with pixelated rendering. */
export function PixelFlower() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const img = ctx.createImageData(N, N)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    const draw = (t: number) => {
      const rot = t / 4000
      const d = img.data
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const dx = x - C, dy = y - C
          const r = Math.hypot(dx, dy)
          const a = Math.atan2(dy, dx) + rot
          const outer = 17 * (0.5 + 0.5 * Math.cos(8 * a)) ** 0.7 + 3
          const inner = 11 * (0.5 + 0.5 * Math.cos(8 * (a + Math.PI / 8) - rot * 2)) ** 0.7 + 2
          let col: number[] | null = null
          if (r < 3.2) col = SEED
          else if (r < 5.5) col = RING
          else if (r < inner + 3) col = INNER
          else if (r < outer) col = r > outer - 1.6 ? PETAL_EDGE : PETAL
          const i = (y * N + x) * 4
          if (col) { d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255 }
          else d[i + 3] = 0
        }
      }
      ctx.putImageData(img, 0, 0)
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={ref} className="pixel-flower" width={N} height={N} role="img" aria-label="A pixel flower turning slowly" />
}
