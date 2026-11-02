import { Art, Block, Lines, RED, Shadow, Tag, path, pt, pts } from './InkArt'

/** Ink drawings for the Scobin chapters, in the same hand as the DSO problem art. */

const Arrow = ({ x, y }: { x: number; y: number }) => <polygon points={pts([x, y - 4, 0], [x + 9, y, 0], [x, y + 4, 0])} fill="#1D1D1B" />

/** A small chevron lying on a tile's top face. */
const Chevron = ({ x, y, z, color }: { x: number; y: number; z: number; color?: string }) => (
  <path d={path([x - 4, y - 4, z], [x, y, z], [x + 4, y - 4, z])} stroke={color} strokeWidth="1.4" fill="none" />
)

/* ---------- Five dropdowns, one job ---------- */

const dropdowns = [
  { x: 0, y: 0, h: 6, t: 'CHOOSE…', top: 'paper' as const },
  { x: 100, y: 0, h: 12, t: 'SELECT', top: 'paper' as const },
  { x: 200, y: 0, h: 1, t: 'PICK ONE', top: 'paper' as const },
  { x: 50, y: 56, h: 6, t: 'ALL', top: 'hatch' as const },
  { x: 150, y: 56, h: 9, t: 'TYPE…', top: 'paper' as const },
]

export function AuditArt() {
  return (
    <Art label="Five differently styled dropdowns that all do the same job, reduced to one">
      {dropdowns.map((d) => (
        <g key={d.t}>
          <Shadow x={d.x} y={d.y} w={76} d={26} s={10} />
          <Block x={d.x} y={d.y} w={76} d={26} h={d.h} top={d.top} />
          <Tag plane="top" x={d.x + 8} y={d.y + 17} z={d.h} size={8}>{d.t}</Tag>
          <Chevron x={d.x + 64} y={d.y + 15} z={d.h} />
          <path className="ink-fine" d={path([d.x + 38, d.y + 26, 0], [218, 180, 0])} strokeDasharray="2 3" />
        </g>
      ))}
      <Shadow x={170} y={180} w={96} d={32} s={14} />
      <Block x={170} y={180} w={96} d={32} h={8} />
      <Tag plane="top" x={180} y={200} z={8} size={10}>SELECT</Tag>
      <Block x={240} y={184} z={8} w={20} d={24} h={3} top="red" left="red-hatch" right="red-hatch" />
      <Chevron x={250} y={199} z={11} color="#fff" />
      <Tag plane="top" x={172} y={230} size={8}>ONE DROPDOWN</Tag>
    </Art>
  )
}

/* ---------- Sticky notes settle into three themes ---------- */

const columns = [
  { head: 'WHICH ONE?', notes: ['TWO BUTTONS?', 'COPY OLD ONE', 'ASK IN CHAT'] },
  { head: 'WHAT IF…?', notes: ['EMPTY STATE?', 'ERROR STATE?', 'LOADING?'] },
  { head: 'CAN I REACH IT?', notes: ['TAB ORDER?', 'FOCUS RING?', 'SCREEN READER?'] },
]

export function NotesArt() {
  const face = 8
  const note = (x: number, z: number, w = 76, h = 30) => pts([x, face, z], [x + w, face, z], [x + w, face, z - h], [x, face, z - h])
  return (
    <Art label="A whiteboard of nine sticky notes from interviews, grouped under three red headings: which one, what if, and can I reach it">
      <Shadow x={-6} y={0} w={312} d={8} s={50} />
      {[14, 284].map((x) => <Block key={x} x={x} y={1} w={6} d={6} h={26} />)}
      <Block x={-6} y={0} z={26} w={312} d={face} h={190} left="paper" />
      {columns.map((c, i) => {
        const x = 12 + i * 100
        return (
          <g key={c.head}>
            {c.notes.map((n, j) => (
              <g key={n}>
                <polygon points={note(x, 206 - j * 40)} fill="#fff" />
                <polygon points={note(x, 206 - j * 40, 76, 8)} fill="url(#ink-hatch)" />
                <Tag plane="left" x={x + 6} y={face} z={206 - j * 40 - 20} size={7}>{n}</Tag>
              </g>
            ))}
            <polygon points={note(x, 78, 76, 22)} fill={RED} />
            <Tag plane="left" x={x + 6} y={face} z={63} size={7.5} fill="#fff">{c.head}</Tag>
          </g>
        )
      })}
    </Art>
  )
}

/* ---------- One screen, before and after the library ---------- */

const before = [
  { t: 'DESIGN', x: 0, w: 76 },
  { t: 'BUILD', x: 120, w: 76 },
  { t: 'REVIEW', x: 240, w: 76 },
]
const after = [
  { t: 'PICK A PART', x: 0, w: 96 },
  { t: 'STATES ARE THERE', x: 128, w: 116 },
  { t: 'SHIP', x: 276, w: 60 },
]

export function FlowArt() {
  const row = (items: typeof before, y: number, last?: boolean) => items.map((b, i) => (
    <g key={b.t}>
      <Shadow x={b.x} y={y} w={b.w} d={36} s={12} />
      <Block x={b.x} y={y} w={b.w} d={36} h={22} left={last && i === items.length - 1 ? 'red' : 'paper'} right={last && i === items.length - 1 ? 'red-hatch' : 'dots'} />
      <Tag plane="left" x={b.x + 8} y={y + 36} z={8} size={8} fill={last && i === items.length - 1 ? '#fff' : undefined}>{b.t}</Tag>
      {i < items.length - 1 && (
        <>
          <path d={path([b.x + b.w + 4, y + 18, 0], [items[i + 1].x - 12, y + 18, 0])} />
          <Arrow x={items[i + 1].x - 12} y={y + 18} />
        </>
      )}
    </g>
  ))
  return (
    <Art label="Before: design, build and review loop back with questions. With the library: pick a part, its states are already there, ship">
      <Tag plane="top" x={-96} y={22} size={9}>BEFORE</Tag>
      {row(before, 0)}
      <path d={`M${pt(278, 18, 22)} C${pt(278, 18, 110)} ${pt(38, 18, 110)} ${pt(38, 18, 22)}`} fill="none" strokeDasharray="3 3" />
      <Tag plane="left" x={70} y={18} z={96} size={7.5}>WHICH VARIANT? IS IT EMPTY? IS THAT COLOR ALLOWED?</Tag>
      <Tag plane="top" x={-130} y={148} size={9}>WITH SCOBIN</Tag>
      {row(after, 126, true)}
    </Art>
  )
}

/* ---------- The app shell in grey boxes ---------- */

const rect = (x0: number, y0: number, x1: number, y1: number, z: number) => pts([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])

export function WireArt() {
  const z = 4
  return (
    <Art label="Grey-box wireframe of the app shell lying on the desk: header 64, nav 256, main 1024, with one red primary button">
      <Shadow x={0} y={0} w={280} d={190} s={20} />
      <Block x={0} y={0} w={280} d={190} h={z} />
      <polygon points={rect(0, 0, 280, 18, z)} fill="url(#ink-hatch)" />
      <Tag plane="top" x={8} y={13} z={z} size={8}>HEADER 64</Tag>
      <polygon points={rect(0, 18, 64, 190, z)} fill="url(#ink-dots)" />
      <Tag plane="top" x={8} y={110} z={z} size={8}>NAV 256</Tag>
      <path className="ink-fine" d={path([76, 30, z], [140, 30, z])} />
      <polygon points={rect(76, 36, 150, 44, z)} fill="#1D1D1B" />
      <polygon points={rect(206, 34, 266, 46, z)} fill={RED} />
      {[76, 124, 172, 220].map((x) => (
        <g key={x}>
          <polygon points={rect(x, 58, x + 42, 92, z)} fill="#fff" />
          <Lines x={x + 6} y={70} z={z} w={28} n={2} gap={10} />
        </g>
      ))}
      <polygon points={rect(76, 104, 262, 176, z)} fill="#fff" />
      <Lines x={84} y={118} z={z} w={170} n={6} gap={10} short={1} />
      <Tag plane="top" x={150} y={186} z={z} size={8}>MAIN 1024</Tag>
    </Art>
  )
}

/* ---------- Three token layers ---------- */

const layers = [
  { k: 'PRIMITIVES · 189', n: 'COLOR 99 · TYPE 48 · SPACING 42' },
  { k: 'ROUTING · 129', n: 'THEME 51 · RESPONSIVE 78' },
  { k: 'APPLIED · 216', n: 'INTENT · TEXT · LINK · SURFACE' },
]

export function LayersArt() {
  return (
    <Art label="Three stacked layers: primitives with 189 variables, routing with 129 and applied with 216, and a red button component resting on the applied layer">
      <Shadow x={0} y={0} w={200} d={160} s={28} />
      {layers.map((l, i) => {
        const z = i * 64
        return (
          <g key={l.k}>
            {i > 0 && <path className="ink-fine" d={[[0, 160], [200, 160], [200, 0]].map(([x, y]) => path([x, y, z - 42], [x, y, z])).join(' ')} strokeDasharray="2 3" />}
            <Block x={0} y={0} z={z} w={200} d={160} h={22} />
            <Tag plane="left" x={10} y={160} z={z + 7} size={11.5}>{l.k}</Tag>
            <Tag plane="right" x={200} y={156} z={z + 8} size={7}>{l.n}</Tag>
          </g>
        )
      })}
      <Block x={70} y={60} z={150} w={64} d={26} h={10} top="red" left="red-hatch" right="red-hatch" />
      <Tag plane="top" x={80} y={77} z={160} size={8} fill="#fff">BUTTON</Tag>
    </Art>
  )
}
