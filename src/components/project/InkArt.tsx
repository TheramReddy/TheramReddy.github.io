import { useLayoutEffect, useRef, type ReactNode } from 'react'

/**
 * Isometric ink still-lifes for the DSO problems, drawn in the same hand as the
 * hero post card, the Work desk and the Projects brush set (the Scobin chapters reuse the helpers): fine ink lines,
 * hatching and stipple for shade, and one red accent marking the design decision.
 */

const C = 0.866
const S = 0.5
export const RED = '#C8432E'

/** Project a point on the desk (x right-down, y left-down, z up) to the page. */
export const xy = (x: number, y: number, z = 0): [number, number] => [(x - y) * C, (x + y) * S - z]
export const pt = (x: number, y: number, z = 0) => xy(x, y, z).map((n) => n.toFixed(1)).join(',')
export const pts = (...p: [number, number, number][]) => p.map(([x, y, z]) => pt(x, y, z)).join(' ')
export const path = (...p: [number, number, number][]) => 'M' + p.map(([x, y, z]) => pt(x, y, z)).join(' L')

type Plane = 'top' | 'left' | 'right'
/** Lay text or marks flat on a plane: the desk top, the face toward the left, or the face toward the right. */
const on = (plane: Plane, x: number, y: number, z = 0) => {
  const [px, py] = xy(x, y, z)
  const m = plane === 'top' ? `${C} ${S} ${-C} ${S}` : plane === 'left' ? `${C} ${S} 0 1` : `${C} ${-S} 0 1`
  return `matrix(${m} ${px.toFixed(1)} ${py.toFixed(1)})`
}

/** Shared patterns; rendered once, beside the carousel, so every scene can use them. */
export const InkDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <defs>
      <pattern id="ink-hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke="#1D1D1B" strokeWidth="0.55" />
      </pattern>
      <pattern id="ink-hatch-dense" patternUnits="userSpaceOnUse" width="2.6" height="2.6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="2.6" stroke="#1D1D1B" strokeWidth="0.55" />
      </pattern>
      <pattern id="ink-dots" patternUnits="userSpaceOnUse" width="3.2" height="3.2">
        <circle cx="1.6" cy="1.6" r="0.55" fill="#1D1D1B" />
      </pattern>
      <pattern id="ink-shade" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="3" stroke="#9a9a9a" strokeWidth="0.5" />
      </pattern>
      <pattern id="ink-glow" patternUnits="userSpaceOnUse" width="3.5" height="3.5">
        <circle cx="1.75" cy="1.75" r="0.5" fill="#1D1D1B" opacity=".55" />
      </pattern>
    </defs>
  </svg>
)

type Fill = 'paper' | 'hatch' | 'dense' | 'dots' | 'red' | 'red-hatch' | 'ink'
const fills: Record<Fill, [string, string?]> = {
  paper: ['#fff'],
  hatch: ['#fff', 'url(#ink-hatch)'],
  dense: ['#fff', 'url(#ink-hatch-dense)'],
  dots: ['#fff', 'url(#ink-dots)'],
  red: [RED],
  'red-hatch': [RED, 'url(#ink-hatch)'],
  ink: ['#1D1D1B'],
}

const Face = ({ points, fill }: { points: string; fill: Fill }) => {
  const [base, over] = fills[fill]
  return (
    <>
      <polygon points={points} fill={base} />
      {over && <polygon points={points} fill={over} stroke="none" />}
      <polygon points={points} fill="none" />
    </>
  )
}

type BlockProps = { x: number; y: number; z?: number; w: number; d: number; h: number; top?: Fill; left?: Fill; right?: Fill }

/** A box sitting on the desk, with the two faces toward the viewer shaded. */
export const Block = ({ x, y, z = 0, w, d, h, top = 'paper', left = 'hatch', right = 'dots' }: BlockProps) => (
  <g>
    <Face fill={left} points={pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])} />
    <Face fill={right} points={pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])} />
    <Face fill={top} points={pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])} />
  </g>
)

/** Cast shadow on the desk, falling toward the viewer's left like the Work desk's. */
export const Shadow = ({ x, y, w, d, s = 26 }: { x: number; y: number; w: number; d: number; s?: number }) => (
  <polygon points={pts([x, y + d, 0], [x + w, y + d, 0], [x + w + s * 0.3, y + d + s, 0], [x + s * 0.3, y + d + s, 0])} fill="url(#ink-shade)" stroke="none" />
)

/** Ruled lines on a flat sheet, like the writing on the post card. */
export const Lines = ({ x, y, z, w, n, gap = 9, short = 0.6 }: { x: number; y: number; z: number; w: number; n: number; gap?: number; short?: number }) => (
  <path className="ink-fine" d={Array.from({ length: n }, (_, i) => path([x, y + i * gap, z], [x + (i === n - 1 ? w * short : w), y + i * gap, z])).join(' ')} />
)

export const Tag = ({ plane, x, y, z = 0, size = 10, fill, anchor, children }: { plane: Plane; x: number; y: number; z?: number; size?: number; fill?: string; anchor?: 'middle' | 'end'; children: ReactNode }) => (
  <text className="ink-tag" transform={on(plane, x, y, z)} fontSize={size} style={fill ? { fill } : undefined} textAnchor={anchor}>{children}</text>
)

/** A circle lying flat on the desk. */
export const Disc = ({ x, y, z = 0, r, fill = '#fff' }: { x: number; y: number; z?: number; r: number; fill?: string }) => {
  const [cx, cy] = xy(x, y, z)
  return <ellipse cx={cx} cy={cy} rx={r * 1.2247} ry={r * 0.7071} fill={fill} />
}

/** A short upright cylinder, like a coin or a stamp handle. */
const Drum = ({ x, y, z = 0, r, h, top = '#fff', side = 'url(#ink-hatch)' }: { x: number; y: number; z?: number; r: number; h: number; top?: string; side?: string }) => {
  const [cx, cy] = xy(x, y, z)
  const rx = r * 1.2247, ry = r * 0.7071
  const body = `M${cx - rx} ${cy - h} V${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} V${cy - h} Z`
  return (
    <g>
      <path d={body} fill="#fff" />
      <path d={body} fill={side} stroke="none" />
      <path d={body} fill="none" />
      <ellipse cx={cx} cy={cy - h} rx={rx} ry={ry} fill={top} />
    </g>
  )
}

/** Frame a scene: the view box hugs the drawing, so every scene sits centred at the same scale. */
export const Art = ({ label, children }: { label: string; children: ReactNode }) => {
  const svg = useRef<SVGSVGElement>(null)
  const g = useRef<SVGGElement>(null)
  useLayoutEffect(() => {
    if (!svg.current || !g.current) return
    const b = g.current.getBBox()
    const pad = 14
    const w = Math.max(b.width + pad * 2, (b.height + pad * 2) * 1.6)
    const h = w / 1.6
    svg.current.setAttribute('viewBox', `${(b.x + b.width / 2 - w / 2).toFixed(1)} ${(b.y + b.height / 2 - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`)
  }, [])
  return (
    <svg ref={svg} className="ink-art" viewBox="-320 -200 640 400" role="img" aria-label={label}>
      <g ref={g}>{children}</g>
    </svg>
  )
}

/* ---------- 1. Menus vs one search ---------- */

export function WallArt() {
  return (
    <Art label="A tall cabinet of nested menu drawers beside one flat search bar with a red K key and the profile card it opens">
      <Shadow x={-130} y={-20} w={60} d={60} s={36} />
      <Block x={-130} y={-20} w={60} d={60} h={130} left="hatch" right="paper" />
      {['RECORD', 'LIST', 'SUB-MENU', 'MENU'].map((t, i) => {
        const z0 = 8 + i * 30
        return (
          <g key={t}>
            <polygon points={pts([-70, -14, z0], [-70, 34, z0], [-70, 34, z0 + 24], [-70, -14, z0 + 24])} fill="url(#ink-dots)" />
            <path d={path([-70, 4, z0 + 13], [-70, 16, z0 + 13])} strokeWidth="2" />
            <Tag plane="right" x={-70} y={30} z={z0 + 5} size={6.5}>{t}</Tag>
          </g>
        )
      })}
      <Shadow x={-30} y={40} w={220} d={44} s={20} />
      <Block x={-30} y={40} w={220} d={44} h={10} />
      <Disc x={-6} y={62} z={10} r={9} fill="none" />
      <path d={path([0, 68, 10], [8, 76, 10])} strokeWidth="1.8" />
      <Tag plane="top" x={14} y={67} z={10} size={12}>SEARCH PROFILES…</Tag>
      <Block x={155} y={48} z={10} w={28} d={28} h={10} top="red" left="red-hatch" right="red-hatch" />
      <Tag plane="top" x={164} y={67} z={20} size={14} fill="#fff">K</Tag>
      <Shadow x={40} y={120} w={130} d={80} s={22} />
      <Block x={40} y={120} w={130} d={80} h={3} />
      <polygon points={pts([52, 132, 3], [88, 132, 3], [88, 172, 3], [52, 172, 3])} fill="url(#ink-hatch)" />
      <Tag plane="top" x={98} y={142} z={3} size={10}>PROFILE</Tag>
      <Lines x={98} y={154} z={3} w={60} n={4} gap={10} />
    </Art>
  )
}

/* ---------- 2. A hold that explains itself ---------- */

export function HoldArt() {
  return (
    <Art label="A refund check on the desk with a red tag tied on that reads on hold, waiting on hearing review, and an hourglass beside it">
      <Shadow x={-80} y={0} w={200} d={100} s={24} />
      <Block x={-80} y={0} w={200} d={100} h={3} />
      <Tag plane="top" x={-68} y={18} z={3} size={10}>REFUND CHECK</Tag>
      <Lines x={-68} y={34} z={3} w={120} n={2} gap={12} />
      <path className="ink-fine" d={path([30, 75, 3], [105, 75, 3])} />
      <Tag plane="top" x={30} y={70} z={3} size={9}>$ ——.——</Tag>
      <polygon points={pts([-74, 6, 3], [114, 6, 3], [114, 94, 3], [-74, 94, 3])} fill="none" className="ink-fine" />
      <path d={`M${pt(100, 90, 3)} C${pt(110, 120, 30)} ${pt(110, 130, 10)} ${pt(108, 140, 1)}`} fill="none" />
      <polygon points={pts([100, 132, 1], [190, 132, 1], [204, 152, 1], [190, 172, 1], [100, 172, 1])} fill={RED} />
      <polygon points={pts([100, 132, 1], [190, 132, 1], [204, 152, 1], [190, 172, 1], [100, 172, 1])} fill="url(#ink-hatch)" stroke="none" opacity=".35" />
      <Disc x={109} y={140} z={1} r={3} />
      <Tag plane="top" x={120} y={147} z={1} size={10} fill="#fff">ON HOLD</Tag>
      <Tag plane="top" x={120} y={162} z={1} size={7} fill="#fff">WAITING ON: HEARING</Tag>
      <Shadow x={160} y={-20} w={40} d={40} s={30} />
      <Drum x={180} y={0} r={22} h={6} />
      <path d={`M${pt(162, 0, 6)} C${pt(165, 0, 40)} ${pt(178, 0, 50)} ${pt(180, 0, 56)} C${pt(182, 0, 62)} ${pt(195, 0, 72)} ${pt(198, 0, 106)}`} fill="none" />
      <path d={`M${pt(180, -18, 6)} C${pt(180, -15, 40)} ${pt(180, -2, 50)} ${pt(180, 0, 56)} C${pt(180, 2, 62)} ${pt(180, 15, 72)} ${pt(180, 18, 106)}`} fill="none" />
      <Disc x={180} y={0} z={20} r={13} fill="url(#ink-dots)" />
      <path className="ink-fine" d={path([180, 0, 56], [180, 0, 22])} strokeDasharray="1 3" />
      <Drum x={180} y={0} z={106} r={22} h={6} />
    </Art>
  )
}

/* ---------- 3. A claim, not a maze ---------- */

const walls: [number, number, number, number][] = [
  // [x, y, length, along x? 1 : 0]
  [0, 0, 240, 1], [0, 150, 240, 1], [0, 0, 60, 0], [0, 90, 60, 0], [240, 0, 60, 0], [240, 90, 60, 0],
  [30, 30, 60, 1], [120, 30, 90, 1], [60, 60, 0, 0], [30, 30, 60, 0], [90, 0, 60, 0],
  [150, 30, 60, 0], [60, 120, 90, 1], [180, 120, 60, 1], [120, 90, 60, 0], [180, 60, 60, 0], [30, 120, 30, 0], [210, 30, 60, 0],
]

export function MazeArt() {
  const segs = walls.filter((s) => s[2] > 0).sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
  return (
    <Art label="A maze of walls labelled claims, hearings and decisions, with a red rule laid straight across it to the claim folder">
      <Shadow x={-10} y={-10} w={260} d={170} s={22} />
      <Block x={-10} y={-10} w={260} d={170} h={6} />
      <Tag plane="top" x={6} y={22} z={6} size={8}>CLAIMS</Tag>
      <Tag plane="top" x={96} y={112} z={6} size={8}>HEARINGS</Tag>
      <Tag plane="top" x={158} y={52} z={6} size={8}>DECISIONS</Tag>
      {segs.map(([x, y, l, ax], i) => (
        <Block key={i} x={x} y={y} z={6} w={ax ? l : 3} d={ax ? 3 : l} h={20} />
      ))}
      <Block x={-34} y={70} z={30} w={300} d={10} h={3} top="red" left="red-hatch" right="red-hatch" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <path key={i} d={path([-24 + i * 30, 70, 33], [-24 + i * 30, 75, 33])} stroke="#fff" strokeWidth="0.8" />
      ))}
      <Shadow x={276} y={44} w={70} d={60} s={18} />
      <Block x={276} y={44} w={70} d={60} h={8} left="paper" />
      <polygon points={pts([286, 44, 8], [316, 44, 8], [312, 36, 8], [290, 36, 8])} fill="#fff" />
      <Tag plane="top" x={286} y={70} z={8} size={10}>CLAIM</Tag>
      <Lines x={286} y={82} z={8} w={48} n={2} gap={9} />
    </Art>
  )
}

/* ---------- 4. Every dollar needs a trail ---------- */

const stamps = ['INTERCEPTED', 'ON HOLD', 'DISTRIBUTED']

export function TrailArt() {
  return (
    <Art label="A coin stack at the start of a receipt tape stamped intercepted, on hold and distributed in red, with the rubber stamp beside it">
      <Shadow x={-40} y={60} w={330} d={60} s={20} />
      <Block x={-40} y={60} w={330} d={60} h={2} />
      <path d={`M${pt(290, 60, 2)} C${pt(304, 60, 4)} ${pt(306, 60, 24)} ${pt(294, 60, 26)}`} fill="none" />
      <path d={`M${pt(290, 120, 2)} C${pt(304, 120, 4)} ${pt(306, 120, 24)} ${pt(294, 120, 26)}`} fill="none" />
      <path d={path([294, 60, 26], [294, 120, 26])} />
      {stamps.map((s, i) => {
        const x = -20 + i * 105
        return (
          <g key={s} stroke={RED}>
            <polygon points={pts([x, 72, 2], [x + 88, 72, 2], [x + 88, 108, 2], [x, 108, 2])} fill="none" strokeWidth="1.4" />
            <Tag plane="top" x={x + 44} y={94} z={2} size={9} fill={RED} anchor="middle">{s}</Tag>
            {i < 2 && <path d={path([x + 92, 90, 2], [x + 101, 90, 2])} strokeDasharray="2 2" />}
          </g>
        )
      })}
      {[0, 1, 2, 3].map((i) => <Drum key={i} x={-70} y={100} z={i * 7} r={20} h={7} />)}
      <Tag plane="top" x={-77} y={103} z={28} size={13}>$</Tag>
      <Shadow x={190} y={150} w={50} d={36} s={18} />
      <Block x={190} y={150} w={50} d={36} h={6} top="red" left="red-hatch" right="red-hatch" />
      <Block x={196} y={154} z={6} w={38} d={28} h={14} />
      <Drum x={215} y={168} z={20} r={6} h={26} />
      <Drum x={215} y={168} z={46} r={11} h={10} top="url(#ink-dots)" />
    </Art>
  )
}

/* ---------- 5. A status that tells a story ---------- */

const steps = ['DONE', 'NOW', 'NEXT']

export function StoryArt() {
  return (
    <Art label="Three standing cards on a ledge, done with a tick, now in red with an hourglass and next with an arrow">
      <Shadow x={-130} y={60} w={330} d={40} s={22} />
      <Block x={-130} y={60} w={330} d={40} h={8} />
      {steps.map((s, i) => {
        const x = -120 + i * 110
        const now = i === 1
        const ink = now ? '#fff' : '#1D1D1B'
        return (
          <g key={s}>
            <Block x={x} y={70} z={8} w={90} d={8} h={110} left={now ? 'red' : 'paper'} right={now ? 'red-hatch' : 'dots'} />
            <Tag plane="left" x={x + 10} y={78} z={104} size={11} fill={ink}>{s}</Tag>
            <g stroke={ink} strokeWidth="1.8" fill="none">
              {i === 0 && <path d={path([x + 26, 78, 76], [x + 40, 78, 62], [x + 64, 78, 90])} />}
              {now && <path d={path([x + 32, 78, 92], [x + 58, 78, 92], [x + 32, 78, 56], [x + 58, 78, 56], [x + 32, 78, 92])} />}
              {i === 2 && <path d={path([x + 22, 78, 74], [x + 66, 78, 74]) + ' ' + path([x + 54, 78, 86], [x + 66, 78, 74], [x + 54, 78, 62])} />}
            </g>
            <path className="ink-fine" d={path([x + 10, 78, 34], [x + 78, 78, 34]) + ' ' + path([x + 10, 78, 24], [x + 60, 78, 24])} stroke={ink} />
          </g>
        )
      })}
    </Art>
  )
}

/* ---------- 6. The whole person in one place ---------- */

const papers = ['CLAIM', 'HEARING', 'PAYMENT']

export function PictureArt() {
  return (
    <Art label="A profile folder holding a claim, a hearing notice and a payment record together, held by a red binder clip">
      <Shadow x={-110} y={0} w={240} d={160} s={24} />
      <Block x={-110} y={0} w={240} d={160} h={3} top="hatch" />
      <polygon points={pts([-100, 0, 3], [-30, 0, 3], [-36, -14, 3], [-94, -14, 3])} fill="#fff" />
      <Tag plane="top" x={-90} y={-3} z={3} size={9}>PROFILE</Tag>
      {papers.map((s, i) => {
        const x = -92 + i * 22, y = 14 + i * 14, z = 3 + (i + 1) * 2
        return (
          <g key={s}>
            <Block x={x} y={y} z={z - 2} w={160} d={118} h={2} />
            <Tag plane="top" x={x + 8} y={y + 11} z={z} size={8}>{s}</Tag>
            <Lines x={x + 10} y={y + 28} z={z} w={110} n={i === 2 ? 7 : 1} gap={11} />
          </g>
        )
      })}
      <Block x={80} y={60} z={9} w={46} d={14} h={10} top="red" left="red-hatch" right="red-hatch" />
      <path d={`M${pt(88, 67, 19)} C${pt(88, 60, 50)} ${pt(118, 60, 50)} ${pt(118, 67, 19)}`} fill="none" strokeWidth="1.3" />
      <path d={`M${pt(94, 67, 19)} C${pt(94, 62, 40)} ${pt(112, 62, 40)} ${pt(112, 67, 19)}`} fill="none" strokeWidth="1.3" />
    </Art>
  )
}

/* ---------- 7. Approvals with an owner ---------- */

// bottom tier first, so each tier above is drawn over the one below
const tiers = ['DECISION', 'PENDING', 'ASSIGNED']

export function QueueArt() {
  const post = (x: number, y: number) => <Block x={x} y={y} w={5} d={5} h={150} />
  return (
    <Art label="A three-tier letter tray labelled assigned, pending and decision, with a red owner flag sticking out of the pending tray">
      <Shadow x={-80} y={-10} w={180} d={130} s={30} />
      {post(-80, -10)}
      {tiers.map((t, i) => {
        const z = i * 50
        return (
          <g key={t}>
            <Block x={-80} y={-10} z={z} w={180} d={130} h={4} />
            <Block x={-70} y={0} z={z + 4} w={150} d={100} h={2} />
            <Lines x={-58} y={14} z={z + 6} w={110} n={i === 2 ? 6 : 2} gap={12} />
            {i === 1 && (
              <>
                <Block x={78} y={30} z={z + 6} w={44} d={14} h={2} top="red" left="red-hatch" right="red-hatch" />
                <Tag plane="top" x={84} y={41} z={z + 8} size={8} fill="#fff">OWNER</Tag>
              </>
            )}
            <Block x={-80} y={114} z={z} w={180} d={6} h={18} left="paper" />
            <Tag plane="left" x={-70} y={120} z={z + 13} size={9}>{t}</Tag>
          </g>
        )
      })}
      {post(95, -10)}
      {post(-80, 115)}
      {post(95, 115)}
    </Art>
  )
}

/* ---------- 8. Exceptions stand out ---------- */

const ROW = 15
const flagged = [2, 6]

export function SignalArt() {
  return (
    <Art label="A long ledger of identical rows where two rows carry red flags, with a magnifier resting on one of them">
      <Shadow x={-60} y={0} w={260} d={180} s={22} />
      <Block x={-56} y={4} w={260} d={180} h={2} />
      <Block x={-60} y={0} z={2} w={260} d={180} h={2} />
      <path className="ink-fine" d={Array.from({ length: 11 }, (_, i) => path([-50, 16 + i * ROW, 4], [190, 16 + i * ROW, 4])).join(' ')} />
      <path className="ink-fine" d={[0, 80, 140].map((x) => path([x, 6, 4], [x, 174, 4])).join(' ')} />
      {Array.from({ length: 11 }, (_, r) => (
        <path key={r} className="ink-fine" d={path([-44, 10 + r * ROW, 4], [-14, 10 + r * ROW, 4]) + ' ' + path([8, 10 + r * ROW, 4], [50, 10 + r * ROW, 4]) + ' ' + path([88, 10 + r * ROW, 4], [120, 10 + r * ROW, 4])} />
      ))}
      {flagged.map((r) => (
        <g key={r}>
          <polygon points={pts([-60, 16 + (r - 1) * ROW, 4], [200, 16 + (r - 1) * ROW, 4], [200, 16 + r * ROW, 4], [-60, 16 + r * ROW, 4])} fill={RED} opacity=".14" stroke="none" />
          <Block x={200} y={18 + (r - 1) * ROW} z={3} w={26} d={ROW - 4} h={1.5} top="red" left="red-hatch" right="red-hatch" />
        </g>
      ))}
      <Disc x={30} y={44} z={10} r={26} fill="rgba(255,255,255,.35)" />
      <Disc x={30} y={44} z={10} r={22} fill="none" />
      <path d={path([58, 44, 10], [112, 44, 6])} strokeWidth="5" />
    </Art>
  )
}

/* ---------- 9. Unmatched, but in plain sight ---------- */

export function HiddenArt() {
  const pairs: [number, number][] = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if (!(r === 2 && c === 3)) pairs.push([-120 + c * 55, -10 + r * 50])
  const [lx, ly] = [62, 96]
  const [hx, hy] = xy(96, 84, 120)
  // the light falls on the card's left and right corners as seen on the page
  const [a1x, a1y] = xy(lx - 4, ly + 36, 2)
  const [a2x, a2y] = xy(lx + 46, ly - 4, 2)
  return (
    <Art label="Rows of matched card pairs, and one lone red card that a desk lamp lights up">
      {pairs.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <Shadow x={x} y={y} w={40} d={30} s={8} />
          <Block x={x} y={y} w={40} d={30} h={2} />
          <Block x={x + 5} y={y + 5} z={2} w={40} d={30} h={2} />
          <Lines x={x + 11} y={y + 15} z={4} w={26} n={2} gap={8} />
        </g>
      ))}
      <polygon points={`${hx - 12},${hy + 8} ${hx + 12},${hy + 8} ${a2x},${a2y} ${a1x},${a1y}`} fill="url(#ink-glow)" stroke="none" />
      <Block x={lx} y={ly} w={40} d={30} h={2} top="red" left="red-hatch" right="red-hatch" />
      <path d={path([lx + 8, ly + 12, 2], [lx + 30, ly + 12, 2]) + ' ' + path([lx + 8, ly + 20, 2], [lx + 22, ly + 20, 2])} stroke="#fff" />
      <Drum x={150} y={70} r={16} h={5} />
      <path d={path([150, 70, 5], [158, 70, 95], [96, 84, 120])} fill="none" strokeWidth="2.2" />
      <path d={`M${hx - 14} ${hy + 10} L${hx - 4} ${hy - 14} H${hx + 8} L${hx + 16} ${hy + 10} Z`} fill="#fff" />
      <path d={`M${hx - 14} ${hy + 10} L${hx - 4} ${hy - 14} H${hx + 8} L${hx + 16} ${hy + 10} Z`} fill="url(#ink-hatch-dense)" stroke="none" />
      <path d={`M${hx - 14} ${hy + 10} L${hx - 4} ${hy - 14} H${hx + 8} L${hx + 16} ${hy + 10} Z`} fill="none" />
      <Tag plane="top" x={lx - 2} y={ly + 44} size={8}>UNMATCHED</Tag>
    </Art>
  )
}
