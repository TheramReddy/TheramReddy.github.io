import type { Act, Dir } from './crew'

/**
 * The agent sprite on a 12 x 13 pixel grid. At rest it is the plain pose: antenna, body,
 * two arm nubs, pupils, two legs. Each activity brings its own props (keyboard, sheet,
 * pencil, files, lens, packet), all driven by CSS keyed on data-act so changing act
 * never remounts the sprite.
 */
export function Bot({ act, dir = 'r', look, size = 37.2 }: { act: Act; dir?: Dir; look?: Dir; size?: number }) {
  return (
    <svg className="bot" data-act={act} data-dir={dir} data-look={look} width={size} height={(size * 13) / 12} viewBox="0 0 12 13" shapeRendering="crispEdges" aria-hidden="true">
      <g className="bot-stool">
        <rect x="2" y="11.6" width="8" height="1" />
        <rect x="5.5" y="12.6" width="1" height="0.6" />
      </g>

      <g className="bot-pose">
        <g className="bot-bob">
          <g className="bot-legs">
            <rect x="3" y="9" width="2" height="3" />
            <rect x="7" y="9" width="2" height="3" />
          </g>
          <g className="bot-antenna">
            <rect x="6" y="0" width="1" height="2" />
          </g>
          <rect className="bot-body" x="2" y="2" width="8" height="7" />
          <g className="bot-armL">
            <rect x="1" y="5" width="1" height="3" />
          </g>
          <g className="bot-armR">
            <rect x="10" y="5" width="1" height="3" />
          </g>
          <g className="bot-pupils">
            <rect x="4" y="5" width="1" height="1" />
            <rect x="8" y="5" width="1" height="1" />
          </g>

          <g className="prop prop-held">
            <rect className="p-dark" x="4.5" y="5.2" width="3" height="2.4" />
            <rect className="p-light" x="4.5" y="5.2" width="3" height="0.7" />
          </g>
          <g className="prop prop-pencil">
            <rect className="p-dark" x="10.9" y="3.2" width="0.8" height="3" />
            <rect className="p-ink" x="10.9" y="6.2" width="0.8" height="0.7" />
          </g>
          <g className="prop prop-lens">
            <circle className="p-ring" cx="12" cy="3.2" r="1.7" />
            <path className="p-handle" d="M13.2 4.4 L14.7 5.9" />
          </g>
        </g>
      </g>

      <g className="prop prop-kbd">
        <rect className="p-light" x="2" y="9.8" width="8" height="1.5" />
        {[2.6, 3.9, 5.2, 6.5, 7.8].map((x, i) => (
          <rect key={x} className="key" x={x} y="10.15" width="0.9" height="0.7" style={{ animationDelay: `${i * 90}ms` }} />
        ))}
      </g>

      <g className="prop prop-sheet">
        <rect className="p-paper" x="12.6" y="2.4" width="5.2" height="6.6" />
        <g className="sheet-lines">
          <rect x="13.3" y="3.6" width="3.8" height="0.45" style={{ animationDelay: '0ms' }} />
          <rect x="13.3" y="4.9" width="3" height="0.45" style={{ animationDelay: '700ms' }} />
          <rect x="13.3" y="6.2" width="3.5" height="0.45" style={{ animationDelay: '1400ms' }} />
        </g>
        <path className="sheet-ink" d="M13.4 8 L14.3 4.3 L15.3 7 L16.2 3.8 L17.1 6.4" pathLength={1} />
      </g>

      <g className="prop prop-stack">
        {[0, 1, 2].map((i) => (
          <rect key={i} className="page" x={-5.8 + i * 0.35} y={3.2 + i * 0.35} width="4.4" height="5.8" style={{ animationDelay: `${i * 450}ms` }} />
        ))}
      </g>

      <g className="prop prop-bang">
        <rect x="5.55" y="-3.6" width="0.9" height="1.9" />
        <rect x="5.55" y="-1.3" width="0.9" height="0.9" />
      </g>
    </svg>
  )
}

const BOSS: [string, number, number, number, number][] = [
  ['#8d96ec', 4, 0, 2, 1], ['#4f5bd5', 4, 1, 2, 1], ['#4f5bd5', 2, 2, 6, 1], ['#4f5bd5', 1, 3, 8, 1], ['#4f5bd5', 0, 4, 10, 4],
  ['#3a43ad', 0, 8, 10, 1], ['#3a43ad', 1, 9, 8, 1], ['#3a43ad', 2, 10, 2, 1], ['#3a43ad', 6, 10, 2, 1],
  ['#8d96ec', 2, 2, 2, 1], ['#8d96ec', 1, 3, 1, 1],
  ['#ffffff', 3, 4, 4, 1], ['#ffffff', 2, 5, 6, 2], ['#ffffff', 3, 7, 4, 1],
  ['#1f1e1b', 5, 5, 2, 2], ['#ffffff', 5.25, 5.25, 0.5, 0.5],
  ['#f2a7a0', 1, 7, 1, 1], ['#f2a7a0', 8, 7, 1, 1],
]

/** The blue one-eyed boss who hands out the work. */
export function BossBot({ width = 43.18 }: { width?: number }) {
  return (
    <svg width={width} height={(width * 11) / 10} viewBox="0 0 10 11" shapeRendering="crispEdges" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      {BOSS.map(([fill, x, y, w, h], i) => <rect key={i} fill={fill} x={x} y={y} width={w} height={h} />)}
    </svg>
  )
}
