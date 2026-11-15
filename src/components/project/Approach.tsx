import { Law } from '@/components/Law'
import type { LawId } from '@/data/laws'

/** five rules, each with a line of what I did, the principle it leans on, and how the principle shows up here */
const rules: { rule: string; why: string; law: LawId; here: string }[] = [
  { rule: 'Start with the work, not the screens.', law: 'mental', why: 'I wrote down the jobs a person does in a day. What didn’t serve one went quiet or went away.', here: 'Staff think in tasks, not in tables of data. The screens are organized the way they think.' },
  { rule: 'Let the screen remember.', law: 'recognition', why: 'Claims, hearings and payments are one story. I linked them on the page, so staff don’t carry the connection in their heads.', here: 'The way to the next step is on the page, so nobody has to recall where to go.' },
  { rule: 'Say what’s happening.', law: 'feedback', why: 'Wherever something is pending, the page says what it waits on and who moves it. The same word means the same thing everywhere.', here: 'A pending item says what it waits on, so nobody acts twice or waits without knowing why.' },
  { rule: 'Make risky things hard and common things easy.', law: 'feedforward', why: 'Everyday paths are short. Actions that can’t be undone get a pause, a plain warning or a second pair of eyes.', here: 'The warning comes before the click, when it can still change the decision.' },
  { rule: 'One system, different people.', law: 'hicks', why: 'The public, staff and vendors each see only what’s theirs. Built to WCAG 2.1 AA, with keyboard and screen-reader support from the start.', here: 'Each role sees only its own choices, so there is less to rule out before starting.' },
]

/** The design approach as a short rulebook: five rules, each with one line of why, and the takeaway at the foot. */
export function Approach() {
  return (
    <section className="approach" id="cs-action" aria-label="How I worked">
      <h3 className="in-action-title">How I worked</h3>
      <div className="rulebook px-plate">
        <span className="id-slot" aria-hidden="true" />
        <p className="rb-head">rulebook · 5 rules</p>
        <ol>
          {rules.map((r, i) => (
            <li key={r.rule}>
              <span className="rb-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h4>{r.rule}</h4>
                <p>{r.why}</p>
                <Law id={r.law} here={r.here} />
              </div>
            </li>
          ))}
        </ol>
        <p className="rb-take"><b>Rethink the work, not just the look.</b> A process now takes 40% fewer steps. The screens here are recreated; the problems and the thinking are real.</p>
      </div>
    </section>
  )
}
