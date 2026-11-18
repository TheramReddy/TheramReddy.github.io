/** Brand logos converted to greyscale, stored in /public/tools/<id>.svg; the full-colour ones the playground uses are in /public/tools/color/<id>.svg. */
export const tools = {
  figma: 'Figma',
  sketch: 'Sketch',
  storybook: 'Storybook',
  claude: 'Claude',
  rust: 'Rust',
  angular: 'Angular',
  css: 'CSS',
  photoshop: 'Photoshop',
  bootstrap: 'Bootstrap',
  html: 'HTML',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  git: 'Git',
  aftereffects: 'After Effects',
  rive: 'Rive',
  lottie: 'Lottie',
  framer: 'Framer',
  miro: 'Miro',
  jira: 'Jira',
  ga4: 'Google Analytics 4',
  hotjar: 'Hotjar',
  axe: 'axe',
  wave: 'WAVE',
  lighthouse: 'Lighthouse',
  illustrator: 'Illustrator',
  xd: 'Adobe XD',
  zeplin: 'Zeplin',
  notion: 'Notion',
  confluence: 'Confluence',
  vscode: 'VS Code',
  figjam: 'FigJam',
  protopie: 'ProtoPie',
  webflow: 'Webflow',
  axure: 'Axure RP',
  indesign: 'InDesign',
  blender: 'Blender',
  spline: 'Spline',
  canva: 'Canva',
  maze: 'Maze',
  usertesting: 'UserTesting',
  dovetail: 'Dovetail',
  optimal: 'Optimal Workshop',
  amplitude: 'Amplitude',
  linear: 'Linear',
  slack: 'Slack',
  trello: 'Trello',
  invision: 'InVision',
  balsamiq: 'Balsamiq',
  whimsical: 'Whimsical',
  zeroheight: 'zeroheight',
  lightroom: 'Lightroom',
  premiere: 'Premiere Pro',
  procreate: 'Procreate',
  lookback: 'Lookback',
  typeform: 'Typeform',
  mixpanel: 'Mixpanel',
  clarity: 'Microsoft Clarity',
  airtable: 'Airtable',
  react: 'React',
  tailwind: 'Tailwind CSS',
  github: 'GitHub',
  stark: 'Stark',
  nvda: 'NVDA',
  voiceover: 'VoiceOver',
  browserstack: 'BrowserStack',
  asana: 'Asana',
  loom: 'Loom',
  teams: 'Microsoft Teams',
  zoom: 'Zoom',
} as const

export type ToolId = keyof typeof tools
export const TOOL_IDS = Object.keys(tools) as ToolId[]

/** What each tool is for; the toolkit groups a role's tools under these, in this order. */
export const TOOL_KINDS = ['Design', 'Research', 'Build', 'Test', 'Team'] as const
type ToolKind = (typeof TOOL_KINDS)[number]
export const toolKind: Record<ToolId, ToolKind> = {
  figma: 'Design', sketch: 'Design', xd: 'Design', framer: 'Design', illustrator: 'Design', photoshop: 'Design', aftereffects: 'Design', rive: 'Design', lottie: 'Design', storybook: 'Design',
  figjam: 'Design', protopie: 'Design', webflow: 'Design', axure: 'Design', indesign: 'Design', blender: 'Design', spline: 'Design', canva: 'Design',
  invision: 'Design', balsamiq: 'Design', whimsical: 'Design', zeroheight: 'Design', lightroom: 'Design', premiere: 'Design', procreate: 'Design',
  miro: 'Research', ga4: 'Research', hotjar: 'Research', maze: 'Research', usertesting: 'Research', dovetail: 'Research', optimal: 'Research', amplitude: 'Research', lookback: 'Research', typeform: 'Research', mixpanel: 'Research', clarity: 'Research', airtable: 'Research',
  angular: 'Build', bootstrap: 'Build', html: 'Build', css: 'Build', javascript: 'Build', typescript: 'Build', git: 'Build', rust: 'Build', vscode: 'Build', claude: 'Build', react: 'Build', tailwind: 'Build', github: 'Build',
  axe: 'Test', wave: 'Test', lighthouse: 'Test', stark: 'Test', nvda: 'Test', voiceover: 'Test', browserstack: 'Test',
  jira: 'Team', confluence: 'Team', notion: 'Team', zeplin: 'Team', linear: 'Team', slack: 'Team', trello: 'Team', asana: 'Team', loom: 'Team', teams: 'Team', zoom: 'Team',
}

/** Every tool has a logo in /public/tools/color/: an SVG, except the ones listed here, which only exist as pictures. */
export const RASTER: Partial<Record<ToolId, 'png' | 'jpg'>> = {
  axe: 'png', wave: 'png', axure: 'png', lookback: 'png', nvda: 'png', optimal: 'png', procreate: 'png', protopie: 'png', spline: 'png', stark: 'png', whimsical: 'png', balsamiq: 'jpg',
}

/** Logos drawn in black: on the dark app they are inverted, so they read as white. */
export const INKY: ToolId[] = ['rust', 'framer']

/** Logos drawn in white: on the light app they are the ones inverted, so they read as black. */
export const PALE: ToolId[] = ['clarity', 'github', 'notion', 'rive', 'typeform', 'voiceover']

/**
 * Optical size of each logo. Every logo is fitted into the same square, so a tall or wide mark ends up smaller than a square one,
 * and a full square tile looks heavier than a bare mark. These factors even them out; anything not listed stays at 1.
 */
export const logoScale: Partial<Record<ToolId, number>> = {
  figma: 1.2, framer: 1.2, html: 1.18, css: 1.18, storybook: 1.1, bootstrap: 1.1, zeplin: 1.1, hotjar: 1.05, ga4: 1.05, sketch: 1.05,
  photoshop: 0.92, illustrator: 0.92, aftereffects: 0.92, xd: 0.92, lottie: 0.92, miro: 0.92, javascript: 0.92, typescript: 0.92,
}

/** The applications I work in, listed in the playground sidebar. */
export const apps: ToolId[] = ['figma', 'sketch', 'framer', 'photoshop', 'illustrator', 'aftereffects', 'rive', 'lottie', 'storybook', 'miro', 'xd', 'zeplin', 'hotjar', 'ga4', 'jira', 'confluence', 'notion', 'claude', 'vscode']
