/**
 * The psychology behind a decision, in plain words.
 * Each one is a principle from growth.design's list of cognitive biases (growth.design/psychology). `says` is one
 * sentence about what people do, said the way I would say it to a teammate. It never says what I designed: the case
 * studies and the work cards do that, in a second line that ties the principle to the screen it explains. So the
 * order is always the moment first, then the principle, then how it shows up here.
 */
export type Law = {
  name: string
  /** what people do, in one plain sentence */
  says: string
}

export const laws = {
  recognition: {
    name: 'Recognition over recall',
    says: 'It’s far easier to spot something than to remember it.',
  },
  chunking: {
    name: 'Chunking',
    says: 'A few small groups are easier to hold in mind than one long list.',
  },
  hicks: {
    name: 'Hick’s law',
    says: 'The more choices in front of someone, the longer each decision takes.',
  },
  progressive: {
    name: 'Progressive disclosure',
    says: 'People feel less overwhelmed when detail arrives as they ask for it.',
  },
  feedback: {
    name: 'Feedback loop',
    says: 'When someone acts and the screen stays silent, they wonder, or do it again.',
  },
  feedforward: {
    name: 'Feedforward',
    says: 'People stop guessing when they are told what will happen before they act.',
  },
  labor: {
    name: 'Labor illusion',
    says: 'People trust a result more when they can see the work behind it.',
  },
  signifiers: {
    name: 'Signifiers',
    says: 'A good mark says what it means before anyone has to ask.',
  },
  tesler: {
    name: 'Tesler’s law',
    says: 'Every process has some complexity that can’t be removed, only moved: to the system or to the person.',
  },
  mental: {
    name: 'Mental model',
    says: 'People arrive with an idea of how things work, and judge the product against it.',
  },
  hawthorne: {
    name: 'Hawthorne effect',
    says: 'People act more carefully when they know someone will see.',
  },
  curse: {
    name: 'Curse of knowledge',
    says: 'Once you know how something works, it’s hard to remember not knowing.',
  },
  similarity: {
    name: 'Law of similarity',
    says: 'Things that look alike are read as the same thing.',
  },
  familiarity: {
    name: 'Familiarity bias',
    says: 'People prefer what they already know.',
  },
  load: {
    name: 'Cognitive load',
    says: 'Every detail someone has to keep in their head is effort taken from the real work.',
  },
  aha: {
    name: 'Aha! moment',
    says: 'The moment someone first sees what the product is for.',
  },
  endowment: {
    name: 'Endowment effect',
    says: 'People value what feels like theirs.',
  },
  zeigarnik: {
    name: 'Zeigarnik effect',
    says: 'An unfinished task stays on the mind until it is finished.',
  },
  goal: {
    name: 'Goal gradient',
    says: 'People speed up as the end comes into view.',
  },
  negativity: {
    name: 'Negativity bias',
    says: 'Bad moments are remembered longer than good ones.',
  },
  chrono: {
    name: 'Chronoception',
    says: 'A second feels longer when nothing is happening.',
  },
  occam: {
    name: 'Occam’s razor',
    says: 'When two designs do the job, the simpler one usually wins.',
  },
  spark: {
    name: 'Spark effect',
    says: 'People act when the next step is small.',
  },
  discover: {
    name: 'Discoverability',
    says: 'A feature nobody finds might as well not exist.',
  },
  reactance: {
    name: 'Reactance',
    says: 'People push back when they feel forced.',
  },
  vonrestorff: {
    name: 'Von Restorff effect',
    says: 'The one thing that looks different is the one thing people notice.',
  },
} satisfies Record<string, Law>

export type LawId = keyof typeof laws

export const LAWS_SOURCE = 'https://growth.design/psychology'
