import { useLayoutEffect, useRef, type ReactNode } from 'react'

/**
 * Isometric ink still-lifes for the DSO problems, drawn in the same hand as the
 * hero post card, the Work desk and the Projects brush set (the Scobin chapters reuse the helpers): fine ink lines,
 * hatching and stipple for shade, and one black accent marking the design decision.
 */

const C = 0.866
const S = 0.5
export const ACCENT = '#0a0a0a'
/** the drawing ink, the same as the CSS --ink token */
export const INK = '#1d1d1d'

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
        <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.55" />
      </pattern>
      <pattern id="ink-hatch-dense" patternUnits="userSpaceOnUse" width="2.6" height="2.6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="2.6" stroke={INK} strokeWidth="0.55" />
      </pattern>
      <pattern id="ink-dots" patternUnits="userSpaceOnUse" width="3.2" height="3.2">
        <circle cx="1.6" cy="1.6" r="0.55" fill={INK} />
      </pattern>
      <pattern id="ink-shade" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="3" stroke="#9a9a9a" strokeWidth="0.5" />
      </pattern>
      <pattern id="ink-glow" patternUnits="userSpaceOnUse" width="3.5" height="3.5">
        <circle cx="1.75" cy="1.75" r="0.5" fill={INK} opacity=".55" />
      </pattern>
    </defs>
  </svg>
)

type Fill = 'paper' | 'hatch' | 'dense' | 'dots' | 'accent' | 'accent-hatch' | 'ink'
const fills: Record<Fill, [string, string?]> = {
  paper: ['#fff'],
  hatch: ['#fff', 'url(#ink-hatch)'],
  dense: ['#fff', 'url(#ink-hatch-dense)'],
  dots: ['#fff', 'url(#ink-dots)'],
  accent: [ACCENT],
  'accent-hatch': [ACCENT, 'url(#ink-hatch)'],
  ink: [INK],
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
