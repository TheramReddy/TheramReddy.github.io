const rules = [
  { rule: 'Start with the work, not the screens.', why: 'I wrote down the jobs a person does in a day. What didn’t serve one went quiet or went away.' },
  { rule: 'Let the screen remember.', why: 'Claims, hearings and payments are one story. I linked them on the page, so staff recognise instead of recall.' },
  { rule: 'Say what’s happening.', why: 'Wherever something is pending, the page says what it waits on and who moves it. The same word means the same thing everywhere.' },
  { rule: 'Make risky things hard and common things easy.', why: 'Everyday paths are short. Actions that can’t be undone get a pause, a plain warning or a second pair of eyes.' },
  { rule: 'One system, different people.', why: 'The public, staff and vendors each see only what’s theirs. Built to WCAG 2.1 AA, with keyboard and screen-reader support from the start.' },
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
              </div>
            </li>
          ))}
        </ol>
        <p className="rb-take"><b>Rethink the work, not just the look.</b> A process now takes 40% fewer steps. The screens here are recreated; the problems and the thinking are real.</p>
      </div>
    </section>
  )
}
