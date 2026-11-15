import type { ToolId } from './tools'

export type Job = {
  role: string
  product: string
  /** what I did in the role: each line starts with the verb, and ends with the number where one was measured */
  highlights: string[]
  tools: ToolId[]
}

export const jobs: Job[] = [
  {
    role: 'UX Designer',
    product: 'Legacy state systems rebuilt as cloud portals',
    highlights: [
      'Researched with 50+ caseworkers and subject experts through contextual inquiry, ride-alongs and workshops',
      'Designed three role-based portals for residents, caseworkers and vendors: task time down about 40%, usability scores up 15%',
      'Modeled LIHEAP eligibility as conditional, permission-aware flows that show only the relevant fields',
      'Defined shared components on a WCAG 2.1 AA baseline, verified in the build with axe, WAVE and Lighthouse',
      'Ran usability testing after every round: user flows, wireframes and annotated high-fidelity prototypes',
    ],
    tools: ['figma', 'sketch', 'illustrator', 'storybook', 'photoshop', 'miro', 'claude', 'angular', 'bootstrap', 'rust', 'vscode', 'jira', 'confluence', 'axe', 'wave', 'lighthouse'],
  },
  {
    role: 'Product Designer',
    product: 'Inventory platform with dense operational data',
    highlights: [
      'Audited the whole product UI and found five dropdown patterns, three primary buttons and four error styles',
      'Built a design system as the single source of truth: 548 variables, 41 documented components, 35 icons and 95 text styles',
      'Reworked dense inventory screens with progressive disclosure: task time down 35%, manual errors down 40%',
      'Turned customer feedback, observation and competitive analysis into recommendations: adoption up 20% in three months',
      'Agreed component specs and ownership with design and engineering',
    ],
    tools: ['figma', 'illustrator', 'storybook', 'photoshop', 'miro', 'hotjar', 'html', 'css', 'javascript', 'vscode', 'jira', 'notion'],
  },
  {
    role: 'UI Developer',
    product: 'Enterprise client portals',
    highlights: [
      'Built UX specs as responsive Angular interfaces and reusable components',
      'Flagged technical constraints early in wireframe and prototype reviews with designers, clients and engineers',
      'Rewrote server and client validation as inline, actionable messages with recovery steps',
      'Sped up the first load with lazy loading, code splitting and asset optimization',
      'Contributed to A/B tests on two client portals: engagement up 15%, conversion up 10%',
    ],
    tools: ['xd', 'ga4', 'hotjar', 'angular', 'typescript', 'javascript', 'html', 'css', 'bootstrap', 'git', 'vscode', 'jira', 'confluence', 'zeplin'],
  },
]
