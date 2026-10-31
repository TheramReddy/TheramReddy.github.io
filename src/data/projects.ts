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
  /** where the work happened, e.g. "Georgia DHS" */
  client: string
  /** path under /public, e.g. "/projects/one/cover.jpg"; falls back to `gradient` */
  cover?: string
  gradient: string
  /** images shown in the project popup; falls back to gradient frames */
  gallery?: string[]
  /** logo shown above the title in the project popup, e.g. "/logos/georgia-dhs.png" */
  logo?: string
  /** GIF + context blocks shown on the right of the popup; replace the gallery when set */
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
}

type Metric = { value: string; label: string; note: string }

export type Feature = { title: string; body: string; gif: string; alt: string }

const gif = (name: string) => `/projects/liheap-eap/${name}.gif`
const shot = (name: string) => `/projects/dso-modernization/${name}.gif`

/** Add a project: append an entry here and drop images in /public/projects/<slug>/. */
export const projects: Project[] = [
  {
    slug: 'telemetric',
    title: 'Telemetric',
    year: '2026',
    role: 'Product Designer',
    stack: ['Figma'],
    url: '#',
    client: 'Telemetric',
    summary: 'A workspace where AI agents work on your files as a map. Coming soon to beta.',
    description:
      'Most AI tools treat a folder as a pile of text and re-read it on every question. Telemetric organizes the folder into connected nodes first, so both you and the AI can move through it quickly. When you ask a question, several small agents each take one task, and you can see what each one did. I worked with two engineers who built the multi-agent engine, and designed the product concept, the end-to-end experience and the interface.',
    gradient: 'linear-gradient(135deg,#6a8cff,#a9c1ff 55%,#e0e8ff)',
    tools: ['figma', 'aftereffects', 'rive', 'lottie', 'framer'],
    story: true,
  },
  {
    slug: 'dso-modernization',
    title: 'DSO Modernization',
    logo: '/logos/georgia-dhs.png',
    cover: gif('command_palette_search'),
    year: '2025',
    role: 'UX Designer',
    stack: ['Figma', 'Bootstrap', 'Angular'],
    url: '#',
    client: 'Georgia DHS',
    summary: 'Moving Georgia DHS debt recovery off a legacy mainframe onto three connected cloud portals.',
    description:
      'For years, the Georgia Department of Human Services (DHS) recovered debt through an outdated mainframe. The Debt Setoff (DSO) Modernization moves that work to a cloud platform with three connected portals: one for the public, one for agency staff and one for external vendors. I set out to make claims, hearings, payments and reconciliation easier to handle, faster to finish and accessible to everyone involved.',
    gradient: 'linear-gradient(135deg,#6a8cff,#a9c1ff 55%,#e0e8ff)',
    link: {
      href: 'https://dor.georgia.gov/state-refund-offsets-other-agencies',
      title: 'Visit the public information page',
      note: 'How the state explains refund offsets to residents',
    },
    metrics: [
      { value: '1 search', label: 'Find a profile from any screen', note: 'Before, staff worked through menus to reach a profile. Now one search finds it, with results as you type.' },
      { value: '1 view', label: 'Everything about a person, together', note: 'Before, claims, hearings and payments sat on separate screens. Now they sit on one page.' },
      { value: 'AA', label: 'Built to WCAG 2.1 AA', note: 'Keyboard use and screen-reader labels were part of the design from the start.' },
      { value: 'Fewer steps', label: 'Processes take far less effort', note: 'Claims, hearings, payments and reconciliation now link to each other, so the steps to finish a process are significantly cut down.' },
    ],
    features: [
      { title: "Real-time status tracking", body: "A checklist shows which step each file is on, so nobody guesses whether a transfer is stuck.", gif: gif('system_process_live'), alt: "System process page with a live checklist advancing and an interface menu opening" },
      { title: "Segmented record views", body: "Intercepts, disbursements and refunds each get a tab under running totals, so a long record is split into small groups instead of one long page.", gif: shot('trail'), alt: "Switching between the intercepts, disbursements and refunds tabs of a profile" },
      { title: "System status visibility", body: "A void waits for supervisor approval, and the page says nothing is sent to the bank until then, so nobody is left wondering or acts too early.", gif: gif('check_void_approval'), alt: "Filling in a check void reason and comment and submitting for supervisor approval" },
      { title: "Status signaling", body: "A badge marks the hold and the Hearing tab explains it in plain language.", gif: shot('hold'), alt: "A profile marked Hearing: Under review, then the Hearing tab explaining the hold" },
      { title: "Progressive disclosure", body: "Social Security numbers stay masked until someone makes a deliberate, logged click, so sensitive detail appears only when it is needed.", gif: gif('ssn_reveal'), alt: "Revealing and hiding a masked SSN in a table row" },
      { title: "Guided scheduling", body: "Past dates are locked and the page warns that a batch can’t change on the day it runs, so the mistake is blocked before it happens.", gif: gif('check_batch_scheduling'), alt: "Choosing a date range and a weekly repeat and generating four scheduled batch dates" },
      { title: "Global command palette", body: "Ctrl K opens one search for pages and profiles, from any screen. Experienced staff get a fast path, and new staff can ignore it.", gif: gif('command_palette_search'), alt: "Command palette searching for the name Alder and listing four matching profiles" },
      { title: "Sortable, filterable data tables", body: "Sort, filter, resize and pick columns, built for work done hundreds of times a day, so repeat use is fast and not only the first visit.", gif: gif('table_sort_filter'), alt: "Profile table sorted by name and then filtered by city to show only Savannah" },
      { title: "Role-based navigation", body: "A partner-agency worker sees only Hearings, while DHS staff see everything, so each person faces only the choices that apply to them.", gif: gif('role_switch_nav'), alt: "Switching roles from the profile menu and the sidebar changing to show only hearing pages" },
    ],
  },
  {
    slug: 'scobin-design-system',
    title: 'Scobin Design System',
    logo: '/logos/scobin.svg',
    cover: '/projects/scobin/cover.png',
    year: '2024',
    role: 'Product Designer',
    stack: ['Figma', 'Storybook'],
    url: '#',
    client: 'Scobin',
    summary: 'A design system built from the ground up, now supporting 120+ employees.',
    description:
      'Scobin didn’t have a shared design language. Similar components looked and behaved differently across screens, leaving designers and developers to solve the same problems repeatedly. I built a design system from the ground up: a structured Figma library with 548 variables, 41 documented components, 35 icons, and 95 text styles. The system now supports a user base of more than 120 employees.',
    gradient: 'linear-gradient(135deg,#6a8cff,#a9c1ff 55%,#e0e8ff)',
    tools: ['figma', 'storybook', 'photoshop', 'html', 'css', 'javascript'],
    story: true,
    figma: 'https://www.figma.com/design/aQDljAL3G6oGoaenWvq81E/Scobin-Design-System?node-id=6-9',
  },
]

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
