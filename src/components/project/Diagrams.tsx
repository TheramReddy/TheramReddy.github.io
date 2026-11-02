import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { Carousel } from './Carousel'
import { HiddenArt, HoldArt, InkDefs, MazeArt, PictureArt, QueueArt, SignalArt, StoryArt, TrailArt, WallArt } from './InkArt'

/** Arrowhead marker shared by the Scobin and Telemetric chapter drawings. */
export const Defs = ({ id }: { id: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M1 1.5 9 5 1 8.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  </defs>
)

const items = [
  { tag: 'Wall', title: 'Finding a profile should take one search.', body: 'Menus put a wall between staff and the profile they need. I replaced the walk through menus with one search box: results as you type, from any screen.', more: 'Staff look people up all day, often with someone waiting on the phone. Every extra click costs time they do not have, so the fastest route had to be the obvious one.', art: <WallArt /> },
  { tag: 'Hold', title: 'A hold should explain itself.', body: 'When funds are held, the page says why, which step it is waiting on, and who acts next. I wrote it in the words staff already use, not system codes.', more: 'A hold affects real money for a real person, and staff get asked about it constantly. If the page cannot answer the question, staff have to dig or escalate, and the person waits longer.', art: <HoldArt /> },
  { tag: 'Maze', title: 'A claim shouldn’t be a maze.', body: 'Claims, hearings and decisions are linked. I gave staff one clear path through them, so nobody has to stop and work out where to go next.', more: 'One claim can pass through several teams over weeks. People return to it cold, so each step had to make sense without remembering what came before.', art: <MazeArt /> },
  { tag: 'Trail', title: 'Every dollar needs a trail.', body: 'Money moves through steps such as intercepted, on hold and distributed. I show each one, so staff can picture the whole flow and nobody has to ask where it went.', more: 'Public money has to be accounted for to the cent, and audits ask where it went. Showing every stage keeps answers on the page, not in someone’s memory.', art: <TrailArt /> },
  { tag: 'Story', title: 'A status should tell a story.', body: 'A status shows what is done, what is happening now and what comes next, so the state of a case is clear at a glance.', more: 'Many people touch the same case and hand it on. A status that only names a state forces them to guess the rest. One that shows past, present and next lets anyone pick it up.', art: <StoryArt /> },
  { tag: 'Picture', title: 'A profile should show the whole person.', body: 'Claims, hearings and payments for one person sit together in a single view, so related records read as related.', more: 'Needing three screens to understand one person invites mistakes, like acting on a claim without seeing the hearing that changes it. Putting them together protects against that.', art: <PictureArt /> },
  { tag: 'Queue', title: 'Approvals shouldn’t disappear into a queue.', body: 'An approval shows who has it and where it stands: assigned, pending or decided, so nobody has to chase it.', more: 'Work stalls when nobody knows whose turn it is. Making ownership visible turns a vague wait into a clear next action for a named person.', art: <QueueArt /> },
  { tag: 'Signal', title: 'Exceptions should stand out.', body: 'In long lists, I highlighted the few rows that need a person, so they are the first thing staff see.', more: 'When every row looks the same, the one that matters gets missed. Quiet by default and loud only for exceptions means attention goes where it is needed, even on a busy day.', art: <SignalArt /> },
  { tag: 'Hidden', title: 'Unmatched doesn’t mean invisible.', body: 'Records that did not match are surfaced and easy to find, so staff never have to remember to go looking for them.', more: 'What falls through the cracks is the costliest part of any process. Putting the leftovers in plain sight means nothing depends on someone remembering to check.', art: <HiddenArt /> },
]

export function Diagrams() {
  return (
    <>
      <InkDefs />
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
    </>
  )
}
