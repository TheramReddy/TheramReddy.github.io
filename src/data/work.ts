import type { ToolId } from './tools'

export type Job = {
  role: string
  product: string
  highlights: string[]
  tools: ToolId[]
}

export const jobs: Job[] = [
  {
    role: 'UX Designer',
    product: 'Legacy state systems rebuilt as cloud portals',
    highlights: [
      'Research with 50+ caseworkers and subject experts: contextual inquiry, ride-alongs and workshops',
      'Three role-based portals for residents, caseworkers and vendors: task time down about 40%, usability scores up 15%',
      'LIHEAP eligibility modeled as conditional, permission-aware flows that show only the relevant fields',
      'Shared components on a WCAG 2.1 AA baseline, verified in the build with axe, WAVE and Lighthouse',
      'Usability testing after every round: user flows, wireframes and annotated high-fidelity prototypes',
    ],
    tools: ['figma', 'sketch', 'illustrator', 'storybook', 'photoshop', 'miro', 'claude', 'angular', 'bootstrap', 'rust', 'vscode', 'jira', 'confluence', 'axe', 'wave', 'lighthouse'],
  },
  {
    role: 'Product Designer',
    product: 'Inventory platform with dense operational data',
    highlights: [
      'A product-wide UI audit to surface inconsistent patterns',
      'A design system as the single source of truth: 548 variables, 41 documented components, 35 icons and 95 text styles',
      'Dense inventory screens reworked with progressive disclosure: task time down 35%, manual errors down 40%',
      'Customer feedback, observation and competitive analysis turned into recommendations: adoption up 20% in three months',
      'Component specs and ownership agreed with design and engineering',
    ],
    tools: ['figma', 'illustrator', 'storybook', 'photoshop', 'miro', 'hotjar', 'html', 'css', 'javascript', 'vscode', 'jira', 'notion'],
  },
  {
    role: 'UI Developer',
    product: 'Enterprise client portals',
    highlights: [
      'UX specs built as responsive Angular interfaces and reusable components',
      'Technical constraints flagged early in wireframe and prototype reviews with designers, clients and engineers',
      'Server and client validation rewritten as inline, actionable messages with recovery steps',
      'Faster first load through lazy loading, code splitting and asset optimization',
      'A/B tests on two client portals: engagement up 15%, conversion up 10%',
    ],
    tools: ['xd', 'ga4', 'hotjar', 'angular', 'typescript', 'javascript', 'html', 'css', 'bootstrap', 'git', 'vscode', 'jira', 'confluence', 'zeplin'],
  },
]
