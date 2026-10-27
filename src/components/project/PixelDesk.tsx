import { useEffect, useRef } from 'react'

export const W = 64
export const H = 48
const FRAME_MS = 140 // slow, chunky typing
const BLINK_MS = 280

export const INK = '#0a0a0a'
export const SHIRT = '#3d3a2e'
export const SKIN = '#efeeea'
export const LIGHT = '#d6d3c8'
export const MID = '#9a978a'
export const SCREEN = '#f7f6f2'

export function drawDesk(ctx: CanvasRenderingContext2D, tick: number, blink: boolean) {
  const r = (c: string, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
  }
  ctx.clearRect(0, 0, W, H)

  // floor
  r(LIGHT, 2, 46, 60, 1)

  // chair: back, seat, stem, base
  r(MID, 8, 18, 3, 17)
  r(MID, 8, 34, 15, 3)
  r(MID, 14, 37, 2, 6)
  r(MID, 8, 43, 15, 2)
  r(INK, 8, 45, 2, 1)
  r(INK, 21, 45, 2, 1)

  // legs: thigh under the desk, shin, shoe
  r(SHIRT, 14, 34, 19, 3)
  r(SHIRT, 30, 37, 4, 7)
  r(INK, 29, 44, 9, 2)

  // torso and typing arm
  r(INK, 14, 17, 10, 17)
  r(SHIRT, 16, 19, 4, 9)
  r(SHIRT, 16, 27, 17, 3)
  const bob = tick % 2
  r(SKIN, 32 + bob, 28, 3, 2)

  // head: skin, hair, eye, mouth
  r(SKIN, 17, 6, 9, 10)
  r(SKIN, 26, 9, 1, 3)
  r(INK, 17, 5, 9, 2)
  r(INK, 16, 6, 3, 8)
  r(INK, 19, 7, 5, 1)
  if (blink) r(INK, 23, 11, 3, 1)
  else r(INK, 24, 10, 1, 3)
  r(INK, 24, 14, 2, 1)
  r(SKIN, 19, 16, 3, 2) // neck

  // desk and drawer
  r(INK, 28, 31, 35, 3)
  r(INK, 59, 34, 3, 12)
  r(MID, 40, 34, 17, 6)
  r(INK, 47, 36, 3, 1)

  // keyboard
  r(LIGHT, 32, 30, 11, 1)

  // monitor: bezel, screen, stand, scrolling code lines
  r(INK, 38, 7, 19, 19)
  r(SCREEN, 40, 9, 15, 15)
  r(INK, 46, 26, 3, 3)
  r(INK, 42, 29, 11, 2)
  const lens = [9, 12, 7, 10, 5, 12, 8, 6]
  const off = Math.floor(tick / 2)
  for (let i = 0; i < 5; i++) {
    const len = lens[(i + off) % lens.length]
    r(i % 2 ? MID : INK, 42 + (i % 3 === 1 ? 2 : 0), 11 + i * 2, len, 1)
  }
  if (tick % 4 < 2) r(INK, 42, 21 + 1, 1, 1)

  // mug with steam
  r(MID, 58, 26, 4, 5)
  r(MID, 62, 27, 1, 3)
  r(LIGHT, 59, tick % 4 < 2 ? 22 : 23, 1, 2)
  r(LIGHT, 61, tick % 4 < 2 ? 23 : 22, 1, 2)
}

/** A pixel person at a desk, typing at a monitor. Fills the space of an unfinished case study. */
export function PixelDesk() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return

    let tick = 0
    let nextBlink = performance.now() + 2000
    let blinkStart = -1

    const frame = (now: number) => {
      if (blinkStart < 0 && now > nextBlink) blinkStart = now
      let blink = false
      if (blinkStart >= 0) {
        blink = now - blinkStart < BLINK_MS
        if (!blink) {
          blinkStart = -1
          nextBlink = now + 2000 + Math.random() * 3000
        }
      }
      drawDesk(ctx, tick, blink)
    }

    frame(performance.now())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      tick++
      frame(performance.now())
    }, FRAME_MS)
    return () => window.clearInterval(id)
  }, [])

  return <canvas ref={ref} className="pixel-desk" width={W} height={H} aria-hidden="true" />
}
