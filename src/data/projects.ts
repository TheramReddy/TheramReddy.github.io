import type { ToolId } from './tools'

export type Project = {
  slug: string
  title: string
  year: string
  role: string
  stack: string[]
  url: string
  description: string
  /** one-line pitch shown on the case-study card in Work */
  summary: string
  /** short label on the slip that hangs from the case study's flag in the village, e.g. "Modernization" */
  tag: string
  /** where the work happened, e.g. "Georgia DHS" */
  client: string
  /** path under /public, e.g. "/projects/one/cover.jpg"; falls back to `gradient` */
  cover?: string
  gradient: string
  /** images shown in the project popup; falls back to gradient frames */
  gallery?: string[]
  /** logo shown above the title in the project popup, e.g. "/logos/georgia-dhs.png" */
  logo?: string
  /** screen recordings shown in the gallery at the end of the case study */
  features?: Feature[]
  /** headline numbers for the whole system, shown first on the right of the popup */
  metrics?: Metric[]
  /** tools shown in the popup; falls back to the default set */
  tools?: ToolId[]
  /** render the chaptered design-system story instead of metrics and GIFs */
  story?: boolean
  /** public Figma file, shown as a link with the Figma logo under the tools */
  figma?: string
  /** public web page related to the work, shown like the Figma link */
  link?: { href: string; title: string; note: string }
  /** not published yet: shown on the map as "Coming soon" and never opens */
  soon?: boolean
}

export type Metric = { value: string; label: string; group?: string; note: string }

export type Feature = { gif: string; alt: string }

const gif = (name: string) => `/projects/liheap-eap/${name}.gif`
const shot = (name: string) => `/projects/dso-modernization/${name}.gif`
// every card shares one grey wash
const CARD = 'linear-gradient(135deg,#959595,#c2c2c2 55%,#e8e8e8)'

/** Add a project: append an entry here and drop images in /public/projects/<slug>/. */
export const projects: Project[] = [

  {
    slug: 'dso-modernization',
    tag: 'Modernization',
    title: 'DSO Modernization',
    logo: '/logos/georgia-dhs.png',
    cover: gif('command_palette_search'),
    year: '2025',
    role: 'UX Designer',
    stack: ['Figma', 'Bootstrap', 'Angular'],
    url: '#',
    client: 'Georgia DHS',
    summary: 'How I took 40% of the steps out of recovering debt for the state of Georgia.',
    description:
      'A caseworker has someone on the phone, asking where their tax refund went. To answer, the caseworker digs through menus to find the profile, then opens three separate screens: claims, hearings, payments. None of them says why the money is on hold. That was debt recovery at the Georgia Department of Human Services (DHS), on a mainframe that had run for years. The Debt Setoff (DSO) Modernization replaces it with three connected cloud portals: one for the public, one for agency staff and one for vendors. I was the UX designer. I mapped the pipeline end to end, then redesigned how staff find a person, follow a payment and approve a risky action. A process now takes 40% fewer steps.',
    gradient: CARD,
    link: {
      href: 'https://dor.georgia.gov/state-refund-offsets-other-agencies',
      title: 'Read the state’s public page',
      note: 'How the state explains refund offsets to residents',
    },
    metrics: [
      { value: '1 search', label: 'Find a profile from any screen', group: 'Easier to handle', note: 'Before, staff worked through menus to reach a profile. Now one search finds it, with results as you type.' },
      { value: '1 view', label: 'Everything about a person, together', group: 'Easier to handle', note: 'Before, claims, hearings and payments sat on separate screens. Now they sit on one page.' },
      { value: '40% fewer steps', label: 'Processes take far less effort', group: 'Faster to finish', note: 'Claims, hearings, payments and reconciliation now link to each other, so finishing a process takes 40% fewer steps.' },
      { value: 'AA', label: 'Built to WCAG 2.1 AA', group: 'Accessible to everyone', note: 'Keyboard use and screen-reader labels were part of the design from the start.' },
    ],
    features: [
      { gif: gif('system_process_live'), alt: "System process page with a live checklist advancing and an interface menu opening" },
      { gif: shot('trail'), alt: "Switching between the intercepts, disbursements and refunds tabs of a profile" },
      { gif: gif('check_void_approval'), alt: "Filling in a check void reason and comment and submitting for supervisor approval" },
      { gif: shot('hold'), alt: "A profile marked Hearing: Under review, then the Hearing tab explaining the hold" },
      { gif: gif('ssn_reveal'), alt: "Revealing and hiding a masked SSN in a table row" },
      { gif: gif('check_batch_scheduling'), alt: "Choosing a date range and a weekly repeat and generating four scheduled batch dates" },
      { gif: gif('command_palette_search'), alt: "Command palette searching for the name Alder and listing four matching profiles" },
      { gif: gif('table_sort_filter'), alt: "Profile table sorted by name and then filtered by city to show only Savannah" },
      { gif: gif('role_switch_nav'), alt: "Switching roles from the profile menu and the sidebar changing to show only hearing pages" },
    ],
  },
  {
    slug: 'scobin-design-system',
    tag: 'Design system',
    title: 'Scobin Design System',
    logo: '/logos/scobin.svg',
    cover: '/projects/scobin/cover.png',
    year: '2023–24',
    role: 'Product Designer',
    stack: ['Figma', 'Storybook'],
    url: '#',
    client: 'Scobin',
    summary: 'Five dropdowns, three primary buttons, four error styles. How I replaced them with one design system that 120+ people use.',
    description:
      'A designer at Scobin needs a dropdown. The product already has five. Which one is right? Nobody could say. The same went for three versions of the primary button and four ways to show an error, so designers and developers kept solving the same problems again. I audited the product, sat with the people who design, build and use it, and built a design system from the ground up: a structured Figma library with 548 variables, 41 documented components, 35 icons and 95 text styles. More than 120 people use it today.',
    gradient: CARD,
    tools: ['figma', 'storybook', 'photoshop', 'html', 'css', 'javascript'],
    story: true,
    figma: 'https://www.figma.com/design/aQDljAL3G6oGoaenWvq81E/Scobin-Design-System?node-id=6-9',
  },
  {
    slug: 'telemetric',
    tag: 'Telemetric',
    title: 'Telemetric',
    year: '2026',
    role: 'Product Designer',
    stack: ['Figma'],
    url: '#',
    client: 'Telemetric',
    summary: 'Several AI agents are working on your files. Can you see what they’re doing? I’m designing the workspace that shows you. Coming soon to beta.',
    description:
      'Ask most AI tools about a folder, and they read the whole pile of text again, every time. Then they answer, and you can’t see how. Telemetric turns the folder into a map of connected notes first, so both you and the AI can move through it. When you ask a question, several small agents each take one task, and you can watch what each one did. Two engineers built the multi-agent engine. I designed the product concept, the end-to-end experience and the interface.',
    gradient: CARD,
    tools: ['figma', 'aftereffects', 'rive', 'lottie', 'framer'],
    story: true,
    soon: true,
  }
]

/** the case studies that can be opened */
export const published = projects.filter((p) => !p.soon)
/** The case study pages are closed while they are rewritten: set to true and link the work cards to reopen them. */
export const CASE_STUDIES_OPEN = true
export const getProject = (slug?: string) => (CASE_STUDIES_OPEN ? published.find((p) => p.slug === slug) : undefined)
