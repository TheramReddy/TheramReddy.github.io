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
}

export type Metric = { value: string; label: string; note: string }

export type Feature = { title: string; body: string; gif: string; alt: string }

const gif = (name: string) => `/projects/liheap-eap/${name}.gif`
const shot = (name: string) => `/projects/dso-modernization/${name}.gif`

/** Add a project: append an entry here and drop images in /public/projects/<slug>/. */
export const projects: Project[] = [
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
      { value: '3', label: 'Audiences, one front door each', note: 'Taxpayers, agency staff and vendors each see only what their job needs.' },
      { value: '1', label: 'Place for a person’s story', note: 'Claims, hearings, payments and history sit together, so nobody hunts across screens.' },
      { value: '24/7', label: 'Help without office hours', note: 'People can check on a claim or pay at 9pm instead of waiting for the phone lines.' },
      { value: 'AA', label: 'Usable by everyone', note: 'Checked against WCAG 2.1 AA, including keyboard use and screen readers.' },
      { value: '4', label: 'Workflows that feel connected', note: 'Claims, hearings, payments and reconciliation hand off to each other cleanly.' },
    ],
    features: [
      { title: "Watch the integrations work", body: "System process lists each partner interface and the file it is handling right now. A checklist moves through connecting, transferring, validating and updating balances. Each interface has a menu for viewing details, testing the connection or pausing feeds.", gif: gif('system_process_live'), alt: "System process page with a live checklist advancing and an interface menu opening" },
      { title: "See where claims come from", body: "A map of Georgia shaded by claims received. Pick a county or an agency, and switch between claims, amounts and intercepts.", gif: gif('counties_map'), alt: "Georgia county map reshading as the metric, agency and county change" },
      { title: "Follow the money, step by step", body: "Intercepts, disbursements and refunds each get their own tab with a count, under running totals for claimed, intercepted, disbursed and returned.", gif: shot('trail'), alt: "Switching between the intercepts, disbursements and refunds tabs of a taxpayer record" },
      { title: "Say what happens next", body: "A void does not take effect straight away. The page confirms the check is waiting for supervisor approval and that nothing is sent to the bank until then.", gif: gif('check_void_approval'), alt: "Filling in a check void reason and comment and submitting for supervisor approval" },
      { title: "Explain why funds are held", body: "A taxpayer under hearing review is marked on the record. The Hearing tab says funds are held while a hearing is active and where review and approval happen.", gif: shot('hold'), alt: "A taxpayer marked Hearing: Under review, then the Hearing tab explaining the hold" },
      { title: "Reveal a number only on purpose", body: "Social Security numbers are masked by default. Revealing one is a deliberate click on a single row, limited by role and logged.", gif: gif('ssn_reveal'), alt: "Revealing and hiding a masked SSN in a table row" },
      { title: "Plan a month of batches in a few clicks", body: "Pick a date range, choose how often it repeats and generate the schedule. Past dates are locked, and the page warns that a scheduled batch cannot change on the day it runs.", gif: gif('check_batch_scheduling'), alt: "Choosing a date range and a weekly repeat and generating four scheduled batch dates" },
      { title: "Look inside the file that was sent", body: "Open any bank file to see check-level detail, then the outbound file itself, as fields with character positions or as raw fixed-width text. Rejections can be traced to the exact line.", gif: gif('regions_file_drilldown'), alt: "Opening a bank file and switching between the records view and the raw source text" },
      { title: "Hover to read the number", body: "Moving across the donut highlights the matching status in the legend and shows its count and share in the centre.", gif: gif('chart_tooltips'), alt: "Hovering over segments of a check status donut chart" },
      { title: "Find a person from anywhere", body: "Press Ctrl K on any screen to search pages and taxpayers in one box. Results update as you type and say what each will open.", gif: gif('command_palette_search'), alt: "Command palette searching for the name Alder and listing four matching taxpayers" },
      { title: "Narrow a long list, quickly", body: "Sort by any column header, then filter by column. Built for repeated work: search, filter, open a record, move to the next.", gif: gif('table_sort_filter'), alt: "Taxpayer table sorted by name and then filtered by city to show only Savannah" },
      { title: "Pull the exceptions to the top", body: "Type Exception into the latest status filter and only the rows that need a person remain, marked in red.", gif: shot('signal'), alt: "Typing Exception into the latest status filter so only the red exception rows remain" },
      { title: "Let people size their own table", body: "Drag the edge of a column to widen or narrow it. The same handle works from the keyboard.", gif: gif('table_column_resize'), alt: "Dragging a column edge to widen the Taxpayer ID column and back again" },
      { title: "Show only what the job needs", body: "The column picker lists every field and says how many are hidden, so a case manager and a supervisor can each see the view they need.", gif: gif('table_choose_columns'), alt: "Opening the column chooser and toggling columns on and off" },
      { title: "Move through results without losing your place", body: "Pagination shows where you are in the set, for example 1 to 15 of 96, and lets you change how many rows appear per page.", gif: gif('table_pagination'), alt: "Paging through the taxpayer table, from page 1 to 2 to 3 and back" },
      { title: "One person, seven views", body: "Taxpayer 360 is the hub for a person. Empty tabs say what will appear there instead of showing a blank box.", gif: gif('tabs_switching'), alt: "Switching between the tabs of a taxpayer record" },
      { title: "Comments that stay on the record", body: "The dialog states its rule up front: comments stay with the taxpayer record and cannot be deleted.", gif: gif('add_comment_dialog'), alt: "Adding a comment to a taxpayer record in a dialog" },
      { title: "Two audiences, one system", body: "Switching role changes the navigation. A partner-agency worker sees only Hearings; DHS staff see the full set.", gif: gif('role_switch_nav'), alt: "Switching roles from the profile menu and the sidebar changing to show only hearing pages" },
      { title: "From referral to decision, at a glance", body: "Claim to decision shows how many claims reach each stage and where they drop off. Filter by agency or switch quarters. All figures are demo data.", gif: gif('dashboard_filter_collapse'), alt: "Filtering the claim funnel by agency and collapsing a dashboard panel" },
      { title: "Give the work more room", body: "Collapse the sidebar to icons when the table needs the width, and bring it back in one click.", gif: gif('sidebar_collapse'), alt: "Collapsing the sidebar to icons and expanding it again" },
    ],
  },
]

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
