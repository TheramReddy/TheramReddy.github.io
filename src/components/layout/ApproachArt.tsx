import type { CSSProperties } from 'react'

/**
 * The four approach scenes, drawn in the hand of the hero post card and the case-study still-lifes: a .9px contour,
 * .55px interior lines, hatching and stipple for shade with the light from the upper left, a stippled cast shadow
 * under everything that stands, and one seal-red accent each. Every scene shares one frame (345 x 247, the stage's
 * shape) so the four sit at the same scale. Each has one live detail (steam, a pencil at work, modules settling, a
 * crane taking off) that only runs while the scene is on screen.
 */

/* the scenes sit behind the words: a warm graphite instead of black (--art-ink in me.css) and shade a step lighter;
   the seal keeps its red */
const RED = '#C8432E'
const INK = '#55524A'
const SHADE = '#8C887E'
const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties

/* Shapes that are both drawn and used as clips. Clips resolve in the user space of the element using them, so one
   clip serves every copy of a shape however it is placed. */
const POT = 'M114 184 C96 177 92 150 104 137 C116 125 148 125 160 137 C172 150 168 177 150 184 Z'
const CUP = 'M-15 -36 L-12.5 -3 C-8 0 8 0 12.5 -3 L15 -36 A15 3.6 0 0 1 -15 -36 Z'

/** Shared fills and clips, rendered once above the scenes. */
export const ApproachDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <defs>
      <pattern id="ap-hatch" patternUnits="userSpaceOnUse" width="3.6" height="3.6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="3.6" stroke={SHADE} strokeWidth=".5" />
      </pattern>
      <pattern id="ap-dense" patternUnits="userSpaceOnUse" width="2.2" height="2.2" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="2.2" stroke={SHADE} strokeWidth=".5" />
      </pattern>
      <pattern id="ap-cross" patternUnits="userSpaceOnUse" width="3.2" height="3.2" patternTransform="rotate(-45)">
        <line x1="0" y1="0" x2="0" y2="3.2" stroke={SHADE} strokeWidth=".42" />
        <line x1="0" y1="0" x2="3.2" y2="0" stroke={SHADE} strokeWidth=".42" />
      </pattern>
      <pattern id="ap-dots" patternUnits="userSpaceOnUse" width="2.6" height="2.6">
        <circle cx="1.3" cy="1.3" r=".48" fill={SHADE} />
      </pattern>
      <pattern id="ap-grey" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="3" stroke="#bdb9af" strokeWidth=".5" />
      </pattern>
      <clipPath id="ap-pot-clip"><path d={POT} /></clipPath>
      <clipPath id="ap-cup-clip"><path d={CUP} /></clipPath>
    </defs>
  </svg>
)

/** A floor line with a gap or two, so the ground reads as drawn rather than ruled. */
const Ground = ({ y, from = 14, to = 331, gaps = [] }: { y: number; from?: number; to?: number; gaps?: [number, number][] }) => {
  const xs = [from, ...gaps.flat(), to]
  let p = ''
  for (let i = 0; i < xs.length; i += 2) p += `M${xs[i]} ${y} H${xs[i + 1]} `
  return <path className="f" d={p} />
}

/* ---------- 1. Listen: a teapot and two cups on a tray, steam rising from all three ---------- */

/** A yunomi cup standing on its foot at the origin, shaded on the side away from the light. */
const Cup = ({ band }: { band?: boolean }) => (
  <g>
    <ellipse cx="5" cy=".6" rx="17" ry="1.8" fill="url(#ap-dots)" stroke="none" />
    <path className="paper" d="M-10 -3.4 L-9 0 H9 L10 -3.4" />
    <path className="paper" d={CUP} />
    <g clipPath="url(#ap-cup-clip)" stroke="none">
      <path d="M5 -40 H20 V2 H9 C11 -10 8 -28 5 -40 Z" fill="url(#ap-hatch)" />
      <path d="M-20 -6 C-8 -1 8 -1 20 -6 V4 H-20 Z" fill="url(#ap-dense)" />
    </g>
    {band && <path d="M-14.3 -27 C-8 -24.5 8 -24.5 14.3 -27 L14 -23 C8 -20.5 -8 -20.5 -14 -23 Z" fill={RED} stroke="none" />}
    <path className="f" d="M-13.5 -16 C-8 -13.8 8 -13.8 13.5 -16 M-13.1 -10.5 C-8 -8.4 8 -8.4 13.1 -10.5" />
    <path fill="none" d={CUP} />
    <ellipse cx="0" cy="-36" rx="15" ry="3.6" className="paper" />
    <ellipse cx="0" cy="-35.5" rx="13" ry="2.7" className="f" />
    <ellipse cx="0" cy="-35" rx="11.4" ry="2" fill="url(#ap-dots)" stroke="none" />
  </g>
)

/** Three wisps of steam, each fading up on its own clock. */
const Steam = ({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) => (
  <g className="ap-steam" transform={`translate(${x} ${y}) scale(${s})`}>
    <path style={d(delay)} d="M0 0 C-6 -9 6 -17 0 -27 S-6 -44 0 -54" />
    <path style={d(delay + 1.1)} d="M-7 -6 C-11 -14 -3 -20 -7 -29 S-11 -40 -6 -48" />
    <path style={d(delay + 2.2)} d="M7 -5 C3 -14 11 -21 7 -31 S3 -42 8 -51" />
  </g>
)

export const ListenArt = () => (
  <svg className="ap-svg" viewBox="22 44 300 215" aria-hidden="true">
    <Ground y={206} from={24} to={322} gaps={[[226, 232]]} />
    <path d="M44 206 H318 L313 210 H50 Z" fill="url(#ap-dots)" stroke="none" />

    {/* the tray: a top in shallow perspective, a grained front edge, two feet */}
    <path className="paper" d="M44 182 H300 L312 190 H32 Z" />
    <path className="h" d="M58 185.5 C110 184.5 170 187 230 185.5 S286 186 296 186" />
    <path className="paper" d="M32 190 H312 V198 H32 Z" />
    <path className="h" d="M38 193 C90 192 140 195 200 193 S280 192 306 194 M36 196 C100 195 160 197 230 195.6 S290 196 309 196" />
    <path className="paper" d="M48 198 V206 H62 V198 M282 198 V206 H296 V198" />
    <path d="M56 198 H62 V206 H56 Z M290 198 H296 V206 H290 Z" fill="url(#ap-hatch)" stroke="none" />

    {/* a tent card with the first question on it */}
    <path className="paper" d="M80 156 L86 188 H74 Z" />
    <path d="M80 156 L86 188 H74 Z" fill="url(#ap-grey)" stroke="none" />
    <path className="paper" d="M46 188 L52 156 H80 L74 188 Z" />
    <text transform="matrix(1 0 -.1875 1 0 0)" x="84.6" y="173" className="ap-hand" style={{ fontSize: 8.5 }}>why?</text>
    <path className="f" d="M51 179 H68 M50 183.4 H63" />

    {/* the teapot, a round body under a bamboo bail */}
    <g transform="translate(18 0)">
      <ellipse cx="140" cy="187.6" rx="36" ry="2" fill="url(#ap-dots)" stroke="none" />
      <path className="paper" d="M101 166 C88 163 79 152 72 134 L79 131 C84 144 92 151 102 152 Z" />
      <path d="M101 166 C90 163 82 155 76 142.5 L79.6 141 C85 150 92 156 101.5 158.5 Z" fill="url(#ap-hatch)" stroke="none" />
      <ellipse cx="75.5" cy="132.5" rx="4.2" ry="1.7" transform="rotate(-22 75.5 132.5)" className="paper" />
      <path className="paper" d="M110 184 H154 L152 188 H112 Z" />
      <path className="paper" d={POT} />
      <g clipPath="url(#ap-pot-clip)" stroke="none">
        <rect x="90" y="120" width="90" height="70" fill="url(#ap-hatch)" />
        <ellipse cx="124" cy="152" rx="35" ry="33" fill="#fff" />
        <path d="M90 178 C110 186 150 186 175 176 V190 H90 Z" fill="url(#ap-dense)" />
      </g>
      <path fill="none" d={POT} />
      <path className="f" d="M99.5 162 C118 169 146 169 164.5 162 M100.5 166.5 C118 173.5 146 173.5 163.5 166.5" />
      <path className="f" d="M108 147 C110 142 114 138 119 135.5" />
      <path className="paper" d="M114 131 C116 122 148 122 150 131 C144 133.6 120 133.6 114 131 Z" />
      <path d="M141 123.6 C146 125 149 128 150 131 C147.4 132.2 144.6 132.8 142 133 C142.8 129.4 142.4 126.4 141 123.6 Z" fill="url(#ap-hatch)" stroke="none" />
      <path className="paper" d="M128.5 124.6 C128 120.2 136 120.2 135.5 124.6 Z" />
      <ellipse cx="132" cy="120.8" rx="3.8" ry="1.4" className="paper" />
      <ellipse cx="106.5" cy="138.6" rx="2.4" ry="3.2" className="paper" />
      <ellipse cx="157.5" cy="138.6" rx="2.4" ry="3.2" className="paper" />
      <path className="paper" d="M104 137 C100 92 164 92 160 137 L155 137 C158 99 106 99 109 137 Z" />
      <path d="M146 108 C154 114 158 124 160 137 L155 137 C154 126 151 117 145 111.6 Z" fill="url(#ap-hatch)" stroke="none" />
      <path className="f" d="M111.6 111.7 L115.3 115.6 M132 103.3 V108.5 M152.4 111.7 L148.7 115.6" />
    </g>

    {/* two cups, the near one banded red */}
    <g transform="translate(270 185) scale(.88)"><Cup /></g>
    <g transform="translate(228 188)"><Cup band /></g>

    <Steam x={94} y={127} s={0.7} />
    <Steam x={228} y={146} s={0.78} delay={0.6} />
    <Steam x={270} y={149} s={0.62} delay={1.4} />
  </svg>
)

/* ---------- 2. Sketch: a sketchbook on a desk easel filling with thumbnails, a pencil at work ---------- */

/** A hexagonal pencil lying along +x from its point at the origin. */
const Pencil = () => (
  <g>
    <path className="paper" d="M12 -3.5 H78 V3.5 H12 Z" />
    <path d="M12 1.2 H78 V3.5 H12 Z" fill="url(#ap-hatch)" stroke="none" />
    <path className="f" d="M12 -1.2 H78 M12 1.2 H78" />
    <path className="paper" d="M78 -3.6 H86 V3.6 H78 Z" />
    <path d="M78 1 H86 V3.6 H78 Z" fill="url(#ap-dense)" stroke="none" />
    <path className="f" d="M80.6 -3.6 V3.6 M83.3 -3.6 V3.6" />
    <path className="paper" d="M86 -3.4 H90.5 C92.8 -3.4 92.8 3.4 90.5 3.4 H86 Z" />
    <path className="paper" d="M0 0 L12 -3.5 C10.6 -2.2 10.6 -1.2 12 0 C10.6 1.2 10.6 2.2 12 3.5 Z" />
    <path d="M6 0 L12 3.5 L11.2 1.4 Z" fill="url(#ap-grey)" stroke="none" />
    <path d="M0 0 L4 -1.2 V1.2 Z" fill={INK} />
  </g>
)

type Variant = 'split' | 'stack' | 'list'
/** One rough wireframe thumbnail in one of three layouts; its lines draw in on a loop, starting at `delay`. */
const Thumb = ({ x, y, w = 52, h = 38, v, delay = 0, crossed }: { x: number; y: number; w?: number; h?: number; v: Variant; delay?: number; crossed?: boolean }) => {
  const body =
    v === 'split'
      ? `M4 10 H${w * 0.46} V${h - 4} H4 Z M4 10 L${w * 0.46} ${h - 4} M${w * 0.46} 10 L4 ${h - 4} M${w * 0.54} 12 H${w - 5} M${w * 0.54} 17 H${w - 9} M${w * 0.54} 22 H${w - 7} M${w * 0.54} ${h - 9} H${w * 0.8} V${h - 4} H${w * 0.54} Z`
      : v === 'stack'
        ? `M4 10 H${w - 4} V${h * 0.6} H4 Z M4 10 L${w - 4} ${h * 0.6} M${w - 4} 10 L4 ${h * 0.6} M4 ${h * 0.6 + 5} H${w - 10} M4 ${h * 0.6 + 10} H${w * 0.6}`
        : [11, 19, 27].map((r) => `M6.5 ${r} m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M11 ${r - 1} H${w - 6} M11 ${r + 1.4} H${w * 0.55}`).join(' ')
  return (
    <g className="ap-draw" style={d(delay)} transform={`translate(${x} ${y})`}>
      <path pathLength={1} d={`M0 0 H${w} V${h} H0 Z`} />
      <path pathLength={1} d={`M4 4.5 H${w * 0.3} M${w - 14} 4.5 H${w - 4}`} />
      <path pathLength={1} className="ap-thin" d={body} />
      {crossed && <path pathLength={1} className="ap-strike" d={`M-3 ${h + 2} L${w + 3} -2`} />}
    </g>
  )
}

/** A crumpled paper ball: an irregular outline, creases, and its shadowed facets. */
const Crumple = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="3" cy="9" rx="12" ry="1.6" fill="url(#ap-dots)" stroke="none" />
    <polygon className="paper" points="-10,0 -8,-6 -3,-9.5 3,-9 8,-6 11,-1 10,5 5,9 -1,9.5 -7,8 -10.5,4" />
    <polygon points="-2,-2 11,-1 10,5 5,9 -1,9.5 -0.5,3" fill="url(#ap-hatch)" stroke="none" />
    <polygon points="-0.5,3 -1,9.5 -7,8 -10.5,4" fill="url(#ap-grey)" stroke="none" />
    <path className="f" d="M-8 -6 L-2 -2 L3 -9 M-2 -2 L11 -1 M-2 -2 L-0.5 3 L5 9 M-0.5 3 L-10.5 4 M-3 -9.5 L-5 -3 L-10 0 M8 -6 L4 -3 M-0.5 3 L4 2" />
  </g>
)

export const SketchArt = () => (
  <svg className="ap-svg" viewBox="4 4 337 241" aria-hidden="true">
    <Ground y={210.5} from={8} to={337} gaps={[[110, 116]]} />
    <path d="M58 210.5 H276 L271 214 H64 Z" fill="url(#ap-dots)" stroke="none" />

    {/* a cup of pencils and a rule */}
    <g transform="translate(26 120) rotate(80)"><g transform="scale(.8)"><Pencil /></g></g>
    <g transform="translate(37 116) rotate(6)">
      <path className="paper" d="M0 0 H7 V64 H0 Z" />
      <path className="f" d="M0 6 H3 M0 12 H4.5 M0 18 H3 M0 24 H4.5 M0 30 H3 M0 36 H4.5 M0 42 H3 M0 48 H4.5" />
    </g>
    <g transform="translate(46 130) rotate(100)"><g transform="scale(.76)"><Pencil /></g></g>
    <path className="paper" d="M18 170 L20 208 C26 211.4 42 211.4 48 208 L50 170 A16 3.5 0 0 1 18 170 Z" />
    <path d="M39 173.3 C43.6 172.8 47.4 171.6 50 170 L48 208 C45.6 209.4 42.4 210.2 39 210.6 Z" fill="url(#ap-hatch)" stroke="none" />
    <path className="f" d="M18.6 178 C26 181 42 181 49.4 178" />
    <path fill="none" d="M18 170 L20 208 C26 211.4 42 211.4 48 208 L50 170" />
    <ellipse cx="34" cy="170" rx="16" ry="3.5" fill="none" />

    {/* the sketchbook: back cover, page block, the open page */}
    <path className="paper" d="M67 47 H263 V197 H67 Z" />
    <path d="M67 47 H263 V197 H67 Z" fill="url(#ap-hatch)" stroke="none" />
    <path className="paper" d="M64.5 45.5 H260.5 V195.5 H64.5 Z" />
    <path className="paper" d="M62 44 H258 V194 H62 Z" />
    {Array.from({ length: 17 }, (_, i) => {
      const x = 72 + i * 11
      return (
        <g key={x}>
          <circle cx={x} cy="50" r="1.3" fill={INK} />
          <path d={`M${x} 50 C${x - 1.6} 45 ${x} 38.6 ${x + 3} 38.6 C${x + 5.2} 38.6 ${x + 5.4} 42 ${x + 4.2} 44.4`} />
        </g>
      )
    })}
    <Thumb x={74} y={60} v="split" delay={0} />
    <Thumb x={134} y={60} v="stack" delay={0.5} crossed />
    <Thumb x={194} y={60} v="list" delay={1} />
    <Thumb x={74} y={108} v="stack" delay={1.5} crossed />
    <Thumb x={134} y={108} v="list" delay={2} />
    <Thumb x={194} y={108} v="split" delay={2.5} />
    <ellipse className="ap-circle" pathLength={1} cx="220" cy="127" rx="36" ry="26" style={d(3.1)} />
    {/* a three-step flow and margin notes */}
    <g className="ap-draw" style={d(3.5)}>
      <path pathLength={1} d="M74 162 H92 V174 H74 Z M104 162 H122 V174 H104 Z M134 162 H152 V174 H134 Z" />
      <path pathLength={1} className="ap-thin" d="M93 168 H102 M99 165.6 L102 168 L99 170.4 M123 168 H132 M129 165.6 L132 168 L129 170.4" />
      <path pathLength={1} className="ap-thin" d="M166 164 C170 162 174 166 178 164 S186 162 190 164 S198 166 204 164 M166 172 C171 170 175 174 180 172 S188 170 196 172 M166 180 C170 178 176 182 184 180 S194 178 206 181" />
    </g>

    {/* the desk easel's lip holds the book */}
    <path className="paper" d="M54 191 H272 V199 H54 Z" />
    <path d="M54 196 H272 V199 H54 Z" fill="url(#ap-hatch)" stroke="none" />
    <path className="paper" d="M64 199 L60 210 H67 L70 199 M256 199 L260 210 H267 L262 199" />

    {/* the pencil, writing the margin notes */}
    <g className="ap-pencil">
      <g transform="translate(207 180) rotate(-48)"><Pencil /></g>
    </g>

    {/* discarded tries on the desk */}
    <Crumple x={296} y={200} />
    <Crumple x={322} y={204} s={0.62} />
  </svg>
)

/* ---------- 3. Shape: a folding screen, modules settling into its lattice ---------- */

const XS = [48, 112, 176, 240, 304]
const TOP = [38, 52, 38, 52, 38]
const BOT = [200, 190, 200, 190, 200]
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** A point on panel i at u across (0..1) and v down (0..1). */
const at = (i: number, u: number, v: number): [number, number] => {
  const x = lerp(XS[i], XS[i + 1], u)
  const t = lerp(TOP[i], TOP[i + 1], u)
  const b = lerp(BOT[i], BOT[i + 1], u)
  return [x, lerp(t, b, v)]
}
const quad = (i: number, u0: number, v0: number, u1: number, v1: number) =>
  [at(i, u0, v0), at(i, u1, v0), at(i, u1, v1), at(i, u0, v1)].map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')
const line = (i: number, u0: number, v0: number, u1: number, v1: number) => {
  const [a, b] = [at(i, u0, v0), at(i, u1, v1)]
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`
}

const IN = 0.09
const cellU = [IN, 0.363, 0.637, 1 - IN]
const cellV = [0.05, 0.2375, 0.425, 0.6125, 0.8]
/** Modules that settle into lattice cells: [panel, column, row, fill]. */
const MODULES: [number, number, number, string][] = [
  [1, 0, 0, 'url(#ap-dense)'],
  [1, 1, 0, 'url(#ap-dense)'],
  [0, 1, 1, 'url(#ap-hatch)'],
  [1, 2, 2, 'url(#ap-dots)'],
  [2, 0, 2, 'url(#ap-cross)'],
  [0, 0, 3, 'url(#ap-dots)'],
  [3, 1, 1, 'url(#ap-dense)'],
  [3, 0, 3, 'url(#ap-dots)'],
  [3, 2, 3, 'url(#ap-hatch)'],
]

/** The screen's footprint: its foot line and the same line pushed back and right, where the light throws it. */
const SHADOW = (() => {
  const foot = XS.map((x, i) => [x, BOT[i] + 5])
  const cast = foot.map(([x, y]) => [x + 20, y + 7]).reverse()
  return [...foot, ...cast].map((p) => p.join(',')).join(' ')
})()

export const ShapeArt = () => {
  const sun = at(2, 0.5, 0.3)
  return (
    <svg className="ap-svg" viewBox="4 14 337 241" aria-hidden="true">
      <defs>
        <clipPath id="ap-sun-clip"><polygon points={quad(2, IN, cellV[0], 1 - IN, cellV[4])} /></clipPath>
      </defs>
      <Ground y={205.5} from={10} to={335} />
      <polygon points={SHADOW} fill="url(#ap-dots)" stroke="none" />

      {/* panels: paper, the folds turned from the light in grey, a wooden kick panel */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <polygon className="paper" points={quad(i, 0, 0, 1, 1)} />
          {i % 2 === 1 && <polygon points={quad(i, 0, 0, 1, 1)} fill="url(#ap-grey)" stroke="none" />}
          <polygon points={quad(i, IN, 0.84, 1 - IN, 0.965)} fill="url(#ap-hatch)" className="f" />
        </g>
      ))}

      {MODULES.map(([i, c, r, fill], k) => (
        <polygon key={k} className="ap-module" style={d(0.3 + k * 0.28)} points={quad(i, cellU[c], cellV[r], cellU[c + 1], cellV[r + 1])} fill={fill} />
      ))}
      <g clipPath="url(#ap-sun-clip)">
        <circle className="ap-sun" cx={sun[0]} cy={sun[1]} r="19" fill={RED} stroke="none" />
      </g>

      {/* the lattice and frames sit over everything behind the paper */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <polygon className="f" points={quad(i, IN, cellV[0], 1 - IN, cellV[4])} />
          {cellU.slice(1, -1).map((u) => <path key={u} className="f" d={line(i, u, cellV[0], u, cellV[4])} />)}
          {cellV.slice(1, -1).map((v) => <path key={v} className="f" d={line(i, IN, v, 1 - IN, v)} />)}
          <polygon className="f" points={quad(i, 0.035, 0.018, 0.965, 0.982)} />
          <polygon fill="none" points={quad(i, 0, 0, 1, 1)} />
          <path className="ap-foot" d={line(i, 0.02, 1, 0.02, 1.03)} />
          {i > 0 && <path className="ap-hinge" d={`${line(i, 0, 0.17, 0, 0.23)} ${line(i, 0, 0.74, 0, 0.8)}`} />}
        </g>
      ))}
      <path className="ap-foot" d={line(3, 0.98, 1, 0.98, 1.03)} />

      {/* a set square leaning on the first panel, a swatch fan on the floor */}
      <path className="paper" fillRule="evenodd" d="M24 207 H86 L24 170 Z M30.5 201.5 H63 L30.5 182.4 Z" />
      <path d="M24 207 H86 L82 204.6 H24 Z" fill="url(#ap-grey)" stroke="none" />
      <path className="f" d="M30 207 v-3 M36 207 v-2 M42 207 v-3 M48 207 v-2 M54 207 v-3 M60 207 v-2 M66 207 v-3 M72 207 v-2 M78 207 v-3" />
      <ellipse cx="300" cy="222.5" rx="26" ry="2" fill="url(#ap-dots)" stroke="none" />
      {[
        [-42, '#fff'],
        [-22, 'url(#ap-dots)'],
        [-2, 'url(#ap-hatch)'],
        [18, 'url(#ap-dense)'],
      ].map(([r, fill], k) => (
        <g key={k} transform={`rotate(${r} 300 220)`}>
          <rect x="294.5" y="180" width="11" height="42" rx="1.6" className="paper" />
          <rect x="296.5" y="182" width="7" height="24" fill={fill as string} className="f" />
          <path className="f" d="M296.5 210 H303 M296.5 213 H301" />
        </g>
      ))}
      <circle cx="300" cy="218" r="1.8" className="paper" />
    </svg>
  )
}

/* ---------- 4. Ship: a paper crane lifting off the sheet it was folded from ---------- */

/** Gull marks for the cranes already far away. */
const far = (x: number, y: number) => `M${x} ${y} q2.6 -2.6 5.2 0 q2.6 -2.6 5.2 0`

export const ShipArt = () => (
  <svg className="ap-svg" viewBox="0 6 345 247" aria-hidden="true">
    <Ground y={198} from={14} to={331} gaps={[[96, 220]]} />
    <circle cx="266" cy="70" r="27" fill={RED} stroke="none" />

    {/* the sheet it was folded from, opened flat and creased */}
    <path className="paper" d="M158 200 L214 214 L158 228 L102 214 Z" />
    <path d="M158 214 L214 214 L158 228 Z" fill="url(#ap-grey)" stroke="none" />
    <path className="f" d="M102 214 H214 M158 200 V228 M158 200 L136 214 L158 228 M158 200 L180 214 L158 228" />
    <path className="f ap-dash" d="M130 207 L186 221 M186 207 L130 221" />
    <ellipse className="ap-shadow" cx="162" cy="214" rx="24" ry="3.2" fill="url(#ap-dots)" stroke="none" />

    {/* wind, and three cranes already away */}
    <g className="ap-wind">
      <path pathLength={1} className="f" d="M318 176 C296 170 276 178 256 172 S232 160 240 150 S256 148 252 156" />
      <path pathLength={1} className="f" style={d(1.3)} d="M334 148 C314 143 298 150 280 145" />
    </g>
    <g className="ap-far">
      <path className="f" d={far(300, 128)} />
      <path className="f" style={d(1.2)} d={far(318, 112)} />
      <path className="f" style={d(2.1)} d={far(52, 74)} />
      <path className="f" style={d(0.6)} d={far(74, 56)} />
    </g>

    {/* the path it took off along */}
    <path className="f ap-trail" d="M158 210 C140 196 134 178 146 162 S162 150 160 144" />

    {/* the crane: wing behind, tail, neck and head, body, wing in front; light from the upper left */}
    <g className="ap-crane">
      <g transform="translate(158 120) scale(1.35)">
        <g className="ap-wing ap-wing-back">
          <polygon className="paper" points="-14,-8 10,-8 -16,-62" />
          <polygon points="-1,-8 10,-8 -16,-62" fill="url(#ap-dense)" stroke="none" />
          <path className="f" d="M-1 -8 L-16 -62" />
        </g>
        <polygon className="paper" points="20,-5 48,-44 12,-1" />
        <polygon className="paper" points="12,-1 48,-44 8,5" />
        <polygon points="12,-1 48,-44 8,5" fill="url(#ap-hatch)" stroke="none" />
        <polygon className="paper" points="-20,-5 -48,-42 -12,-1" />
        <polygon className="paper" points="-12,-1 -48,-42 -8,5" />
        <polygon points="-12,-1 -48,-42 -8,5" fill="url(#ap-hatch)" stroke="none" />
        <polygon className="paper" points="-48,-42 -43.6,-38 -60,-31" />
        <polygon points="-45.6,-40 -43.6,-38 -60,-31" fill="url(#ap-dense)" stroke="none" />
        <polygon className="paper" points="-22,-5 -6,-9 6,-9 22,-5 0,14" />
        <polygon points="0,-9 6,-9 22,-5 0,14" fill="url(#ap-hatch)" stroke="none" />
        <path className="f" d="M0 -9 V14 M-22 -5 L0 1 L22 -5" />
        <g className="ap-wing ap-wing-front">
          <polygon className="paper" points="-10,-8 16,-8 32,-66" />
          <polygon points="-10,-8 3,-8 32,-66" fill="url(#ap-hatch)" stroke="none" />
          <path className="f" d="M3 -8 L32 -66" />
        </g>
      </g>
    </g>
  </svg>
)
