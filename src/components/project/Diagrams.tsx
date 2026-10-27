import type { ReactNode } from 'react'
import type { Feature } from '@/data/projects'

/** Hand-drawn style explainers shown above the GIF walkthrough. */
const Defs = ({ id }: { id: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M1 1.5 9 5 1 8.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  </defs>
)

const Box = ({ x, y, w, children }: { x: number; y: number; w: number; children: ReactNode }) => (
  <g>
    <rect x={x} y={y} width={w} height="38" rx="11" className="d-box" />
    <text x={x + w / 2} y={y + 25} textAnchor="middle" className="d-label">{children}</text>
  </g>
)

function Barrier() {
  const m = 'url(#arr8)'
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="A person blocked by menus from the taxpayer they need; one search box goes around the wall">
      <Defs id="arr8" />
      <text x="96" y="58" className="d-label">Menus</text>
      <path d="M172 52 Q206 58 240 50" className="d-line" markerEnd={m} />
      <path d="M300 30 L300 250" className="d-line" strokeWidth="2" />
      <path d="M100 250 L540 250" className="d-line" strokeWidth="2" />
      <g fill="currentColor">
        <circle cx="190" cy="190" r="9" />
        <path d="M185 202 L195 202 L204 218 L200 221 L195 213 L195 232 L199 250 L194 250 L190 236 L186 250 L181 250 L185 232 L185 213 L180 221 L176 218 Z" />
      </g>
      <ellipse cx="420" cy="120" rx="80" ry="44" transform="rotate(-8 420 120)" className="d-box" />
      <text x="420" y="127" textAnchor="middle" className="d-label">Taxpayer</text>
      <path d="M420 206 L407 242 L433 242 Z" fill="currentColor" />
      <path d="M196 270 Q300 320 414 270" className="d-line d-dash" markerEnd={m} />
      <Box x={185} y={322} w={270}>One search box, Ctrl K</Box>
    </svg>
  )
}

function Layers() {
  const m = 'url(#arr9)'
  return (
    <svg viewBox="0 0 700 590" role="img" aria-label="Staff move through layers of records, claims, cases and decisions, driven by context and understanding">
      <Defs id="arr9" />
      <g className="d-line" strokeWidth="1.2">
        <path d="M90 450 L90 70" markerEnd={m} />
        <path d="M90 450 L480 450" markerEnd={m} />
        <path d="M90 360 A90 90 0 0 1 180 450" />
        <path d="M90 270 A180 180 0 0 1 270 450" />
        <path d="M90 180 A270 270 0 0 1 360 450" />
        <path d="M90 90 A360 360 0 0 1 450 450" />
        <path d="M376 232 L486 232" markerEnd={m} />
      </g>
      <ellipse cx="185" cy="355" rx="135" ry="52" transform="rotate(-45 185 355)" className="d-line" strokeWidth="2.4" fill="none" />
      <g className="d-label d-em d-halo" textAnchor="middle">
        <text x="140" y="424">Records</text>
        <text x="190" y="360">Claims</text>
        <text x="252" y="296">Cases</text>
        <text x="316" y="230">Decisions</text>
      </g>
      <text x="500" y="238" className="d-label">Surface the <tspan className="d-em">next step</tspan></text>
      <g transform="translate(40 290) rotate(-90)">
        <rect x="-46" y="-17" width="92" height="34" rx="10" className="d-box" />
        <text x="0" y="7" textAnchor="middle" className="d-label">Context</text>
      </g>
      <Box x={205} y={470} w={170}>Understanding</Box>
      <path d="M96 458 Q92 520 128 540" className="d-line" markerEnd={m} />
      <text x="142" y="546" className="d-label">Drill through</text>
      <text x="142" y="570" className="d-label">the layers</text>
    </svg>
  )
}

function Pending() {
  const m = 'url(#arr10)'
  return (
    <svg viewBox="0 0 640 340" role="img" aria-label="A person on the submitted step asks if it is done; the approval and bank steps are dashed because they have not happened yet">
      <Defs id="arr10" />
      <ellipse cx="205" cy="74" rx="66" ry="30" className="d-box" />
      <text x="205" y="81" textAnchor="middle" className="d-label">Is it done?</text>
      <g fill="currentColor">
        <circle cx="90" cy="130" r="9" />
        <path d="M85 142 L95 142 L104 158 L100 161 L95 153 L95 172 L99 190 L94 190 L90 176 L86 190 L81 190 L85 172 L85 153 L80 161 L76 158 Z" />
      </g>
      <rect x="30" y="190" width="140" height="46" rx="12" className="d-box d-big" />
      <text x="100" y="219" textAnchor="middle" className="d-label">Submitted</text>
      <rect x="250" y="150" width="140" height="46" rx="12" className="d-box" strokeDasharray="6 6" />
      <text x="320" y="179" textAnchor="middle" className="d-label">Approval</text>
      <rect x="480" y="110" width="130" height="46" rx="12" className="d-box" strokeDasharray="6 6" />
      <text x="545" y="139" textAnchor="middle" className="d-label">Bank</text>
      <g className="d-line d-dash">
        <path d="M174 206 Q212 206 246 184" markerEnd={m} />
        <path d="M394 166 Q436 166 476 142" markerEnd={m} />
      </g>
      <text x="320" y="224" textAnchor="middle" className="d-small d-em">waiting on a supervisor</text>
      <text x="545" y="184" textAnchor="middle" className="d-small d-em">nothing sent yet</text>
      <Box x={150} y={282} w={340}>Say what has not happened</Box>
    </svg>
  )
}

function Reveal() {
  const m = 'url(#arr3)'
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label="A masked number is revealed by a deliberate click and the reveal is logged">
      <Defs id="arr3" />
      <Box x={30} y={50} w={150}>•••-••-1234</Box>
      <Box x={410} y={50} w={150}>123-45-1234</Box>
      <g className="d-line">
        <path d="M184 66 Q300 28 406 66" markerEnd={m} />
        <path d="M485 92 Q470 150 500 190 Q520 214 480 226" className="d-dash" markerEnd={m} />
      </g>
      <text x="295" y="40" textAnchor="middle" className="d-label d-em">deliberate click</text>
      <text x="295" y="108" textAnchor="middle" className="d-small">one row, by role</text>
      <Box x={330} y={208} w={150}>Logged</Box>
      <text x="105" y="130" textAnchor="middle" className="d-small">masked by default</text>
    </svg>
  )
}

/** `gif` is the path of the feature GIF shown under the diagram as the result. */
export const diagramGifs = [
  '/projects/liheap-eap/command_palette_search.gif',
  '/projects/liheap-eap/dashboard_filter_collapse.gif',
  '/projects/liheap-eap/ssn_reveal.gif',
  '/projects/liheap-eap/check_void_approval.gif',
]

const items = [
  { title: 'Finding a taxpayer should take one search.', body: 'Staff look people up many times a day, and menus put a wall between them and the taxpayer they need. A single search box goes around it: results as you type, from any screen.', art: <Barrier /> },
  { title: 'Most work is finding the next step.', body: 'A record leads to a claim, a claim to a case, a case to a decision. The interface should move people through those layers with the right context, and surface what to do next instead of making them dig.', art: <Layers /> },
  { title: 'Sensitive data stays masked until someone asks.', body: 'Social Security numbers show as dots until someone clicks to reveal one. The click works on a single row, depends on the person\'s role, and is logged.', art: <Reveal /> },
  { title: 'Say what has not happened yet.', body: 'A void does not take effect straight away. The page says the check is waiting for a supervisor and that nothing has gone to the bank, so nobody has to guess whether it is done.', art: <Pending /> },
]

export function Diagrams({ features }: { features: Feature[] }) {
  return (
    <>
      {items.map((d, i) => {
        const result = features.find((f) => f.gif === diagramGifs[i])
        return (
          <section className="diagram" key={d.title}>
            <div className="d-copy">
              <h3>{d.title}</h3>
              <p>{d.body}</p>
              {result && (
                <figure className="d-result">
                  <img src={result.gif} alt={result.alt} loading="lazy" />
                </figure>
              )}
            </div>
            <div className="d-art">{d.art}</div>
          </section>
        )
      })}
    </>
  )
}
