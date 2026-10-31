const chapters = [
  {
    id: 'jobs',
    title: 'Starting with the work, not the screens',
    aim: 'Fewer choices, so the right one is obvious.',
    body: [
      'The old system had grown one request at a time for years. Each addition made sense alone, but together they asked staff to learn the system’s way of working instead of the other way round.',
      'Before drawing anything, I wrote down what a person is actually trying to do in a day. Everything that did not serve one of those jobs became quieter or went away, and the rest was ordered by how often it is needed.',
    ],
  },
  {
    id: 'connect',
    title: 'Letting the screen remember, so people don’t have to',
    aim: 'Related things sit together and read as related.',
    body: [
      'Claims, hearings, payments and reconciliation are one story to the person living it, but the old system told it in separate places. Staff carried the connections in their heads, which works until someone is new, tired or interrupted.',
      'I moved the connections onto the page. What belongs together is grouped and linked, so recognizing is enough and nobody has to recall.',
    ],
  },
  {
    id: 'status',
    title: 'Saying what is happening',
    aim: 'Never leave a person guessing.',
    body: [
      'Much of the work is waiting: for an approval, a hearing, a transfer. Waiting is fine when you know what for, and stressful when the page stays silent.',
      'So wherever something is pending, the page says what it is waiting on and who moves it forward, in the words staff already use. The same word means the same thing everywhere, so a phrase learned once keeps its meaning.',
    ],
  },
  {
    id: 'risk',
    title: 'Keeping the risky things hard and the common things easy',
    aim: 'Effort should match the stakes.',
    body: [
      'Most of the day is repetition, so the frequent paths are short and need no thought. A few actions cannot be undone. There I added a pause, a plain warning or a second pair of eyes, so an honest slip does not become a costly one.',
      'Sensitive details stay out of sight until they are needed, which also keeps busy pages calm.',
    ],
  },
  {
    id: 'roles',
    title: 'One system, different people',
    aim: 'Show each person only what is theirs.',
    body: [
      'The public, agency staff and outside vendors all use the platform, and they need very different things from it. Rather than one crowded interface for everyone, each group sees only what applies to them.',
      'The same care went into who can use it at all. It was built to meet WCAG 2.1 AA, with keyboard use and screen-reader support designed in from the start, not added at the end. Experienced staff get fast routes, and newcomers are never forced to learn them.',
    ],
  },
  {
    id: 'takeaway',
    title: 'What I would want you to take from it',
    aim: 'Rethink the work, not just the look.',
    body: [
      'The old workflows were not restyled, they were rethought, and the steps needed to finish a process are far fewer than before. The screens below are recreated, but the problems and the thinking behind them are real.',
    ],
  },
]

/** The design story as short chapters: the reasoning in prose, one short chapter per problem solved. */
export function Approach() {
  return (
    <section className="approach" id="cs-action" aria-label="How I approached it">
      <h3 className="in-action-title">How I approached it</h3>
      {chapters.map((c, i) => (
        <div className="approach-chapter" key={c.id}>
          <span className="ap-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <h4>{c.title}</h4>
          <p className="ap-aim">{c.aim}</p>
          {c.body.map((t) => <p key={t}>{t}</p>)}
        </div>
      ))}
    </section>
  )
}
