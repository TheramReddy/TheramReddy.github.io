import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'
import { Defs } from './Diagrams'

const img = (name: string) => `/projects/scobin/${name}.png`

const Shot = ({ name, w, h, alt }: { name: string; w: number; h: number; alt: string }) => (
  <img src={img(name)} width={w} height={h} loading="lazy" decoding="async" alt={alt} />
)

/** A wide Figma board that scrolls sideways on small screens. */
const Board = (props: Parameters<typeof Shot>[0]) => (
  <div className="board" tabIndex={0} role="group" aria-label="Scrollable board">
    <Shot {...props} />
  </div>
)

export type Chapter = {
  id: string
  title: string
  body: string[]
  decision?: string
  art?: ReactNode
  /** art runs the full width above the text instead of sitting beside it */
  wide?: boolean
  /** put the art on the right */
  flip?: boolean
}

const Chev = ({ x, y }: { x: number; y: number }) => (
  <path d={`M${x - 6} ${y - 3} L${x} ${y + 4} L${x + 6} ${y - 3}`} className="d-line" />
)

/** Five dropdowns, one job. */
function Audit() {
  return (
    <svg viewBox="0 0 640 376" role="img" aria-label="Five differently styled dropdowns that all do the same job, reduced to one">
      <Defs id="arr-audit" />
      <rect x="48" y="40" width="160" height="44" rx="2" className="d-box" />
      <text x="64" y="68" className="d-note">Choose…</text>
      <Chev x={190} y={60} />

      <rect x="240" y="40" width="160" height="44" rx="22" className="d-box" />
      <text x="262" y="68" className="d-note">Select</text>
      <path d="M368 57 L380 57 L374 66 Z" fill="currentColor" />

      <path d="M432 84 H592" className="d-line" />
      <text x="432" y="68" className="d-note">pick one</text>
      <Chev x={580} y={60} />

      <rect x="144" y="116" width="160" height="44" rx="6" fill="#ececec" />
      <text x="162" y="144" className="d-note">All</text>
      <path d="M276 132 L281 127 L286 132 M276 143 L281 148 L286 143" className="d-line" />

      <rect x="340" y="120" width="160" height="44" rx="3" className="d-box" />
      <rect x="336" y="116" width="160" height="44" rx="3" className="d-line" />
      <text x="358" y="147" className="d-note">Type…</text>
      <Chev x={478} y={140} />

      <path d="M320 184 V232" className="d-line d-dash" markerEnd="url(#arr-audit)" />
      <text x="338" y="214" className="d-small">same job</text>

      <rect x="240" y="248" width="160" height="44" rx="6" className="d-box" />
      <text x="260" y="276" className="d-note">Select</text>
      <Chev x={382} y={270} />
      <text x="320" y="336" textAnchor="middle" className="d-label d-em">one dropdown</text>
    </svg>
  )
}

const notes: { x: number; y: number; t: string; r: number; sx: number; sy: number; sr: number }[] = [
  { x: 54, y: 40, t: 'two buttons?', r: -2, sx: -30, sy: 20, sr: -14 },
  { x: 54, y: 112, t: 'copy old one', r: 1.5, sx: 120, sy: 70, sr: 18 },
  { x: 54, y: 184, t: 'ask in chat', r: -1, sx: 150, sy: -30, sr: -8 },
  { x: 254, y: 40, t: 'empty state?', r: 1.5, sx: -140, sy: 90, sr: 12 },
  { x: 254, y: 112, t: 'error state?', r: -2, sx: 80, sy: -50, sr: -20 },
  { x: 254, y: 184, t: 'loading?', r: 1, sx: -90, sy: 40, sr: 9 },
  { x: 454, y: 40, t: 'tab order?', r: -1.5, sx: -190, sy: 40, sr: 15 },
  { x: 454, y: 112, t: 'focus ring?', r: 2, sx: -60, sy: 110, sr: -12 },
  { x: 454, y: 184, t: 'screen reader?', r: -1, sx: -220, sy: -10, sr: 6 },
]

/** Sticky notes from the sessions settling into three themes. */
function Wall() {
  return (
    <svg viewBox="0 0 640 336" role="img" aria-label="Nine sticky notes from interviews grouping into three themes: which one to use, what states exist, and whether it is reachable">
      {notes.map((n, i) => (
        <g key={n.t} className="note" style={{ '--sx': `${n.sx}px`, '--sy': `${n.sy}px`, '--sr': `${n.sr}deg`, '--i': i } as CSSProperties}>
          <g transform={`rotate(${n.r} ${n.x + 66} ${n.y + 28})`}>
            <rect x={n.x} y={n.y} width="132" height="56" rx="3" className="d-box" />
            <text x={n.x + 66} y={n.y + 34} textAnchor="middle" className="d-note">{n.t}</text>
          </g>
        </g>
      ))}
      {[54, 254, 454].map((x) => <path key={x} d={`M${x} 262 V270 H${x + 132} V262`} className="d-line" />)}
      <text x="120" y="304" textAnchor="middle" className="d-label d-em">Which one?</text>
      <text x="320" y="304" textAnchor="middle" className="d-label d-em">What if…?</text>
      <text x="520" y="304" textAnchor="middle" className="d-label d-em">Can I reach it?</text>
    </svg>
  )
}

/** The path of one screen, before and after the library. */
function Flow() {
  const m = 'url(#arr-flow)'
  return (
    <svg viewBox="0 0 640 336" role="img" aria-label="Before: design, build and review loop back with questions. With the library: pick a part, its states are already there, ship">
      <Defs id="arr-flow" />
      <text x="40" y="32" className="d-small">Before</text>
      {[['Design', 40], ['Build', 270], ['Review', 500]].map(([t, x]) => (
        <g key={t as string}>
          <rect x={x as number} y="52" width="100" height="52" rx="4" className="d-box" />
          <text x={(x as number) + 50} y="85" textAnchor="middle" className="d-label">{t}</text>
        </g>
      ))}
      <path d="M144 78 H266" className="d-line" markerEnd={m} />
      <path d="M374 78 H496" className="d-line" markerEnd={m} />
      <path d="M550 112 Q320 190 90 112" className="d-line d-dash" markerEnd={m} />
      <text x="320" y="176" textAnchor="middle" className="d-small">which variant? is it empty? is that color allowed?</text>

      <text x="40" y="232" className="d-small">With Scobin</text>
      {[['Pick a part', 40, 150], ['States are there', 250, 190], ['Ship', 500, 100]].map(([t, x, w]) => (
        <g key={t as string}>
          <rect x={x as number} y="252" width={w as number} height="52" rx="4" className="d-box" />
          <text x={(x as number) + (w as number) / 2} y="285" textAnchor="middle" className="d-label">{t}</text>
        </g>
      ))}
      <path d="M194 278 H246" className="d-line" markerEnd={m} />
      <path d="M444 278 H496" className="d-line" markerEnd={m} />
    </svg>
  )
}

/** A gray box wireframe of the app shell, beside the screen it became. */
function Wireframe() {
  return (
    <div className="pair">
      <svg viewBox="0 0 400 330" role="img" aria-label="Gray-box wireframe of the app shell: header 64, nav 256, main 1024">
        <rect x="1" y="1" width="398" height="328" rx="3" className="d-line d-dash" />
        <path d="M1 21 H399 M80 21 V329" className="d-line" />
        <text x="10" y="15" className="d-dim">header 64</text>
        <text x="40" y="180" textAnchor="middle" className="d-dim">nav 256</text>
        <path d="M92 38 H190" className="d-line" />
        <rect x="92" y="50" width="86" height="9" rx="2" fill="currentColor" opacity=".8" />
        <path d="M92 70 H220" className="d-line" opacity=".5" />
        <rect x="262" y="48" width="48" height="18" className="d-box" />
        <rect x="318" y="48" width="70" height="18" className="d-box" fill="currentColor" opacity=".18" />
        <rect x="92" y="82" width="296" height="26" rx="2" className="d-box" />
        {[92, 168, 244, 320].map((x) => (
          <g key={x}>
            <rect x={x} y="122" width="68" height="46" rx="2" className="d-box" />
            <path d={`M${x + 8} 136 H${x + 38}`} className="d-line" opacity=".5" />
            <path d={`M${x + 8} 152 H${x + 52}`} className="d-line" strokeWidth="3" />
          </g>
        ))}
        <text x="240" y="240" textAnchor="middle" className="d-dim">main 1024</text>
        <rect x="268" y="304" width="120" height="12" rx="2" className="d-box" />
      </svg>
      <Shot name="dashboard" w={1280} h={1054} alt="The finished Dashboard sample screen with breadcrumbs, title, alert, four stat cards and pagination" />
    </div>
  )
}

const ladderRows = [
  { k: 'Primitives', v: '189 variables', n: 'Color (99), typography (48), and spacing and sizing (42). The raw values the rest of the system is built from.' },
  { k: 'Routing', v: '129 variables', n: 'Theme (51) and Responsive (78). Connects foundational values to the right theme or responsive context.' },
  { k: 'Applied', v: '216 variables', n: 'Semantic tokens that describe purpose, such as text, surface, or intent.' },
]

/** Primitives, then routing, then applied. */
function Ladder() {
  return (
    <ol className="ladder" aria-label="Token layers">
      {ladderRows.map((r, i) => (
        <li key={r.k}>
          <div className="ladder-row">
            <p className="ladder-k">{r.k}</p>
            <p className="ladder-v">{r.v}</p>
            <p className="ladder-n">{r.n}</p>
          </div>
          {i < ladderRows.length - 1 && <ArrowDown className="ladder-arrow" size={18} strokeWidth={1.6} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}

const chapters: Chapter[] = [
  {
    id: 'sc-audit',
    title: 'Five dropdowns. One product. Five different experiences.',
    body: [
      'Before creating anything new, I went through the existing interface screen by screen.',
      'I collected recurring UI elements and compared how they looked and behaved. That’s when the inconsistencies became difficult to ignore: five different dropdown patterns, three versions of the primary button, and four ways to communicate an error.',
      'Each component worked in isolation. But together, they made the experience unpredictable.',
      'I grouped similar controls, looked at the purpose behind each variation, and identified where a single, well defined component could replace multiple competing patterns.',
    ],
    decision: 'The first step wasn’t designing more components. It was understanding which ones we actually needed.',
    art: <Audit />,
  },
  {
    id: 'sc-research',
    title: 'I wanted to know where the inconsistencies were slowing people down.',
    body: [
      'I spoke with designers, front end developers, and employees who used the interface regularly.',
      'Instead of asking what features they wanted in a design system, I asked them to walk me through their actual work: what they had recently designed, built, or used, and where they needed to stop and figure something out.',
      'A few questions kept coming up. Which version of this component should I use? What happens when there’s no data or something goes wrong? How should this interaction work with a keyboard?',
      'These weren’t isolated UI questions. They revealed a larger problem: the team lacked a shared reference for making consistent decisions.',
    ],
    decision: 'That became the foundation of the design system: every reusable component should answer the questions people would otherwise have to ask.',
    art: <Wall />,
    flip: true,
  },
  {
    id: 'sc-flow',
    title: 'Small unanswered questions were creating unnecessary back and forth.',
    body: [
      'I followed the journey of a screen from its initial design through development and review. The friction often came from details that seemed small but had to be resolved repeatedly.',
      'Which variant was correct? Was that color approved? How should an empty state behave? What should happen when the user presses Tab? Without shared guidance, those decisions depended on individual interpretation or another conversation.',
      'I wanted the library to carry that context. By documenting component behavior, states, and usage rules directly in Figma, I could make important design decisions available at the moment someone needed them.',
    ],
    decision: 'The goal was to spend less time clarifying the same details and more time solving meaningful design problems.',
    art: <Flow />,
  },
  {
    id: 'sc-wireframe',
    title: 'Before choosing colors, I needed to understand the layout.',
    body: [
      'I began by wireframing the application shell in grayscale.',
      'Breaking the interface into its fundamental areas (header, navigation, breadcrumbs, page titles, and content cards) helped me understand how the pieces related to one another before defining their visual appearance.',
      'Those early structures became reusable layout components, and the wireframe eventually informed the Dashboard sample screen. Working this way kept me focused on hierarchy and usability before visual styling.',
    ],
    decision: 'I wanted the layout to make sense on its own, without relying on color to explain it.',
    art: <Wireframe />,
    wide: true,
  },
  {
    id: 'sc-tokens',
    title: 'Three layers. One clear system.',
    body: [
      'I organized the variables into three layers: Primitives, Routing, and Applied. Each layer has a distinct responsibility.',
      'Primitives define the raw values. Routing determines how those values adapt to different contexts. Applied tokens give them meaningful roles in the interface.',
      'This separation was intentional. I didn’t want designers or developers to memorize which shade of blue belonged to an information message or which raw value should be used for a specific surface. Instead, components reference semantic tokens that describe their purpose.',
    ],
    decision: 'The component asks for the meaning of a value, not a hardcoded color.',
    art: <Ladder />,
    flip: true,
  },
  {
    id: 'sc-semantic',
    title: 'A color name should tell you what it does.',
    body: [
      'The semantic layer contains 216 variables organized around their roles in the interface, including intent, text, links, and surfaces. I documented these tokens in structured tables so designers and developers could understand their intended use without guessing.',
      'This approach separates a component’s meaning from its raw visual value. For example, an information state uses a semantic intent token rather than referencing a particular blue directly.',
      'The current Theme collection has one mode, Scobin. The structure also leaves room for future themes or brand variations without requiring components to be redesigned from scratch.',
    ],
    decision: 'I wanted the design system to support change without losing consistency.',
    art: <Board name="semantic" w={2000} h={1360} alt="The Semantic Colors board: documented token tables for Intent, Text and Link, and Surface" />,
    wide: true,
  },
  {
    id: 'sc-type',
    title: 'Typography should adapt without losing its hierarchy.',
    body: [
      'I created 95 text styles across five categories: Display, Heading, Body, UI, and Mono. Rather than treating typography as a collection of fixed font sizes, I organized the styles around their role in the interface.',
      'A separate Responsive collection defines five modes, from Mobile through Desktop Large. Each mode manages the typography values needed at that size, including font size, line height, and letter spacing. This keeps the hierarchy familiar while allowing text to adapt to different screens.',
    ],
    decision: 'The goal was to maintain a consistent reading experience, not force the same dimensions onto every device.',
    art: <Board name="typography" w={2000} h={863} alt="The Typography board: font family, font size, body, UI, heading, display and mono text styles" />,
    wide: true,
  },
  {
    id: 'sc-contrast',
    title: 'Contrast shouldn’t be something we remember to check at the end.',
    body: [
      'I created a contrast reference board to make accessibility decisions visible inside the design system. Each color pairing displays its contrast ratio, with failing combinations clearly identified.',
      'The board uses WCAG guidance as its reference: at least 4.5:1 for body text, at least 3:1 for large text, and at least 3:1 for relevant UI elements that aren’t text.',
      'For example, the documented Scobin Blue 600 pairing reaches a contrast ratio of 4.63:1, meeting the minimum requirement for normal text. By placing these checks alongside the color system, I wanted to make accessible choices easier during everyday design work.',
    ],
    decision: 'Accessibility should be part of choosing a component, not a separate task after the screen is finished.',
    art: <Board name="contrast" w={1124} h={685} alt="The Color Contrast board: every color swatch labelled with its contrast ratio, failing cells outlined in red" />,
    wide: true,
  },
  {
    id: 'sc-button',
    title: 'A component isn’t finished when it looks good in its default state.',
    body: [
      'A button might look simple, but its behavior changes depending on context. I built the Button component around 4 types, 3 sizes, and 5 states, which together create 60 defined variants.',
      'Users need to recognize when a button is interactive, when it’s being pressed, when it has keyboard focus, and when an action is unavailable. I designed those states as part of the component rather than treating them as separate exceptions.',
      'Hover and Pressed states are connected through Figma prototype interactions, allowing the team to experience the intended behavior during reviews. Focus uses a shared Focus Ring style, with explicit guidance to preserve visible keyboard focus.',
    ],
    decision: 'If an interaction matters in the browser, it deserves attention in the design system.',
    art: <Shot name="button-states" w={2000} h={1918} alt="The Button board: Primary, Secondary, Tertiary and Danger in three sizes and five states" />,
    flip: true,
  },
  {
    id: 'sc-scaffold',
    title: 'The components needed a system of their own.',
    body: [
      'One of the less visible parts of my work was creating the structure used to document the library. I built reusable documentation elements: a heading system with four levels, seven component status labels from Stable to Deprecated, five annotation note colors, variant headings, and reusable token table rows and color swatches.',
      'I also separated documentation only colors into a Figma only variable collection so they wouldn’t be confused with product tokens. These elements don’t appear in the final product, but they help make the library easier to maintain and navigate.',
      'The Button documentation, for example, explains when to use a Primary button, how to position it within an action group, and when an Icon Button is appropriate. Guidelines like these help the team apply components consistently instead of treating every variant as interchangeable.',
    ],
    decision: 'Documentation should guide decisions, not just display components.',
    art: <Shot name="button-docs" w={979} h={2400} alt="The Button documentation page: variants, sizes, icons, states, a properties table, and when-to-use and accessibility guidance" />,
  },
  {
    id: 'sc-components',
    title: 'Good documentation explains behavior, not just appearance.',
    body: [
      'Across 41 documented components, I followed a consistent page structure covering available variants and properties, interaction states, when to use the component, when to avoid it, and accessibility considerations. I wanted someone opening the library for the first time to find answers without needing me to explain every page.',
      'The Accordion is one example. Its guidelines describe the expected keyboard and focus behavior, the relevant ARIA attributes, and the interaction rules developers need to preserve. The documentation also explains when the pattern shouldn’t be used, including guidance against nesting accordions.',
      'I wanted each component page to help someone answer three questions: Is this the right component for the situation? How should it behave? What do I need to consider to make it accessible?',
    ],
    decision: 'A component wasn’t complete simply because its variants were drawn. It needed enough guidance for another designer or developer to use it correctly.',
    art: (
      <div className="stack-shots">
        <Shot name="accordion" w={1600} h={684} alt="The Accordion component page: a matrix of bordered and borderless, single and multi select, with and without slots" />
        <Shot name="properties" w={1434} h={540} alt="The Accordion properties table listing each property, its options and when to use it" />
      </div>
    ),
    wide: true,
  },
  {
    id: 'sc-lesson',
    title: 'What creating this system taught me',
    body: [
      'Building the Scobin Design System changed how I think about UI consistency. A design system isn’t just a collection of polished components or neatly organized tokens. It’s a shared language that helps people make decisions.',
      'What mattered most to me was creating something the team could continue using and maintaining, not something that depended on me being available to explain every detail.',
      'The biggest lesson was that consistency comes from clarity: clear foundations, intentional component behavior, and documentation that makes the reasoning accessible to everyone.',
    ],
    decision: 'That’s the kind of design system I wanted to build: one that makes good design easier to repeat.',
    wide: true,
  },
]

export function ChapterBlock({ c }: { c: Chapter }) {
  const ref = useRef<HTMLElement>(null)

  // rise in once as the chapter scrolls into the sheet; content stays visible if this never runs
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = el.closest('.sheet')
    el.classList.add('pre')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.remove('pre'); io.disconnect() }
    }, { root, threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={`chapter${c.wide ? ' wide' : ''}${c.flip ? ' flip' : ''}`} id={c.id} ref={ref} aria-labelledby={`${c.id}-h`}>
      {c.art && <div className="chapter-art">{c.art}</div>}
      <div className="chapter-copy">
        <h3 id={`${c.id}-h`}>{c.title}</h3>
        <div className="chapter-text">
          {c.body.map((t) => <p key={t}>{t}</p>)}
          {c.decision && <p className="chapter-decision">{c.decision}</p>}
        </div>
      </div>
    </section>
  )
}

export function ScobinStory() {
  return (
    <div className="story">
      <p className="story-intro">The goal wasn’t simply to create reusable components. I wanted to make design decisions easier to understand, easier to implement, and easier to maintain as the product evolved.</p>
      <ul className="story-principles" aria-label="My approach">
        {[
          'Understand the existing experience.',
          'Listen to the people using and building it.',
          'Establish foundations before components.',
          'Design for every meaningful interaction state.',
          'Document decisions so others can use the system confidently.',
        ].map((x) => <li key={x}>{x}</li>)}
      </ul>
      {chapters.map((c) => <ChapterBlock key={c.id} c={c} />)}
    </div>
  )
}
