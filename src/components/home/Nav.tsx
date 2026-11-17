import { useLocation, useNavigate } from 'react-router-dom'
import { site } from '@/data/site'
import { scrollToSection, useMeSection, type MeSection } from '@/lib/me-section'

// each icon is a small bitmap, one string per row of pixels: a game controller, and a briefcase
const LINKS: { id: MeSection; label: string; icon: string[] }[] = [
  { id: 'about', label: 'Playground', icon: ['.#######.', '#########', '##.###.##', '#########', '###...###', '##.....##'] },
  { id: 'projects', label: 'Work', icon: ['...###...', '...#.#...', '#########', '####.####', '#########', '#########'] },
]

/** A bitmap drawn as two-pixel squares with hard edges, in the colour of the text beside it. */
function PixelIcon({ rows }: { rows: string[] }) {
  const w = rows[0].length
  return (
    <svg className="bar-icon" viewBox={`0 0 ${w} ${rows.length}`} width={w * 2} height={rows.length * 2} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) => [...row.matchAll(/#+/g)].map((run) => <rect key={`${y}-${run.index}`} x={run.index} y={y} width={run[0].length} height={1} />))}
    </svg>
  )
}

/** Fixed top bar: the wordmark on the left, the section links in a pixel menu in the middle. Over a case study it stays, with a way back on the right. */
export function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const section = useMeSection()
  const inCase = pathname.startsWith('/project/')

  // from a case study, go home first and then to the section once the page is uncovered
  const go = (id: MeSection) => {
    if (!inCase) return scrollToSection(id)
    navigate('/')
    setTimeout(() => scrollToSection(id, false), 80)
  }

  return (
    <div className={inCase ? 'bar is-case' : 'bar'}>
      <button type="button" className="bar-mark" aria-label={`${site.name}, back to top`} onClick={() => go('me')}>
        {site.firstName.toLowerCase()}
      </button>
      <nav className="bar-pill" aria-label="Primary">
        {LINKS.map((l) => (
          <button key={l.id} type="button" className="bar-link" aria-current={!inCase && section === l.id} onClick={() => go(l.id)}>
            <PixelIcon rows={l.icon} />{l.label}
          </button>
        ))}
      </nav>
      {inCase && <button type="button" className="key" onClick={() => go('projects')}>back to work</button>}
    </div>
  )
}
