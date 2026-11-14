/**
 * Tiny isometric pixel dioramas for the problem cards. Everything is drawn with filled rectangles on a
 * small logical canvas (W x H) that the page scales up crisply, so a frame is a few hundred fillRect
 * calls. A scene is a pure function of time, which keeps it easy to loop, pause and test.
 */
export type Gfx = { rect: (x: number, y: number, w: number, h: number, c: string) => void }
export type Scene = { draw: (g: Gfx, t: number) => void; loop: number }

export const W = 144
export const H = 76
const HW = 8
const HH = 4
const OX = 72
const OY = 8

const INK = '#0c0c0b'
const LIT = '#f2f2f0'
const SOFT = '#b4b4b1'
const MID = '#8c8c89'
const DIM = '#626260'
const WHITE = '#ffffff'

type Tone = { top: string; l: string; r: string; e: string }
const HI: Tone = { top: LIT, l: SOFT, r: MID, e: WHITE }
const MD: Tone = { top: SOFT, l: MID, r: DIM, e: LIT }
const LO: Tone = { top: '#4a4a47', l: '#363634', r: '#2a2a28', e: '#5c5c58' }

type Pt = [number, number]
const P = (gx: number, gy: number, z = 0): Pt => [Math.round(OX + (gx - gy) * HW), Math.round(OY + (gx + gy) * HH - z)]
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const T = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
const ease = (u: number) => u * u * (3 - 2 * u)
const lerp = (a: number, b: number, u: number) => a + (b - a) * u

/** The time of the frame being drawn; small idle motion (breathing, blinking) reads it. */
let clock = 0

/** Fill a convex polygon row by row so the edges stay hard. */
function poly(g: Gfx, pts: Pt[], c: string) {
  let lo = Infinity, hi = -Infinity
  for (const p of pts) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]) }
  for (let y = Math.floor(lo); y < Math.ceil(hi); y++) {
    const yc = y + 0.5
    let x0 = Infinity, x1 = -Infinity
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) {
        const x = a[0] + ((yc - a[1]) / (b[1] - a[1])) * (b[0] - a[0])
        x0 = Math.min(x0, x); x1 = Math.max(x1, x)
      }
    }
    const a = Math.round(x0), b = Math.round(x1)
    if (b > a) g.rect(a, y, b - a, 1, c)
  }
}

function line(g: Gfx, a: Pt, b: Pt, c: string) {
  let [x, y] = a
  const dx = Math.abs(b[0] - x), dy = -Math.abs(b[1] - y)
  const sx = x < b[0] ? 1 : -1, sy = y < b[1] ? 1 : -1
  let e = dx + dy
  for (;;) {
    g.rect(x, y, 1, 1, c)
    if (x === b[0] && y === b[1]) break
    const e2 = 2 * e
    if (e2 >= dy) { e += dy; x += sx }
    if (e2 <= dx) { e += dx; y += sy }
  }
}

/** A box on the floor grid: footprint w x d at (gx, gy), height h, resting at height z, with bright front edges. */
function box(g: Gfx, gx: number, gy: number, w: number, d: number, h: number, c: Tone, z = 0) {
  const t = z + h
  poly(g, [P(gx, gy + d, t), P(gx + w, gy + d, t), P(gx + w, gy + d, z), P(gx, gy + d, z)], c.l)
  poly(g, [P(gx + w, gy + d, t), P(gx + w, gy, t), P(gx + w, gy, z), P(gx + w, gy + d, z)], c.r)
  poly(g, [P(gx, gy, t), P(gx + w, gy, t), P(gx + w, gy + d, t), P(gx, gy + d, t)], c.top)
  line(g, P(gx, gy + d, t), P(gx + w, gy + d, t), c.e)
  line(g, P(gx + w, gy + d, t), P(gx + w, gy, t), c.e)
  if (h > 2) line(g, P(gx + w, gy + d, t), P(gx + w, gy + d, z), c.e)
}

/** A flat diamond on the floor. */
function tile(g: Gfx, gx: number, gy: number, w: number, d: number, c: string, z = 0) {
  poly(g, [P(gx, gy, z), P(gx + w, gy, z), P(gx + w, gy + d, z), P(gx, gy + d, z)], c)
}

/** A line drawn on the right-hand face of a box (the face at gx), from gy = a to gy = b at height z. */
const faceR = (g: Gfx, gx: number, a: number, b: number, z: number, c: string) => line(g, P(gx, a, z), P(gx, b, z), c)
/** The same on the left-hand face (the face at gy), from gx = a to gx = b. */
const faceL = (g: Gfx, gy: number, a: number, b: number, z: number, c: string) => line(g, P(a, gy, z), P(b, gy, z), c)

function bmp(g: Gfx, x: number, y: number, rows: string[], c: string) {
  rows.forEach((r, j) => { for (const m of r.matchAll(/#+/g)) g.rect(x + m.index!, y + j, m[0].length, 1, c) })
}

const G = {
  check: ['.....#', '....##', '#..##.', '###...', '.#....'],
  q: ['.###.', '#...#', '...#.', '..#..', '.....', '..#..'],
  bang: ['#', '#', '#', '#', '.', '#'],
  coin: ['.###.', '#.#.#', '#.###', '#.#.#', '.###.'],
  lens: ['.###.', '#...#', '#...#', '.###.', '....##'],
  person: ['.##.', '.##.', '####', '####'],
  dots: ['#.#.#'],
}
const glyphAt = (g: Gfx, p: Pt, rows: string[], c: string) => bmp(g, p[0] - Math.floor(rows[0].length / 2), p[1], rows, c)
/** A glyph that floats up and down by a pixel. */
const hover = (g: Gfx, p: Pt, rows: string[], c: string) => glyphAt(g, [p[0], p[1] - (Math.floor(clock * 2) % 2)], rows, c)

/** A circle on the floor, seen in perspective. */
function ring(g: Gfx, gx: number, gy: number, r: number, z: number, c: string) {
  if (r <= 0) return
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2
    const p = P(gx + Math.cos(a) * r, gy + Math.sin(a) * r, z)
    g.rect(p[0], p[1], 1, 1, c)
  }
}

/** A speech bubble with a glyph in it, its tail pointing down at p. */
function bubble(g: Gfx, p: Pt, rows: string[]) {
  const x = p[0] - 5, y = p[1] - 10
  g.rect(x, y, 11, 9, LIT)
  g.rect(p[0] - 1, y + 9, 3, 1, LIT)
  g.rect(p[0], y + 10, 1, 1, LIT)
  bmp(g, p[0] - Math.floor(rows[0].length / 2), y + 2, rows, INK)
}

/** Four specks that fly out from a point for half a second after `at`: the little "solved" burst. */
function spark(g: Gfx, p: Pt, at: number) {
  const age = clock - at
  if (age <= 0 || age > 0.6) return
  const r = Math.round(2 + age * 16)
  const c = age > 0.4 ? MID : LIT
  g.rect(p[0] - r, p[1], 1, 1, c); g.rect(p[0] + r, p[1], 1, 1, c)
  g.rect(p[0], p[1] - Math.round(r * 0.6), 1, 1, c); g.rect(p[0], p[1] + Math.round(r * 0.6), 1, 1, c)
}

/** The tiny agent: antenna with a blinking light, square body, eyes, arms, and legs that step. */
function bot(g: Gfx, gx: number, gy: number, o: { z?: number; step?: number; face?: 1 | -1; tone?: string; carry?: boolean } = {}) {
  const [sx, sy] = P(gx, gy, o.z ?? 0)
  const moving = (o.step ?? 0) > 0
  // a bounce when it steps, a slow breath when it stands
  const bob = moving ? (o.step as number) % 2 : Math.floor(clock * 1.6 + gx * 0.7) % 2
  const x = sx - 3, y = sy - 9 - bob
  const face = o.face ?? 1
  const blink = (clock * 0.9 + gx) % 3.1 < 0.14
  g.rect(sx - 3, sy, 7, 1, 'rgba(0,0,0,.5)')
  g.rect(x + 3, y, 1, 2, MID)
  if (Math.floor(clock * 2 + gx) % 4 === 0) g.rect(x + 3, y - 1, 1, 1, LIT)
  g.rect(x + 1, y + 2, 5, 5, o.tone ?? SOFT)
  g.rect(x + 1, y + 2, 5, 1, LIT)
  if (!blink) {
    g.rect(x + (face > 0 ? 3 : 1), y + 4, 1, 1, INK)
    g.rect(x + (face > 0 ? 5 : 3), y + 4, 1, 1, INK)
  }
  const swing = moving ? (o.step as number) % 2 : 0
  g.rect(x, y + (o.carry ? 3 : 4 + swing), 1, 2, MID)
  g.rect(x + 6, y + (o.carry ? 3 : 5 - swing), 1, 2, MID)
  const s = moving ? (o.step as number) % 2 : 0
  g.rect(x + 2, y + 7 + bob, 1, s ? 1 : 2, MID)
  g.rect(x + 4, y + 7 + bob, 1, s ? 2 : 1, MID)
}

/** Walk along a polyline of floor points; u runs 0 to 1 over its whole length. */
function along(pts: Pt[], u: number) {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  const total = lens.reduce((a, b) => a + b, 0)
  let d = clamp(u) * total
  let i = 0
  while (i < lens.length - 1 && d > lens[i]) { d -= lens[i]; i++ }
  const a = pts[i], b = pts[i + 1]
  const k = lens[i] ? d / lens[i] : 1
  const face: 1 | -1 = b[0] - a[0] - (b[1] - a[1]) >= 0 ? 1 : -1
  const moving = u > 0.001 && u < 0.999
  return { gx: lerp(a[0], b[0], k), gy: lerp(a[1], b[1], k), face, step: moving ? 1 + Math.floor(clamp(u) * total * 2.4) : 0 }
}

/** Painter's order: draw the things further from the viewer first. */
function stack(items: [number, () => void][]) { items.sort((a, b) => a[0] - b[0]).forEach(([, f]) => f()) }

export function floor(g: Gfx) {
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) tile(g, i, j, 1, 1, (i + j) % 2 ? '#1e1e1c' : '#222220')
}

// ---------------------------------------------------------------------------------------------------------
// 1. wall: wandering and bumping into menus, then ONE search: a ripple knocks the walls down and the profile comes to you

const WALL_PATH: Pt[] = [[0.5, 2.5], [1.7, 2.5], [0.8, 2.5], [0.5, 5.7], [3.4, 5.7], [3.4, 2.1], [6.3, 2.1], [6.3, 5.3]]
const wall = (g: Gfx, t: number) => {
  const walk = T(t, 0.4, 5.6)
  const drop = ease(T(t, 7.2, 8.0))
  const fly = ease(T(t, 8.0, 9.4))
  const wh = lerp(13, 1, drop)
  const searching = t >= 6.0
  const b = searching ? { gx: 0.5, gy: 2.5, face: 1 as const, step: 0 } : along(WALL_PATH, walk)
  // the search ripple spreads across the floor
  const rip = T(t, 6.8, 8.6)
  if (rip > 0 && rip < 1) { ring(g, 0.8, 1, rip * 6.5, 0, rip < 0.6 ? LIT : MID); ring(g, 0.8, 1, rip * 6.5 - 1.2, 0, DIM) }
  const menu = (gx: number, gy: number, d: number) => {
    if (wh < 6) return
    for (let k = 0; k < 3; k++) faceR(g, gx + 1, gy + 0.5, gy + d - 0.5 - (k % 2) * 1.2, wh - 3 - k * 3, 'rgba(0,0,0,.35)')
  }
  const px = lerp(6, 1.3, fly), py = lerp(6, 3.3, fly), pz = Math.sin(fly * Math.PI) * 7
  stack([
    [px + py + 1, () => { box(g, px, py, 1.2, 1.2, 1.5, HI, pz); hover(g, P(px + 0.6, py + 0.6, 10 + pz), G.person, fly >= 1 ? LIT : MID); if (fly >= 1) glyphAt(g, P(px + 0.6, py + 0.6, 17), G.check, LIT) }],
    [5, () => { box(g, 2, 0, 1, 5, wh, MD); menu(2, 0, 5) }],
    [10, () => { box(g, 4, 3, 1, 5, wh, MD); menu(4, 3, 5) }],
    [b.gx + b.gy, () => bot(g, b.gx, b.gy, { step: b.step, face: b.face })],
    [0, () => {
      if (!searching) return
      box(g, 0, 0.6, 1.6, 0.7, 1.6, HI)
      const c = P(0.4, 1.3, 2.6)
      const typed = Math.min(3, Math.floor((t - 6.2) / 0.3) + 1)
      g.rect(c[0], c[1], typed * 2 - 1, 1, INK)
      if (Math.floor(t * 3) % 2) g.rect(c[0] + typed * 2, c[1], 1, 1, INK)
    }],
  ])
  if (!searching && t > 5.6) hover(g, P(b.gx, b.gy, 13), G.q, SOFT)
  else if (!searching && b.gx > 1.45 && b.gx < 1.8 && b.gy < 3) hover(g, P(b.gx, b.gy, 13), G.bang, SOFT)
  if (fly >= 1) spark(g, P(1.9, 3.9, 14), 9.4)
}

// ---------------------------------------------------------------------------------------------------------
// 2. hold: questions pile up over a locked crate; the board's answers pop them one by one

const SHOW_AT = [0.6, 1.2, 1.8, 2.4, 3.0]
const POP_AT = [4.3, 4.6, 5.4, 5.7, 6.5]
const BUBBLE_AT: Pt[] = [[-24, -8], [24, -8], [-12, -17], [12, -17], [0, -22]]
const LOCK = ['.###.', '#...#', '#...#', '#####', '##.##', '#####']
const hold = (g: Gfx, t: number) => {
  const hop = (even: boolean) => SHOW_AT.reduce((s, a, i) => (i % 2 === 0) === even && t > a && t < a + 0.25 ? s + 2.2 * Math.sin(((t - a) / 0.25) * Math.PI) : s, 0)
  const cleared = t > 6.7
  const top = P(3.7, 3.7, 5)
  stack([
    [6.4, () => {
      box(g, 4.6, 0.4, 3, 0.4, 13, LO)
      for (let i = 0; i < 3; i++) {
        const k = T(t, 4.0 + i * 1.0, 4.6 + i * 1.0)
        if (k > 0) {
          faceL(g, 0.8, 4.9, 4.9 + lerp(0, 1.9 - i * 0.3, k), 10 - i * 3, i === 0 ? LIT : SOFT)
          faceL(g, 0.8, 4.9, 4.9 + lerp(0, 1.9 - i * 0.3, k), 9.2 - i * 3, i === 0 ? LIT : SOFT)
        }
      }
    }],
    [6, () => { box(g, 3, 3, 1.4, 1.4, 5, MD); hover(g, [top[0], top[1] - 8], cleared ? G.check : LOCK, LIT) }],
    [7, () => bot(g, 2, 5, { face: 1, z: hop(true) })],
    [8, () => bot(g, 5, 5.4, { face: -1, tone: MID, z: hop(false) })],
  ])
  SHOW_AT.forEach((a, i) => {
    const at: Pt = [top[0] + BUBBLE_AT[i][0], top[1] + BUBBLE_AT[i][1]]
    if (t >= POP_AT[i]) { spark(g, at, POP_AT[i]); return }
    if (t < a) return
    if (T(t, a, a + 0.2) < 1 && Math.floor(t * 20) % 2) return
    bubble(g, [at[0], at[1] - (Math.floor(t * 2 + i) % 2)], G.q)
  })
  if (cleared) spark(g, [top[0], top[1] - 14], 6.7)
}

// ---------------------------------------------------------------------------------------------------------
// 3. maze: a slow, doubting walk, then a bright head runs the route lighting it and the bot sprints along

const MAZE_PATH: Pt[] = [[1, 0.6], [1, 7.2], [3.5, 7.2], [3.5, 0.8], [5.5, 0.8], [5.5, 7.2], [7.4, 7.2], [7.4, 1.2]]
const maze = (g: Gfx, t: number) => {
  const slow = T(t, 0.3, 4.6)
  const lit = T(t, 4.8, 6.2)
  const run = T(t, 6.4, 8.2)
  const b = run > 0 ? along(MAZE_PATH, run) : along(MAZE_PATH, slow * 0.55)
  const n = 26
  const head = Math.ceil(n * lit)
  for (let i = 0; i < head; i++) {
    const p = along(MAZE_PATH, i / n)
    const tx = Math.floor(p.gx), ty = Math.floor(p.gy)
    tile(g, tx, ty, 1, 1, i === head - 1 && lit < 1 ? LIT : DIM)
    // marching dots: the route reads as a direction
    if ((i - Math.floor(t * 9)) % 3 === 0) { const s = P(tx + 0.5, ty + 0.5, 0); g.rect(s[0], s[1], 2, 1, LIT) }
  }
  stack([
    [4, () => box(g, 2, 0, 1, 6, 6, MD)],
    [9, () => box(g, 4, 2, 1, 6, 6, MD)],
    [9, () => box(g, 6, 0, 1, 6, 6, MD)],
    [b.gx + b.gy + 0.3, () => bot(g, b.gx, b.gy, { step: b.step, face: b.face })],
    [8, () => { box(g, 7, 0.2, 0.7, 0.7, 4, HI); if (run >= 1) glyphAt(g, P(7.35, 0.55, 12), G.check, LIT) }],
  ])
  if (run === 0 && slow > 0.08 && Math.floor(t * 1.2) % 2 === 0) hover(g, P(b.gx, b.gy, 13), G.q, SOFT)
  if (run >= 1) spark(g, P(7.35, 0.55, 14), 8.2)
}

// ---------------------------------------------------------------------------------------------------------
// 4. trail: a coin goes through three stages leaving dots, then an auditor rewinds the whole trail in seconds

const TRAIL: Pt[] = [[1.2, 1.2], [4.2, 3.6], [6.6, 6.6]]
const TRAIL_BACK: Pt[] = [[6.6, 6.6], [4.2, 3.6], [1.2, 1.2]]
const trail = (g: Gfx, t: number) => {
  const u = ease(T(t, 0.6, 5.2))
  const c = along(TRAIL, u)
  const follow = along(TRAIL, Math.max(0, u - 0.14))
  const ua = ease(T(t, 6.2, 9.0))
  const back = ua > 0 ? along(TRAIL_BACK, ua) : null
  for (let i = 0; i < 40; i++) {
    const k = i / 40
    if (k >= u - 0.02) continue
    const p = along(TRAIL, k)
    const s = P(p.gx, p.gy, 0)
    const checked = ua > 0 && k >= 1 - ua
    g.rect(s[0], s[1], 2, 1, checked ? LIT : SOFT)
    if (checked) g.rect(s[0], s[1] - 1, 2, 1, LIT)
  }
  const stage = (i: number) => u >= [0, 0.5, 0.98][i]
  const items: [number, () => void][] = [
    [2.4, () => box(g, 0.6, 0.6, 1.2, 1.2, 3, stage(0) ? HI : LO)],
    [7.8, () => box(g, 3.6, 3, 1.2, 1.2, 3, stage(1) ? HI : LO)],
    [13.2, () => { box(g, 6, 6, 1.2, 1.2, 3, stage(2) ? HI : LO); if (stage(2)) glyphAt(g, P(6.6, 6.6, 12), G.check, LIT) }],
    [follow.gx + follow.gy, () => bot(g, follow.gx, follow.gy, { step: follow.step, face: follow.face })],
    [c.gx + c.gy + 0.4, () => { const s = P(c.gx, c.gy, 5 + Math.sin(t * 5)); g.rect(s[0] - 2, s[1] - 2, 5, 5, LIT); g.rect(s[0] - 1, s[1] - 3, 3, 1, LIT); g.rect(s[0] - 1, s[1] + 3, 3, 1, LIT); g.rect(s[0], s[1] - 1, 1, 3, INK) }],
  ]
  if (back) items.push([back.gx + back.gy + 0.2, () => { bot(g, back.gx, back.gy, { step: back.step, face: back.face, tone: MID }); hover(g, P(back.gx, back.gy, 13), G.lens, LIT) }])
  stack(items)
  if (stage(1)) spark(g, P(4.8, 4.2, 5), 3.2)
  if (stage(2)) spark(g, P(6.6, 6.6, 14), 5.2)
}

// ---------------------------------------------------------------------------------------------------------
// 5. story: a case is handed on like a baton; the line fills behind it, and the next stop is always showing

const STORY: Pt[] = [[1, 6], [3.6, 3.6], [6, 1]]
const story = (g: Gfx, t: number) => {
  const A = along([[1.6, 7.7], [4.0, 5.3]], ease(T(t, 0.5, 2.6)))
  const B = along([[4.8, 5.3], [6.6, 2.7]], ease(T(t, 3.9, 6.6)))
  const hand = ease(T(t, 2.7, 3.4))
  const holderA = t < 3.4
  // where the baton is along the whole line: 0 at the first stop, 2 at the last
  const prog = t < 2.6 ? ease(T(t, 0.5, 2.6)) : t < 3.9 ? 1 : 1 + ease(T(t, 3.9, 6.6))
  const stateOf = (i: number) => (prog > i + 0.02 ? 'done' : prog >= i - 0.001 ? 'now' : 'next')
  for (let i = 0; i < 2; i++) {
    const a = P(STORY[i][0] + 0.6, STORY[i][1] + 0.6, 0), z = P(STORY[i + 1][0] + 0.6, STORY[i + 1][1] + 0.6, 0)
    line(g, a, z, '#33332f')
    const fill = clamp(prog - i)
    if (fill > 0) line(g, a, [Math.round(lerp(a[0], z[0], fill)), Math.round(lerp(a[1], z[1], fill))], LIT)
    // chevrons pointing on: what comes next is always visible
    if (fill < 1) for (let k = 1; k < 4; k++) if ((k - Math.floor(t * 3)) % 3 === 0) g.rect(Math.round(lerp(a[0], z[0], k / 4)), Math.round(lerp(a[1], z[1], k / 4)) - 1, 2, 2, DIM)
  }
  const nodes = STORY.map((p, i) => [p[0] + p[1], () => {
    const s = stateOf(i)
    box(g, p[0], p[1], 1.2, 1.2, 3, s === 'done' ? HI : s === 'now' ? MD : LO)
    const top = P(p[0] + 0.6, p[1] + 0.6, 3)
    if (s === 'done') glyphAt(g, [top[0], top[1] - 9], G.check, LIT)
    else if (s === 'now') g.rect(top[0] - 3, top[1] - 8, 7, 3, Math.floor(t * 2.5) % 2 === 0 ? LIT : MID)
    else glyphAt(g, [top[0], top[1] - 7], G.dots, DIM)
  }] as [number, () => void])
  stack([...nodes,
    [A.gx + A.gy, () => bot(g, A.gx, A.gy, { step: A.step, face: A.face, carry: holderA })],
    [B.gx + B.gy, () => bot(g, B.gx, B.gy, { step: B.step, face: B.face, tone: MID, carry: !holderA })],
  ])
  // the baton rides in the holder's hands and arcs across at the hand-over
  const ha: Pt = [P(A.gx, A.gy)[0] + 4, P(A.gx, A.gy)[1] - 6]
  const hb: Pt = [P(B.gx, B.gy)[0] + 4, P(B.gx, B.gy)[1] - 6]
  const bt: Pt = !holderA ? hb : t < 2.7 ? ha : [Math.round(lerp(ha[0], hb[0], hand)), Math.round(lerp(ha[1], hb[1], hand) - Math.sin(hand * Math.PI) * 8)]
  g.rect(bt[0], bt[1], 3, 2, LIT)
  if (prog >= 1) spark(g, P(4.2, 4.2, 12), 2.6)
  if (prog >= 1.999) spark(g, P(6.6, 1.6, 12), 6.6)
}

// ---------------------------------------------------------------------------------------------------------
// 6. picture: three screens are pulled together like magnets, snap with a bounce, link up, and a person appears

const SCREENS: { from: Pt; to: Pt; at: number }[] = [
  { from: [0.4, 5.6], to: [1.9, 3.6], at: 0.5 },
  { from: [6.2, 0.4], to: [3.6, 3.6], at: 1.7 },
  { from: [6.4, 6.2], to: [5.3, 3.6], at: 2.9 },
]
const picture = (g: Gfx, t: number) => {
  const items: [number, () => void][] = []
  const pos = SCREENS.map((s) => {
    const k = T(t, s.at, s.at + 1.0)
    const m = k * k * k
    const bounce = clamp((t - (s.at + 1.0)) / 0.5)
    return { gx: lerp(s.from[0], s.to[0], m), gy: lerp(s.from[1], s.to[1], m), z: bounce > 0 && bounce < 1 ? 2.4 * Math.abs(Math.sin(bounce * Math.PI * 2)) * (1 - bounce) : 0, snap: t > s.at + 1.0 && t < s.at + 1.15 }
  })
  pos.forEach((p) => items.push([p.gx + p.gy + 0.8, () => {
    box(g, p.gx, p.gy, 1.5, 0.35, 8, p.snap ? HI : MD, p.z)
    for (let r = 0; r < 3; r++) faceL(g, p.gy + 0.35, p.gx + 0.25, p.gx + 1.15 - r * 0.2, 6 - r * 2 + p.z, INK)
  }]))
  const rise = ease(T(t, 5.0, 6.2))
  items.push([8, () => {
    if (rise > 0) { box(g, 3.9, 3.5, 0.8, 0.8, 3 * rise, HI, 8); box(g, 4.0, 3.6, 0.6, 0.6, 1.3 * rise, HI, 8 + 3 * rise) }
  }])
  items.push([11, () => bot(g, 3.6, 5.8, { carry: true, face: 1 })])
  stack(items)
  // the links, once all three are home
  const link = T(t, 4.2, 5.0)
  if (link > 0) {
    const tops = SCREENS.map((s) => P(s.to[0] + 0.75, s.to[1] + 0.2, 8))
    for (let i = 0; i < 2; i++) line(g, tops[i], [Math.round(lerp(tops[i][0], tops[i + 1][0], link)), Math.round(lerp(tops[i][1], tops[i + 1][1], link))], LIT)
  }
  SCREENS.forEach((s) => spark(g, P(s.to[0] + 0.75, s.to[1] + 0.2, 8), s.at + 1.0))
  if (rise >= 1) hover(g, P(4.3, 3.9, 19), G.check, LIT)
}

// ---------------------------------------------------------------------------------------------------------
// 7. queue: a bot walks the line planting a flag on every folder, so each one has a named owner; the first is decided

const queue = (g: Gfx, t: number) => {
  const walking = t > 0.8 && t < 4.4
  const bgx = lerp(0.6, 6.2, T(t, 0.8, 4.4))
  const decide = T(t, 5.6, 6.4)
  const out = ease(T(t, 6.4, 7.4))
  const shift = ease(T(t, 6.6, 7.8))
  const items: [number, () => void][] = []
  for (let i = 0; i < 5; i++) {
    const cx = 0.8 + i * 1.35 + 0.55
    const planted = 0.8 + 3.6 * ((cx - 0.6) / 5.6)
    const grow = T(t, planted, planted + 0.3)
    const gx = 0.8 + (i > 0 ? i - shift : 0) * 1.35 + (i === 0 ? 0 : 0)
    const first = i === 0
    const stamp = first && decide > 0 && decide < 1 ? -Math.sin(decide * Math.PI) * 1.2 : 0
    const ox = first ? out * 3.2 : 0
    items.push([gx + 4, () => {
      box(g, gx + ox, 3.4 + ox, 1.1, 1.7, 1.8, first && decide >= 1 ? HI : MD, stamp)
      if (grow > 0) {
        const p = P(gx + ox + 0.55, 4.2 + ox, 1.8 + stamp)
        const h = Math.round(10 * grow)
        g.rect(p[0], p[1] - h, 1, h, LIT)
        if (grow >= 1) g.rect(p[0] + 1, p[1] - 10, 5, 3, first && decide >= 1 ? WHITE : LIT)
      }
    }])
  }
  const x = t < 4.4 ? bgx : 6.2
  items.push([x + 6, () => bot(g, x, 5.6, { step: walking ? 1 + Math.floor(t * 5) : 0, face: 1, carry: t < 4.4 })])
  stack(items)
  hover(g, P(3.2, 4.2, 14), t > 4.6 ? G.check : G.q, t > 4.6 ? LIT : SOFT)
  if (t > 4.6) spark(g, P(3.2, 4.2, 14), 4.6)
  if (decide >= 1) spark(g, P(1.35, 4.2, 8), 6.4)
}

// ---------------------------------------------------------------------------------------------------------
// 8. signal: a calm wave rolls over identical rows; then one raises an alarm with rings and the rest dim

const signal = (g: Gfx, t: number) => {
  const alarm = ease(T(t, 3.0, 3.6))
  const on = t >= 3.0
  const hx = 1 + 2 * 1.6 + 0.6, hy = 0.6 + 1.6 + 0.6
  if (on) for (let k = 0; k < 3; k++) {
    const ph = ((t - 3.0) * 0.8 + k / 3) % 1
    ring(g, hx, hy, ph * 4.2, 0, ph < 0.5 ? LIT : DIM)
  }
  const b = along([[0.2, 7.4], [3.2, 4.4]], T(t, 3.4, 6.4))
  const items: [number, () => void][] = []
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const hot = i === 2 && j === 1
    const calm = 1.4 + 0.5 * Math.sin(t * 2 - (i + j) * 0.9)
    const h = hot ? lerp(calm, 4.2, alarm) : calm * (1 - 0.35 * alarm)
    const sh = hot && on && Math.floor(t * 14) % 2 ? 0.07 : 0
    const gx = 1 + i * 1.6 + sh, gy = 0.6 + j * 1.6
    items.push([gx + gy, () => box(g, gx, gy, 1.2, 1.2, h, hot && on ? (Math.floor(t * 3) % 2 ? HI : MD) : LO)])
    if (hot && on) items.push([gx + gy + 1, () => glyphAt(g, P(gx + 0.6, gy + 0.6, 13 - (Math.floor(t * 3) % 2)), G.bang, LIT)])
  }
  items.push([b.gx + b.gy + 0.5, () => bot(g, b.gx, b.gy, { step: b.step, face: b.face })])
  stack(items)
  if (t > 6.4) hover(g, P(b.gx + 0.2, b.gy, 14), G.lens, LIT)
  spark(g, P(hx, hy, 10), 3.0)
}

// ---------------------------------------------------------------------------------------------------------
// 9. hidden: a sweep crosses the floor like a scanner; the lost record blinks as it passes, then lifts out into view

const hidden = (g: Gfx, t: number) => {
  const sweep = T(t, 2.2, 5.8) * 16
  const fly = ease(T(t, 6.0, 7.6))
  if (sweep > 0 && sweep < 16) for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const d = Math.abs(i + j + 1 - sweep)
    if (d < 0.6) tile(g, i, j, 1, 1, MID)
    else if (d < 1.4) tile(g, i, j, 1, 1, '#33332f')
  }
  const seen = sweep > 6 && t < 6.0
  const cx = lerp(3.3, 5.4, fly), cy = lerp(1.7, 5.0, fly), cz = Math.sin(fly * Math.PI) * 6
  const flash = seen && Math.floor(t * 6) % 2 === 0
  stack([
    [cx + cy + 0.5, () => box(g, cx, cy, 1.1, 1.5, 0.8, flash ? HI : MD, cz)],
    [6, () => box(g, 3, 3, 1.6, 1.6, 10, MD)],
    [4, () => box(g, 1, 4.8, 1.3, 1.3, 4, LO)],
    [11, () => box(g, 6, 5.2, 1.3, 1.3, 4, LO)],
    [8, () => bot(g, 6.2, 2.0, { face: -1, z: fly > 0 && fly < 1 ? 2 * Math.sin(fly * Math.PI) : 0 })],
  ])
  if (seen) hover(g, P(cx + 0.55, cy + 0.75, 12), G.bang, LIT)
  if (fly >= 1) { hover(g, P(cx + 0.55, cy + 0.75, 10), G.check, LIT); spark(g, P(cx + 0.55, cy + 0.75, 12), 7.6) }
}

/** Each scene with its loop length: its last move plus a short hold before it fades and starts over. */
export const scenes: Record<string, Scene> = {
  Wall: { draw: wall, loop: 11 },
  Hold: { draw: hold, loop: 9.6 },
  Maze: { draw: maze, loop: 10 },
  Trail: { draw: trail, loop: 10.4 },
  Story: { draw: story, loop: 9.2 },
  Picture: { draw: picture, loop: 8.6 },
  Queue: { draw: queue, loop: 9.4 },
  Signal: { draw: signal, loop: 9 },
  Hidden: { draw: hidden, loop: 9.2 },
}

/** Draw one frame of a scene; t is in seconds from the start of its loop. */
export function render(g: Gfx, name: string, t: number) {
  clock = t
  scenes[name]?.draw(g, t)
}
