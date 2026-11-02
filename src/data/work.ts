import type { ToolId } from './tools'

export type Job = {
  when: string
  where: string
  company: string
  current?: boolean
  role: string
  /** creative headline, the card's main line */
  title: string
  /** Drop an image in /public/logos and set `src` to use a real logo instead of the monogram. */
  logos: { label: string; color: string; src?: string }[]
  /** Project pages the job links to (see data/projects.ts). */
  projects: { slug: string }[]
  tools: ToolId[]
}

export const jobs: Job[] = [
  {
    when: 'Present',
    where: 'GEORGIA>GOVERNMENT',
    company: 'Georgia Department of Human Services',
    current: true,
    role: 'UX Designer',
    title: 'Clarity is the kindest thing a screen can offer',
    logos: [{ label: 'GA', color: '#fff', src: '/logos/georgia-dhs.png' }],
    projects: [{ slug: 'dso-modernization' }],
    tools: ['figma', 'sketch', 'storybook', 'claude', 'rust', 'angular', 'bootstrap', 'photoshop'],
  },
  {
    when: '2024',
    where: 'SCOBIN>PRODUCT',
    company: 'Scobin',
    role: 'Product Designer',
    title: 'Decide once, then create freely',
    logos: [{ label: 'S', color: '#fff', src: '/logos/scobin.svg' }],
    projects: [{ slug: 'scobin-design-system' }],
    tools: ['figma', 'storybook', 'photoshop', 'html', 'css', 'javascript'],
  },
  {
    when: '2021',
    where: 'WIPRO>ENTERPRISE',
    company: 'Wipro',
    role: 'UI Developer',
    title: 'Made for everyone, from the first line',
    logos: [{ label: 'W', color: '#fff', src: '/logos/wipro.webp' }],
    projects: [],
    tools: ['angular', 'typescript', 'javascript', 'html', 'css', 'bootstrap', 'git'],
  },
]
