import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import { JourneyMap } from './JourneyMap'
import { PlayScene } from './PlayScene'
import { StatTiles } from './StatTiles'
import { Law } from '@/components/Law'
import type { LawId } from '@/data/laws'

const img = (name: string) => `/projects/scobin/${name}.png`

/** What each Figma frame is, for the title of its window. */
const CAPS: Record<string, string> = {
  dashboard: 'dashboard · sample screen', semantic: 'semantic colors', typography: 'typography', contrast: 'color contrast',
  'button-states': 'button · states', 'button-docs': 'button · docs', accordion: 'accordion', properties: 'accordion · properties',
}

/** A dark pixel window around a picture or a scene: three little squares and a lowercase title. */
function Frame({ cap, children }: { cap: string; children: ReactNode }) {
  return (
    <figure className="frame px-plate">
      <figcaption><i /><i /><i /><span>{cap}</span></figcaption>
      <div className="frame-body">{children}</div>
    </figure>
  )
}

const Pic = ({ name, w, h, alt }: { name: string; w: number; h: number; alt: string }) => (
  <img src={img(name)} width={w} height={h} loading="lazy" decoding="async" alt={alt} />
)

const Shot = (props: Parameters<typeof Pic>[0]) => (
  <Frame cap={CAPS[props.name] ?? props.name}><Pic {...props} /></Frame>
)

/** A wide Figma board that scrolls sideways on small screens. */
const Board = (props: Parameters<typeof Pic>[0]) => (
  <Frame cap={CAPS[props.name] ?? props.name}>
    <div className="board" tabIndex={0} role="group" aria-label="Scrollable board"><Pic {...props} /></div>
  </Frame>
)

/** A pixel scene on a dark plate, in place of a drawing. */
const Scene = ({ scene }: { scene: string }) => <div className="scene-plate px-plate"><PlayScene scene={scene} /></div>

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
  /** the piece of psychology the chapter's decision rests on */
  law?: LawId
  /** the principle tied to this chapter: the moment it explains */
  here?: string
}

/** The grey-box wireframe of the app shell, beside the screen it became. */
function Wireframe() {
  return (
    <div className="pair">
      <Frame cap="wireframe"><PlayScene scene="Wire" /></Frame>
      <Shot name="dashboard" w={1280} h={1054} alt="The finished Dashboard sample screen with breadcrumbs, title, alert, four stat cards and pagination" />
    </div>
  )
}

/*
 * How the chapters are written: the title is the finding or the decision. The first paragraph says what I did, the
 * next ones give the numbers and one example, and each paragraph holds one idea. `decision` is the line to remember.
 */
const chapters: Chapter[] = [
  {
    id: 'sc-audit', law: 'similarity',
    here: 'Controls that did the same job looked and behaved in five different ways, so nothing learned on one screen carried to the next.',
    part: 1,
    title: 'Five dropdowns. One product. Five different experiences.',
    body: [
      'Before designing anything new, I went through the existing interface screen by screen and compared every recurring element.',
      'I found five dropdown patterns, three versions of the primary button, and four ways to show an error. Each one worked on its own. Together, they made the product unpredictable.',
      'I grouped similar controls, asked what each variation was for, and marked where one well-defined component could replace several.',
    ],
    decision: 'The first step wasn’t designing more components. It was understanding which ones we actually needed.',
    art: <Scene scene="Audit" />,
  },
  {
    id: 'sc-research', law: 'curse',
    here: 'I asked for a walk through real work instead of a feature list, because people can’t report the gaps they have stopped noticing.',
    part: 2,
    title: 'I asked where the inconsistencies were slowing people down.',
    body: [
      'I interviewed designers, front-end developers, and employees who used the interface every day.',
      'I didn’t ask what they wanted in a design system. I asked each of them to walk me through something they had recently designed, built or used, and to show me where they had to stop and figure something out.',
      'Three questions kept coming up. Which one should I use? What if there’s no data, or something goes wrong? Can everyone reach it, including with a keyboard?',
      'The problem was bigger than any one component: the team had no shared reference for making consistent decisions.',
    ],
    decision: 'So I set one test for the system: every component should answer the questions people would otherwise have to ask.',
    art: <Scene scene="Notes" />,
    flip: true,
  },
  {
    id: 'sc-flow', law: 'tesler',
    here: 'Someone has to decide how a component behaves. Undocumented, that decision fell on every designer and developer, on every screen.',
    part: 2,
    title: 'The same small questions were being settled again on every screen.',
    body: [
      'I followed one screen from its first layout through development and review, and recorded what stopped each step.',
      'The same three questions came back at every handoff. With no shared guidance, each was settled by one person’s judgment or another conversation, and then settled again on the next screen.',
      'So I documented each component’s behavior, states and usage rules directly in Figma, where the answer is in front of someone at the moment they need it.',
    ],
    decision: 'The goal: less time clarifying the same details, and more time on the design problem.',
    art: <Scene scene="Flow" />,
  },
  {
    id: 'sc-wireframe', law: 'occam',
    here: 'If the layout reads in grey, it doesn’t need color to explain it.',
    part: 3,
    title: 'Before choosing colors, I needed to understand the layout.',
    body: [
      'I wireframed the application shell in grayscale first.',
      'Breaking it into header, navigation, breadcrumbs, page titles and content cards showed me how the pieces relate, before I decided how they look.',
      'Those structures became reusable layout components, and the wireframe became the Dashboard sample screen.',
    ],
    decision: 'I wanted the layout to make sense on its own, without relying on color to explain it.',
    art: <Wireframe />,
    wide: true,
  },
  {
    id: 'sc-tokens', law: 'load',
    here: 'Nobody has to remember which blue means “information”. The token’s name says it.',
    part: 3,
    title: 'Three layers. One clear system.',
    body: [
      'I organized the variables into three layers. Primitives hold the raw values. Routing decides how those values adapt to different contexts. Applied tokens give them a role in the interface.',
      'Components reference only Applied tokens, which are named for their purpose. A designer or developer never has to memorize which shade of blue belongs to an information message.',
    ],
    decision: 'The component asks for the meaning of a value, not a hardcoded color.',
    art: <Scene scene="Layers" />,
    flip: true,
  },
  {
    id: 'sc-semantic', law: 'signifiers',
    here: 'A token named for its role tells you when to use it. A hex value never does.',
    part: 3,
    title: 'A color name should tell you what it does.',
    body: [
      'The Applied layer holds 216 semantic variables, organized by role: intent, text, links and surfaces. I documented them in tables, so nobody has to guess what a token is for.',
      'An information state, for example, uses a semantic intent token. It never points at a particular blue.',
      'The Theme collection has one mode today, Scobin. The structure leaves room for future themes or brands without redesigning the components.',
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
      'I created 95 text styles in five categories: Display, Heading, Body, UI and Mono. Each style is named for its role in the interface, not for its size.',
      'A separate Responsive collection defines five modes, from Mobile to Desktop Large. Each mode sets font size, line height and letter spacing, so the hierarchy stays familiar while the text adapts to the screen.',
    ],
    decision: 'The goal was to maintain a consistent reading experience, not force the same dimensions onto every device.',
    art: <Board name="typography" w={2000} h={863} alt="The Typography board: font family, font size, body, UI, heading, display and mono text styles" />,
    wide: true,
  },
  {
    id: 'sc-contrast', law: 'spark',
    here: 'The ratio sits next to the swatch, so the accessible choice takes no extra step.',
    part: 3,
    title: 'Contrast shouldn’t be something we remember to check at the end.',
    body: [
      'I built a contrast reference board inside the design system. Every color pairing shows its ratio, and the failing combinations are outlined.',
      'The board uses the WCAG minimums: 4.5:1 for body text, 3:1 for large text, and 3:1 for UI elements that aren’t text.',
      'Scobin Blue 600, for example, reaches 4.63:1, which passes for normal text. The check sits beside the color system, where the choice is made.',
    ],
    decision: 'Accessibility should be part of choosing a component, not a separate task after the screen is finished.',
    art: <Board name="contrast" w={1124} h={685} alt="The Color Contrast board: every color swatch labelled with its contrast ratio, failing cells outlined in red" />,
    wide: true,
  },
  {
    id: 'sc-button', law: 'feedback',
    here: 'Hover says “you can click this”, Pressed says “you did”, and Focus says “the keyboard is here”.',
    part: 4,
    title: 'A component isn’t finished when it looks good in its default state.',
    body: [
      'A button looks simple, but it behaves differently in every context. I built the Button around 4 types, 3 sizes and 5 states: 60 defined variants.',
      'Each state answers a question the user has. Default and Hover say it’s interactive. Pressed confirms the click. Focus shows where the keyboard is. Disabled says the action isn’t available yet.',
      'Hover and Pressed are wired as Figma prototype interactions, so the team can try the behavior in reviews. Focus uses a shared Focus Ring style, with guidance to keep keyboard focus visible.',
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
      'A less visible part of the work was the structure the library is documented with. I built a heading system with four levels, seven status labels from Stable to Deprecated, five annotation note colors, variant headings, and reusable token table rows and color swatches.',
      'I kept documentation-only colors in a separate Figma-only collection, so they are never confused with product tokens.',
      'The Button page, for example, says when to use a Primary button, where it sits in an action group, and when an Icon Button fits better. The team stops treating every variant as interchangeable.',
    ],
    decision: 'Documentation should guide decisions, not just display components.',
    art: <Shot name="button-docs" w={979} h={2400} alt="The Button documentation page: variants, sizes, icons, states, a properties table, and when-to-use and accessibility guidance" />,
  },
  {
    id: 'sc-components', law: 'recognition',
    here: 'The answer sits on the component’s page, so nobody has to remember a decision made in a meeting.',
    part: 5,
    title: 'Good documentation explains behavior, not just appearance.',
    body: [
      'All 41 components follow one page structure: variants and properties, interaction states, when to use it, when to avoid it, and accessibility. Someone opening the library for the first time can find answers without me.',
      'The Accordion page, for example, describes the keyboard and focus behavior, the ARIA attributes, and the interaction rules developers need to preserve. It also says when not to use the pattern, such as nesting accordions.',
      'Every page answers the three questions from the interviews: Which one should I use? What if something unexpected happens? Can everyone reach it?',
    ],
    decision: 'A component isn’t complete when its variants are drawn. It is complete when another designer or developer can use it correctly.',
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
      'A design system is a shared language that helps people make decisions. Polished components and tidy tokens are only the visible part of it.',
      'What mattered most to me was building something the team could keep using and maintaining without me there to explain it.',
      'Consistency comes from clarity. Foundations make a decision easier to understand, defined states make it easier to build, and documentation makes it easier to maintain long after I’ve stepped away.',
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
          {c.law && <Law id={c.law} here={c.here} />}
        </div>
      </div>
    </section>
  )
}

export function ScobinStory() {
  return (
    <div className="story">
      <div className="story-open">
      <p className="story-intro">“Which one should I use?” I heard that question from designers and developers alike. So I built the place where the answer lives.</p>
      <StatTiles stats={[
        { to: 548, label: 'variables' },
        { to: 41, label: 'documented components' },
        { to: 95, label: 'text styles' },
        { to: 120, suffix: '+', label: 'people using it' },
      ]} />
      <div className="rulebook px-plate">
        <span className="id-slot" aria-hidden="true" />
        <p className="rb-head">how i worked · 5 principles</p>
        <ol aria-label="My approach">
          {principles.map((x, i) => (
            <li key={x}>
              <span className="rb-num" aria-hidden="true">{num(i + 1)}</span>
              <h4>{x}</h4>
            </li>
          ))}
        </ol>
      </div>
      </div>
      {chapters.map((c, i) => (
        <Fragment key={c.id}>
          {c.part && c.part !== chapters[i - 1]?.part && (
            <h3 className="story-part"><span className="story-num">{num(c.part)}</span>{principles[c.part - 1]}</h3>
          )}
          <ChapterBlock c={c} level={c.part ? 4 : 3} />
          {c.id === 'sc-flow' && (
            <JourneyMap
              src="/projects/scobin/journey.html"
              title="Scobin journey map: one screen from design to use"
              lede="One screen, followed from first layout to the people using it: the question that stopped each step, and the part of the system that answers it."
              level={4}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}
