import { Code, Microscope, PenTool, Workflow, X } from 'lucide-react'
import { projects } from '@/data/projects'
import { INKY, PALE, RASTER, type ToolId, logoScale } from '@/data/tools'
import { jobs } from '@/data/work'

/* The pieces the work app and its toolkit both use: where I have worked, what I am good at, the logos, and the cross that closes things. */

const telemetric = projects.find((p) => p.slug === 'telemetric')!
// months are counted from January 2021; `end` is the month after the last one. The present is read from the clock, held within
// the years the timeline draws
const month = (year: number, m: number) => (year - 2021) * 12 + m - 1
const today = new Date()
export const NOW = Math.min(month(today.getFullYear(), today.getMonth() + 1) + 1, month(2027, 1))
export const PLACES = [
  { key: 'GA', name: 'Georgia DHS', hue: '#4ea7fc', dates: 'Feb 2025 to now', start: month(2025, 2), end: NOW, ...jobs[0] },
  { key: 'SCO', name: 'Scobin', hue: '#e879c7', dates: 'Jan 2024 to Feb 2025', start: month(2024, 1), end: month(2025, 2), ...jobs[1] },
  { key: 'WIP', name: 'Wipro', hue: '#4cb782', dates: 'Apr 2021 to Dec 2022', start: month(2021, 4), end: month(2022, 12), ...jobs[2] },
  { key: 'TEL', name: 'Telemetric', hue: '#f2994a', role: telemetric.role, dates: '2026, co-founder', start: month(2026, 1), end: NOW, product: 'A workspace where your files become a map, and AI agents work on it with you', highlights: ['Designed the product concept, the end-to-end experience and the interface, alongside the two engineers who built the agent engine', 'Turned a folder into a map of connected notes that both you and the AI can move through', 'Designed a panel that shows several small agents each taking one task, and what each one did'], tools: (telemetric.tools ?? []) as ToolId[] },
  { key: 'UMBC', name: 'UMBC', hue: '#febb00', role: 'Graduate Student', dates: '2023', start: month(2023, 1), end: month(2023, 12), product: 'Master of Science, Information Systems', highlights: ['Master of Science in Information Systems', 'Coursework in UX research methods, information architecture and usability', 'Interaction design and human-computer interaction'], tools: [] as ToolId[] },
]

// each area borrows the icon and colour of the matching stage on the board
export const EXPERTISE = [
  { name: 'Research', hue: '#4ea7fc', Icon: Microscope, list: ['Contextual inquiry', 'Ride-alongs', 'Stakeholder interviews', 'Usability testing', 'Personas', 'Journey maps', 'GA4', 'Hotjar'] },
  { name: 'Product', hue: '#f2c94c', Icon: Workflow, list: ['Information architecture', 'User flows', 'Task analysis', 'Workflow and form design', 'State logic', 'Design strategy'] },
  { name: 'Design', hue: '#e879c7', Icon: PenTool, list: ['Interaction design', 'Prototyping', 'Design systems', 'Design tokens', 'Microcopy', 'WCAG 2.1 AA', 'Section 508', 'Design QA'] },
  { name: 'Build', hue: '#4cb782', Icon: Code, list: ['Figma', 'Dev Mode', 'Miro', 'Jira', 'Angular', 'Bootstrap', 'HTML', 'CSS', 'JavaScript', 'ARIA', 'REST APIs', 'axe', 'WAVE', 'Lighthouse'] },
]

// the emblem of each workplace, without its wordmark: the seal cut from the Georgia DHS logo, the hexagon of the Scobin one (the same
// drawing with a tighter view box), and the Wipro logo whole, since its name sits inside its ring of dots
const MARKS: Record<string, string> = {
  GA: '/logos/georgia-dhs-mark.png',
  SCO: '/logos/scobin-mark.svg',
  WIP: '/logos/wipro.webp',
  UMBC: '/logos/umbc-mark.svg',
}

// the Georgia DHS and Scobin emblems are dark single-colour marks, so they sit straight on the dark page with their colours inverted
const BARE = ['GA', 'SCO', 'UMBC']

// Wipro keeps its real colours on a small light tile, the ground the logo was drawn for; Telemetric has none yet, so it gets a small map of three joined notes
export function PlaceLogo({ p }: { p: number }) {
  const { hue, key } = PLACES[p]
  if (MARKS[key]) return <img className={BARE.includes(key) ? 'plogo is-bare' : 'plogo'} src={MARKS[key]} alt="" width={18} height={18} draggable={false} />
  return (
    <svg className="ico" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke={hue} strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M4.2 10.4l3-5.4M9.4 5.2l2.6 4.2M5.4 12h5.2" /><circle cx="8.3" cy="3.6" r="1.7" /><circle cx="3.4" cy="12" r="1.7" /><circle cx="12.6" cy="11" r="1.7" />
    </svg>
  )
}

// a tool shows its real logo straight on the page, with no tile behind it. The file is only fetched once the logo is on screen.
export function ToolLogo({ id }: { id: ToolId }) {
  const kind = RASTER[id]
  return <img className={kind ? 'plogo is-tool is-raster' : 'plogo is-tool'} src={`/tools/color/${id}.${kind ?? 'svg'}`} alt="" width={18} height={18} loading="lazy" decoding="async" draggable={false} data-ink={INKY.includes(id) || undefined} data-pale={PALE.includes(id) || undefined} style={{ scale: logoScale[id] }} />
}

/** The cross that closes whatever is open: the card, a dialog or a toast. One button, so it looks and works the same everywhere. */
export function Close({ label = 'Close', onClick, tip, small, autoFocus }: { label?: string; onClick: () => void; tip?: string; small?: boolean; autoFocus?: boolean }) {
  return <button type="button" className="lin-icon" aria-label={label} data-tip={tip} data-tip-end={tip ? '' : undefined} autoFocus={autoFocus} onClick={(e) => { e.stopPropagation(); onClick() }}><X size={small ? 13 : 15} /></button>
}

export const YEARS = [2021, 2022, 2023, 2024, 2025, 2026]
export const SPAN = YEARS.length * 12
