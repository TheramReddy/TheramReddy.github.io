import type { ToolId } from './tools'

export type Job = {
  when: string
  /** years in the role, from the resume, e.g. "2025 — Now" */
  span: string
  where: string
  company: string
  current?: boolean
  role: string
  /** creative headline, the card's main line */
  title: string
  /** what the product was, then what I did there (both from the resume) */
  product: string
  did: string
  /** Drop an image in /public/logos and set `src` to use a real logo instead of the monogram. */
  logos: { label: string; color: string; src?: string }[]
  /** Project pages the job links to (see data/projects.ts). */
  projects: { slug: string }[]
  tools: ToolId[]
}

export const jobs: Job[] = [
  {
    when: 'Present',
    span: '2025 — Now',
    where: 'GEORGIA>GOVERNMENT',
    company: 'Georgia Department of Human Services',
    current: true,
    role: 'UX Designer',
    title: 'Clarity is the kindest thing a screen can offer',
    product: 'Legacy state systems rebuilt as cloud portals',
    did: 'I design role-based portals for the public, agency staff and vendors, grounded in research with 50+ caseworkers and subject experts, with shared components and a WCAG 2.1 AA baseline.',
    logos: [{ label: 'GA', color: '#fff', src: '/logos/georgia-dhs.png' }],
    projects: [{ slug: 'dso-modernization' }],
    tools: ['figma', 'sketch', 'storybook', 'claude', 'rust', 'angular', 'bootstrap', 'photoshop'],
  },
  {
    when: '2024',
    span: '2024 — 25',
    where: 'SCOBIN>PRODUCT',
    company: 'Scobin',
    role: 'Product Designer',
    title: 'Decide once, then create freely',
    product: 'Inventory platform with dense operational data',
    did: 'I led a product-wide UI audit, then built the design system that became the single source of truth for design and engineering.',
    logos: [{ label: 'S', color: '#fff', src: '/logos/scobin.svg' }],
    projects: [{ slug: 'scobin-design-system' }],
    tools: ['figma', 'storybook', 'photoshop', 'html', 'css', 'javascript'],
  },
  {
    when: '2021',
    span: '2021 — 22',
    where: 'WIPRO>ENTERPRISE',
    company: 'Wipro',
    role: 'UI Developer',
    title: 'Made for everyone, from the first line',
    product: 'Enterprise client portals',
    did: 'I turned UX specs into responsive Angular interfaces and reusable components, and rewrote validation errors as inline messages with recovery steps.',
    logos: [{ label: 'W', color: '#fff', src: '/logos/wipro.webp' }],
    projects: [],
    tools: ['angular', 'typescript', 'javascript', 'html', 'css', 'bootstrap', 'git'],
  },
]
