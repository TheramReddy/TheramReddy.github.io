/** Original full-colour brand logos, stored in /public/tools/<id>.svg. */
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
  react: 'React',
} as const

export type ToolId = keyof typeof tools
