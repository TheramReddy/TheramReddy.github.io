import { projects } from './projects'

/**
 * The cards on the playground board: one piece of work each, written from the resume and the case studies.
 * `place` is the workplace (0 Georgia DHS, 1 Scobin, 2 Wipro, 3 Telemetric) and `stage` the column
 * (0 Research, 1 Define, 2 Design, 3 Build, 4 Test). Every workplace has at least three cards in every stage.
 * The open card shows `desc` first, then the problem (`why`), what I did (`how`) and what changed (`out`).
 */
export type Work = {
  place: number
  stage: number
  title: string
  labels: string[]
  /** a number or fact worth a green chip on the card */
  result?: string
  desc: string
  why: string
  how: string[]
  out: string
  link?: { href: string; name: string }
}

const dso = projects.find((p) => p.slug === 'dso-modernization')!
const scobin = projects.find((p) => p.slug === 'scobin-design-system')!

export const WORK: Work[] = [
  /* ================= Georgia DHS ================= */
  // Research
  {
    place: 0, stage: 0, title: 'Ride-alongs and workshops with caseworkers', labels: ['Research'], result: '50+ caseworkers and experts',
    desc: 'I studied the real work through contextual inquiry, ride-alongs and workshops with more than 50 caseworkers and subject experts.',
    why: 'The legacy system had been in use for years, and the people using it had built workarounds nobody had written down. Designing from the old screens alone would have copied the old problems.',
    how: ['Sat beside caseworkers while they worked real cases, and watched before asking', 'Ran workshops with subject experts to walk through the rules behind each step', 'Wrote down every workaround, because each one marked a place where the system failed on efficiency or user control'],
    out: 'The findings set the design priorities and the order things were built in.',
  },
  {
    place: 0, stage: 0, title: 'Stakeholder interviews across the agency', labels: ['Research'],
    desc: 'I interviewed agency staff, subject experts and vendors to learn what each group needed from the system.',
    why: 'The public, agency staff and vendors each need something different from the same system, and some of those needs pull against each other.',
    how: ['Asked each group what they needed and what got in their way', 'Compared the answers to find where the groups agreed and where their goals conflicted', 'Brought the conflicts to the team early, as decisions to make and not surprises to find later'],
    out: 'Each portal started from a clear list of what its people needed.',
  },
  {
    place: 0, stage: 0, title: 'The debt setoff pipeline, mapped end to end', labels: ['Research'],
    desc: 'I mapped the whole pipeline as a journey: every step a file takes from a partner agency to a taxpayer’s refund, with the goal and the pain at each one.',
    why: 'The work crosses partner agencies, the bank, the print vendor and the taxpayer. Nobody had a single picture of it, so problems were fixed one screen at a time.',
    how: ['Followed a file from the moment it arrives to the moment a check clears', 'Wrote the goal of each step in plain words, such as “watch a file travel from partner to taxpayer balance without guessing”', 'Marked the pain at each step, and later the design that answers it'],
    out: 'The map became the shared reference for what to fix and in what order.',
  },
  {
    place: 0, stage: 0, title: 'Heuristic review of the legacy system', labels: ['Research'],
    desc: 'I reviewed the legacy screens against usability heuristics to see exactly where they failed.',
    why: 'Staff described the old system as slow and confusing, but “confusing” is not something you can design against. I needed specific failures.',
    how: ['Went through the legacy screens task by task', 'Checked each one for visible system status, user control, and recognition over recall', 'Matched what I found to the workarounds I had seen in the field'],
    out: 'The review pointed to two main failures, efficiency and user control, which shaped the rules for the redesign.',
  },
  // Define
  {
    place: 0, stage: 1, title: 'The jobs a person does in a day', labels: ['Workflow'],
    desc: 'I wrote down the jobs a person does in a day, and designed around those instead of around the old screens.',
    why: 'The legacy system was organized around its own data, not around the work. People had to know where things lived before they could do anything.',
    how: ['Listed the tasks each role really performs, from the field research', 'Kept what served a task, and made the rest quiet or removed it', 'Used the list to decide what to design first'],
    out: 'It became the first rule of the project: start with the work, not the screens.',
  },
  {
    place: 0, stage: 1, title: 'Three portals, one for each role', labels: ['Workflow'], result: 'Task time down about 40%',
    desc: 'I designed three role-based portals (resident, caseworker and vendor), each built around that role’s task flow and vocabulary.',
    why: 'One system was trying to serve the public, agency staff and outside vendors with the same screens and the same words.',
    how: ['Split the system into three portals: resident, caseworker and vendor', 'Built each portal around its role’s tasks and vocabulary, so the system matches the real world', 'Kept the shared parts consistent, so the three portals feel like one product'],
    out: 'Task time dropped about 40% and usability scores rose 15%.',
  },
  {
    place: 0, stage: 1, title: 'Information architecture for three portals', labels: ['Workflow'],
    desc: 'I organized each portal around the tasks of its role, so the navigation matches how the work is really done.',
    why: 'Menus followed the structure of the old system. Finding a page meant remembering where it had been put.',
    how: ['Grouped pages by the task they belong to', 'Named everything in the words staff already use', 'Made the day’s work the landing page, not a menu'],
    out: 'People land on the work they came to do.',
  },
  {
    place: 0, stage: 1, title: 'Claims, hearings, payments and reconciliation, linked', labels: ['Workflow'], result: '40% fewer steps',
    desc: 'I linked claims, hearings, payments and reconciliation, so one process leads into the next.',
    why: 'Claims, hearings and payments are one story, but the old system kept them apart. Staff carried the connection in their heads.',
    how: ['Mapped how each process hands over to the next', 'Linked them on the page, so staff recognise instead of recall', 'Made one clear path through, with no guessing about what comes next'],
    out: 'Finishing a process now takes 40% fewer steps.',
  },
  {
    place: 0, stage: 1, title: 'Eligibility rules as conditional flows', labels: ['Workflow'],
    desc: 'I modeled LIHEAP eligibility as conditional flows that reveal only the relevant fields.',
    why: 'Eligibility depends on fuel types, county and vendor relationships, and access restrictions. Shown all at once, it is a wall of fields, most of which do not apply.',
    how: ['Modeled the rules as conditional flows', 'Revealed only the fields that are relevant to the answers so far', 'Made the screens permission-aware, so each role sees only what its access allows'],
    out: 'People answer only the questions that apply to them.',
  },
  {
    place: 0, stage: 1, title: 'Five rules for the redesign', labels: ['Workflow'],
    desc: 'I wrote the approach down as five short rules the whole team could design and review against.',
    why: 'A project this size is shaped by many decisions on many days. Without shared rules, each screen drifts in its own direction.',
    how: ['Start with the work, not the screens', 'Let the screen remember', 'Say what’s happening', 'Make risky things hard and common things easy', 'One system, different people'],
    out: 'Every screen could be checked against the same five rules.',
  },
  // Design
  {
    place: 0, stage: 2, title: 'Shared components on a WCAG 2.1 AA baseline', labels: ['Design system', 'Accessibility'],
    desc: 'I defined shared components and a WCAG 2.1 AA baseline for all three portals.',
    why: 'Three portals built separately would drift apart, and accessibility added at the end is always incomplete.',
    how: ['Defined one set of components for all three portals', 'Set the baseline: keyboard navigation, logical focus order, semantic markup and ARIA', 'Made the baseline part of each component, so every screen built from them inherits it'],
    out: 'Consistency and accessibility come from the components, not from remembering.',
  },
  {
    place: 0, stage: 2, title: 'One search from any screen', labels: ['Interaction'], result: '1 search to find a profile',
    link: dso.link && { href: dso.link.href, name: dso.link.title },
    desc: 'Ctrl K opens one search for pages and profiles, from any screen.',
    why: 'Finding a profile took too many clicks. Staff dug through menus to reach one.',
    how: ['Put one search on every screen, opened with Ctrl K', 'Made it search both pages and profiles, with results as you type', 'Kept it optional: experienced staff get a fast path, and new staff can ignore it'],
    out: 'One search finds a profile from anywhere.',
  },
  {
    place: 0, stage: 2, title: 'Everything about a person on one page', labels: ['Interaction'], result: '1 view',
    desc: 'Claims, hearings and payments for a person now sit on one page.',
    why: 'One person’s record was spread across separate screens, and a long record was one long page.',
    how: ['Brought it together in one profile, with four totals at the top and seven tabs', 'Gave intercepts, disbursements and refunds a tab each under the running totals', 'Split a long record into small groups instead of one long page'],
    out: 'One person’s whole debt story is in one place: what was claimed, taken, paid and returned.',
  },
  {
    place: 0, stage: 2, title: 'Live status for every file', labels: ['Interaction'],
    desc: 'A live checklist shows which step each file is on.',
    why: 'Nobody could tell if a transfer was stuck, and a partner feed could fail quietly.',
    how: ['Designed a six-step live checklist, with logs and timing for each step', 'Showed the health of each partner connection', 'Gave a failed connection a clear next action, such as Retry'],
    out: 'Staff can watch a file travel from partner to taxpayer balance without guessing.',
  },
  {
    place: 0, stage: 2, title: 'Sensitive numbers stay masked', labels: ['Interaction'],
    desc: 'Social Security numbers stay masked until someone makes a deliberate, logged click.',
    why: 'Social Security numbers were on screen even when nobody needed them.',
    how: ['Masked every number by default', 'Required a deliberate click to reveal one', 'Logged each reveal'],
    out: 'Sensitive detail appears only when it is needed.',
  },
  {
    place: 0, stage: 2, title: 'Navigation that follows the role', labels: ['Interaction'],
    desc: 'A partner-agency worker sees only Hearings, while DHS staff see everything.',
    why: 'Partner staff saw menus that did not apply to them.',
    how: ['Tied the navigation to the role', 'Showed a partner-agency worker only Hearings', 'Kept the full navigation for DHS staff'],
    out: 'Each person faces only the choices that apply to them.',
  },
  {
    place: 0, stage: 2, title: 'Approvals that say what happens next', labels: ['Interaction'],
    desc: 'A void waits for supervisor approval, and the page says nothing is sent to the bank until then.',
    why: 'After voiding a check, staff were unsure whether the void was done or the bank had been told.',
    how: ['Made a void wait for supervisor approval', 'Stated on the page that nothing goes to the bank until it is approved', 'Gave the supervisor one clear decision: approve or reject'],
    out: 'Nobody is left wondering, and nobody acts too early.',
  },
  {
    place: 0, stage: 2, title: 'Scheduling that blocks the mistake', labels: ['Interaction'],
    desc: 'Past dates are locked, and the page warns that a batch cannot change on the day it runs.',
    why: 'A batch could land on a past date, or be changed on the day it runs.',
    how: ['Locked today and earlier dates', 'Stated the run-day rule at the top of the page', 'Let staff choose a date range and a repeat, and see the dates before confirming'],
    out: 'The mistake is blocked before it happens.',
  },
  {
    place: 0, stage: 2, title: 'Data tables built for repeat use', labels: ['Interaction'],
    desc: 'Tables that sort, filter, resize and let people pick their columns.',
    why: 'The work is done hundreds of times a day in long tables, and repeat work was slow.',
    how: ['Added sort and filter to the tables', 'Let people resize columns and choose which ones to show', 'Designed for the hundredth visit, not only the first'],
    out: 'Repeat use is fast.',
  },
  {
    place: 0, stage: 2, title: 'Plain-language status and microcopy', labels: ['Interaction'],
    desc: 'A badge marks a hold, and the Hearing tab explains it in plain language.',
    why: 'A hold was hard to spot and hard to explain. A status said what, but not why.',
    how: ['Put a badge in the header when money is on hold', 'Explained it in one plain sentence: why it is held, what it is waiting on and who acts next', 'Used the same word for the same thing everywhere'],
    out: 'Nobody has to ask where the money went.',
  },
  // Build
  {
    place: 0, stage: 3, title: 'Annotated specs for engineering', labels: ['Design system'],
    desc: 'I handed off annotated high-fidelity prototypes, with states, rules and edge cases written down.',
    why: 'A design that only shows the happy path leaves the hard decisions to whoever builds it.',
    how: ['Annotated the high-fidelity prototypes', 'Wrote down the states, rules and edge cases for each screen', 'Stayed with engineering through the build to answer questions as they came up'],
    out: 'The build did not depend on guesswork.',
  },
  {
    place: 0, stage: 3, title: 'Keyboard, focus and ARIA specified per component', labels: ['Accessibility'],
    desc: 'Keyboard navigation, focus order, semantic markup and ARIA were specified for each shared component.',
    why: 'Accessibility left to the end of a build is rarely finished.',
    how: ['Specified keyboard navigation for each shared component', 'Defined a logical focus order', 'Named the semantic markup and ARIA each one needs'],
    out: 'Keyboard and screen-reader support were there from the start.',
  },
  {
    place: 0, stage: 3, title: 'Design QA in the Angular and Bootstrap build', labels: ['Front-end'],
    desc: 'I reviewed the built screens against the designs and the accessibility baseline.',
    why: 'What gets built is never exactly what was drawn, and the differences are where usability is lost.',
    how: ['Compared the built screens with the designs', 'Checked them against the accessibility baseline', 'Worked through the differences with engineering'],
    out: 'The shipped screens match the design intent.',
  },
  // Test
  {
    place: 0, stage: 4, title: 'Usability testing after every round', labels: ['Research'], result: 'Usability scores up 15%',
    desc: 'I ran iterative design with usability testing, refining after every round.',
    why: 'A design is a guess until someone uses it.',
    how: ['Worked in rounds: user flows, then wireframes, then annotated high-fidelity prototypes', 'Tested each round with the people who do the work', 'Refined the design after every round'],
    out: 'Usability scores rose 15%.',
  },
  {
    place: 0, stage: 4, title: 'Verified with axe, WAVE and Lighthouse', labels: ['Accessibility'],
    desc: 'The accessibility baseline was verified in the Angular and Bootstrap build with axe, WAVE and Lighthouse.',
    why: 'A baseline on paper proves nothing. It has to hold in the real build.',
    how: ['Ran axe, WAVE and Lighthouse against the built screens', 'Worked through what they found with engineering', 'Checked the result against WCAG 2.1 AA'],
    out: 'The baseline is verified in the build, not only in the design.',
  },
  {
    place: 0, stage: 4, title: 'Keyboard and screen-reader passes', labels: ['Accessibility'],
    desc: 'I went through the screens with a keyboard and a screen reader, because automated tools only catch part of the problem.',
    why: 'A tool can tell you a label is missing. It cannot tell you whether the page makes sense without a mouse.',
    how: ['Completed the main tasks using only a keyboard', 'Checked that focus moves in a logical order and is always visible', 'Listened to the screens with a screen reader'],
    out: 'The portals work for people who do not use a mouse.',
  },

  /* ================= Scobin ================= */
  // Research
  {
    place: 1, stage: 0, title: 'Product-wide UI audit', labels: ['Design system'], result: '5 dropdowns, 3 buttons, 4 error styles',
    desc: 'Before creating anything new, I went through the existing interface screen by screen.',
    why: 'Similar components looked and behaved differently across screens. Each worked alone, but together they made the product unpredictable.',
    how: ['Collected the recurring UI elements and compared how they looked and behaved', 'Found five dropdown patterns, three versions of the primary button and four ways to show an error', 'Grouped similar controls and asked what each variation was for'],
    out: 'I knew where one well-defined component could replace several competing ones.',
  },
  {
    place: 1, stage: 0, title: 'Interviews with designers, developers and employees', labels: ['Research'],
    desc: 'I spoke with designers, front-end developers and employees who used the interface regularly.',
    why: 'I wanted to know where the inconsistencies were slowing people down, not which features they wanted in a design system.',
    how: ['Asked people to walk me through work they had recently designed, built or used', 'Noted every point where they had to stop and figure something out', 'Heard the same three questions: Which one should I use? What if there’s no data, or something goes wrong? Can everyone reach it, including with a keyboard?'],
    out: 'The real problem was clear: the team had no shared reference for making consistent decisions.',
  },
  {
    place: 1, stage: 0, title: 'One screen, followed from design to review', labels: ['Research'],
    desc: 'I followed the journey of one screen from its first layout through development and review.',
    why: 'Small unanswered questions were creating back and forth. Each one was settled in a conversation, and then settled again on the next screen.',
    how: ['Followed a screen through design, build and review', 'Recorded the question that stopped each step', 'Matched each question to the part of the system that should answer it'],
    out: 'I knew what the library had to carry: behavior, states and usage rules, there at the moment someone needs them.',
  },
  {
    place: 1, stage: 0, title: 'Feedback, observation and competitive analysis', labels: ['Research'], result: 'Adoption up 20% in three months',
    desc: 'I synthesized customer feedback, observation and competitive analysis into recommendations.',
    why: 'Stakeholders had to choose what to fix first, and needed evidence to choose with.',
    how: ['Gathered customer feedback and observed how people used the product', 'Compared the product with its competitors', 'Turned the findings into recommendations, with the tradeoffs laid out'],
    out: 'Adoption grew 20% in three months.',
  },
  // Define
  {
    place: 1, stage: 1, title: 'Three questions every component must answer', labels: ['Design system'],
    desc: 'I made the three questions from the interviews the test every component has to pass.',
    why: 'A library of good-looking components would not have fixed anything. People were stuck on decisions, not on drawing.',
    how: ['Which one should I use? Each page says when to use it and when to avoid it', 'What if something goes wrong? Properties and states are documented on each component', 'Can everyone reach it? Keyboard, focus and ARIA rules are on each page'],
    out: 'Every reusable component answers the questions people would otherwise have to ask.',
  },
  {
    place: 1, stage: 1, title: 'Three layers of variables', labels: ['Design system'], result: '548 variables',
    desc: 'I organized the variables into three layers: Primitives, Routing and Applied.',
    why: 'I didn’t want anyone to memorize which shade of blue belongs to an information message.',
    how: ['Primitives define the raw values', 'Routing decides how those values adapt to different contexts', 'Applied tokens give them a meaningful role, and components reference only these'],
    out: 'A component asks for the meaning of a value, not a hardcoded color.',
  },
  {
    place: 1, stage: 1, title: 'One component where several competed', labels: ['Design system'],
    desc: 'I decided which components the product actually needed, before designing any.',
    why: 'Five dropdowns in one product means five different experiences.',
    how: ['Looked at the purpose behind each variation', 'Kept the differences that served a real need', 'Replaced the rest with one defined component per pattern'],
    out: 'The same control behaves the same way on every screen.',
  },
  {
    place: 1, stage: 1, title: 'Recommendations and tradeoffs for stakeholders', labels: ['Workflow'],
    desc: 'I turned the research into recommendations and stakeholder tradeoffs.',
    why: 'Research that stays in a document changes nothing.',
    how: ['Turned the findings into specific recommendations', 'Laid out the tradeoffs of each one', 'Agreed the priorities with stakeholders'],
    out: 'The team knew what to build first, and why.',
  },
  // Design
  {
    place: 1, stage: 2, title: 'The app shell, wireframed in grayscale', labels: ['Interaction'],
    desc: 'Before choosing colors, I wireframed the application shell in grayscale.',
    why: 'Color can hide a weak layout. I wanted the structure to make sense on its own.',
    how: ['Broke the interface into header, navigation, breadcrumbs, page titles and content cards', 'Worked out how the pieces relate before deciding how they look', 'Turned those structures into reusable layout components'],
    out: 'The wireframe became the Dashboard sample screen.',
  },
  {
    place: 1, stage: 2, title: 'Color names that say what they do', labels: ['Design system'], result: '216 semantic tokens',
    desc: 'The Applied layer holds 216 semantic variables, named for their role: intent, text, links and surfaces.',
    why: 'A raw color name tells you what it looks like. It does not tell you when to use it.',
    how: ['Named each token for its role in the interface', 'Documented the tokens in tables, so nobody has to guess their intended use', 'Left room for future themes without redesigning the components'],
    out: 'The system can change without losing consistency.',
  },
  {
    place: 1, stage: 2, title: 'Typography that adapts', labels: ['Design system'], result: '95 text styles',
    desc: 'I created 95 text styles across five categories: Display, Heading, Body, UI and Mono.',
    why: 'Fixed font sizes break on small screens, and resizing them by hand breaks the hierarchy.',
    how: ['Organized the styles by their role, not by their size', 'Defined five responsive modes, from Mobile to Desktop Large', 'Let each mode manage font size, line height and letter spacing'],
    out: 'The hierarchy stays familiar on every screen size.',
  },
  {
    place: 1, stage: 2, title: 'A button in every state', labels: ['Interaction', 'Design system'], result: '60 variants',
    desc: 'I built the Button around 4 types, 3 sizes and 5 states: 60 defined variants.',
    why: 'A component isn’t finished when it looks good in its default state.',
    how: ['Default and Hover say it’s interactive, and Pressed confirms the click', 'Focus shows where the keyboard is, using a shared Focus Ring', 'Disabled says the action isn’t available yet'],
    out: 'Each state answers a question the user has.',
  },
  {
    place: 1, stage: 2, title: 'Dense inventory screens you can read', labels: ['Interaction'], result: 'Task time down 35%, errors down 40%',
    desc: 'I reworked the dense inventory screens with progressive disclosure and visual hierarchy.',
    why: 'The inventory screens show a lot of operational data at once, and people had to remember what things meant.',
    how: ['Used progressive disclosure, so detail appears when it is needed', 'Used visual hierarchy to favor recognition over recall', 'Kept system status visible'],
    out: 'Task time fell 35% and manual errors fell 40%.',
  },
  {
    place: 1, stage: 2, title: 'Status chips, empty, loading and error states', labels: ['Interaction'],
    desc: 'I designed status chips plus empty, loading and error states.',
    why: '“What if there’s no data, or something goes wrong?” was one of the three questions people kept asking.',
    how: ['Designed status chips that read at a glance', 'Designed the empty, loading and error states', 'Documented them, so they are built the same way every time'],
    out: 'System status stays visible on every screen.',
  },
  // Build
  {
    place: 1, stage: 3, title: 'Component specs and ownership with engineering', labels: ['Design system'],
    desc: 'I defined component specs and ownership with design and engineering.',
    why: 'Design and engineering each had their own version of a component, and nobody owned the answer.',
    how: ['Defined what a component spec includes', 'Agreed who owns each component, across design and engineering', 'Made the design system the single source of truth for both'],
    out: 'Handoff stopped needing a second round of questions.',
  },
  {
    place: 1, stage: 3, title: 'One page structure for every component', labels: ['Design system'], result: '41 documented components',
    desc: 'Every component has the same page: variants and properties, states, when to use it, when to avoid it, and accessibility.',
    why: 'I wanted someone opening the library for the first time to find answers without needing me to explain every page.',
    how: ['Followed one page structure across all 41 components', 'Described behavior, not only appearance: the Accordion page covers keyboard and focus behavior and the relevant ARIA attributes', 'Said when not to use a pattern, such as nesting accordions'],
    out: 'Another designer or developer can use each component correctly.',
  },
  {
    place: 1, stage: 3, title: 'A system for the documentation itself', labels: ['Design system'],
    desc: 'I built the reusable pieces the library is documented with.',
    why: 'A library this size needs a structure of its own, or it becomes hard to navigate and maintain.',
    how: ['Built a heading system with four levels, and seven status labels from Stable to Deprecated', 'Made reusable annotation notes, token table rows and color swatches', 'Kept documentation-only colors in a separate Figma-only collection, so they are never confused with product tokens'],
    out: 'The library is easier to maintain and navigate.',
  },
  // Test
  {
    place: 1, stage: 4, title: 'Every color pairing checked for contrast', labels: ['Accessibility'], result: '4.63:1 on Scobin Blue 600',
    desc: 'I built a contrast reference board that shows the ratio of every color pairing, with the failing ones clearly marked.',
    why: 'Contrast shouldn’t be something we remember to check at the end.',
    how: ['Measured each pairing against WCAG: at least 4.5:1 for body text, 3:1 for large text and 3:1 for UI elements that aren’t text', 'Marked the failing combinations', 'Placed the board beside the color system, where the choices are made'],
    out: 'Accessible choices are easy during everyday design work.',
  },
  {
    place: 1, stage: 4, title: 'Reviews with real behavior', labels: ['Interaction'],
    desc: 'Hover and Pressed states are wired up as Figma prototype interactions, so the team can try the behavior in reviews.',
    why: 'You cannot judge how a button behaves from a still frame.',
    how: ['Connected Hover and Pressed through prototype interactions', 'Used the working prototype in design reviews', 'Spent the review on the design problem, not on settled details'],
    out: 'If an interaction matters in the browser, it gets attention in the design system.',
  },
  {
    place: 1, stage: 4, title: 'A system the whole company uses', labels: ['Design system'], result: '120+ people use it',
    link: scobin.figma ? { href: scobin.figma, name: 'Open the Figma file' } : undefined,
    desc: 'More than 120 people use the design system today.',
    why: 'A design system only works if people keep using it after its author steps away.',
    how: ['Built it to be used and maintained without me explaining every detail', 'Made each decision easy to find at the moment it is needed', 'Made it the single source of truth for design and engineering'],
    out: 'It makes good design easier to repeat.',
  },

  /* ================= Wipro ================= */
  // Research
  {
    place: 2, stage: 0, title: 'Wireframe and prototype reviews', labels: ['Research'],
    desc: 'I joined wireframe and prototype reviews with designers, clients and engineers, to understand a design before building it.',
    why: 'A developer who first sees a design at handoff can only build it or push back. Seeing it early means the design can still change.',
    how: ['Read the UX specs and asked what each screen was for', 'Asked how the design should behave with real data and with errors', 'Raised what would be hard or slow to build'],
    out: 'Problems were found while they were still cheap to fix.',
  },
  {
    place: 2, stage: 0, title: 'Where error messages left people stuck', labels: ['Research'],
    desc: 'I looked at what people saw when a form was rejected, by the browser or by the server.',
    why: 'A validation error told people something was wrong, but not what, or how to fix it.',
    how: ['Collected the errors the client and the server could return', 'Checked what each one showed the user', 'Noted which ones gave no way forward'],
    out: 'I had a clear list of the messages to rewrite.',
  },
  {
    place: 2, stage: 0, title: 'What slowed the first load', labels: ['Front-end'],
    desc: 'Before speeding up the first load, I looked at what was being loaded, and when.',
    why: 'You cannot make a page faster until you know where the time goes.',
    how: ['Looked at what the first screen really needed', 'Found code that could load later', 'Found assets that could be smaller'],
    out: 'I knew which changes would matter.',
  },
  // Define
  {
    place: 2, stage: 1, title: 'Technical constraints flagged early', labels: ['Workflow'],
    desc: 'I flagged technical constraints early, in wireframe and prototype reviews.',
    why: 'A constraint found during the build costs a redesign. Found in a review, it costs a conversation.',
    how: ['Said what the framework and the data could and could not do', 'Offered an alternative each time, not only a no', 'Agreed the change with designers, clients and engineers'],
    out: 'Designs changed before they were expensive to change.',
  },
  {
    place: 2, stage: 1, title: 'A pattern for every error message', labels: ['Interaction'],
    desc: 'I defined how an error should read: what went wrong, where, and how to recover.',
    why: 'Each form had been handling errors in its own way.',
    how: ['Put the message inline, next to the field it concerns', 'Wrote it as an action the person can take', 'Used the same pattern for client and server errors'],
    out: 'One pattern for every error, on every form.',
  },
  {
    place: 2, stage: 1, title: 'Which parts become reusable components', labels: ['Front-end'],
    desc: 'Before building, I worked out which parts of the specs repeated, and made those the components.',
    why: 'When each screen is built from scratch, the same pattern ends up slightly different every time.',
    how: ['Read across the UX specs for repeated patterns', 'Defined each one as a component', 'Planned the screens around those components'],
    out: 'The same pattern looks and behaves the same wherever it appears.',
  },
  // Design
  {
    place: 2, stage: 2, title: 'Errors people can recover from', labels: ['Front-end', 'Interaction'],
    desc: 'I turned server and client validation into inline, actionable messages with recovery steps.',
    why: 'A raw validation error tells you that you failed. It does not help you succeed.',
    how: ['Showed each message inline', 'Made each message actionable', 'Added the steps to recover'],
    out: 'Users can recognize, diagnose and recover from errors.',
  },
  {
    place: 2, stage: 2, title: 'Responsive behavior for every screen size', labels: ['Front-end'],
    desc: 'I worked out how each interface adapts between screen sizes, following the UX specs.',
    why: 'A spec shows a few sizes. The browser has all of them.',
    how: ['Decided how each layout reflows between the sizes in the spec', 'Checked the awkward widths in between', 'Took questions back to the designers when the spec did not cover a case'],
    out: 'The interfaces work across screen sizes.',
  },
  {
    place: 2, stage: 2, title: 'Variations for the A/B tests', labels: ['Interaction'],
    desc: 'I built the variations for the A/B tests on two client portals.',
    why: 'Opinions about which design works better are cheap. A test settles it.',
    how: ['Worked with the team on what to compare', 'Kept the difference between versions to the one thing being tested', 'Kept both versions equally fast and stable'],
    out: 'The results could be trusted.',
  },
  // Build
  {
    place: 2, stage: 3, title: 'UX specs as responsive Angular interfaces', labels: ['Front-end'],
    desc: 'I implemented UX specs as responsive Angular interfaces.',
    why: 'A spec is a promise. The interface is what people actually use.',
    how: ['Built the UX specs as Angular interfaces', 'Made them responsive', 'Stayed close to the designers when the spec and the browser disagreed'],
    out: 'What shipped matched what was designed.',
  },
  {
    place: 2, stage: 3, title: 'A library of reusable components', labels: ['Front-end'],
    desc: 'I built reusable Angular components, so a pattern is built once and used everywhere.',
    why: 'Code that is copied drifts. A fix in one place never reaches the others.',
    how: ['Built each repeated pattern as a reusable component', 'Used the components across screens', 'Fixed a problem once, in the component'],
    out: 'Consistent screens, and less code to maintain.',
  },
  {
    place: 2, stage: 3, title: 'Client and server validation in one voice', labels: ['Front-end', 'Interaction'],
    desc: 'Errors from the server and from the client are shown the same way.',
    why: 'People do not care which side rejected their input. They only see that two errors look different.',
    how: ['Handled server and client validation in the same place', 'Showed both inline, next to the field', 'Gave both the step that fixes them'],
    out: 'An error looks and reads the same wherever it comes from.',
  },
  {
    place: 2, stage: 3, title: 'A faster first load', labels: ['Front-end'],
    desc: 'I sped up the initial load with lazy loading, code splitting and asset optimization.',
    why: 'People judge a portal in its first seconds.',
    how: ['Lazy loading: a part of the app loads only when it is needed', 'Code splitting: the code arrives in smaller pieces', 'Asset optimization: smaller images and files'],
    out: 'The initial load is faster.',
  },
  // Test
  {
    place: 2, stage: 4, title: 'A/B tests on two client portals', labels: ['Research'], result: 'Engagement up 15%, conversion up 10%',
    desc: 'I contributed to A/B tests on two client portals.',
    why: 'A change that feels better is not always a change that works better.',
    how: ['Ran two versions side by side on two client portals', 'Compared engagement and conversion between them', 'Kept what performed better'],
    out: 'Engagement rose 15% and conversion rose 10%.',
  },
  {
    place: 2, stage: 4, title: 'Checking the build against the specs', labels: ['Front-end'],
    desc: 'I compared what I built with the UX specs before calling it done.',
    why: 'Small differences from the spec add up to an interface that feels off.',
    how: ['Compared each built screen with its spec', 'Checked it at different screen sizes', 'Reviewed the result with the designers'],
    out: 'The designers recognised their design in the browser.',
  },
  {
    place: 2, stage: 4, title: 'Trying every error on purpose', labels: ['Interaction'],
    desc: 'I triggered each validation error on purpose, to check the message and the way out.',
    why: 'Error paths are the ones nobody tests, and the ones people remember.',
    how: ['Triggered each client-side error', 'Triggered each server-side error', 'Checked that the message appeared inline, with a recovery step that works'],
    out: 'Every error has a way forward.',
  },

  /* ================= Telemetric ================= */
  // Research
  {
    place: 3, stage: 0, title: 'Several AI models, run from a terminal', labels: ['Research'],
    desc: 'The idea began with a friend who was using several AI models to build a game. Each model had a specific job, but the whole setup lived in a terminal.',
    why: 'The system was capable, but only for someone comfortable in a terminal.',
    how: ['Watched how the setup worked, and where it was hard to follow', 'Noticed I was more interested in the person using it than in what it could do', 'Asked what that person would need to see'],
    out: 'It gave me the question behind the product.',
  },
  {
    place: 3, stage: 0, title: 'How AI tools handle a folder today', labels: ['Research'],
    desc: 'Most AI tools treat a folder as a pile of text and re-read it on every question.',
    why: 'When a tool re-reads everything each time, every question starts from nothing.',
    how: ['Looked at how current tools read a folder of files', 'Noted what that costs the person asking', 'Looked for a structure both a person and an AI could move through'],
    out: 'That gap is where the concept started.',
  },
  {
    place: 3, stage: 0, title: 'Who it is for', labels: ['Research'],
    desc: 'I defined the person the product is for: someone who doesn’t live in a terminal.',
    why: 'The engineers built the agent system. My job was to give that person a way in.',
    how: ['Asked how someone could see what several agents are doing', 'Asked what would make them comfortable letting the agents work', 'Used those two questions to judge every screen'],
    out: 'The design problem fits in one sentence.',
  },
  // Define
  {
    place: 3, stage: 1, title: 'A folder becomes a map', labels: ['Workflow'],
    desc: 'Telemetric turns the folder into a map of connected notes first, so both you and the AI can move through it quickly.',
    why: 'A pile of text has no shape. Neither a person nor an AI can find their way around it.',
    how: ['Turn the folder into connected notes first', 'Let the notes form a map you can scan at a glance', 'Let the AI move through the same map'],
    out: 'You and the AI work from the same picture of your files.',
  },
  {
    place: 3, stage: 1, title: 'Product concept and end-to-end experience', labels: ['Workflow'],
    desc: 'I defined the product concept and the experience from opening a folder to getting an answer.',
    why: 'The engine existed before the product did. Someone had to decide what a person would actually do with it.',
    how: ['Defined what the product is, in one line: a workspace where your files become a map, and AI agents work on it with you', 'Laid out the experience from start to finish', 'Marked the points where a person needs to see what is happening'],
    out: 'The team had one experience to build toward.',
  },
  {
    place: 3, stage: 1, title: 'Six principles for the experience', labels: ['Workflow'],
    desc: 'I wrote the approach down as six principles.',
    why: 'Working with AI agents is new to most people. The product needed rules for how it treats them.',
    how: ['Turn files into a map you can scan at a glance', 'Give every task its own agent and the right model', 'Show each agent’s work, and let people change it', 'Let people see the value before they set anything up', 'Make finding a note lead straight to asking about it', 'Tell people when the workspace changes, and ask first'],
    out: 'Every screen is designed against the same six principles.',
  },
  // Design
  {
    place: 3, stage: 2, title: 'Agents you can watch working', labels: ['Interaction'],
    desc: 'When you ask a question, several small agents each take one task, and you can see what each one did.',
    why: 'When several agents work at once, a single spinner tells you nothing.',
    how: ['Gave each agent one task', 'Showed each agent while it works', 'Showed what each one produced'],
    out: 'You never have to guess what the system is doing.',
  },
  {
    place: 3, stage: 2, title: 'The interface for the map', labels: ['Interaction'],
    desc: 'I designed the interface where your files appear as connected notes.',
    why: 'A file tree shows where things are stored. It does not show how they connect.',
    how: ['Showed the files as notes that link to each other', 'Made the map readable at a glance', 'Kept it the same map the AI uses'],
    out: 'You can move through your files quickly.',
  },
  {
    place: 3, stage: 2, title: 'Work you can change, not only watch', labels: ['Interaction'],
    desc: 'The interface shows each agent’s work and lets people change it.',
    why: 'Handing work to AI should not mean giving up control of it.',
    how: ['Showed the output of each agent', 'Let people change it', 'Kept the person in charge of the result'],
    out: 'People watch, steer and edit.',
  },
  {
    place: 3, stage: 2, title: 'See the value before setting anything up', labels: ['Interaction'],
    desc: 'People can see what the product does before they are asked to set anything up.',
    why: 'Asking for setup first asks for trust the product has not earned yet.',
    how: ['Let people look around first', 'Let them understand how it works', 'Left the setup decisions for when they are ready'],
    out: 'People see the value first.',
  },
  {
    place: 3, stage: 2, title: 'Finding a note leads to asking about it', labels: ['Interaction'],
    desc: 'Finding a note leads straight to asking about it.',
    why: 'Search and chat are usually separate. You find something in one, then start again in the other.',
    how: ['Made finding and asking one continuous task', 'Let a found note go straight into the question', 'Removed the need to start the search again'],
    out: 'Find something, understand it, then ask about it.',
  },
  // Build
  {
    place: 3, stage: 3, title: 'Working with the engineers on the agent engine', labels: ['Workflow'],
    desc: 'I worked with the two engineers who built the multi-agent engine.',
    why: 'A design the engine cannot support is a picture, not a product.',
    how: ['Learned what the engine can do', 'Shaped the experience around it', 'Kept the design and the engine moving together'],
    out: 'The interface shows what the engine really does.',
  },
  {
    place: 3, stage: 3, title: 'Prototypes and motion', labels: ['Interaction'],
    desc: 'I designed the interface in Figma, and used Framer, After Effects, Rive and Lottie for prototypes and motion.',
    why: 'An experience about watching work happen cannot be judged from still frames.',
    how: ['Designed the screens in Figma', 'Prototyped the interactions', 'Made the motion that shows the agents at work'],
    out: 'The team could see the experience move.',
  },
  {
    place: 3, stage: 3, title: 'Getting ready for beta', labels: ['Workflow'],
    desc: 'Telemetric is coming soon to beta.',
    why: 'A concept only proves itself when people outside the team use it.',
    how: ['Tightening the end-to-end experience', 'Working with the engineers on what ships first', 'Deciding what to learn from the first users'],
    out: 'Coming soon to beta.',
  },
  // Test
  {
    place: 3, stage: 4, title: 'Walking the experience end to end', labels: ['Research'],
    desc: 'I walk the whole experience as a first-time user, from opening a folder to getting an answer.',
    why: 'Screens that work one at a time can still fail as a journey.',
    how: ['Started from nothing, as a new person would', 'Noted every point where I had to stop and think', 'Fixed the gaps between screens'],
    out: 'The experience reads as one continuous task.',
  },
  {
    place: 3, stage: 4, title: 'Every screen checked against the principles', labels: ['Workflow'],
    desc: 'I check each screen against the six principles.',
    why: 'Principles that are only written down are decoration.',
    how: ['Asked of each screen: can I see what the agents are doing?', 'Asked: can I change it?', 'Reworked the screens that failed either question'],
    out: 'The principles show up in the product, not only in the document.',
  },
  {
    place: 3, stage: 4, title: 'Reviews with the engineers', labels: ['Research'],
    desc: 'I review the experience with the two engineers who built the engine.',
    why: 'They know what the agents really do. I know what a person needs to see. Each of us catches what the other misses.',
    how: ['Walked the engineers through the experience', 'Checked that the interface tells the truth about the engine', 'Changed what did not match'],
    out: 'What the interface shows is what is actually happening.',
  },
]
