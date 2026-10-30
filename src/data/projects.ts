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
    summary: 'A workspace where your files become a map, and a team of AI agents works on that map while you watch, steer and edit. Coming soon to beta.',
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
    summary: 'Debt Setoff (DSO) Modernization moves Georgia DHS off a legacy mainframe and onto three connected cloud portals that share one design system and meet WCAG 2.1 AA.',
    description:
      'For years, the Georgia Department of Human Services (DHS) recovered debt through an outdated mainframe. The Debt Setoff (DSO) Modernization moves that work to a cloud platform with three connected portals: one for the public, one for agency staff and one for external vendors. I set out to make claims, hearings, payments and reconciliation easier to handle, faster to finish and accessible to everyone involved.',
    gradient: 'linear-gradient(135deg,#6a8cff,#a9c1ff 55%,#e0e8ff)',
    metrics: [
      { value: '40%', label: 'Faster to finish a task', note: 'Caseworkers get through everyday work in well under the time the mainframe took.' },
      { value: '1', label: 'Place for a person’s story', note: 'Claims, hearings, payments and history sit together, so nobody hunts across screens.' },
      { value: 'AA', label: 'Usable by everyone', note: 'Checked against WCAG 2.1 AA, including keyboard use and screen readers.' },
      { value: '4', label: 'Workflows that feel connected', note: 'Claims, hearings, payments and reconciliation hand off to each other cleanly.' },
    ],
    features: [
      { title: "Real-time status tracking", body: "Checklist pattern, stepper, contextual action menu.", gif: gif('system_process_live'), alt: "System process page with a live checklist advancing and an interface menu opening" },
      { title: "Geospatial data visualization", body: "Choropleth map, metric toggle, hierarchical drill-down (county, agency).", gif: gif('counties_map'), alt: "Georgia county map reshading as the metric, agency and county change" },
      { title: "Segmented record views", body: "Tabbed navigation, summary KPIs, information grouping.", gif: shot('trail'), alt: "Switching between the intercepts, disbursements and refunds tabs of a taxpayer record" },
      { title: "System status visibility", body: "Confirmation feedback, pending-approval state, clear next-step affordance.", gif: gif('check_void_approval'), alt: "Filling in a check void reason and comment and submitting for supervisor approval" },
      { title: "Status signaling", body: "Status badge, explanatory tab, plain-language rationale.", gif: shot('hold'), alt: "A taxpayer marked Hearing: Under review, then the Hearing tab explaining the hold" },
      { title: "Progressive disclosure", body: "Data masked by default, intentional reveal, role-based access control.", gif: gif('ssn_reveal'), alt: "Revealing and hiding a masked SSN in a table row" },
      { title: "Guided scheduling", body: "Date range picker, recurrence presets, disabled past dates, inline validation warnings.", gif: gif('check_batch_scheduling'), alt: "Choosing a date range and a weekly repeat and generating four scheduled batch dates" },
      { title: "Layered detail", body: "Drill-down hierarchy, records and raw data views, traceable error states.", gif: gif('regions_file_drilldown'), alt: "Opening a bank file and switching between the records view and the raw source text" },
      { title: "Interactive data visualization", body: "Linked hover states, legend highlighting, centered data readout.", gif: gif('chart_tooltips'), alt: "Hovering over segments of a check status donut chart" },
      { title: "Global command palette", body: "Keyboard shortcut, instant search, categorized results.", gif: gif('command_palette_search'), alt: "Command palette searching for the name Alder and listing four matching taxpayers" },
      { title: "Sortable, filterable data tables", body: "Column sorting, per-column filters, reduced interaction cost for repeat tasks.", gif: gif('table_sort_filter'), alt: "Taxpayer table sorted by name and then filtered by city to show only Savannah" },
      { title: "Exception highlighting", body: "Status filter, color-coded rows, priority-based ordering.", gif: shot('signal'), alt: "Typing Exception into the latest status filter so only the red exception rows remain" },
      { title: "Resizable columns", body: "Drag handle, keyboard parity, user-controlled information density.", gif: gif('table_column_resize'), alt: "Dragging a column edge to widen the Taxpayer ID column and back again" },
      { title: "Customizable views", body: "Column picker, hidden-field indicator, role-based layouts.", gif: gif('table_choose_columns'), alt: "Opening the column chooser and toggling columns on and off" },
      { title: "Pagination controls", body: "Position indicator, adjustable page size, persistent context.", gif: gif('table_pagination'), alt: "Paging through the taxpayer table, from page 1 to 2 to 3 and back" },
      { title: "Tabbed hub layout", body: "Single entry point, designed empty states, consistent page structure.", gif: gif('tabs_switching'), alt: "Switching between the tabs of a taxpayer record" },
      { title: "Focused modal dialogs", body: "Rules surfaced up front, permanent record, single-task input.", gif: gif('add_comment_dialog'), alt: "Adding a comment to a taxpayer record in a dialog" },
      { title: "Role-based navigation", body: "Adaptive sidebar, scoped access, shared layout system.", gif: gif('role_switch_nav'), alt: "Switching roles from the profile menu and the sidebar changing to show only hearing pages" },
      { title: "Funnel visualization", body: "Stage conversion, agency and quarter filters, collapsible panels.", gif: gif('dashboard_filter_collapse'), alt: "Filtering the claim funnel by agency and collapsing a dashboard panel" },
      { title: "Collapsible sidebar", body: "Icon rail, expanded canvas, one-click restore.", gif: gif('sidebar_collapse'), alt: "Collapsing the sidebar to icons and expanding it again" },
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
    summary: 'A design system built from the ground up to make consistency easier, now supporting more than 120 employees.',
    description:
      'Scobin didn’t have a shared design language. Similar components looked and behaved differently across screens, leaving designers and developers to solve the same problems repeatedly. I built a design system from the ground up: a structured Figma library with 548 variables, 41 documented components, 35 icons, and 95 text styles. The system now supports a user base of more than 120 employees.',
    gradient: 'linear-gradient(135deg,#6a8cff,#a9c1ff 55%,#e0e8ff)',
    tools: ['figma', 'storybook', 'photoshop', 'html', 'css', 'javascript'],
    story: true,
    figma: 'https://www.figma.com/design/aQDljAL3G6oGoaenWvq81E/Scobin-Design-System?node-id=6-9',
  },
]

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
