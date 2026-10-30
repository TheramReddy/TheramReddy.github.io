import { Defs } from './Diagrams'
import { ChapterBlock, type Chapter } from './ScobinStory'

/** Files go through the agents into a vault, which you access, search, explore and edit. */
function Vault() {
  const uses = ['Access', 'Search', 'Explore', 'See outputs']
  return (
    <svg viewBox="0 0 640 330" role="img" aria-label="Files go through the agents into a vault of Markdown notes and a graph, which you can access, search, explore and see outputs from, and edit to send changes back">
      <Defs id="arr-vault" />
      {['PDF', 'notes', 'docs'].map((t, i) => (
        <g key={t}>
          <rect x="10" y={20 + i * 34} width="70" height="28" rx="3" className="d-box" />
          <text x="45" y={39 + i * 34} textAnchor="middle" className="d-dim">{t}</text>
        </g>
      ))}
      <path d="M90 66 H150" className="d-line" markerEnd="url(#arr-vault)" />
      <rect x="160" y="30" width="150" height="72" rx="4" className="d-box" />
      <text x="235" y="72" textAnchor="middle" className="d-label">Agents</text>
      <path d="M320 66 H380" className="d-line" markerEnd="url(#arr-vault)" />
      <rect x="390" y="20" width="240" height="92" rx="6" className="d-line" />
      <rect x="404" y="52" width="100" height="46" rx="3" className="d-box" />
      <text x="454" y="80" textAnchor="middle" className="d-dim">Markdown</text>
      <rect x="516" y="52" width="100" height="46" rx="3" className="d-box" />
      <text x="566" y="80" textAnchor="middle" className="d-dim">Graph</text>
      <text x="510" y="42" textAnchor="middle" className="d-small">the vault</text>
      <path d="M510 114 V150" className="d-line d-dash" markerEnd="url(#arr-vault)" />
      {uses.map((t, i) => (
        <g key={t}>
          <rect x={10 + i * 158} y="160" width="140" height="56" rx="4" className="d-box" />
          <text x={80 + i * 158} y="193" textAnchor="middle" className="d-label">{t}</text>
        </g>
      ))}
      <path d="M80 226 V262 H235 V108" className="d-line d-dash" markerEnd="url(#arr-vault)" />
      <text x="320" y="300" textAnchor="middle" className="d-label d-em">Search it. Edit it. Don’t re-ask it.</text>
    </svg>
  )
}

const crew: { name: string; job: string }[] = [
  { name: 'Converter', job: 'files to Markdown' },
  { name: 'Structurer', job: 'gives notes shape' },
  { name: 'Linker', job: 'connects ideas' },
  { name: 'Organizer', job: 'files everything' },
]

/** Four named specialists, with one opened up for detail. */
function Crew() {
  return (
    <svg viewBox="0 0 640 330" role="img" aria-label="Four agents in a row, Converter, Structurer, Linker and Organizer, with one opened to show its model, tools, activity and outputs you can edit">
      <Defs id="arr-crew" />
      {crew.map((a, i) => (
        <g key={a.name}>
          <rect x={10 + i * 158} y="30" width="132" height="64" rx="4" className="d-box" />
          <text x={76 + i * 158} y="68" textAnchor="middle" className="d-note">{a.name}</text>
          <text x={76 + i * 158} y="124" textAnchor="middle" className="d-dim">{a.job}</text>
          {i < 3 && <path d={`M${144 + i * 158} 62 H${166 + i * 158}`} className="d-line" markerEnd="url(#arr-crew)" />}
        </g>
      ))}
      <path d="M326 134 V196" className="d-line d-dash" markerEnd="url(#arr-crew)" />
      <rect x="170" y="200" width="300" height="108" rx="4" className="d-box" />
      <text x="190" y="232" className="d-label">Linker</text>
      <text x="190" y="262" className="d-dim">model · tools</text>
      <text x="190" y="286" className="d-dim">activity · outputs, editable in place</text>
    </svg>
  )
}

/** Working, paused, and waiting on the person. */
function Control() {
  const states = [['Working', 'agent running'], ['Paused', 'progress kept'], ['Needs review', 'waiting on you']]
  return (
    <svg viewBox="0 0 640 280" role="img" aria-label="An agent moves from working to paused to needs review, and can be continued from paused">
      <Defs id="arr-control" />
      {states.map(([t, n], i) => (
        <g key={t}>
          <rect x={10 + i * 220} y="30" width="180" height="64" rx="4" className="d-box" />
          <text x={100 + i * 220} y="70" textAnchor="middle" className="d-label">{t}</text>
          <text x={100 + i * 220} y="124" textAnchor="middle" className="d-dim">{n}</text>
        </g>
      ))}
      <path d="M194 62 H226" className="d-line" markerEnd="url(#arr-control)" />
      <path d="M414 62 H446" className="d-line" markerEnd="url(#arr-control)" />
      <path d="M320 150 Q215 205 100 150" className="d-line d-dash" markerEnd="url(#arr-control)" />
      <text x="210" y="214" textAnchor="middle" className="d-small">continue</text>
      <text x="320" y="260" textAnchor="middle" className="d-label d-em">pause · stop · redirect · review</text>
    </svg>
  )
}

/** Four skippable steps, with the demo workspace as a way around them. */
function Onboarding() {
  return (
    <svg viewBox="0 0 640 300" role="img" aria-label="Four skippable setup steps, with a demo workspace that lets someone look around first">
      <Defs id="arr-onboard" />
      <path d="M108 70 H212 M268 70 H372 M428 70 H532" className="d-line" />
      {[1, 2, 3, 4].map((n, i) => (
        <g key={n}>
          <circle cx={80 + i * 160} cy="70" r="28" className="d-box" />
          <text x={80 + i * 160} y="79" textAnchor="middle" className="d-label">{n}</text>
          <text x={80 + i * 160} y="130" textAnchor="middle" className="d-dim">skip</text>
        </g>
      ))}
      <path d="M320 150 V196" className="d-line d-dash" markerEnd="url(#arr-onboard)" />
      <rect x="170" y="200" width="300" height="72" rx="4" className="d-box" />
      <text x="320" y="233" textAnchor="middle" className="d-label">Demo workspace</text>
      <text x="320" y="258" textAnchor="middle" className="d-dim">look around, set up later</text>
    </svg>
  )
}

/** Search, preview, then the note attached to the chat composer. */
function Handoff() {
  const panels = [['Find', 10], ['Understand', 225], ['Ask', 440]] as const
  return (
    <svg viewBox="0 0 640 290" role="img" aria-label="Find a note in search, read its context in a preview, then add it to chat and ask about it">
      <Defs id="arr-handoff" />
      {panels.map(([t, x]) => (
        <g key={t}>
          <rect x={x} y="30" width="190" height="190" rx="5" className="d-box" />
          <text x={x + 95} y="258" textAnchor="middle" className="d-small">{t}</text>
        </g>
      ))}
      <rect x="22" y="42" width="166" height="26" rx="13" className="d-line" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="22" y={84 + i * 40} width="166" height="30" rx="3" className={i === 1 ? 'd-line' : 'd-box'} fill={i === 1 ? 'currentColor' : undefined} fillOpacity={i === 1 ? 0.12 : undefined} />
      ))}
      <rect x="237" y="46" width="100" height="10" rx="2" fill="currentColor" opacity=".8" />
      {[72, 90, 108].map((y) => <path key={y} d={`M237 ${y} H${y === 108 ? 340 : 395}`} className="d-line" opacity=".5" />)}
      <text x="237" y="142" className="d-dim">related</text>
      <rect x="237" y="152" width="70" height="22" rx="11" className="d-box" />
      <rect x="315" y="152" width="70" height="22" rx="11" className="d-box" />
      <rect x="237" y="184" width="108" height="26" rx="3" className="d-line" />
      <text x="291" y="202" textAnchor="middle" className="d-dim">Add to chat</text>
      <rect x="452" y="150" width="166" height="58" rx="5" className="d-line" />
      <rect x="462" y="160" width="86" height="20" rx="10" className="d-box" />
      <text x="505" y="174" textAnchor="middle" className="d-dim">note.md</text>
      <text x="462" y="198" className="d-dim">ask about it…</text>
      <path d="M204 125 H221" className="d-line" markerEnd="url(#arr-handoff)" />
      <path d="M419 125 H436" className="d-line" markerEnd="url(#arr-handoff)" />
    </svg>
  )
}

const chapters: Chapter[] = [
  {
    id: 'tl-idea',
    title: 'A different way to work with AI',
    body: [
      'Most AI tools give you a familiar routine: type a request, wait, and see what comes back. But what happens when the task isn’t one question? What if you have dozens of documents to read, convert, connect, and come back to, with several AI agents working on them at once, and you want to find things later without asking again?',
      'That was the question behind Telemetric. The idea began after a conversation with a friend who was using multiple AI models to build a game. Each model had a specific job, but the whole setup lived in a terminal. I was interested in what the system could do. As a designer, though, I became more interested in the person trying to use it.',
      'I worked with two engineers who built the underlying agent system. My role was to turn that capability into a product experience.',
    ],
    decision: 'How could someone who doesn’t live in a terminal understand what these agents are doing, and feel comfortable letting them work?',
    wide: true,
  },
  {
    id: 'tl-problem',
    title: 'The part automation doesn’t solve',
    body: [
      'Consider someone taking over a complex project. There are PDFs, decisions, meeting notes, and old documents scattered across folders. The information exists, but finding the right piece, and understanding how it connects to everything else, takes time.',
      'We wanted agents to do the groundwork: convert files into Markdown notes, give them structure, connect related ideas, and store everything as a vault you can search and explore as a graph, so finding something never means asking again.',
      'But automating the task raised another problem. If a system rewrites your information, how do you know what it did? What if it misunderstood something? How do you correct it before that mistake spreads?',
    ],
    decision: 'The interface needed to do more than show a finished vault. It needed to make the work understandable, and let people open, search and change it.',
    art: <Vault />,
    flip: true,
  },
  {
    id: 'tl-crew',
    title: 'Giving the work a shape',
    body: [
      'Instead of one assistant doing everything behind a chat window, I designed a visible crew. Telemetric coordinates four specialists: Converter turns source files into Markdown, Structurer gives the notes shape, Linker connects related ideas, and Organizer files everything. Each agent has a name, a purpose, its own activity, and outputs you can read.',
      'The challenge was showing enough detail without making the workspace feel like a monitoring dashboard. So the main panel gives a quick sense of who’s active and what stage they’re in. Opening an agent reveals the deeper details: its model, tools, activity history, and outputs, which you can open and edit in place.',
      'This was my application of visibility of system status, one of Nielsen’s usability heuristics. Users shouldn’t have to guess whether something is happening or what the system is doing.',
    ],
    art: <Crew />,
  },
  {
    id: 'tl-control',
    title: 'The moment the design changed',
    body: [
      'Early beta testers liked watching the agents work. But watching wasn’t enough. They wanted a way to step in. That feedback changed how I thought about the product. The agents weren’t just features to observe; they were collaborators people needed to direct.',
      'I designed pause, stop, redirect, review, and edit interactions. An agent could have an understandable working state, a paused state, and a point where it needed the user’s input. That meant thinking beyond the buttons: what happens to the unfinished task, what information remains visible, and how does the person continue?',
      'Nielsen calls the underlying principle user control and freedom. In this product, it meant something practical: you could hand over work without surrendering control of it.',
    ],
    art: <Control />,
    flip: true,
  },
  {
    id: 'tl-onboarding',
    title: 'Let people see the value first',
    body: [
      'A new user had to choose agents, connect model providers, and add files before knowing whether the product was useful. I simplified onboarding into four skippable steps and added a demo workspace. That way, someone could look around, understand the workflow, and make setup decisions when they were ready.',
      'Rather than making people remember unfamiliar choices up front, the interface lets them recognize what is available as they explore. That connects to Nielsen’s recognition rather than recall, and to the broader idea of progressive disclosure.',
    ],
    art: <Onboarding />,
  },
  {
    id: 'tl-search',
    title: 'Finding a note should lead somewhere',
    body: [
      'Once the agents have converted the files, the next challenge is using them. Everything lives as Markdown notes in a graph, so I designed search and exploration around it: find a note, see its context and related material, and follow the links. You search the vault instead of asking a chat to remember it. When asking is the right move, the interaction I care most about is much smaller: Add to chat.',
      'When someone finds a note, they can attach it directly to the chat composer and ask a question about it. The note stays visible as context, and the answer can reference the source. There is no need to copy text, remember a filename, or start the search again.',
    ],
    decision: 'I wanted the experience to feel like one continuous task: find something, understand it, then ask about it only if you need to.',
    art: <Handoff />,
    flip: true,
  },
  {
    id: 'tl-open',
    title: 'What we have, and what we don’t know yet',
    body: [
      'Telemetric is now a working beta. Feedback has shaped the onboarding, demo experience, and agent controls. The product also keeps its notes as local Markdown files, so people can continue reading and editing them outside Telemetric.',
      'I don’t have measured improvements in trust, task completion, or time saved yet. Those are questions for the next round of usability testing. There are also unfinished details in the current build, including clearer control labels and better search empty states.',
      'For the next iteration, I’d watch people try three real tasks: set up their first workspace, interrupt an agent safely, and find an answer they can verify.',
    ],
    wide: true,
  },
  {
    id: 'tl-lesson',
    title: 'Looking back',
    body: [
      'When we started, I was drawn to what a team of AI agents could accomplish. Working on the experience shifted my attention to something less flashy: the small moments when a person needs reassurance, context, or the ability to change course.',
      'That became the most interesting part of the design. Telemetric is still evolving, but it has made one thing clear to me.',
    ],
    decision: 'The better AI gets at doing work for us, the more carefully we need to design how people stay involved.',
    wide: true,
  },
]

export function TelemetricStory() {
  return (
    <div className="story">
      <p className="story-intro">Most AI tools make you wait for an answer. Telemetric is a desktop workspace where several agents turn your documents into a searchable Markdown graph while you watch, edit what they produce, and stay in charge. You find answers by searching, not asking.</p>
      <ul className="story-principles" aria-label="My approach">
        {[
          'Make the work and its outputs visible.',
          'Show the status first, the detail on request.',
          'Let people step in at any moment.',
          'Show the value before asking for setup.',
          'Search and explore first, ask only when needed.',
        ].map((x) => <li key={x}>{x}</li>)}
      </ul>
      {chapters.map((c) => <ChapterBlock key={c.id} c={c} />)}
    </div>
  )
}
