import { BossBot } from './crew/Bot'
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

/** An orchestrator splits a question into tasks; each agent owns one task, with its own model and connector. */
function Crew() {
  return (
    <svg viewBox="0 0 640 330" role="img" aria-label="An orchestrator splits a question into tasks and hands each to its own agent, every agent with its own model and its own connector">
      <Defs id="arr-crew" />
      <rect x="220" y="20" width="200" height="56" rx="4" className="d-box" />
      <text x="320" y="54" textAnchor="middle" className="d-label">Orchestrator</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M320 78 V110 H${105 + i * 215} V138`} className="d-line" markerEnd="url(#arr-crew)" />
          <rect x={10 + i * 215} y="144" width="190" height="130" rx="4" className="d-box" />
          <text x={105 + i * 215} y="180" textAnchor="middle" className="d-label">Agent</text>
          <text x={105 + i * 215} y="212" textAnchor="middle" className="d-dim">one task</text>
          <text x={105 + i * 215} y="236" textAnchor="middle" className="d-dim">own model</text>
          <text x={105 + i * 215} y="260" textAnchor="middle" className="d-dim">own connector (MCP)</text>
        </g>
      ))}
      <text x="320" y="312" textAnchor="middle" className="d-small">you see what each one did</text>
    </svg>
  )
}

/** Edit an output or an instruction; the agents run again from that point. */
function Control() {
  const states = [['Output', 'what an agent made'], ['You edit', 'output or instruction'], ['Agents re-run', 'from that point']]
  return (
    <svg viewBox="0 0 640 280" role="img" aria-label="An agent's output, which you edit, after which the agents run again from that point, including agents in any other domain the change touches">
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
      <path d="M540 150 Q320 215 100 150" className="d-line d-dash" markerEnd="url(#arr-control)" />
      <text x="320" y="214" textAnchor="middle" className="d-small">other domains re-run too</text>
      <text x="320" y="260" textAnchor="middle" className="d-label d-em">see it · change it · run again</text>
    </svg>
  )
}

/** Onboarding, then the Atlas Migration demo workspace. */
function Onboarding() {
  return (
    <svg viewBox="0 0 640 200" role="img" aria-label="Onboarding leads into the Atlas Migration demo workspace">
      <Defs id="arr-onboard" />
      <rect x="40" y="50" width="220" height="90" rx="4" className="d-box" />
      <text x="150" y="102" textAnchor="middle" className="d-label">Onboarding</text>
      <path d="M270 95 H370" className="d-line" markerEnd="url(#arr-onboard)" />
      <rect x="380" y="50" width="220" height="90" rx="4" className="d-box" />
      <text x="490" y="88" textAnchor="middle" className="d-label">Demo workspace</text>
      <text x="490" y="116" textAnchor="middle" className="d-dim">Atlas Migration</text>
    </svg>
  )
}

/** Search, preview, then the note attached to the chat composer. */
function Handoff() {
  const panels = [['Find', 10], ['Understand', 225], ['Ask', 440]] as const
  return (
    <svg viewBox="0 0 640 290" role="img" aria-label="Find a note in search, read its context in a preview, then add it to chat as a chip and ask about these notes">
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
      <text x="462" y="198" className="d-dim">Ask about these notes</text>
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
      'Most AI tools treat a folder as a pile of text and re-read it on every question. Telemetric organizes the folder into connected nodes first, so both you and the AI can move through it quickly.',
      'The idea began after a conversation with a friend who was using multiple AI models to build a game. Each model had a specific job, but the whole setup lived in a terminal. I was interested in what the system could do. As a designer, though, I became more interested in the person trying to use it.',
      'I worked with two engineers who built the underlying agent system. My role was to turn that capability into a product experience.',
    ],
    decision: 'How could someone who doesn’t live in a terminal see what several agents are doing, and feel comfortable letting them work?',
    wide: true,
  },
  {
    id: 'tl-problem',
    title: 'Files become nodes',
    body: [
      'All the folder’s data is organized into nodes (notes in .md format) that link to each other. You get a graph you can scan at a glance instead of a file tree.',
      'The AI walks the same connections when it searches, so you can follow the path it took.',
    ],
    decision: 'The interface needed to make the work understandable, and let people open, search and change it.',
    art: <Vault />,
    flip: true,
  },
  {
    id: 'tl-crew',
    title: 'One task for each agent',
    body: [
      'Every question in the workspace is split into tasks by an orchestrator. Each agent owns one task and has its own model. Each agent also has its own connector (MCP), and connectors can be separated per agent.',
      'The panel shows each agent working and what it produced. Users never have to guess whether something is happening or what the system is doing.',
      'Specialized models handle the tasks they are good at, so a large model is not used for everything. Smaller, focused prompts use fewer tokens, and each output is refined by the agent that owns it. Telemetric works with cloud models and with local AI.',
    ],
    art: <Crew />,
  },
  {
    id: 'tl-control',
    title: 'Change an output, and the work runs again',
    body: [
      'You can edit an output or change an instruction. The agents run again from that point. If your change touches a different domain, the agents in that domain re-run too.',
      'In this product, that meant something practical: you could hand over work without surrendering control of it.',
    ],
    art: <Control />,
    flip: true,
  },
  {
    id: 'tl-onboarding',
    title: 'Let people see the value first',
    body: [
      'Telemetric starts with onboarding and then opens the Atlas Migration demo workspace. Someone can look around, understand the workflow, and make setup decisions when they are ready.',
      'Rather than making people remember unfamiliar choices up front, the interface lets them recognize what is available as they explore, and reveals more only when they need it.',
    ],
    art: <Onboarding />,
  },
  {
    id: 'tl-search',
    title: 'Finding a note should lead somewhere',
    body: [
      'Search walks the connected nodes and returns result cards, so you search the vault instead of asking a chat to remember it.',
      'You can add a card to the chat as a removable chip, and the composer switches to “Ask about these notes”. There is no need to copy text, remember a filename, or start the search again.',
    ],
    decision: 'I wanted the experience to feel like one continuous task: find something, understand it, then ask about it only if you need to.',
    art: <Handoff />,
    flip: true,
  },
  {
    id: 'tl-watch',
    title: 'The workspace tells you when it changes',
    body: [
      'When a file is updated or added, Telemetric is notified. It reports what changed, where, and why it matters, and asks for your input before acting on the change.',
    ],
    wide: true,
  },
  {
    id: 'tl-open',
    title: 'What exists today, and what is still open',
    body: [
      'Today there is onboarding, then the Atlas Migration demo workspace, with an Agents panel, a Search panel, and Add to chat from Search results. It works with cloud models and with local AI.',
      'Still being worked out: which agents run again after an edit, so a cascade does not cost more than it saves; what happens if you edit an output while agents are still running; and who picks the model for each agent, you or the orchestrator. Left-nav Search and Mission control are not wired up yet.',
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
      <p className="story-intro">A workspace where your files become a map, and a team of AI agents works on that map while you watch, steer and edit.</p>
      <ul className="story-principles" aria-label="My approach">
        {[
          'Turn files into a map you can scan at a glance.',
          'Split every question into tasks, one agent each.',
          'Show each agent’s work, and let people change it.',
          'Use the right model for each task.',
          'Tell people when the workspace changes, and ask first.',
        ].map((x) => <li key={x}>{x}</li>)}
      </ul>
      {/* Telemetric isn't in beta yet: only the first chapter is public. Drop the slice when it ships. */}
      {chapters.slice(0, 1).map((c) => <ChapterBlock key={c.id} c={c} />)}
      <section className="story-soon" aria-label="Coming soon">
        <BossBot className="story-soon-mark" width={160} />
        <span className="story-soon-shadow" aria-hidden="true" />
        <p><em>Telemetric</em> is coming soon to beta.</p>
      </section>
    </div>
  )
}
