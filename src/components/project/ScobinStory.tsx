import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import { InkDefs } from './InkArt'
import { AuditArt, FlowArt, LayersArt, NotesArt, WireArt } from './ScobinArt'

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
  /** the number of the approach principle this chapter belongs to */
  part?: number
}

/** The grey-box wireframe of the app shell, beside the screen it became. */
function Wireframe() {
  return (
    <div className="pair">
      <WireArt />
      <Shot name="dashboard" w={1280} h={1054} alt="The finished Dashboard sample screen with breadcrumbs, title, alert, four stat cards and pagination" />
    </div>
  )
}

const chapters: Chapter[] = [
  {
    id: 'sc-audit',
    part: 1,
    title: 'Five dropdowns. One product. Five different experiences.',
    body: [
      'Before creating anything new, I went through the existing interface screen by screen.',
      'I collected recurring UI elements and compared how they looked and behaved. That’s when the inconsistencies became difficult to ignore: five different dropdown patterns, three versions of the primary button, and four ways to communicate an error.',
      'Each component worked in isolation. But together, they made the experience unpredictable.',
      'I grouped similar controls, looked at the purpose behind each variation, and identified where a single, well defined component could replace multiple competing patterns.',
    ],
    decision: 'The first step wasn’t designing more components. It was understanding which ones we actually needed.',
    art: <AuditArt />,
  },
  {
    id: 'sc-research',
    part: 2,
    title: 'I wanted to know where the inconsistencies were slowing people down.',
    body: [
      'I spoke with designers, front end developers, and employees who used the interface regularly.',
      'Instead of asking what features they wanted in a design system, I asked them to walk me through their actual work: what they had recently designed, built, or used, and where they needed to stop and figure something out.',
      'Three questions kept coming up. Which one should I use? What if there’s no data, or something goes wrong? Can everyone reach it, including with a keyboard?',
      'These weren’t isolated UI questions. They revealed a larger problem: the team lacked a shared reference for making consistent decisions.',
    ],
    decision: 'That became the foundation of the design system: every reusable component should answer the questions people would otherwise have to ask.',
    art: <NotesArt />,
    flip: true,
  },
  {
    id: 'sc-flow',
    part: 2,
    title: 'Small unanswered questions were creating unnecessary back and forth.',
    body: [
      'I followed the journey of a screen from its initial design through development and review. The friction often came from details that seemed small but had to be resolved repeatedly.',
      'Those same three questions came back at every handoff. Without shared guidance, each one was settled by individual judgment or another conversation, and then settled again on the next screen.',
      'I wanted the library to carry that context. By documenting component behavior, states, and usage rules directly in Figma, I could make important design decisions available at the moment someone needed them.',
    ],
    decision: 'The goal was to spend less time clarifying the same details and more time solving meaningful design problems.',
    art: <FlowArt />,
  },
  {
    id: 'sc-wireframe',
    part: 3,
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
    part: 3,
    title: 'Three layers. One clear system.',
    body: [
      'I organized the variables into three layers: Primitives, Routing, and Applied. Each layer has a distinct responsibility.',
      'Primitives define the raw values. Routing determines how those values adapt to different contexts. Applied tokens give them meaningful roles in the interface.',
      'This separation was intentional. I didn’t want designers or developers to memorize which shade of blue belonged to an information message or which raw value should be used for a specific surface. Instead, components reference Applied tokens, which are named for their purpose.',
    ],
    decision: 'The component asks for the meaning of a value, not a hardcoded color.',
    art: <LayersArt />,
    flip: true,
  },
  {
    id: 'sc-semantic',
    part: 3,
    title: 'A color name should tell you what it does.',
    body: [
      'The Applied layer holds 216 semantic variables, organized around their roles in the interface: intent, text, links and surfaces. I documented these tokens in structured tables so designers and developers could understand their intended use without guessing.',
      'This approach separates a component’s meaning from its raw visual value. For example, an information state uses a semantic intent token rather than referencing a particular blue directly.',
      'The current Theme collection has one mode, Scobin. The structure also leaves room for future themes or brand variations without requiring components to be redesigned from scratch.',
    ],
    decision: 'I wanted the design system to support change without losing consistency.',
    art: <Board name="semantic" w={2000} h={1360} alt="The Semantic Colors board: documented token tables for Intent, Text and Link, and Surface" />,
    wide: true,
  },
  {
    id: 'sc-type',
    part: 3,
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
    part: 3,
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
    part: 4,
    title: 'A component isn’t finished when it looks good in its default state.',
    body: [
      'A button might look simple, but its behavior changes depending on context. I built the Button component around 4 types, 3 sizes, and 5 states, which together create 60 defined variants.',
      'Each state answers a question the user has. Default and Hover say it’s interactive, Pressed confirms the click, Focus shows where the keyboard is, and Disabled says the action isn’t available yet.',
      'Hover and Pressed states are connected through Figma prototype interactions, allowing the team to experience the intended behavior during reviews. Focus uses a shared Focus Ring style, with explicit guidance to preserve visible keyboard focus.',
    ],
    decision: 'If an interaction matters in the browser, it deserves attention in the design system.',
    art: <Shot name="button-states" w={2000} h={1918} alt="The Button board: Primary, Secondary, Tertiary and Danger in three sizes and five states" />,
    flip: true,
  },
  {
    id: 'sc-scaffold',
    part: 5,
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
    part: 5,
    title: 'Good documentation explains behavior, not just appearance.',
    body: [
      'Across 41 documented components, I followed a consistent page structure covering available variants and properties, interaction states, when to use the component, when to avoid it, and accessibility considerations. I wanted someone opening the library for the first time to find answers without needing me to explain every page.',
      'The Accordion is one example. Its guidelines describe the expected keyboard and focus behavior, the relevant ARIA attributes, and the interaction rules developers need to preserve. The documentation also explains when the pattern shouldn’t be used, including guidance against nesting accordions.',
      'I wanted each component page to answer the same three questions from the interviews: Which one should I use? What if something unexpected happens? Can everyone reach it?',
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
      'The biggest lesson was that consistency comes from clarity. Foundations make a decision easier to understand, defined states make it easier to implement, and documentation makes it easier to maintain long after I’ve stepped away.',
    ],
    decision: 'That’s the kind of design system I wanted to build: one that makes good design easier to repeat.',
    wide: true,
  },
]

/** The five principles; each one heads its group of chapters, numbered to match the list at the top. */
const principles = [
  'Understand the existing experience',
  'Listen to the people using and building it',
  'Establish foundations before components',
  'Design for every meaningful interaction state',
  'Document decisions so others can use the system confidently',
]
const num = (n: number) => String(n).padStart(2, '0')

export function ChapterBlock({ c, level = 3 }: { c: Chapter; level?: 3 | 4 }) {
  const H = level === 4 ? 'h4' : 'h3'
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
        <H id={`${c.id}-h`}>{c.title}</H>
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
      <InkDefs />
      <p className="story-intro">The goal wasn’t simply to create reusable components. I wanted to make design decisions easier to understand, easier to implement, and easier to maintain as the product evolved.</p>
      <ol className="story-principles" aria-label="My approach">
        {principles.map((x, i) => <li key={x}><span className="story-num">{num(i + 1)}</span>{x}</li>)}
      </ol>
      {chapters.map((c, i) => (
        <Fragment key={c.id}>
          {c.part && c.part !== chapters[i - 1]?.part && (
            <h3 className="story-part"><span className="story-num">{num(c.part)}</span>{principles[c.part - 1]}</h3>
          )}
          <ChapterBlock c={c} level={c.part ? 4 : 3} />
        </Fragment>
      ))}
    </div>
  )
}
