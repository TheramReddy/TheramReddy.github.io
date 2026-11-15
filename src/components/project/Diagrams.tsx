import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { Carousel } from './Carousel'
import { PlayScene } from './PlayScene'
import { Law } from '@/components/Law'
import type { LawId } from '@/data/laws'

/** Arrowhead marker shared by the Scobin and Telemetric chapter drawings. */
export const Defs = ({ id }: { id: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M1 1.5 9 5 1 8.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  </defs>
)

/**
 * Nine problems, each told the same way: the title is what was wrong, `before` is the moment staff met it, `fix` is
 * the one change I made and what it does, and `here` ties the piece of psychology to this screen.
 */
const items: { tag: string; title: string; before: string; fix: string; law: LawId; here: string }[] = [
  { tag: 'Wall', law: 'discover', title: 'Finding a profile took too many clicks.', before: 'Staff look people up all day, often with someone waiting on the phone. Every lookup meant digging through menus.', fix: 'I put one search box on every screen. It finds a profile as you type.', here: 'The search sits on every screen, where staff already look. The fastest route is now the obvious one.' },
  { tag: 'Hold', law: 'curse', title: 'Nobody could say why the money was on hold.', before: 'Staff got asked about holds all the time. When the page couldn’t answer, they had to dig or escalate, and the person kept waiting.', fix: 'The page now says why the money is held, what it’s waiting on and who acts next, in the words staff already use.', here: 'The old status made sense to whoever set it. The new one is written for the person who has to explain it on the phone.' },
  { tag: 'Maze', law: 'zeigarnik', title: 'Claims felt like a maze.', before: 'A claim can sit with several teams for weeks. People came back to it cold, with nothing to say what came next.', fix: 'I linked claims, hearings and decisions into one clear path, so every step makes sense on its own.', here: 'An open claim nags at whoever touched it last. The page now holds where it stopped, so they don’t have to.' },
  { tag: 'Trail', law: 'feedback', title: 'Money had no trail.', before: 'Public money has to be accounted for to the cent. Where a payment had got to was stuck in someone’s memory.', fix: 'Every stage a payment passes through is now on the page: intercepted, on hold, distributed.', here: 'Each stage a payment reaches shows on the page, so no step happens silently.' },
  { tag: 'Story', law: 'goal', title: 'A status said what. It never said what next.', before: 'Many people hand a case on. A bare status left the next person guessing.', fix: 'Each status now shows what’s done, what’s happening and what’s next, so anyone can pick the case up.', here: 'Seeing what’s done and what’s left shows how close a case is to closing.' },
  { tag: 'Picture', law: 'load', title: 'One person, three screens.', before: 'Claims, hearings and payments each had their own screen. That invited mistakes, like acting on a claim without seeing the hearing that changes it.', fix: 'I put all three on one page.', here: 'Staff used to carry facts from one screen to the next in their heads. One page carries them instead.' },
  { tag: 'Queue', law: 'hawthorne', title: 'Approvals vanished into a queue.', before: 'Work stalled because no one knew whose turn it was.', fix: 'Each approval now shows who has it and where it stands: assigned, pending or decided. A vague wait became a next step.', here: 'A name on an approval is visible to everyone, and people move sooner on work that is visibly theirs.' },
  { tag: 'Signal', law: 'vonrestorff', title: 'Every row looked the same.', before: 'In a long list, the one row that mattered looked like all the others. So it got missed.', fix: 'The lists are quiet by default. Only the few rows that need a person stand out.', here: 'If every row is highlighted, none is. Only the rows that need a person look different.' },
  { tag: 'Hidden', law: 'recognition', title: 'Unmatched records were easy to forget.', before: 'Records that didn’t match sat out of sight. What falls through the cracks costs the most.', fix: 'Unmatched records are now surfaced and easy to find. Nothing depends on someone remembering to check.', here: 'Staff see the unmatched records listed, instead of recalling that they should go and look.' },
]

export function Diagrams() {
  return (
    <>
      <Carousel id="cs-problems" title="Nine problems, nine fixes" noun="problem" labels={items.map((d) => d.tag)}>
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
                <span className="d-label-tag">before</span>
                <p>{d.before}</p>
                <span className="d-label-tag">what I did</span>
                <p>{d.fix}</p>
                <span className="d-label-tag">why it works</span>
                <Law id={d.law} here={d.here} />
              </div>
            </article>
          )
        })}
      </Carousel>
    </>
  )
}
