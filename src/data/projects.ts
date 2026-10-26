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
}

export type Feature = { title: string; body: string; gif: string; alt: string }

const gif = (name: string) => `/projects/liheap-eap/${name}.gif`

/** Add a project: append an entry here and drop images in /public/projects/<slug>/. */
export const projects: Project[] = [
  {
    slug: 'dso-modernization',
    title: 'DSO Modernization',
    logo: '/logos/georgia-dhs.png',
    cover: gif('command_palette_search'),
    year: '2025',
    role: 'UI/UX Design & Front-end',
    stack: ['Figma', 'Bootstrap', 'Angular'],
    url: '#',
    client: 'Georgia DHS',
    summary: 'A legacy mainframe rebuilt as three connected, cloud-native portals on one shared design system, with accessibility built in.',
    description:
      'The Georgia Department of Human Services relied on a decades-old mainframe to collect debts owed to the state, such as overpaid benefits and unpaid taxes. DSO Modernization replaces it with a responsive, cloud-native platform made of three connected portals: one for the public, one for agency staff and one for outside vendors. Behind them are multi-agency business rules, sensitive taxpayer data and bank file exchanges. All three portals share one design system that was built for accessibility from the start.',
    gradient: 'linear-gradient(135deg,#6a8cff,#a9c1ff 55%,#e0e8ff)',
    features: [
      { title: "Watch the integrations work", body: "System process shows each partner interface and the file being handled right now, step by step, from connecting and transferring to validating and updating balances. Every interface has its own menu to view details, test the connection or pause feeds.", gif: gif('system_process_live'), alt: "System process page with a live checklist advancing and an interface menu opening" },
      { title: "See where claims come from", body: "A map of Georgia shaded by claims received. Pick a county or an agency, and switch between claims, amounts and intercepts.", gif: gif('counties_map'), alt: "Georgia county map reshading as the metric, agency and county change" },
      { title: "Say what happens next", body: "A void does not take effect straight away. The page confirms the check is waiting for supervisor approval and that nothing is sent to the bank until then.", gif: gif('check_void_approval'), alt: "Filling in a check void reason and comment and submitting for supervisor approval" },
      { title: "Reveal a number only on purpose", body: "Social Security numbers are masked by default. Revealing one is a deliberate click on a single row, limited by role and logged.", gif: gif('ssn_reveal'), alt: "Revealing and hiding a masked SSN in a table row" },
      { title: "Plan a month of batches in a few clicks", body: "Pick a date range, choose how often it repeats and generate the schedule. Past dates are locked, and the page warns that a scheduled batch cannot change on the day it runs.", gif: gif('check_batch_scheduling'), alt: "Choosing a date range and a weekly repeat and generating four scheduled batch dates" },
      { title: "Look inside the file that was sent", body: "Open any bank file to see check-level detail, then the outbound file itself, as fields with character positions or as raw fixed-width text. Rejections can be traced to the exact line.", gif: gif('regions_file_drilldown'), alt: "Opening a bank file and switching between the records view and the raw source text" },
      { title: "Hover to read the number", body: "Moving across the donut highlights the matching status in the legend and shows its count and share in the centre.", gif: gif('chart_tooltips'), alt: "Hovering over segments of a check status donut chart" },
      { title: "Find a person from anywhere", body: "Press Ctrl K on any screen to search pages and taxpayers in one box. Results update as you type and say what each will open.", gif: gif('command_palette_search'), alt: "Command palette searching for the name Alder and listing four matching taxpayers" },
      { title: "Narrow a long list, quickly", body: "Sort by any column header, then filter by column. Built for repeated work: search, filter, open a record, move to the next.", gif: gif('table_sort_filter'), alt: "Taxpayer table sorted by name and then filtered by city to show only Savannah" },
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
  {
    slug: 'scobin-tables',
    title: 'Scobin',
    year: '2024',
    role: 'UX Lead & Design Systems',
    stack: ['Figma', 'Design tokens', 'Responsive grid'],
    url: '#',
    client: 'Scobin',
    summary: 'Data-dense tables, filters and bulk actions backed by a tokenised design system.',
    description:
      'Tables, filters and bulk actions for a data-dense inventory and pricing platform, backed by a design system with tokens, versioning and a responsive grid. Result: 40% fewer manual errors, 35% faster task time and 20% adoption growth in 3 months.',
    gradient: 'linear-gradient(135deg,#3fbf9b,#9ee3c8 55%,#dcf6ec)',
  },
]

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
