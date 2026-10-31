import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Carousel } from './Carousel'

/** Hand-drawn style explainers of each problem, shown before the GIF walkthrough. */
export const Defs = ({ id }: { id: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M1 1.5 9 5 1 8.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  </defs>
)

const Box = ({ x, y, w, children }: { x: number; y: number; w: number; children: ReactNode }) => (
  <text x={x + w / 2} y={y + 25} textAnchor="middle" className="d-label d-em">{children}</text>
)

/** Stick figure standing with its feet at (x, y). */
const Person = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g fill="currentColor" transform={`translate(${x} ${y}) scale(${s}) translate(-190 -250)`}>
    <circle cx="190" cy="190" r="9" />
    <path d="M185 202 L195 202 L204 218 L200 221 L195 213 L195 232 L199 250 L194 250 L190 236 L186 250 L181 250 L185 232 L185 213 L180 221 L176 218 Z" />
  </g>
)

const Doc = ({ x, y, w = 110, rot = 0, children }: { x: number; y: number; w?: number; rot?: number; children: ReactNode }) => (
  <g transform={`rotate(${rot} ${x + w / 2} ${y + 43})`}>
    <rect x={x} y={y} width={w} height="86" rx="3" className="d-box" />
    <text x={x + w / 2} y={y + 32} textAnchor="middle" className="d-label">{children}</text>
    <path d={`M${x + 16} ${y + 50} H${x + w - 16} M${x + 16} ${y + 66} H${x + w - 40}`} className="d-line" />
  </g>
)

function Wall() {
  const m = 'url(#arr-wall)'
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="A person blocked by menus from the profile they need; one search box goes around the wall">
      <Defs id="arr-wall" />
      <text x="96" y="58" className="d-label">Menus</text>
      <path d="M172 52 Q206 58 240 50" className="d-line" markerEnd={m} />
      <path d="M300 30 L300 250" className="d-line" strokeWidth="2" />
      <path d="M100 250 L540 250" className="d-line" strokeWidth="2" />
      <Person x={190} y={250} />
      <ellipse cx="420" cy="120" rx="80" ry="44" transform="rotate(-8 420 120)" className="d-box" />
      <text x="420" y="127" textAnchor="middle" className="d-label">Profile</text>
      <path d="M420 206 L407 242 L433 242 Z" fill="currentColor" />
      <path d="M196 270 Q300 320 414 270" className="d-line d-dash" markerEnd={m} />
      <Box x={185} y={322} w={270}>One search, Ctrl K</Box>
    </svg>
  )
}

function Hold() {
  const m = 'url(#arr-hold)'
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="A person waits at a locked gate labelled hearing review, between them and their funds; the page should show who acts next">
      <Defs id="arr-hold" />
      <path d="M20 290 H620" className="d-line" strokeWidth="2" />
      <Person x={70} y={290} />
      <path d="M100 262 Q160 215 262 232" className="d-line d-dash" markerEnd={m} />
      <text x="330" y="150" textAnchor="middle" className="d-label">Hearing review</text>
      <g className="d-line" strokeWidth="2">
        <path d="M285 290 V175 M375 290 V175 M285 175 Q330 150 375 175" />
        <path d="M305 290 V168 M325 290 V160 M345 290 V160 M365 290 V168" strokeWidth="1.2" />
      </g>
      <rect x="312" y="215" width="36" height="30" rx="4" fill="currentColor" />
      <path d="M319 215 V205 A11 11 0 0 1 341 205 V215" className="d-line" strokeWidth="3" />
      <path d="M390 232 Q450 225 500 245" className="d-line d-dash" markerEnd={m} />
      <ellipse cx="548" cy="255" rx="62" ry="34" className="d-box" />
      <text x="548" y="264" textAnchor="middle" className="d-label">Funds</text>
      <path d="M200 340 Q260 340 322 300" className="d-line" markerEnd={m} />
      <text x="190" y="352" textAnchor="end" className="d-small d-em">Who acts next?</text>
      <Box x={390} y={326} w={235}>Show the next action</Box>
    </svg>
  )
}

function Maze() {
  const m = 'url(#arr-maze)'
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="A person faces a tangled maze of claims, cases, hearings and decisions; one clear dashed path leads straight to the claim">
      <Defs id="arr-maze" />
      <path d="M20 300 H90" className="d-line" strokeWidth="2" />
      <Person x={55} y={300} />
      <path d="M90 300 C130 300 130 235 175 235 S215 340 255 300 S290 205 335 228 S375 335 415 295 S455 215 495 275 H520" className="d-line" strokeWidth="2.2" />
      <path d="M100 262 Q320 40 535 262" className="d-line d-dash" markerEnd={m} />
      <text x="190" y="118" className="d-small d-em">One clear path.</text>
      <text x="152" y="208" className="d-small">Claims</text>
      <text x="250" y="348" className="d-small">Cases</text>
      <text x="325" y="204" className="d-small">Hearings</text>
      <text x="410" y="342" className="d-small">Decisions</text>
      <ellipse cx="572" cy="288" rx="52" ry="30" className="d-box" />
      <text x="572" y="297" textAnchor="middle" className="d-label">Claim</text>
    </svg>
  )
}

const Gate = ({ x, y, label }: { x: number; y: number; label: string }) => (
  <g>
    <path d={`M${x - 24} ${y} V${y - 36} A24 24 0 0 1 ${x + 24} ${y - 36} V${y}`} className="d-line" strokeWidth="2" />
    <path d={`M${x} ${y - 84} V${y - 58}`} className="d-line" strokeWidth="2" />
    <path d={`M${x} ${y - 84} l20 8 l-20 8 Z`} fill="currentColor" />
    <text x={x} y={y - 96} textAnchor="middle" className="d-small" style={{ fontSize: 21 }}>{label}</text>
  </g>
)

function Trail() {
  const m = 'url(#arr-trail)'
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="A person asks where the money went; a coin rolls past three gates, intercepted, on hold and distributed, so the trail is visible">
      <Defs id="arr-trail" />
      <path d="M20 300 C100 285 170 295 250 292 S400 320 500 306 S590 300 620 296" className="d-line" strokeWidth="2" markerEnd={m} />
      <Person x={60} y={298} />
      <text x="30" y="190" className="d-small d-em">Where did it go?</text>
      <circle cx="170" cy="262" r="30" className="d-box" strokeWidth="2" />
      <text x="170" y="274" textAnchor="middle" className="d-label">$</text>
      <Gate x={265} y={296} label="Intercepted" />
      <Gate x={400} y={310} label="On hold" />
      <Gate x={535} y={304} label="Distributed" />
    </svg>
  )
}

const Sign = ({ x, label, children }: { x: number; label: string; children: ReactNode }) => (
  <g>
    <path d={`M${x + 50} 270 V300`} className="d-line" strokeWidth="2" />
    <rect x={x} y="160" width="100" height="110" rx="6" className="d-box" strokeWidth="1.6" />
    <text x={x + 50} y="196" textAnchor="middle" className="d-label">{label}</text>
    {children}
  </g>
)

function Story() {
  const m = 'url(#arr-story)'
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="Three signs, past, now and next; a person standing at now asks what happens next">
      <Defs id="arr-story" />
      <path d="M20 300 H610" className="d-line" strokeWidth="2" />
      <Sign x={40} label="Past">
        <circle cx="90" cy="235" r="20" className="d-line" />
        <path d="M80 235 L88 243 L102 227" className="d-line" strokeWidth="2" />
      </Sign>
      <Sign x={240} label="Now">
        <path d="M274 218 H306 M274 254 H306 M276 218 Q290 236 276 254 M304 218 Q290 236 304 254" className="d-line" strokeWidth="2" />
        <path d="M280 250 H300 L290 240 Z" fill="currentColor" />
      </Sign>
      <Sign x={450} label="Next">
        <path d="M478 235 H512 V224 L534 240 L512 256 V245 H478 Z" className="d-line" strokeWidth="1.8" />
      </Sign>
      <Person x={185} y={300} />
      <path d="M270 150 Q370 80 490 150" className="d-line d-dash" markerEnd={m} />
      <text x="380" y="92" textAnchor="middle" className="d-small d-em">What happens next?</text>
    </svg>
  )
}

function Picture() {
  const m = 'url(#arr-picture)'
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="Claim, hearing, refund and payment records all connect to one profile">
      <Defs id="arr-picture" />
      <Doc x={60} y={20} rot={-6}>Claim</Doc>
      <Doc x={440} y={20} rot={5}>Hearing</Doc>
      <Doc x={30} y={170} rot={-6}>Refund</Doc>
      <Doc x={470} y={170} rot={6}>Payment</Doc>
      <ellipse cx="320" cy="205" rx="90" ry="42" className="d-box" strokeWidth="1.6" />
      <text x="320" y="214" textAnchor="middle" className="d-label">Profile</text>
      <g className="d-line d-dash">
        <path d="M175 85 Q250 100 280 165" markerEnd={m} />
        <path d="M455 80 Q380 100 360 163" markerEnd={m} />
        <path d="M150 230 Q200 240 225 215" markerEnd={m} />
        <path d="M465 235 Q420 245 410 222" markerEnd={m} />
      </g>
      <path d="M20 360 H620" className="d-line" strokeWidth="2" />
      <Person x={320} y={360} s={0.85} />
      <text x="360" y="345" className="d-small d-em">Connect the records.</text>
    </svg>
  )
}

const Cell = ({ x, label }: { x: number; label: string }) => (
  <g>
    <rect x={x} y="190" width="106" height="110" rx="4" className="d-box" />
    <text x={x + 53} y="220" textAnchor="middle" className="d-small" style={{ fontSize: 21 }}>{label}</text>
    <Person x={x + 53} y={290} s={0.6} />
  </g>
)

function Queue() {
  const m = 'url(#arr-queue)'
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="A person posts an approval into a dark queue and wonders where it went; showing the owner at assigned, pending and decision steps answers that">
      <Defs id="arr-queue" />
      <path d="M10 300 H625" className="d-line" strokeWidth="2" />
      <Person x={40} y={300} />
      <text x="50" y="150" className="d-label d-em">?</text>
      <rect x="85" y="170" width="120" height="130" rx="4" fill="currentColor" />
      <rect x="100" y="245" width="90" height="34" rx="3" fill="#fff" />
      <text x="145" y="269" textAnchor="middle" className="d-small" style={{ fill: '#111', fontSize: 21 }}>Queue</text>
      <path d="M210 275 Q235 285 255 275" className="d-line d-dash" />
      <Cell x={260} label="Assigned" />
      <Cell x={385} label="Pending" />
      <Cell x={510} label="Decision" />
      <path d="M368 245 H385 M493 245 H510" className="d-line d-dash" />
      <path d="M390 352 Q300 350 300 312" className="d-line" markerEnd={m} />
      <text x="400" y="358" className="d-small d-em">Show the owner.</text>
    </svg>
  )
}

const gridRows = [0, 1, 2, 3, 4]
const gridCols = Array.from({ length: 12 }, (_, i) => i)
const hot = new Set(['3-1', '8-3', '10-1'])

function Exceptions() {
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="A grid of ordinary rows with a few highlighted exceptions and a magnifier on one of them">
      <path d="M10 330 H70" className="d-line" strokeWidth="2" />
      <Person x={40} y={330} />
      <text x="20" y="62" className="d-small d-em">Review what matters.</text>
      {gridRows.map((r) => gridCols.map((c) => {
        const x = 110 + c * 42
        const y = 120 + r * 48
        return hot.has(`${c}-${r}`)
          ? <g key={`${c}-${r}`}><circle cx={x + 8} cy={y + 8} r="20" className="d-box" /><rect x={x} y={y} width="16" height="16" fill="currentColor" /></g>
          : <rect key={`${c}-${r}`} x={x} y={y} width="16" height="16" className="d-line" strokeWidth="1.1" />
      }))}
      <circle cx="486" cy="188" r="44" className="d-line" strokeWidth="2.4" fill="none" />
      <path d="M518 220 L560 262" className="d-line" strokeWidth="6" />
    </svg>
  )
}

const dotRows = [0, 1, 2, 3, 4, 5]
const dotCols = Array.from({ length: 11 }, (_, i) => i)

function Unmatched() {
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="A person with a flashlight finds the one unmatched dot among a field of matched ones">
      <Defs id="arr-unmatched" />
      {dotRows.map((r) => dotCols.map((c) => (
        <circle key={`${c}-${r}`} cx={20 + c * 32 + r * 9} cy={120 + r * 40} r="3.4" fill="currentColor" />
      )))}
      <Person x={430} y={290} />
      <path d="M446 262 L520 322 M446 262 L618 308" className="d-line" strokeWidth="1.2" />
      <ellipse cx="570" cy="322" rx="48" ry="12" className="d-line" strokeWidth="1.4" />
      <circle cx="570" cy="320" r="5" fill="currentColor" />
      <text x="440" y="150" className="d-small d-em">Find the exceptions.</text>
      <path d="M560 168 Q590 220 580 300" className="d-line" markerEnd="url(#arr-unmatched)" />
    </svg>
  )
}

const items = [
  { tag: 'Wall', title: 'Finding a profile should take one search.', body: 'Menus put a wall between staff and the profile they need. I replaced the walk through menus with one search box: results as you type, from any screen.', more: 'Staff look people up all day, often with someone waiting on the phone. Every extra click costs time they do not have, so the fastest route had to be the obvious one.', art: <Wall /> },
  { tag: 'Hold', title: 'A hold should explain itself.', body: 'When funds are held, the page says why, which step it is waiting on, and who acts next. I wrote it in the words staff already use, not system codes.', more: 'A hold affects real money for a real person, and staff get asked about it constantly. If the page cannot answer the question, staff have to dig or escalate, and the person waits longer.', art: <Hold /> },
  { tag: 'Maze', title: 'A claim shouldn’t be a maze.', body: 'Claims, cases, hearings and decisions are linked. I gave staff one clear path through them, so nobody has to stop and work out where to go next.', more: 'One claim can pass through several teams over weeks. People return to it cold, so each step had to make sense without remembering what came before.', art: <Maze /> },
  { tag: 'Trail', title: 'Every dollar needs a trail.', body: 'Money moves through steps such as intercepted, on hold and distributed. I show each one, so staff can picture the whole flow and nobody has to ask where it went.', more: 'Public money has to be accounted for to the cent, and audits ask where it went. Showing every stage keeps answers on the page, not in someone’s memory.', art: <Trail /> },
  { tag: 'Story', title: 'A status should tell a story.', body: 'A status shows what is done, what is happening now and what comes next, so the state of a case is clear at a glance.', more: 'Many people touch the same case and hand it on. A status that only names a state forces them to guess the rest. One that shows past, present and next lets anyone pick it up.', art: <Story /> },
  { tag: 'Picture', title: 'One profile. One complete picture.', body: 'Claims, hearings, refunds and payments for one person sit together in a single view, so related records read as related.', more: 'Needing three screens to understand one person invites mistakes, like acting on a claim without seeing the hearing that changes it. Putting them together protects against that.', art: <Picture /> },
  { tag: 'Queue', title: 'Approvals shouldn’t disappear into a queue.', body: 'An approval shows who has it and where it stands: assigned, pending or decided, so nobody has to chase it.', more: 'Work stalls when nobody knows whose turn it is. Making ownership visible turns a vague wait into a clear next action for a named person.', art: <Queue /> },
  { tag: 'Signal', title: 'Make exceptions stand out.', body: 'In long lists, I highlighted the few rows that need a person, so they are the first thing staff see.', more: 'When every row looks the same, the one that matters gets missed. Quiet by default and loud only for exceptions means attention goes where it is needed, even on a busy day.', art: <Exceptions /> },
  { tag: 'Hidden', title: 'Unmatched doesn’t mean invisible.', body: 'Records that did not match are surfaced and easy to find, so staff never have to remember to go looking for them.', more: 'What falls through the cracks is the costliest part of any process. Putting the leftovers in plain sight means nothing depends on someone remembering to check.', art: <Unmatched /> },
]

export function Diagrams() {
  return (
    <Carousel id="cs-problems" title="Problems and decisions" noun="problem" labels={items.map((d) => d.tag)}>
      {(active, go) => items.map((d, i) => {
        const o = Math.max(-2, Math.min(2, i - active))
        return (
          <article
            className={cn('diagram', o === 0 && 'is-active')}
            key={d.title}
            style={{ '--o': o } as CSSProperties}
            aria-hidden={o !== 0}
            onClick={() => o !== 0 && go(i)}
          >
            <div className="d-art">{d.art}</div>
            <div className="d-copy">
              <h4>{d.title}</h4>
              <p>{d.body}</p>
              <p className="d-more">{d.more}</p>
            </div>
          </article>
        )
      })}
    </Carousel>
  )
}
