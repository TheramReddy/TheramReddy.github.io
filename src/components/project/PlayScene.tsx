import { useEffect, useRef } from 'react'
import { reducedMotion } from '@/lib/motion'
import { useTheme } from '@/lib/theme'
import { H, PLATE, W, floor, render, scenes, setPalette, type Gfx } from './playScenes'

const FRAME_MS = 83
const FADE = 0.45

/**
 * One problem acted out as a small isometric pixel scene. It loops, fading through the card colour
 * between rounds, and it only runs while it is on screen, in a case study that is open, in a visible tab.
 * It is painted in the palette of the theme that is on, and painted again when the theme changes.
 */
export function PlayScene({ scene }: { scene: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  useEffect(() => {
    setPalette(theme === 'light')
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    const spec = scenes[scene]
    if (!cv || !ctx || !spec) return

    // the floor never changes, so it is drawn once and copied each frame
    const ground = document.createElement('canvas')
    ground.width = W
    ground.height = H
    const gctx = ground.getContext('2d')!
    let last = ''
    const to = (c2: CanvasRenderingContext2D): Gfx => ({
      rect: (x, y, w, h, c) => {
        if (c !== last) { c2.fillStyle = c; last = c }
        c2.fillRect(x, y, w, h)
      },
    })
    floor(to(gctx))
    const g = to(ctx)

    const frame = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(ground, 0, 0)
      last = ''
      render(g, scene, t)
      // fade in at the start of a round and out at its end, so the reset never shows
      const a = spec.still !== undefined ? 0 : 1 - Math.min(t / FADE, (spec.loop - t) / FADE, 1)
      if (a > 0) {
        ctx.globalAlpha = a
        ctx.fillStyle = PLATE
        ctx.fillRect(0, 0, W, H)
        ctx.globalAlpha = 1
        last = ''
      }
    }

    // stills are drawn once; reduced motion gets a calm solved frame
    if (spec.still !== undefined) { frame(spec.still); return }
    if (reducedMotion()) { frame(spec.loop - FADE - 0.2); return }

    const detail = cv.closest('.detail')
    let t = 0
    let base = 0
    let id = 0
    let seen = false
    const live = () => seen && !document.hidden && !!detail?.classList.contains('open')
    const tick = () => { t = ((performance.now() - base) / 1000) % spec.loop; frame(t) }
    const sync = () => {
      if (live() && !id) { base = performance.now() - t * 1000; id = window.setInterval(tick, FRAME_MS) }
      else if (!live() && id) { clearInterval(id); id = 0 }
    }

    frame(0)
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync() }, { threshold: 0.2 })
    io.observe(cv)
    const mo = detail ? new MutationObserver(sync) : null
    if (detail) mo?.observe(detail, { attributes: true, attributeFilter: ['class'] })
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      mo?.disconnect()
      document.removeEventListener('visibilitychange', sync)
      clearInterval(id)
    }
  }, [scene, theme])

  return <canvas ref={ref} className="play-scene" width={W} height={H} aria-hidden="true" />
}
