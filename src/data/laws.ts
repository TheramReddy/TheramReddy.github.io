/**
 * The psychology behind a decision, in plain words.
 * Each one is a principle from growth.design's list of cognitive biases (growth.design/psychology). `says` is one
 * sentence about what people do, said the way I would say it to a teammate. It never says what I designed: the case
 * studies and the work cards do that, in a second line that ties the principle to the screen it explains. So the
 * order is always the moment first, then the principle, then how it shows up here.
 */
type Law = {
  /** what people do, in one plain sentence */
  says: string
}

export const laws = {
  recognition: {
    says: 'It’s far easier to spot something than to remember it.',
  },
  chunking: {
    says: 'A few small groups are easier to hold in mind than one long list.',
  },
  hicks: {
    says: 'The more choices in front of someone, the longer each decision takes.',
  },
  progressive: {
    says: 'People feel less overwhelmed when detail arrives as they ask for it.',
  },
  feedback: {
    says: 'When someone acts and the screen stays silent, they wonder, or do it again.',
  },
  feedforward: {
    says: 'People stop guessing when they are told what will happen before they act.',
  },
  labor: {
    says: 'People trust a result more when they can see the work behind it.',
  },
  signifiers: {
    says: 'A good mark says what it means before anyone has to ask.',
  },
  tesler: {
    says: 'Every process has some complexity that can’t be removed, only moved: to the system or to the person.',
  },
  mental: {
    says: 'People arrive with an idea of how things work, and judge the product against it.',
  },
  hawthorne: {
    says: 'People act more carefully when they know someone will see.',
  },
  curse: {
    says: 'Once you know how something works, it’s hard to remember not knowing.',
  },
  similarity: {
    says: 'Things that look alike are read as the same thing.',
  },
  familiarity: {
    says: 'People prefer what they already know.',
  },
  load: {
    says: 'Every detail someone has to keep in their head is effort taken from the real work.',
  },
  aha: {
    says: 'The moment someone first sees what the product is for.',
  },
  endowment: {
    says: 'People value what feels like theirs.',
  },
  zeigarnik: {
    says: 'An unfinished task stays on the mind until it is finished.',
  },
  goal: {
    says: 'People speed up as the end comes into view.',
  },
  negativity: {
    says: 'Bad moments are remembered longer than good ones.',
  },
  chrono: {
    says: 'A second feels longer when nothing is happening.',
  },
  occam: {
    says: 'When two designs do the job, the simpler one usually wins.',
  },
  spark: {
    says: 'People act when the next step is small.',
  },
  discover: {
    says: 'A feature nobody finds might as well not exist.',
  },
  reactance: {
    says: 'People push back when they feel forced.',
  },
  vonrestorff: {
    says: 'The one thing that looks different is the one thing people notice.',
  },
} satisfies Record<string, Law>

export type LawId = keyof typeof laws
