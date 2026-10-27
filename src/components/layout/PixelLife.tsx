import { useEffect, useRef } from 'react'
import { drawDesk, H, INK, LIGHT, MID, SCREEN, SHIRT, SKIN, W } from '@/components/project/PixelDesk'

export type Activity = 'work' | 'eat' | 'sleep' | 'walk' | 'cook' | 'read' | 'sketch'

const FRAME_MS = 140 // slow, chunky motion, same beat as the desk scene
const BLINK_MS = 280

type Paint = (color: string, x: number, y: number, w: number, h: number) => void

const floor = (r: Paint) => r(LIGHT, 2, 46, 60, 1)

/** Head in profile, facing right, drawn relative to the seated position; `dx` slides it along. */
function head(r: Paint, dx: number, blink: boolean, mouthOpen = false) {
  r(SKIN, 17 + dx, 6, 9, 10)
  r(SKIN, 26 + dx, 9, 1, 3)
  r(INK, 17 + dx, 5, 9, 2)
  r(INK, 16 + dx, 6, 3, 8)
  r(INK, 19 + dx, 7, 5, 1)
  if (blink) r(INK, 23 + dx, 11, 3, 1)
  else r(INK, 24 + dx, 10, 1, 3)
  if (mouthOpen) r(INK, 24 + dx, 13, 2, 2)
  else r(INK, 24 + dx, 14, 2, 1)
  r(SKIN, 19 + dx, 16, 3, 2)
}

/** Chair, legs, torso and head of someone sitting; each scene adds the arms. */
function sitter(r: Paint, blink: boolean, mouthOpen = false) {
  r(MID, 8, 18, 3, 17)
  r(MID, 8, 34, 15, 3)
  r(MID, 14, 37, 2, 6)
  r(MID, 8, 43, 15, 2)
  r(INK, 8, 45, 2, 1)
  r(INK, 21, 45, 2, 1)
  r(SHIRT, 14, 34, 19, 3)
  r(SHIRT, 30, 37, 4, 7)
  r(INK, 29, 44, 9, 2)
  r(INK, 14, 17, 10, 17)
  head(r, 0, blink, mouthOpen)
}

/** Someone on their feet; `swing` steps the legs and arm, `armsFree` leaves the arm to the scene. */
function stander(r: Paint, blink: boolean, swing: number, armsFree = false) {
  r(SHIRT, 26 + swing, 34, 4, 10)
  r(INK, 26 + swing, 44, 6, 2)
  r(INK, 24, 17, 10, 17)
  head(r, 10, blink)
  r(SHIRT, 28 - swing, 34, 4, 10)
  r(INK, 28 - swing, 44, 6, 2)
  if (!armsFree) {
    r(SHIRT, 27 - swing, 19, 3, 10)
    r(SKIN, 27 - swing, 29, 3, 2)
  }
}

const table = (r: Paint) => {
  r(INK, 28, 31, 35, 3)
  r(INK, 59, 34, 3, 12)
}

function eat(r: Paint, tick: number, blink: boolean) {
  const up = tick % 4 >= 2
  floor(r)
  sitter(r, blink, up)
  table(r)
  r(LIGHT, 40, 29, 12, 2)
  if (tick % 16 < 12) r(MID, 43, 28, 6, 1)
  r(SHIRT, 16, 19, 4, 9)
  if (up) {
    r(SHIRT, 20, 19, 7, 3)
    r(SKIN, 27, 16, 2, 4)
  } else {
    r(SHIRT, 16, 27, 17, 3)
    r(SKIN, 32, 28, 3, 2)
    r(MID, 35, 28, 2, 1)
  }
}

function sketch(r: Paint, tick: number, blink: boolean) {
  const hand = 33 + (tick % 4) * 2
  floor(r)
  sitter(r, blink)
  table(r)
  r(SCREEN, 34, 29, 16, 2)
  for (let i = 0; i < Math.min(14, (tick >> 1) % 16); i++) r(MID, 35 + i, 29 + (i % 2), 1, 1)
  r(SHIRT, 16, 19, 4, 9)
  r(SHIRT, 16, 27, hand - 15, 3)
  r(SKIN, hand, 28, 3, 2)
  r(INK, hand + 3, 26, 1, 3)
}

function read(r: Paint, tick: number, blink: boolean) {
  floor(r)
  r(MID, 56, 16, 2, 30)
  r(LIGHT, 52, 12, 10, 4)
  sitter(r, blink)
  r(SHIRT, 16, 19, 4, 9)
  r(SHIRT, 16, 27, 14, 3)
  r(SKIN, 29, 27, 2, 2)
  r(INK, 30, 17, 12, 13)
  r(SCREEN, 31, 18, 10, 11)
  r(MID, 36, 18, 1, 11)
  for (let i = 0; i < 3; i++) {
    r(MID, 32, 20 + i * 3, 3, 1)
    r(MID, 38, 20 + i * 3, 2, 1)
  }
  if (tick % 10 === 0) r(LIGHT, 36, 18, 4, 11)
}

function sleep(r: Paint, tick: number) {
  r(LIGHT, 3, 38, 58, 3)
  r(INK, 3, 41, 58, 2)
  r(INK, 5, 43, 2, 3)
  r(INK, 57, 43, 2, 3)
  r(MID, 5, 34, 12, 4)
  r(SKIN, 8, 30, 9, 8)
  r(INK, 7, 29, 9, 2)
  r(INK, 7, 30, 2, 7)
  r(INK, 14, 34, 3, 1)
  const rise = tick % 6 < 3 ? 0 : 1 // blanket rises and falls with each breath
  r(MID, 16, 33 - rise, 42, 5 + rise)
  r(INK, 16, 33 - rise, 42, 1)
  for (let i = 0; i < 2; i++) {
    const p = (tick + i * 6) % 12
    const color = p < 8 ? INK : MID
    const x = 22 + p
    const y = 26 - Math.floor(p * 1.5)
    r(color, x, y, 3, 1)
    r(color, x + 1, y + 1, 1, 1)
    r(color, x, y + 2, 3, 1)
  }
}

function walk(r: Paint, tick: number, blink: boolean) {
  floor(r)
  for (let k = 0; k < 3; k++) {
    const tx = ((k * 30 - tick * 2) % 90 + 90) % 90 - 10
    r(LIGHT, tx - 4, 24, 10, 8)
    r(MID, tx, 32, 2, 14)
  }
  for (let k = 0; k < 4; k++) r(MID, ((k * 16 - tick * 2) % 64 + 64) % 64, 47, 4, 1)
  stander(r, blink, [-3, 0, 3, 0][tick % 4])
}

function cook(r: Paint, tick: number, blink: boolean) {
  const stir = tick % 4 < 2 ? 0 : 1
  floor(r)
  r(INK, 38, 32, 26, 3)
  r(INK, 40, 35, 3, 11)
  r(INK, 59, 35, 3, 11)
  r(MID, 46, 26, 10, 6)
  r(INK, 46, 26, 10, 1)
  r(LIGHT, 49, tick % 4 < 2 ? 20 : 21, 1, 3)
  r(LIGHT, 53, tick % 4 < 2 ? 21 : 20, 1, 3)
  stander(r, blink, 0, true)
  r(SHIRT, 28, 22, 10, 3)
  r(SKIN, 38 + stir, 22, 2, 3)
  r(MID, 46 + stir, 23, 1, 5)
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

/** Ordered dither: every painted pixel becomes ink or paper, so tone shows as stippling instead of flat colour. */
function dither(ctx: CanvasRenderingContext2D) {
  const img = ctx.getImageData(0, 0, W, H)
  const d = img.data
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4
      if (!d[i + 3]) continue
      const light = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255
      const ink = light < (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16
      d[i] = d[i + 1] = d[i + 2] = 10
      d[i + 3] = ink ? 255 : 0
    }
  }
  ctx.putImageData(img, 0, 0)
}

function paint(ctx: CanvasRenderingContext2D, activity: Activity, tick: number, blink: boolean) {
  const r: Paint = (color, x, y, w, h) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
  }
  ctx.clearRect(0, 0, W, H)
  if (activity === 'work') drawDesk(ctx, tick, blink)
  else if (activity === 'sleep') sleep(r, tick)
  else if (activity === 'eat') eat(r, tick, blink)
  else if (activity === 'sketch') sketch(r, tick, blink)
  else if (activity === 'read') read(r, tick, blink)
  else if (activity === 'walk') walk(r, tick, blink)
  else cook(r, tick, blink)
  dither(ctx)
}

/** A dithered pixel person doing whatever the status line says: working, eating, cooking, walking, reading, sketching or sleeping. */
export function PixelLife({ activity }: { activity: Activity }) {
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
      paint(ctx, activity, tick, blink)
    }

    frame(performance.now())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      tick++
      frame(performance.now())
    }, FRAME_MS)
    return () => window.clearInterval(id)
  }, [activity])

  return <canvas ref={ref} className="pixel-life" width={W} height={H} aria-hidden="true" />
}
