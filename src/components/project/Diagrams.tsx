import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { Carousel } from './Carousel'
import { PlayScene } from './PlayScene'

/** Arrowhead marker shared by the Scobin and Telemetric chapter drawings. */
export const Defs = ({ id }: { id: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M1 1.5 9 5 1 8.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  </defs>
)

const items = [
  { tag: 'Wall', title: 'Finding a profile took too many clicks.', body: 'Staff dug through menus to reach a profile. I replaced that with one search box on every screen, with results as you type.', more: 'They look people up all day, often with someone on the phone. The fastest route had to be the obvious one.' },
  { tag: 'Hold', title: 'Nobody could tell why money was on hold.', body: 'The page now says why it’s held, what it’s waiting on and who acts next, in the words staff already use.', more: 'Staff got asked about holds all the time. If the page couldn’t answer, they had to dig or escalate, and the person waited longer.' },
  { tag: 'Maze', title: 'Claims felt like a maze.', body: 'Claims, hearings and decisions now link together, so there’s one clear path and no guessing what comes next.', more: 'A claim can sit with several teams for weeks. People come back cold, so every step has to make sense on its own.' },
  { tag: 'Trail', title: 'Money had no trail.', body: 'Every stage a payment passes through (intercepted, on hold, distributed) is shown, so nobody has to ask where it went.', more: 'Public money has to be accounted for to the cent. With every stage on the page, the answer isn’t stuck in someone’s memory.' },
  { tag: 'Story', title: 'A status said what, not the story.', body: 'A status now shows what’s done, what’s happening and what’s next.', more: 'Many people hand a case on. A bare status makes the next person guess; past, present and next lets anyone pick it up.' },
  { tag: 'Picture', title: 'One person, three screens.', body: 'Claims, hearings and payments for a person now sit on one page.', more: 'Splitting them invites mistakes, like acting on a claim without seeing the hearing that changes it.' },
  { tag: 'Queue', title: 'Approvals vanished into a queue.', body: 'Each approval shows who has it and where it stands: assigned, pending or decided.', more: 'Work stalls when no one knows whose turn it is. A named owner turns a vague wait into a next step.' },
  { tag: 'Signal', title: 'Every row looked the same.', body: 'In long lists, only the few rows that need a person stand out.', more: 'When everything looks alike, the one that matters gets missed. Quiet by default, loud for exceptions.' },
  { tag: 'Hidden', title: 'Unmatched records were easy to forget.', body: 'Records that didn’t match are surfaced and easy to find.', more: 'What falls through the cracks costs the most. Now nothing depends on someone remembering to check.' },
]

export function Diagrams() {
  return (
    <>
      <Carousel id="cs-problems" title="Problems and decisions" noun="problem" labels={items.map((d) => d.tag)}>
        {(active) => items.map((d, i) => {
          const o = Math.max(-2, Math.min(2, i - active))
          return (
            <article
              className={cn('diagram px-plate', o === 0 && 'is-active')}
              key={d.title}
              style={{ '--o': o } as CSSProperties}
              aria-hidden={o !== 0}
            >
              <div className="d-art">{o === 0 && <PlayScene scene={d.tag} />}</div>
              <div className="d-copy">
                <h4>{d.title}</h4>
                <span className="d-label-tag">decision</span>
                <p>{d.body}</p>
                <span className="d-label-tag">why</span>
                <p className="d-more">{d.more}</p>
              </div>
            </article>
          )
        })}
      </Carousel>
    </>
  )
}
