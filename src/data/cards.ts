import { projects } from './projects'
import type { LawId } from './laws'

/**
 * The cards on the playground board: one piece of work each, written from the resume and the case studies.
 * `place` is the workplace (0 Georgia DHS, 1 Scobin, 2 Wipro, 3 Telemetric) and `stage` the column
 * (0 Research, 1 Define, 2 Design, 3 Build, 4 Test). Every workplace has at least three cards in every stage.
 * The open card reads as a short story: the hook (`desc`), Before (`why`), What I did (`how`), After (`out`) and,
 * where a decision rests on a piece of psychology, Why it works (`law`, and `here`: how it shows up in this work).
 *
 * How these are written, after growth.design's case studies:
 * - `title` is a hook: the question someone was stuck on, or the change in a few words. Never a deliverable's name.
 * - `desc` opens on the moment that was wrong, then says what I did about it. Two or three short sentences.
 * - `why` is what people saw or had to do before. `how` is three short moves. `out` is the number, or the change.
 * - Nothing here is invented: every fact is from the resume or the case studies.
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
  /** the principle the decision leans on, from laws.ts */
  law?: LawId
  /** the principle tied to this piece of work: the moment it explains, in a sentence or two */
  here?: string
  link?: { href: string; name: string }
}

const dso = projects.find((p) => p.slug === 'dso-modernization')!
const scobin = projects.find((p) => p.slug === 'scobin-design-system')!

export const WORK: Work[] = [
  /* ================= Georgia DHS ================= */
  // Research
  {
    place: 0, stage: 0, title: 'The workarounds nobody wrote down', labels: ['Research'], result: '50+ caseworkers and experts',
    desc: 'After years on a legacy system, caseworkers had quiet tricks for getting around it. I sat beside more than 50 of them, and the subject experts, to find those tricks.',
    why: 'The old screens were the only record of how the work was done. The real method lived in workarounds nobody had written down.',
    how: ['Sat beside caseworkers on real cases, and watched before asking', 'Ran workshops with subject experts on the rules behind each step', 'Logged every workaround as a spot where the system failed its user'],
    out: 'The workarounds became the to-do list: what to design first, and what to build first.',
    law: 'curse', here: 'After years on the system, staff no longer noticed their own workarounds. Watching the work surfaced what they would never have thought to mention.',
  },
  {
    place: 0, stage: 0, title: 'One system, three groups who want different things', labels: ['Research'],
    desc: 'The public, agency staff and vendors all use the same system, and they don’t want the same things from it. I interviewed all three to find where they clash.',
    why: 'Some needs pulled against each other. Left alone, those conflicts would have surfaced late, in the middle of the build.',
    how: ['Asked each group what they needed and what got in their way', 'Laid the answers side by side to find the conflicts', 'Took each conflict to the team as a decision to make now'],
    out: 'Each portal started from a written list of what its people needed, with the conflicts already on the table.',
  },
  {
    place: 0, stage: 0, title: 'One file, followed from partner to refund', labels: ['Research'],
    desc: 'A file crosses partner agencies, the bank, the print vendor and the taxpayer. Nobody had a picture of the whole trip. So I drew one.',
    why: 'With no single picture, problems were fixed one screen at a time.',
    how: ['Followed a file from arrival to the moment a check clears', 'Wrote the goal of every step in plain words', 'Marked the pain at each step, then the design that answers it'],
    out: 'The map became the shared reference for what to fix, and in what order.',
  },
  {
    place: 0, stage: 0, title: 'Turning “confusing” into a list', labels: ['Research'],
    desc: 'Staff called the old system slow and confusing. You can’t design against a feeling. So I reviewed it task by task until I had specific failures.',
    why: '“Slow” and “confusing” were both true. Neither said what to fix.',
    how: ['Walked the legacy screens one task at a time', 'Checked each for visible status, user control, and recognition over recall', 'Matched the failures to the workarounds I had seen in the field'],
    out: 'Two failures came up most: efficiency and user control. They shaped the five rules for the redesign.',
  },
  // Define
  {
    place: 0, stage: 1, title: 'Start with the day, not the database', labels: ['Workflow'],
    desc: 'The old system was organized around its own data. To do anything, you first had to know where it lived. I listed what each role actually does in a day, and designed around that.',
    why: 'Before you could do a task, you had to know where the system kept it.',
    how: ['Listed the tasks each role really performs, from the field research', 'Kept what served a task, and quieted or removed the rest', 'Ordered the design work by that list'],
    out: 'It became rule one of the project: start with the work, not the screens.',
  },
  {
    place: 0, stage: 1, title: 'One system became three portals', labels: ['Workflow'], result: 'Task time down about 40%',
    desc: 'Residents, caseworkers and vendors were sharing the same screens and the same words. I gave each role its own portal.',
    why: 'One set of screens was trying to speak to the public, agency staff and outside vendors at once.',
    how: ['Split the system into resident, caseworker and vendor portals', 'Built each around its role’s tasks, in that role’s words', 'Kept the shared parts consistent, so the three feel like one product'],
    out: 'Task time dropped about 40%. Usability scores rose 15%.',
    law: 'mental', here: 'Residents, caseworkers and vendors each describe the work in their own words. Each portal uses its role’s words and task order, so nobody has to translate.',
  },
  {
    place: 0, stage: 1, title: 'Land on the work, not on a menu', labels: ['Workflow'],
    desc: 'Finding a page meant remembering where the old system had put it. I rebuilt each portal’s navigation around tasks, and made the day’s work the first screen.',
    why: 'The menus followed the structure of the old system, not the work.',
    how: ['Grouped pages by the task they belong to', 'Named everything in the words staff already use', 'Made the day’s work the landing page'],
    out: 'People land on the work they came to do.',
    law: 'recognition', here: 'Staff used to recall where a page lived. Now the task they came for is on the first screen, named the way they name it.',
  },
  {
    place: 0, stage: 1, title: 'Four processes, finally connected', labels: ['Workflow'], result: '40% fewer steps',
    desc: 'Claims, hearings, payments and reconciliation are one story. The old system kept them apart, so staff held the connection in their heads. I linked them.',
    why: 'Each process lived on its own. Getting from one to the next was up to memory.',
    how: ['Mapped how each process hands over to the next', 'Linked each one to the next on the page', 'Left one clear path, with no guessing what comes next'],
    out: 'Finishing a process now takes 40% fewer steps.',
    law: 'zeigarnik', here: 'A claim can wait on a hearing for weeks. The links show where it stopped, so staff don’t have to hold that in their heads.',
  },
  {
    place: 0, stage: 1, title: 'A form that only asks what applies', labels: ['Workflow'],
    desc: 'Eligibility for LIHEAP (energy assistance) depends on fuel type, county, vendor and access rules. Shown all at once, it is a wall of fields. I turned it into a flow that reveals only what applies.',
    why: 'Most of the fields on the page did not apply to the person filling it in.',
    how: ['Modeled the eligibility rules as conditional flows', 'Showed only the fields the answers so far make relevant', 'Made each screen permission-aware, so a role sees only what it may'],
    out: 'People answer only the questions that apply to them.',
    law: 'progressive', here: 'Each answer decides which fields appear next. The form never shows a question that cannot apply.',
  },
  {
    place: 0, stage: 1, title: 'Five rules anyone could check a screen against', labels: ['Workflow'],
    desc: 'A project this size is thousands of small decisions made on different days. I wrote five short rules, so every screen could be judged the same way.',
    why: 'Without shared rules, each screen drifts in its own direction.',
    how: ['Start with the work, not the screens', 'Let the screen remember', 'Say what’s happening', 'Make risky things hard and common things easy', 'One system, different people'],
    out: 'Any screen can be checked against the same five rules.',
  },
  // Design
  {
    place: 0, stage: 2, title: 'Accessibility, built into the parts', labels: ['Design system', 'Accessibility'],
    desc: 'Three portals built separately would drift apart. Accessibility bolted on at the end is never complete. I solved both with one set of shared components.',
    why: 'Consistency and accessibility both depended on people remembering to do them.',
    how: ['Defined one set of components for all three portals', 'Built in keyboard navigation, focus order, semantic markup and ARIA', 'Let every screen made from them inherit the WCAG 2.1 AA baseline'],
    out: 'A screen built from the components starts out consistent and accessible.',
    law: 'familiarity', here: 'A table or a button that works the same in all three portals only has to be learned once.',
  },
  {
    place: 0, stage: 2, title: 'Any profile, one search away', labels: ['Interaction'], result: '1 search to find a profile',
    link: dso.link && { href: dso.link.href, name: dso.link.title },
    desc: 'Staff look people up all day, often with someone waiting on the phone. Every lookup meant digging through menus. I put one search on every screen.',
    why: 'Reaching one profile took a trip through the menus, every time.',
    how: ['Put one search on every screen, opened with Ctrl K', 'Searched pages and profiles together, with results as you type', 'Kept it optional: a fast path for experts, ignorable for new staff'],
    out: 'One search finds a profile from anywhere.',
    law: 'discover', here: 'The search box sits on every screen, where people already look. The shortcut is a bonus for staff who do this all day.',
  },
  {
    place: 0, stage: 2, title: 'One person, one page', labels: ['Interaction'], result: '1 view',
    desc: 'A person’s claims, hearings and payments sat on three separate screens. I brought them onto one profile: four totals at the top, seven tabs below.',
    why: 'One record was spread across screens, and a long record was one long page.',
    how: ['Built one profile with four totals and seven tabs', 'Gave intercepts, disbursements and refunds a tab each', 'Broke long records into small groups'],
    out: 'One person’s whole debt story in one place: what was claimed, taken, paid and returned.',
    law: 'chunking', here: 'Four totals and seven tabs break one long record into pieces a person can scan.',
  },
  {
    place: 0, stage: 2, title: 'Is this transfer stuck?', labels: ['Interaction'],
    desc: 'Nobody could tell. A partner feed could fail without a sound. I designed a six-step live checklist that shows where every file is.',
    why: 'A file in transit looked the same whether it was moving or stuck.',
    how: ['Designed a six-step checklist, with logs and timing for each step', 'Showed the health of each partner connection', 'Gave a failed connection a clear next action, such as Retry'],
    out: 'Staff watch a file travel from partner to taxpayer balance without guessing.',
    law: 'labor', here: 'Six named steps show the transfer happening. A spinner would have hidden a stuck file.',
  },
  {
    place: 0, stage: 2, title: 'Hidden until someone asks', labels: ['Interaction'],
    desc: 'Social Security numbers sat on screen even when nobody needed them. I masked every one. Seeing a number now takes a deliberate click, and the click is logged.',
    why: 'Sensitive numbers were visible by default.',
    how: ['Masked every number by default', 'Required a deliberate click to reveal one', 'Logged each reveal'],
    out: 'A Social Security number appears only when someone asks for it.',
    law: 'hawthorne', here: 'Every reveal is logged, and staff know it. That makes opening a number a decision instead of a habit.',
  },
  {
    place: 0, stage: 2, title: 'A menu with only your work in it', labels: ['Interaction'],
    desc: 'Partner-agency staff saw menus for work they never do. I tied the navigation to the role: they see Hearings, and DHS staff see everything.',
    why: 'Partner staff had to look past menus that did not apply to them.',
    how: ['Tied the navigation to the role', 'Showed a partner-agency worker only Hearings', 'Kept the full navigation for DHS staff'],
    out: 'Each person faces only the choices that apply to them.',
    law: 'hicks', here: 'A partner-agency worker needs one area. The full menu only gave them more to rule out before they could start.',
  },
  {
    place: 0, stage: 2, title: 'Did the void go through?', labels: ['Interaction'],
    desc: 'After voiding a check, staff weren’t sure it had worked, or whether the bank knew. I made the void wait for a supervisor, and had the page say so.',
    why: 'The screen went quiet after a void, at the moment staff most needed an answer.',
    how: ['Made a void wait for supervisor approval', 'Said on the page that nothing goes to the bank until then', 'Gave the supervisor one decision: approve or reject'],
    out: 'Nobody is left wondering, and nobody acts too early.',
    law: 'feedback', here: 'Right after the void, the page answers the two things staff were unsure of: it is waiting on a supervisor, and the bank has not been told.',
  },
  {
    place: 0, stage: 2, title: 'A schedule you can’t break', labels: ['Interaction'],
    desc: 'A batch could land on a past date, or be changed on the very day it runs. I locked the dates that can’t work, and put the run-day rule at the top of the page.',
    why: 'The system allowed the mistake, then left staff to discover it.',
    how: ['Locked today and earlier dates', 'Stated the run-day rule at the top of the page', 'Showed the resulting dates before anyone confirms'],
    out: 'The mistake is blocked before it happens.',
    law: 'feedforward', here: 'The rule is stated before anyone picks a date, and the dates are shown before anyone confirms.',
  },
  {
    place: 0, stage: 2, title: 'Tables for the hundredth visit', labels: ['Interaction'],
    desc: 'Staff work in long tables hundreds of times a day. I designed them to sort, filter, resize, and show only the columns each person wants.',
    why: 'Finding the right row was slow, and it was slow every single time.',
    how: ['Added sort and filter', 'Let people resize columns and choose which to show', 'Designed for repeat use, not for the first visit'],
    out: 'Staff shape the table to the task instead of scrolling for the row.',
    law: 'tesler', here: 'Finding a row in a long table is work someone has to do. Sort, filter and column choice move it from the person to the table.',
  },
  {
    place: 0, stage: 2, title: 'Why is this money on hold?', labels: ['Interaction'],
    desc: 'A hold was hard to spot and harder to explain. I added a badge that flags it, and one plain sentence that says why.',
    why: 'The status said what. It never said why.',
    how: ['Put a badge in the header when money is on hold', 'Wrote one sentence: why it’s held, what it waits on, who acts next', 'Used the same word for the same thing everywhere'],
    out: 'Nobody has to ask where the money went.',
    law: 'signifiers', here: 'The badge shows a hold before anyone opens a tab, and the sentence under it says why.',
  },
  // Build
  {
    place: 0, stage: 3, title: 'Specs that cover the hard cases', labels: ['Design system'],
    desc: 'A design that only shows the happy path leaves the hard decisions to whoever builds it. I wrote down the states, rules and edge cases for every screen.',
    why: 'An edge case with no written answer gets decided by whoever hits it first.',
    how: ['Annotated the high-fidelity prototypes', 'Wrote the states, rules and edge cases for each screen', 'Stayed with engineering through the build to answer questions'],
    out: 'Engineers built the edge cases from the spec, not from guesswork.',
  },
  {
    place: 0, stage: 3, title: 'Keyboard and screen reader, part of the spec', labels: ['Accessibility'],
    desc: 'Accessibility left to the end of a build is rarely finished. I specified keyboard, focus and ARIA behavior for every shared component, as part of the component itself.',
    why: 'Left until the end, accessibility becomes a list of fixes that never quite gets done.',
    how: ['Specified keyboard navigation for each shared component', 'Defined a logical focus order', 'Named the semantic markup and ARIA each one needs'],
    out: 'Keyboard and screen-reader support were there from the start.',
  },
  {
    place: 0, stage: 3, title: 'What was built against what was drawn', labels: ['Front-end'],
    desc: 'What gets built is never exactly what was drawn. I compared the built screens with the designs and the accessibility baseline, and worked through the differences with engineering.',
    why: 'The gaps between a design and its build are where usability gets lost.',
    how: ['Compared the built screens with the designs', 'Checked them against the accessibility baseline', 'Worked through the differences with engineering'],
    out: 'The shipped screens match the design intent.',
  },
  // Test
  {
    place: 0, stage: 4, title: 'Tested after every round, not at the end', labels: ['Research'], result: 'Usability scores up 15%',
    desc: 'I didn’t wait for a finished design. Each round, from user flows to prototypes, went in front of the people who do the work.',
    why: 'Each round carried assumptions about how staff work. Only staff could confirm or break them.',
    how: ['Worked in rounds: user flows, wireframes, then annotated prototypes', 'Tested each round with the people who do the work', 'Refined the design before the next round'],
    out: 'Usability scores rose 15%.',
  },
  {
    place: 0, stage: 4, title: 'Proving AA in the real build', labels: ['Accessibility'],
    desc: 'An accessibility baseline on paper proves nothing. I verified it in the Angular and Bootstrap build with axe, WAVE and Lighthouse.',
    why: 'A baseline in a design file says nothing about the product people actually use.',
    how: ['Ran axe, WAVE and Lighthouse against the built screens', 'Worked through what they found with engineering', 'Checked the result against WCAG 2.1 AA'],
    out: 'The baseline is verified in the build, not only in the design.',
  },
  {
    place: 0, stage: 4, title: 'The whole task, without a mouse', labels: ['Accessibility'],
    desc: 'A tool can tell you a label is missing. It can’t tell you whether the page makes sense without a mouse. So I did the main tasks with a keyboard, then with a screen reader.',
    why: 'Automated checks catch only part of the problem.',
    how: ['Completed the main tasks using only a keyboard', 'Checked that focus moves in a logical order and stays visible', 'Listened to the screens with a screen reader'],
    out: 'The portals work for people who do not use a mouse.',
  },

  /* ================= Scobin ================= */
  // Research
  {
    place: 1, stage: 0, title: 'Five dropdowns in one product', labels: ['Design system'], result: '5 dropdowns, 3 buttons, 4 error styles',
    desc: 'Before designing anything, I went through the product screen by screen. I found five dropdown patterns, three primary buttons and four ways to show an error.',
    why: 'Each component worked on its own. Together they made the product unpredictable.',
    how: ['Collected every recurring UI element', 'Compared how each one looked and behaved', 'Asked what each variation was actually for'],
    out: 'I knew where one well-defined component could replace several competing ones.',
    law: 'similarity', here: 'Controls that did the same job looked and behaved in five different ways, so nothing learned on one screen carried to the next.',
  },
  {
    place: 1, stage: 0, title: '“Which one should I use?”', labels: ['Research'],
    desc: 'I interviewed the designers, developers and employees who used the interface. I didn’t ask what they wanted. I asked them to show me where they got stuck.',
    why: 'Everyone knew the inconsistencies cost time. Nobody knew where.',
    how: ['Had each person walk me through recent work', 'Noted every point where they stopped to figure something out', 'Heard three questions again and again: Which one should I use? What if there’s no data, or something goes wrong? Can everyone reach it, including with a keyboard?'],
    out: 'The real problem: the team had no shared reference for making consistent decisions.',
    law: 'curse', here: 'I asked for a walk through real work instead of a feature list, because people can’t report the gaps they have stopped noticing.',
  },
  {
    place: 1, stage: 0, title: 'The same question, asked on every screen', labels: ['Research'],
    desc: 'I followed one screen from first layout to review, and wrote down what stopped each step. The same small questions kept stopping it.',
    why: 'Each question was settled in a conversation, then settled again on the next screen.',
    how: ['Followed a screen through design, build and review', 'Recorded the question that stopped each step', 'Matched each question to the part of the system that should answer it'],
    out: 'I knew what the library had to carry: behavior, states and usage rules, there when someone needs them.',
    law: 'tesler', here: 'Someone has to decide how a component behaves. Undocumented, that decision fell on every designer and developer, on every screen.',
  },
  {
    place: 1, stage: 0, title: 'Evidence for what to fix first', labels: ['Research'], result: 'Adoption up 20% in three months',
    desc: 'Stakeholders had to choose what to fix first, and had nothing to choose with. I turned customer feedback, observation and competitive analysis into recommendations.',
    why: 'There was more to fix than time to fix it.',
    how: ['Gathered customer feedback and observed how people used the product', 'Compared the product with its competitors', 'Turned the findings into recommendations, with the tradeoffs laid out'],
    out: 'Adoption grew 20% in three months.',
  },
  // Define
  {
    place: 1, stage: 1, title: 'Three questions every component must answer', labels: ['Design system'],
    desc: 'A library of good-looking components would have fixed nothing. People were stuck on decisions. So I made the three interview questions the test for every component.',
    why: 'People weren’t stuck on drawing. They were stuck on deciding.',
    how: ['Which one should I use? Each page says when to use it and when to avoid it', 'What if something goes wrong? Properties and states are documented on each component', 'Can everyone reach it? Keyboard, focus and ARIA rules are on each page'],
    out: 'Every component answers the questions people would otherwise have to ask.',
    law: 'recognition', here: 'The answer sits on the component’s page, so nobody has to remember a decision made in a meeting.',
  },
  {
    place: 1, stage: 1, title: 'Which blue means “information”?', labels: ['Design system'], result: '548 variables',
    desc: 'Nobody should have to remember. I organized 548 variables into three layers, so a component asks for a meaning and never for a raw color.',
    why: 'Designers and developers had to remember which raw value went where.',
    how: ['Primitives hold the raw values', 'Routing decides how those values adapt to different contexts', 'Applied tokens give them a role, and components reference only these'],
    out: 'A component asks for the meaning of a value, not a hardcoded color.',
    law: 'load', here: 'Nobody has to remember which blue means “information”. The token’s name says it.',
  },
  {
    place: 1, stage: 1, title: 'One dropdown instead of five', labels: ['Design system'],
    desc: 'Five dropdowns in one product is five different experiences. Before designing any component, I decided which ones the product actually needed.',
    why: 'Several versions of the same control were competing across screens.',
    how: ['Looked at the purpose behind each variation', 'Kept the differences that served a real need', 'Replaced the rest with one defined component per pattern'],
    out: 'The same control behaves the same way on every screen.',
    law: 'familiarity', here: 'Once someone has used the dropdown on one screen, they already know it on all the others.',
  },
  {
    place: 1, stage: 1, title: 'From findings to a plan people agreed on', labels: ['Workflow'],
    desc: 'The research found more to fix than the team could take on at once. I turned it into specific recommendations, with the tradeoffs of each, and agreed the order with stakeholders.',
    why: 'Findings alone don’t say what to do first.',
    how: ['Turned the findings into specific recommendations', 'Laid out the tradeoffs of each one', 'Agreed the priorities with stakeholders'],
    out: 'The team knew what to build first, and why.',
  },
  // Design
  {
    place: 1, stage: 2, title: 'Layout first, in grey', labels: ['Interaction'],
    desc: 'I wireframed the whole app shell in grayscale before choosing a single color, so the structure had to make sense on its own.',
    why: 'Color can hide a weak layout.',
    how: ['Broke the shell into header, navigation, breadcrumbs, page titles and content cards', 'Worked out how the pieces relate before deciding how they look', 'Turned those structures into reusable layout components'],
    out: 'The wireframe became the Dashboard sample screen.',
    law: 'occam', here: 'If the layout reads in grey, it doesn’t need color to explain it.',
  },
  {
    place: 1, stage: 2, title: 'Colors named for their job', labels: ['Design system'], result: '216 semantic tokens',
    desc: 'A raw color name says what it looks like, not when to use it. I named 216 semantic variables for their role: intent, text, links and surfaces.',
    why: 'Nothing in a color’s name told you where it belonged.',
    how: ['Named each token for its role in the interface', 'Documented the tokens in tables, so nobody has to guess', 'Left room for future themes without redesigning the components'],
    out: 'A theme can change without any component being redesigned.',
    law: 'signifiers', here: 'A token named for its role tells you when to use it. A hex value never does.',
  },
  {
    place: 1, stage: 2, title: 'Type that survives a small screen', labels: ['Design system'], result: '95 text styles',
    desc: 'Fixed font sizes break on small screens. I built 95 text styles in five categories that adapt across five responsive modes.',
    why: 'Resizing type by hand broke the hierarchy.',
    how: ['Organized the styles by role, not by size', 'Defined five responsive modes, from Mobile to Desktop Large', 'Let each mode set font size, line height and letter spacing'],
    out: 'The hierarchy stays familiar on every screen size.',
  },
  {
    place: 1, stage: 2, title: 'One button, 60 variants', labels: ['Interaction', 'Design system'], result: '60 variants',
    desc: 'A button isn’t finished when it looks good at rest. I built it in 4 types, 3 sizes and 5 states, and each state answers a question the user has.',
    why: 'Components were drawn in their default state. What happened on hover, on focus or when disabled was left to whoever built the screen.',
    how: ['Default and Hover say it’s interactive, and Pressed confirms the click', 'Focus shows where the keyboard is, using a shared Focus Ring', 'Disabled says the action isn’t available yet'],
    out: 'Every state of the button is defined before anyone builds it.',
    law: 'feedback', here: 'Hover says “you can click this”, Pressed says “you did”, and Focus says “the keyboard is here”.',
  },
  {
    place: 1, stage: 2, title: 'Dense screens you can actually read', labels: ['Interaction'], result: 'Task time down 35%, errors down 40%',
    desc: 'The inventory screens showed everything at once, and people had to remember what it all meant. I reworked them so detail appears when it’s needed.',
    why: 'Every value was on screen at the same time, at the same volume.',
    how: ['Showed detail only when it is needed, instead of all at once', 'Used visual hierarchy so people recognise what matters', 'Kept system status visible'],
    out: 'Task time fell 35%. Manual errors fell 40%.',
    law: 'progressive', here: 'The screens used to show every value at once. Now detail arrives when someone asks for it.',
  },
  {
    place: 1, stage: 2, title: 'What if there’s no data?', labels: ['Interaction'],
    desc: 'It was one of the three questions people kept asking. I designed the empty, loading and error states, plus status chips, and documented each one.',
    why: 'Nobody knew what a screen should show with no data, or when something failed.',
    how: ['Designed status chips that read at a glance', 'Designed the empty, loading and error states', 'Documented them, so they are built the same way every time'],
    out: 'System status stays visible on every screen.',
    law: 'negativity', here: 'An empty or broken screen is where people decide a product can’t be trusted, so each one got a designed state.',
  },
  // Build
  {
    place: 1, stage: 3, title: 'Who owns this component?', labels: ['Design system'],
    desc: 'Design and engineering each had their own version of a component, and nobody owned the answer. I defined the spec and agreed the owners.',
    why: 'Two versions of the truth, and no one responsible for either.',
    how: ['Defined what a component spec includes', 'Agreed who owns each component, across design and engineering', 'Made the design system the single source of truth for both'],
    out: 'Handoff stopped needing a second round of questions.',
  },
  {
    place: 1, stage: 3, title: 'Every component, the same page', labels: ['Design system'], result: '41 documented components',
    desc: 'Someone opening the library for the first time should find answers without me. I documented all 41 components on one page structure.',
    why: 'A library that needs its author to explain it doesn’t scale past the author.',
    how: ['Used one structure: variants, properties, states, when to use it, when to avoid it, accessibility', 'Described behavior, not only looks: the Accordion page covers keyboard, focus and ARIA', 'Said when not to use a pattern, such as nesting accordions'],
    out: 'Another designer or developer can use each component correctly.',
  },
  {
    place: 1, stage: 3, title: 'The documentation needed a system too', labels: ['Design system'],
    desc: 'A library this size needs a structure of its own, or it becomes hard to navigate. I built the reusable pieces it is documented with.',
    why: 'Without its own structure, a large library gets harder to navigate and maintain with every page.',
    how: ['Built a four-level heading system, and seven status labels from Stable to Deprecated', 'Made reusable annotation notes, token table rows and color swatches', 'Kept documentation-only colors in a separate Figma-only collection'],
    out: 'The library is easier to maintain and navigate.',
  },
  // Test
  {
    place: 1, stage: 4, title: 'Contrast you can see while choosing', labels: ['Accessibility'], result: '4.63:1 on Scobin Blue 600',
    desc: 'Contrast was checked at the end of a design, if at all. I built a board that shows the ratio of every color pairing, and outlines the ones that fail.',
    why: 'By the time anyone checked contrast, the colors were already chosen.',
    how: ['Measured each pairing against WCAG: 4.5:1 for body text, 3:1 for large text and for UI elements', 'Marked the failing combinations', 'Placed the board beside the color system, where the choices are made'],
    out: 'A designer sees whether a pairing passes while choosing it.',
    law: 'spark', here: 'The ratio sits next to the swatch, so the accessible choice takes no extra step.',
  },
  {
    place: 1, stage: 4, title: 'Try the button, don’t imagine it', labels: ['Interaction'],
    desc: 'You can’t judge how a button behaves from a still frame. I wired Hover and Pressed as Figma prototype interactions, so reviewers can try them.',
    why: 'Design reviews were judging behavior from still frames.',
    how: ['Connected Hover and Pressed through prototype interactions', 'Used the working prototype in design reviews', 'Spent the review on the design problem, not on settled details'],
    out: 'Reviewers try the interaction instead of imagining it.',
  },
  {
    place: 1, stage: 4, title: 'Used by 120+ people, without me', labels: ['Design system'], result: '120+ people use it',
    link: scobin.figma ? { href: scobin.figma, name: 'Open the Figma file' } : undefined,
    desc: 'A design system only works if people keep using it after its author steps away. More than 120 people use this one today.',
    why: 'A system that needs its author in the room stops when the author leaves.',
    how: ['Built it to be used and maintained without me explaining it', 'Made each decision easy to find at the moment it is needed', 'Made it the single source of truth for design and engineering'],
    out: 'More than 120 people use it.',
  },

  /* ================= Wipro ================= */
  // Research
  {
    place: 2, stage: 0, title: 'In the room before handoff', labels: ['Research'],
    desc: 'A developer who first sees a design at handoff can only build it or push back. I joined the wireframe and prototype reviews, while the design could still change.',
    why: 'By handoff, a design is already expensive to change.',
    how: ['Read the UX specs and asked what each screen was for', 'Asked how the design should behave with real data and with errors', 'Raised what would be hard or slow to build'],
    out: 'Problems were found while they were still cheap to fix.',
  },
  {
    place: 2, stage: 0, title: 'Errors that left people stuck', labels: ['Research'],
    desc: 'A rejected form said something was wrong. It didn’t say what, or how to fix it. I collected every error the browser and the server could return, and checked what each one showed.',
    why: 'Some errors gave people no way forward.',
    how: ['Collected the errors the client and the server could return', 'Checked what each one showed the user', 'Noted which ones gave no way forward'],
    out: 'I had a clear list of the messages to rewrite.',
    law: 'negativity', here: 'A rejected form is the moment people remember. It was also the moment the screen said the least.',
  },
  {
    place: 2, stage: 0, title: 'Where the first seconds went', labels: ['Front-end'],
    desc: 'You can’t make a page faster until you know where the time goes. Before changing anything, I looked at what the first screen loaded, and when.',
    why: 'Nobody had looked at what the first screen was waiting on.',
    how: ['Looked at what the first screen really needed', 'Found code that could load later', 'Found assets that could be smaller'],
    out: 'I knew which changes would matter.',
    law: 'chrono', here: 'Waiting with nothing on screen feels longer than it is, so I started with what the first screen could do without.',
  },
  // Define
  {
    place: 2, stage: 1, title: 'Never just a no', labels: ['Workflow'],
    desc: 'A constraint found during the build costs a redesign. Found in a review, it costs a conversation. I raised them in reviews, each with another way to do it.',
    why: 'A technical limit discovered mid-build means redesigning under pressure.',
    how: ['Said what the framework and the data could and could not do', 'Offered an alternative each time, not only a no', 'Agreed the change with designers, clients and engineers'],
    out: 'Designs changed before they were expensive to change.',
  },
  {
    place: 2, stage: 1, title: 'One pattern for every error', labels: ['Interaction'],
    desc: 'Each form handled errors its own way. I defined one pattern: what went wrong, where, and how to recover.',
    why: 'The same mistake looked different from one form to the next.',
    how: ['Put the message inline, next to the field it concerns', 'Wrote it as an action the person can take', 'Used the same pattern for client and server errors'],
    out: 'One pattern for every error, on every form.',
    law: 'familiarity', here: 'An error that looks and reads the same on every form only has to be understood once.',
  },
  {
    place: 2, stage: 1, title: 'Build it once', labels: ['Front-end'],
    desc: 'When every screen is built from scratch, the same pattern comes out slightly different each time. I read across the specs for repeats, and made each one a component.',
    why: 'The same pattern was at risk of being built several times, several ways.',
    how: ['Read across the UX specs for repeated patterns', 'Defined each one as a component', 'Planned the screens around those components'],
    out: 'The same pattern looks and behaves the same wherever it appears.',
    law: 'similarity', here: 'People expect two things that look alike to work alike. Building the pattern once guarantees it.',
  },
  // Design
  {
    place: 2, stage: 2, title: 'Errors you can recover from', labels: ['Front-end', 'Interaction'],
    desc: 'A raw validation error tells you that you failed. It doesn’t help you succeed. I rewrote them as inline messages that say what to do next.',
    why: 'People were told they had failed, and not what to change.',
    how: ['Moved each message inline, next to the field it concerns', 'Rewrote each one as an action the person can take', 'Added a recovery step to the messages that had none'],
    out: 'People can see what went wrong, where, and how to fix it.',
    law: 'feedback', here: 'The message appears beside the field and says what to do next, so people fix the input instead of resubmitting it.',
  },
  {
    place: 2, stage: 2, title: 'The widths the spec didn’t show', labels: ['Front-end'],
    desc: 'A spec shows a few screen sizes. The browser has all of them. I worked out how each layout behaves in between.',
    why: 'Layouts were defined at a few sizes and undefined everywhere else.',
    how: ['Decided how each layout reflows between the sizes in the spec', 'Checked the awkward widths in between', 'Took questions back to the designers when the spec did not cover a case'],
    out: 'The interfaces work across screen sizes.',
  },
  {
    place: 2, stage: 2, title: 'Two versions, one difference', labels: ['Interaction'],
    desc: 'The team wanted evidence, not opinions, about which design worked better. I built the A/B variations so they differ in one thing only.',
    why: 'If two versions differ in several ways, the test can’t say which one mattered.',
    how: ['Worked with the team on what to compare', 'Kept the difference between versions to the one thing being tested', 'Kept both versions equally fast and stable'],
    out: 'The results could be trusted, because only one thing differed.',
  },
  // Build
  {
    place: 2, stage: 3, title: 'From spec to working screen', labels: ['Front-end'],
    desc: 'A spec shows how a screen should look. The browser decides how it behaves. I built the UX specs as responsive Angular interfaces, and went back to the designers whenever the two disagreed.',
    why: 'A spec can’t cover everything the browser does with real data and real screen sizes.',
    how: ['Built each spec as an Angular interface', 'Made every screen responsive', 'Went back to the designers whenever the spec and the browser disagreed'],
    out: 'What shipped matched what was designed.',
  },
  {
    place: 2, stage: 3, title: 'Fix it once, fixed everywhere', labels: ['Front-end'],
    desc: 'Copied code drifts, and a fix in one place never reaches the others. I built each repeated pattern as one reusable Angular component.',
    why: 'A fix made on one screen stayed on that screen.',
    how: ['Built each repeated pattern as a reusable component', 'Used the components across screens', 'Fixed a problem once, in the component'],
    out: 'Consistent screens, and less code to maintain.',
  },
  {
    place: 2, stage: 3, title: 'One error voice, client and server', labels: ['Front-end', 'Interaction'],
    desc: 'People don’t care which side rejected their input. They only see two errors that look different. I handled both in one place, so they show the same way.',
    why: 'An error from the server looked different from one caught in the browser.',
    how: ['Handled server and client validation in the same place', 'Showed both inline, next to the field', 'Gave both the step that fixes them'],
    out: 'An error looks and reads the same wherever it comes from.',
    law: 'similarity', here: 'People don’t know which side rejected their input. Two error styles read as two different problems.',
  },
  {
    place: 2, stage: 3, title: 'Load only what the first screen needs', labels: ['Front-end'],
    desc: 'People judge a portal in its first seconds. I sped up the initial load with lazy loading, code splitting and asset optimization.',
    why: 'The first screen was waiting on more than it needed.',
    how: ['Lazy loading: a part of the app loads only when it is needed', 'Code splitting: the code arrives in smaller pieces', 'Asset optimization: smaller images and files'],
    out: 'The first screen loads only what it needs. The rest arrives when it is used.',
    law: 'chrono', here: 'The first seconds are spent on the screen people came for, not on code for screens they have not opened.',
  },
  // Test
  {
    place: 2, stage: 4, title: 'Did it actually work better?', labels: ['Research'], result: 'Engagement up 15%, conversion up 10%',
    desc: 'A change that feels better isn’t always one that works better. I contributed to A/B tests on two client portals to find out.',
    why: 'Without a test, “better” was an opinion.',
    how: ['Ran two versions side by side on two client portals', 'Compared engagement and conversion between them', 'Kept what performed better'],
    out: 'Engagement rose 15%. Conversion rose 10%.',
  },
  {
    place: 2, stage: 4, title: 'Does the build match the spec?', labels: ['Front-end'],
    desc: 'Small differences from the spec add up to an interface that feels off. I compared each built screen with its spec, at different sizes, before calling it done.',
    why: 'No single difference is a bug, but together they change how the product feels.',
    how: ['Compared each built screen with its spec', 'Checked it at different screen sizes', 'Reviewed the result with the designers'],
    out: 'The designers recognised their design in the browser.',
  },
  {
    place: 2, stage: 4, title: 'Breaking every form on purpose', labels: ['Interaction'],
    desc: 'Error paths are the ones nobody tests and everybody remembers. I triggered every validation error on purpose, to check the message and the way out.',
    why: 'An error message that was never triggered was never checked.',
    how: ['Triggered each client-side error', 'Triggered each server-side error', 'Checked that the message appeared inline, with a recovery step that works'],
    out: 'Every error has a way forward.',
  },

  /* ================= Telemetric ================= */
  // Research
  {
    place: 3, stage: 0, title: 'It worked, if you lived in a terminal', labels: ['Research'],
    desc: 'A friend was building a game with several AI models, each with its own job, all run from a terminal. I got more interested in the person using it than in the models.',
    why: 'The setup was capable, but only for someone comfortable in a terminal.',
    how: ['Watched how the setup worked, and where it was hard to follow', 'Asked what the person using it would need to see', 'Turned that into the question behind the product'],
    out: 'The question: how does someone who doesn’t live in a terminal see what several agents are doing?',
    law: 'curse', here: 'The setup made sense to the person who built it. I looked at it as someone who hadn’t.',
  },
  {
    place: 3, stage: 0, title: 'Every question starts from zero', labels: ['Research'],
    desc: 'Most AI tools treat a folder as a pile of text, and read it again for every question. I looked at what that costs the person asking.',
    why: 'When a tool re-reads everything each time, nothing it learned about your files carries over.',
    how: ['Looked at how current tools read a folder of files', 'Noted what that costs the person asking', 'Looked for a structure both a person and an AI could move through'],
    out: 'That gap is where the concept started.',
  },
  {
    place: 3, stage: 0, title: 'For people who don’t live in a terminal', labels: ['Research'],
    desc: 'The engineers built the agent system. My job was to give one person a way in: someone who doesn’t live in a terminal.',
    why: 'The system had builders. It didn’t have a user yet.',
    how: ['Asked how someone could see what several agents are doing', 'Asked what would make them comfortable letting the agents work', 'Used those two questions to judge every screen'],
    out: 'The design problem fits in one sentence.',
  },
  // Define
  {
    place: 3, stage: 1, title: 'A folder becomes a map', labels: ['Workflow'],
    desc: 'A pile of text has no shape. Neither a person nor an AI can find their way around it. So the folder becomes a map of connected notes first.',
    why: 'A folder of files shows where things are stored, and nothing about how they relate.',
    how: ['Turn the folder into connected notes first', 'Let the notes form a map you can scan at a glance', 'Let the AI move through the same map'],
    out: 'You and the AI work from the same picture of your files.',
    law: 'mental', here: 'People already think of their notes as things that connect. A map shows that. A file tree only shows where things are stored.',
  },
  {
    place: 3, stage: 1, title: 'From an engine to a product', labels: ['Workflow'],
    desc: 'The engine existed before the product did. I defined what a person would actually do with it, from opening a folder to getting an answer.',
    why: 'There was technology, and no decided experience around it.',
    how: ['Defined the product in one line: a workspace where your files become a map, and AI agents work on it with you', 'Laid out the experience from start to finish', 'Marked the points where a person needs to see what is happening'],
    out: 'The team had one experience to build toward.',
  },
  {
    place: 3, stage: 1, title: 'Six rules for working with agents', labels: ['Workflow'],
    desc: 'Working with AI agents is new to most people. I wrote six principles for how the product treats the person using it.',
    why: 'Without rules, each screen would decide for itself how much to show and how much to ask.',
    how: ['Turn files into a map you can scan at a glance', 'Give every task its own agent and the right model', 'Show each agent’s work, and let people change it', 'Let people see the value before they set anything up', 'Make finding a note lead straight to asking about it', 'Tell people when the workspace changes, and ask first'],
    out: 'Every screen is designed against the same six principles.',
  },
  // Design
  {
    place: 3, stage: 2, title: 'Watch the agents work', labels: ['Interaction'],
    desc: 'When several agents work at once, a spinner tells you nothing. I designed a panel that shows each agent, its one task, and what it produced.',
    why: 'One spinner stood in for several agents doing different things.',
    how: ['Gave each agent one task', 'Showed each agent while it works', 'Showed what each one produced'],
    out: 'You never have to guess what the system is doing.',
    law: 'labor', here: 'Each agent shows its task and its result as it works, so the wait reads as progress.',
  },
  {
    place: 3, stage: 2, title: 'Your files, as connected notes', labels: ['Interaction'],
    desc: 'A file tree shows where things are stored. It doesn’t show how they connect. I designed the interface where your files appear as notes that link to each other.',
    why: 'In a file tree, the connections between files are invisible.',
    how: ['Showed the files as notes that link to each other', 'Made the map readable at a glance', 'Kept it the same map the AI uses'],
    out: 'You can follow the same path through your files that the AI took.',
  },
  {
    place: 3, stage: 2, title: 'Edit the answer, and the work runs again', labels: ['Interaction'],
    desc: 'Handing work to AI shouldn’t mean giving up control of it. You can edit any agent’s output or instruction, and the agents run again from that point.',
    why: 'Watching is not the same as being in charge.',
    how: ['Showed the output of each agent', 'Let people edit an output or change an instruction', 'Had the agents run again from that point'],
    out: 'People watch, steer and edit.',
    law: 'endowment', here: 'Once someone has edited an output, the result is their work, not something handed to them.',
  },
  {
    place: 3, stage: 2, title: 'See it work before you set it up', labels: ['Interaction'],
    desc: 'Asking for setup first asks for trust the product hasn’t earned yet. I put a demo workspace, Atlas Migration, right after onboarding.',
    why: 'Setup came before any reason to bother with it.',
    how: ['Opened the Atlas Migration demo workspace right after onboarding', 'Let people look around and follow the workflow there', 'Left the setup decisions for when they are ready'],
    out: 'People understand the product before they are asked to configure it.',
    law: 'aha', here: 'The first thing people meet is the product working on a real example, not a settings form.',
  },
  {
    place: 3, stage: 2, title: 'Find a note, then ask about it', labels: ['Interaction'],
    desc: 'Search and chat are usually separate. You find something in one, then start again in the other. I joined them: a found note becomes a chip in the chat.',
    why: 'Finding something and asking about it were two separate trips.',
    how: ['Search returns result cards from the map', 'A card can be added to the chat as a removable chip', 'The composer switches to “Ask about these notes”'],
    out: 'No copying text, remembering a filename or searching again.',
    law: 'spark', here: 'One click turns a found note into a chip in the chat, so asking is the easy next step.',
  },
  // Build
  {
    place: 3, stage: 3, title: 'Designing around a real engine', labels: ['Workflow'],
    desc: 'A design the engine can’t support is a picture, not a product. I worked with the two engineers who built the multi-agent engine, and shaped the experience around what it can do.',
    why: 'An interface that promises more than the engine does would mislead the person using it.',
    how: ['Learned what the engine can do', 'Shaped the experience around it', 'Kept the design and the engine moving together'],
    out: 'The interface shows what the engine really does.',
  },
  {
    place: 3, stage: 3, title: 'Motion you can judge', labels: ['Interaction'],
    desc: 'An experience about watching work happen can’t be judged from still frames. I designed in Figma, and built prototypes and motion in Framer, After Effects, Rive and Lottie.',
    why: 'Still frames can’t show what it feels like to watch agents work.',
    how: ['Designed the screens in Figma', 'Prototyped the interactions', 'Made the motion that shows the agents at work'],
    out: 'The team could see the experience move.',
  },
  {
    place: 3, stage: 3, title: 'Getting ready for beta', labels: ['Workflow'],
    desc: 'A concept only proves itself when people outside the team use it. I’m tightening the end-to-end experience for the beta.',
    why: 'So far, only the people who made it have used it.',
    how: ['Tightening the end-to-end experience', 'Working with the engineers on what ships first', 'Deciding what to learn from the first users'],
    out: 'Coming soon to beta.',
  },
  // Test
  {
    place: 3, stage: 4, title: 'Walking it as a first-time user', labels: ['Research'],
    desc: 'Screens that work one at a time can still fail as a journey. I walk the whole experience as a new person would, from opening a folder to getting an answer.',
    why: 'The gaps are between the screens, where no single design file shows them.',
    how: ['Started from nothing, as a new person would', 'Noted every point where I had to stop and think', 'Fixed the gaps between screens'],
    out: 'The experience reads as one continuous task.',
  },
  {
    place: 3, stage: 4, title: 'Does this screen pass the six rules?', labels: ['Workflow'],
    desc: 'Principles that are only written down change nothing on the screen. I check each screen against the six, and rework the ones that fail.',
    why: 'A principle nobody checks against is only a sentence.',
    how: ['Asked of each screen: can I see what the agents are doing?', 'Asked: can I change it?', 'Reworked the screens that failed either question'],
    out: 'The principles show up in the product, not only in the document.',
  },
  {
    place: 3, stage: 4, title: 'Does the interface tell the truth?', labels: ['Research'],
    desc: 'The engineers know what the agents really do. I know what a person needs to see. We review the experience together, and each of us catches what the other misses.',
    why: 'An interface can look right and still misreport what is happening underneath.',
    how: ['Walked the engineers through the experience', 'Checked that the interface tells the truth about the engine', 'Changed what did not match'],
    out: 'What the interface shows is what is actually happening.',
  },
]
