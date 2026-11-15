import { type FormEvent, useState } from 'react'
import { Check, CircleDashed, CircleDot, Flame, Route, Send, Sparkles, UserRound, Workflow } from 'lucide-react'
import '@/styles/studio.css'

/* Deliverables: the things I make on a project, as templates, with a copilot beside them that keeps track of the
   whole project. The project here is made up, an appointment booking app, so none of this is a real client. */

const PROJECT = { name: 'Appointment booking', note: 'Example project' }

type Tpl = 'journey' | 'persona' | 'workflow' | 'heatmap'
const TEMPLATES: { id: Tpl; name: string; Icon: typeof Route; what: string }[] = [
  { id: 'journey', name: 'Journey map', Icon: Route, what: 'What people do, think and feel at each step' },
  { id: 'persona', name: 'Persona', Icon: UserRound, what: 'One person who stands in for many' },
  { id: 'workflow', name: 'Workflow', Icon: Workflow, what: 'The path through the product, every branch' },
  { id: 'heatmap', name: 'Heatmap', Icon: Flame, what: 'Where people look and tap' },
]

/* ---------- the journey map ---------- */

const STAGES = ['Discover', 'Book', 'Prepare', 'Visit', 'Follow-up']
const JOURNEY = {
  doing: ['Searches for a clinic nearby', 'Picks a service and a time', 'Gets a reminder, checks what to bring', 'Checks in at the desk', 'Gets results and the bill'],
  thinking: ['"Is this one covered?"', '"Why is the earliest slot next month?"', '"Do I need my card? Forms?"', '"They have my details, good."', '"What happens next?"'],
  feeling: [3, 4, 1.5, 3.5, 2.5],
  pains: ['Coverage is unclear until the end', 'Slot list is long and unsorted', 'Nothing says what to bring', '', 'No next step after results'],
  wins: ['Show coverage on the first screen', 'Sort slots by soonest', 'A checklist in the reminder', 'Pre-filled check-in', 'A follow-up card with a next action'],
}
const FEEL = ['', 'Frustrated', 'Unsure', 'Neutral', 'Confident', 'Happy']

function JourneyMap() {
  const low = JOURNEY.feeling.indexOf(Math.min(...JOURNEY.feeling))
  const pt = (v: number, i: number) => [(i + 0.5) * 100, 82 - ((v - 1) / 4) * 64] as const
  const path = JOURNEY.feeling.map((v, i) => { const [x, y] = pt(v, i); return `${i ? 'L' : 'M'}${x} ${y}` }).join(' ')
  const row = (name: string, cells: string[], cls?: string) => (
    <>
      <div className="jm-name">{name}</div>
      {cells.map((c, i) => <div key={i} className={cls ? `jm-cell ${cls}` : 'jm-cell'} data-empty={!c || undefined}>{c || '—'}</div>)}
    </>
  )
  return (
    <div className="tpl jm" role="table" aria-label="Journey map">
      <div className="jm-name" />
      {STAGES.map((s, i) => <div key={s} className="jm-stage"><small>{i + 1}</small>{s}</div>)}
      {row('Doing', JOURNEY.doing)}
      {row('Thinking', JOURNEY.thinking, 'is-quote')}
      <div className="jm-name">Feeling</div>
      <div className="jm-curve">
        <div className="jm-plot">
          <svg viewBox="0 0 500 90" preserveAspectRatio="none" aria-hidden="true">
            <path className="jm-fill" d={`${path} L450 90 L50 90 Z`} />
            <path className="jm-line" d={path} />
          </svg>
          {JOURNEY.feeling.map((v, i) => {
            const [x, y] = pt(v, i)
            return <i key={i} className="jm-dot" data-low={i === low || undefined} style={{ left: `${x / 5}%`, top: `${(y / 90) * 100}%` }} title={FEEL[Math.round(v)]} />
          })}
        </div>
        <span className="ai-note" style={{ left: `${(low + 0.5) * 20}%` }}><Sparkles size={11} />Lowest point. 3 of 5 interviews mention not knowing what to bring.</span>
      </div>
      {row('Pain points', JOURNEY.pains, 'is-pain')}
      {row('Opportunities', JOURNEY.wins, 'is-win')}
    </div>
  )
}

/* ---------- the persona ---------- */

const PERSONA = {
  name: 'Priya N.', who: '34 · Working parent · Books for the whole family',
  quote: 'I do this on my phone between meetings. If it needs a desktop, it waits a week.',
  goals: ['Book the soonest slot that insurance covers', 'Know what to bring before the day', 'See everyone in the family in one place'],
  pains: ['Coverage only shows up at the end', 'Reminders say when, never what', 'Forms arrive on paper at the desk'],
  traits: [['Phone first', 90], ['Time pressure', 85], ['Tech comfort', 70], ['Price sensitivity', 45]] as [string, number][],
}

function Persona() {
  return (
    <div className="tpl pe">
      <header className="pe-head">
        <span className="pe-avatar" aria-hidden="true">PN</span>
        <div>
          <h5>{PERSONA.name}</h5>
          <p>{PERSONA.who}</p>
        </div>
        <span className="ai-chip"><Sparkles size={11} />Built from 12 interviews</span>
      </header>
      <blockquote className="pe-quote">{PERSONA.quote}</blockquote>
      <div className="pe-cols">
        <section><h6>Goals</h6><ul>{PERSONA.goals.map((g) => <li key={g}>{g}</li>)}</ul></section>
        <section><h6>Frustrations</h6><ul className="is-pain">{PERSONA.pains.map((g) => <li key={g}>{g}</li>)}</ul></section>
        <section>
          <h6>Behaviour</h6>
          <dl className="pe-traits">
            {PERSONA.traits.map(([name, v]) => <div key={name}><dt>{name}</dt><dd><i style={{ width: `${v}%` }} /></dd></div>)}
          </dl>
        </section>
      </div>
      <footer className="pe-foot"><Sparkles size={11} />Stands for about 60% of the people who book. The other segment, booking once for themselves, is a second persona.</footer>
    </div>
  )
}

/* ---------- the workflow ---------- */

type Node = { id: string; x: number; y: number; w: number; text: string; kind?: 'start' | 'choice' | 'flag' }
const NODES: Node[] = [
  { id: 'start', x: 16, y: 98, w: 72, text: 'Start', kind: 'start' },
  { id: 'service', x: 112, y: 94, w: 128, text: 'Pick a service' },
  { id: 'time', x: 264, y: 94, w: 128, text: 'Choose a time' },
  { id: 'cover', x: 414, y: 84, w: 112, text: 'Insurance on file?', kind: 'choice' },
  { id: 'confirm', x: 556, y: 94, w: 112, text: 'Confirm' },
  { id: 'remind', x: 692, y: 94, w: 112, text: 'Reminder sent' },
  { id: 'add', x: 406, y: 190, w: 128, text: 'Add insurance', kind: 'flag' },
]
const H = 44

function FlowNode({ n }: { n: Node }) {
  const cx = n.x + n.w / 2
  if (n.kind === 'choice') return <g className="wf-node is-choice"><path d={`M${n.x} 116 L${cx} 84 L${n.x + n.w} 116 L${cx} 148 Z`} /><text x={cx} y={120}>{n.text}</text></g>
  return (
    <g className={`wf-node${n.kind ? ` is-${n.kind}` : ''}`}>
      <rect x={n.x} y={n.y} width={n.w} height={n.kind === 'start' ? 36 : H} rx={n.kind === 'start' ? 18 : 8} />
      <text x={cx} y={n.y + (n.kind === 'start' ? 22 : 27)}>{n.text}</text>
    </g>
  )
}

function Flow() {
  return (
    <div className="tpl wf">
      <svg viewBox="0 0 820 260" aria-label="Workflow: from start to the reminder, with a branch for people without insurance on file">
        <defs><marker id="wf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" /></marker></defs>
        <g className="wf-edges">
          <path d="M88 116 H112" /><path d="M240 116 H264" /><path d="M392 116 H414" /><path d="M526 116 H556" /><path d="M668 116 H692" />
          <path d="M470 148 V190" /><path d="M534 212 H612 V138" />
        </g>
        <g className="wf-labels"><text x={541} y={108}>yes</text><text x={478} y={172}>no</text></g>
        {NODES.map((n) => <FlowNode key={n.id} n={n} />)}
      </svg>
      <span className="ai-note wf-note"><Sparkles size={11} />41% leave at Add insurance. The heatmap shows the same drop, so this branch is the first thing to fix.</span>
    </div>
  )
}

/* ---------- the heatmap ---------- */

const REACH: [string, number][] = [['Header', 100], ['Time picker', 92], ['Book button', 58], ['What to bring', 31], ['Footer', 14]]
// each spot is a patch of heat on the mock screen: where it sits, how wide, and how hot
const HEAT = [
  { x: 50, y: 31, r: 36, t: 1 }, { x: 22, y: 36, r: 22, t: .8 }, { x: 78, y: 36, r: 20, t: .55 },
  { x: 50, y: 50, r: 30, t: .7 }, { x: 50, y: 14, r: 20, t: .35 }, { x: 30, y: 72, r: 16, t: .2 },
]

function Heatmap() {
  return (
    <div className="tpl hm">
      <div className="hm-screen" aria-label="A booking screen with taps shown as heat">
        <div className="hm-ui">
          <div className="hm-bar" />
          <div className="hm-title" /><div className="hm-text" />
          <div className="hm-chips">{Array.from({ length: 9 }, (_, i) => <i key={i} data-on={i === 4 || undefined} />)}</div>
          <div className="hm-btn" />
          <div className="hm-text" /><div className="hm-text is-short" />
          <div className="hm-card" /><div className="hm-card" />
        </div>
        {HEAT.map((h, i) => <i key={i} className="hm-heat" style={{ left: `${h.x}%`, top: `${h.y}%`, width: h.r * 2, height: h.r * 2, opacity: h.t }} />)}
        <span className="hm-fold" style={{ top: '58%' }}><em>Fold</em></span>
      </div>
      <div className="hm-side">
        <dl className="hm-stats">
          <div><dt>Sessions</dt><dd>1,284</dd></div>
          <div><dt>Taps</dt><dd>5,910</dd></div>
          <div><dt>Avg. time</dt><dd>1m 48s</dd></div>
        </dl>
        <h6>Scroll reach</h6>
        <dl className="hm-reach">
          {REACH.map(([name, v]) => <div key={name}><dt>{name}</dt><dd><i style={{ width: `${v}%` }} /><b>{v}%</b></dd></div>)}
        </dl>
        <p className="ai-box"><Sparkles size={11} />Taps pile onto the time chips and fall away below the button. What to bring is only reached by 31%, which matches the lowest point on the journey map.</p>
      </div>
    </div>
  )
}

/* ---------- the copilot: it keeps track of the whole project ---------- */

const TRACK: { name: string; state: 'done' | 'now' | 'next' }[] = [
  { name: 'Interviews, 12', state: 'done' }, { name: 'Persona', state: 'done' }, { name: 'Journey map', state: 'done' },
  { name: 'Workflow', state: 'done' }, { name: 'Heatmap', state: 'now' }, { name: 'Usability test, round 1', state: 'next' },
]
const COPILOT: Record<Tpl, { links: string[]; notes: string[]; asks: [string, string][] }> = {
  journey: {
    links: ['Persona · Priya N.', 'Workflow · Choose a time', 'Heatmap · time picker'],
    notes: ['Prepare is the lowest point of the curve. The reminder says when, never what.', 'Follow-up has no touchpoint in the workflow yet.'],
    asks: [['What should the next round cover?', 'The Prepare stage. Test a reminder that carries a checklist, with five people who booked in the last month.'], ['Which stage changed since last week?', 'Book went up half a point after the slots were sorted by soonest. Everything else is the same.']],
  },
  persona: {
    links: ['Journey map · all stages', 'Heatmap · mobile sessions', 'Interviews 3, 5, 8, 11'],
    notes: ['Priya is phone first, and 71% of sessions in the heatmap are on a phone. The two agree.', 'A second persona is missing: someone booking once, for themselves.'],
    asks: [['Who is not covered yet?', 'People booking once for themselves, about 40% of bookings. Interviews 2 and 9 are the closest; a persona needs three more.'], ['What does she need first?', 'Coverage on the first screen. It is her top goal and the first pain point on the journey map.']],
  },
  workflow: {
    links: ['Heatmap · Book button', 'Journey map · Book', 'Persona · goals'],
    notes: ['Add insurance is the only step without a way back. 41% leave there.', 'The path ends at the reminder, but the journey map has two stages after it.'],
    asks: [['Where does the flow lose people?', 'At Add insurance. The heatmap shows 58% reach the button and far fewer finish; the branch is the gap.'], ['What would shorten it?', 'Ask about insurance on the first screen, before the service. Then the branch happens while people still have momentum.']],
  },
  heatmap: {
    links: ['Workflow · Add insurance', 'Journey map · Prepare', 'Persona · phone first'],
    notes: ['Attention drops right below the button. The what-to-bring section is under the fold on most phones.', 'The middle time chip gets the most taps, which suggests people want the soonest slot.'],
    asks: [['What is below the fold?', 'What to bring, and the two cards after it. Only 31% reach it, and it is the content the journey map says people miss most.'], ['Is this enough data?', '1,284 sessions over two weeks is enough for the pattern. Segment it by device before deciding anything about the layout.']],
  },
}

type Turn = { who: 'you' | 'ai'; text: string }

function Copilot({ tpl }: { tpl: Tpl }) {
  const c = COPILOT[tpl]
  const [chat, setChat] = useState<Turn[]>([])
  const [text, setText] = useState('')
  const done = TRACK.filter((t) => t.state === 'done').length
  // a question gets the answer written for it, or the first one as a stand-in
  const ask = (q: string) => {
    const hit = c.asks.find(([a]) => a === q) ?? c.asks[0]
    setChat((old) => [...old, { who: 'you', text: q }, { who: 'ai', text: hit[1] }])
    setText('')
  }
  const send = (e: FormEvent) => { e.preventDefault(); if (text.trim()) ask(text.trim()) }
  return (
    <aside className="st-ai" aria-label="Project copilot">
      <header className="st-ai-head">
        <span className="st-ai-mark"><Sparkles size={13} /></span>
        <div><h5>Copilot</h5><p>Following {PROJECT.name}</p></div>
      </header>
      <section>
        <h6>Progress<span>{done} of {TRACK.length}</span></h6>
        <ol className="st-track">
          {TRACK.map((t) => <li key={t.name} data-state={t.state}>{t.state === 'done' ? <Check size={12} /> : t.state === 'now' ? <CircleDot size={12} /> : <CircleDashed size={12} />}{t.name}</li>)}
        </ol>
      </section>
      <section>
        <h6>Connected</h6>
        <ul className="st-links">{c.links.map((l) => <li key={l}>{l}</li>)}</ul>
      </section>
      <section>
        <h6>Noticed</h6>
        <ul className="st-notes">{c.notes.map((n) => <li key={n}><Sparkles size={11} />{n}</li>)}</ul>
      </section>
      <section className="st-chat">
        {chat.length === 0 && <div className="st-asks">{c.asks.map(([q]) => <button key={q} type="button" onClick={() => ask(q)}>{q}</button>)}</div>}
        <ol className="st-turns" aria-live="polite">{chat.map((t, i) => <li key={i} data-who={t.who}>{t.text}</li>)}</ol>
        <form className="st-ask" onSubmit={send}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about this project" aria-label="Ask the copilot" />
          <button type="submit" aria-label="Send" disabled={!text.trim()}><Send size={13} /></button>
        </form>
      </section>
    </aside>
  )
}

/** Deliverables: a strip of templates, the chosen one drawn large, and the copilot beside it. */
export function Studio() {
  const [tpl, setTpl] = useState<Tpl>('journey')
  const now = TEMPLATES.find((t) => t.id === tpl)!
  return (
    <div className="st">
      <div className="st-main">
        <nav className="st-tabs" aria-label="Templates">
          {TEMPLATES.map(({ id, name, Icon }) => <button key={id} type="button" aria-current={tpl === id ? 'true' : undefined} onClick={() => setTpl(id)}><Icon size={14} />{name}</button>)}
        </nav>
        <div className="st-canvas">
          <header className="st-head">
            <div><h4>{now.name}</h4><p>{now.what}</p></div>
            <span className="st-proj"><CircleDot size={11} />{PROJECT.name}<small>{PROJECT.note}</small></span>
          </header>
          {tpl === 'journey' ? <JourneyMap /> : tpl === 'persona' ? <Persona /> : tpl === 'workflow' ? <Flow /> : <Heatmap />}
        </div>
      </div>
      <Copilot key={tpl} tpl={tpl} />
    </div>
  )
}
