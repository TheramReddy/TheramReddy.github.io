import type { ToolId } from './tools'

export type Job = {
  when: string
  where: string
  company: string
  current?: boolean
  role: string
  about: string
  /** Drop an image in /public/logos and set `src` to use a real logo instead of the monogram. */
  logos: { label: string; color: string; src?: string }[]
  /** Project pages the job links to (see data/projects.ts). */
  projects: { slug: string }[]
  tools: ToolId[]
}

export const jobs: Job[] = [
  {
    when: '2025',
    where: 'GEORGIA>CONTRACT',
    company: 'Georgia Department of Human Services',
    current: true,
    role: 'UX Designer',
    about: 'Moved legacy mainframe systems to cloud-native web platforms for state caseworkers, 40% faster task completion.',
    logos: [{ label: 'GA', color: '#fff', src: '/logos/georgia-dhs.png' }],
    projects: [{ slug: 'dso-modernization' }],
    tools: ['figma', 'sketch', 'storybook', 'claude', 'rust', 'angular', 'bootstrap', 'photoshop'],
  },
  {
    when: '2023',
    where: 'SCOBIN>UX',
    company: 'Scobin',
    role: 'Product Designer',
    about: 'Designed an inventory and pricing platform, 40% fewer manual errors and 35% faster tasks.',
    logos: [{ label: 'S', color: '#fff', src: '/logos/scobin.svg' }],
    projects: [{ slug: 'scobin-tables' }],
    tools: ['figma', 'storybook', 'photoshop', 'html', 'css', 'javascript'],
  },
  {
    when: '2021',
    where: 'WIPRO>ENTERPRISE',
    company: 'Wipro',
    role: 'UI Developer',
    about: 'Built accessible enterprise portals, A/B tested for +15% engagement and +10% conversions.',
    logos: [{ label: 'W', color: '#fff', src: '/logos/wipro.webp' }],
    projects: [{ slug: 'dso-modernization' }],
    tools: ['angular', 'typescript', 'javascript', 'html', 'css', 'bootstrap', 'git'],
  },
]
