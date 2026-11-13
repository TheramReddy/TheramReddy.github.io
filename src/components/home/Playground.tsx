import { type CSSProperties, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, CalendarRange, ChartColumn, Check, ChevronRight, ChevronsUpDown, Code, Columns3, Copy, Ellipsis, ExternalLink, FlaskConical, Kanban, Keyboard, ListFilter, Maximize2, Microscope, PenTool, Plus, Rows3, Search, Send, SquarePen, Trash, User, Workflow, Wrench, X } from 'lucide-react'
import { projects } from '@/data/projects'
import { site } from '@/data/site'
import { type ToolId, tools } from '@/data/tools'
import { jobs } from '@/data/work'
import { scrollToSection } from '@/lib/me-section'

/* ---------- the content: where I have worked, how I work, and what I did, all from the resume and data/ ---------- */

const telemetric = projects.find((p) => p.slug === 'telemetric')!
const dso = projects.find((p) => p.slug === 'dso-modernization')!
const scobin = projects.find((p) => p.slug === 'scobin-design-system')!
// months are counted from January 2021; `end` is the month after the last one, and the present is November 2026
const month = (year: number, m: number) => (year - 2021) * 12 + m - 1
const NOW = month(2026, 12)
const PLACES = [
  { key: 'GA', name: 'Georgia DHS', hue: '#4ea7fc', role: jobs[0].role, dates: 'Feb 2025 to now', start: month(2025, 2), end: NOW, product: jobs[0].product, did: jobs[0].did, tools: jobs[0].tools },
  { key: 'SCO', name: 'Scobin', hue: '#e879c7', role: jobs[1].role, dates: 'Jan 2024 to Feb 2025', start: month(2024, 1), end: month(2025, 2), product: jobs[1].product, did: jobs[1].did, tools: jobs[1].tools },
  { key: 'WIP', name: 'Wipro', hue: '#4cb782', role: jobs[2].role, dates: 'Apr 2021 to Dec 2022', start: month(2021, 4), end: month(2022, 12), product: jobs[2].product, did: jobs[2].did, tools: jobs[2].tools },
  { key: 'TEL', name: 'Telemetric', hue: '#f2994a', role: telemetric.role, dates: '2026, concept', start: month(2026, 1), end: NOW, product: 'A workspace where your files become a map, and AI agents work on it with you', did: 'I worked with two engineers who built the multi-agent engine, and designed the product concept, the end-to-end experience and the interface.', tools: telemetric.tools ?? [] },
]
// the five stages my work moves through; the board has one column for each
const STAGES = [
  { name: 'Research', hue: '#4ea7fc', Icon: Microscope, what: 'Watch the real work first' },
  { name: 'Define', hue: '#f2c94c', Icon: Workflow, what: 'Turn rules and roles into flows' },
  { name: 'Design', hue: '#e879c7', Icon: PenTool, what: 'Every state, not just the happy path' },
  { name: 'Build', hue: '#4cb782', Icon: Code, what: 'Specs that hold up in code' },
  { name: 'Test', hue: '#a1a1aa', Icon: FlaskConical, what: 'Check it with people and tools' },
]
const LABELS: Record<string, string> = { Research: '#4ea7fc', Workflow: '#f2c94c', Interaction: '#e879c7', 'Design system': '#a1a1aa', Accessibility: '#3ecfb2', 'Front-end': '#4cb782' }
const PEOPLE = [site.firstName, 'You'] // the second one is whoever is visiting

type Entry = { who: number; text: string; said?: boolean }
type Card = { id: number; key: string; place: number; stage: number; title: string; desc: string; labels: string[]; result?: string; link?: { href: string; name: string }; yours?: boolean; log: Entry[] }

const RAW: Omit<Card, 'id' | 'key' | 'log'>[] = [
  { place: 0, stage: 0, title: 'Ride-alongs and workshops with caseworkers', labels: ['Research'], result: '50+ caseworkers and experts', desc: 'I studied real workflows through contextual inquiry, ride-alongs and workshops with 50+ caseworkers and subject experts. Their workarounds showed where the legacy system failed on efficiency and user control, and set the design priorities and build order.' },
  { place: 0, stage: 1, title: 'Three portals, one for each role', labels: ['Workflow'], result: 'Task time down about 40%', desc: "I designed three role-based portals (resident, caseworker, vendor) around each role's task flow and vocabulary, matching the system to the real world. Task time dropped about 40% and usability scores rose 15%." },
  { place: 0, stage: 1, title: 'Eligibility rules as conditional flows', labels: ['Workflow'], desc: 'I modeled LIHEAP eligibility (fuel types, county and vendor relationships, access restrictions) as conditional flows that reveal only relevant fields, with permission-aware screens that show each role only what its access allows.' },
  { place: 0, stage: 2, title: 'Shared components on a WCAG 2.1 AA baseline', labels: ['Design system', 'Accessibility'], desc: 'I defined shared components and a WCAG 2.1 AA baseline (keyboard navigation, logical focus order, semantic markup, ARIA) to enforce consistency and standards.' },
  { place: 0, stage: 2, title: 'One search from any screen', labels: ['Interaction'], result: '1 search to find a profile', link: dso.link && { href: dso.link.href, name: dso.link.title }, desc: 'Ctrl K opens one search for pages and profiles, from any screen. Experienced staff get a fast path, and new staff can ignore it.' },
  { place: 0, stage: 2, title: 'Sensitive numbers stay masked', labels: ['Interaction'], desc: 'Social Security numbers stay masked until someone makes a deliberate, logged click, so sensitive detail appears only when it is needed.' },
  { place: 0, stage: 2, title: 'Navigation that follows the role', labels: ['Interaction'], desc: 'A partner-agency worker sees only Hearings, while DHS staff see everything, so each person faces only the choices that apply to them.' },
  { place: 0, stage: 4, title: 'Usability testing after every round', labels: ['Research'], result: 'Usability scores up 15%', desc: 'I ran iterative design with usability testing: user flows, wireframes and annotated high-fidelity prototypes, refined after every round.' },
  { place: 0, stage: 4, title: 'Verified with axe, WAVE and Lighthouse', labels: ['Accessibility'], desc: 'The accessibility baseline was verified in the Angular and Bootstrap build with axe, WAVE and Lighthouse.' },
  { place: 1, stage: 0, title: 'Product-wide UI audit', labels: ['Design system'], desc: 'I led a product-wide UI audit to surface inconsistent patterns, before building the design system on what it found.' },
  { place: 1, stage: 0, title: 'Feedback, observation and competitive analysis', labels: ['Research'], result: 'Adoption up 20% in three months', desc: 'I synthesized customer feedback, observation and competitive analysis into recommendations and stakeholder tradeoffs. Adoption grew 20% in three months.' },
  { place: 1, stage: 2, title: 'A design system as the single source of truth', labels: ['Design system'], result: '41 documented components', link: scobin.figma ? { href: scobin.figma, name: 'Open the Figma file' } : undefined, desc: 'I established the design system (tokens, components) as the single source of truth, enforcing consistency and standards with accessibility built into the foundation.' },
  { place: 1, stage: 2, title: 'Dense inventory screens you can read', labels: ['Interaction'], result: 'Task time down 35%, errors down 40%', desc: 'I used progressive disclosure and visual hierarchy to favor recognition over recall on dense inventory screens, and designed status chips plus empty, loading and error states to keep system status visible. Task time fell 35% and manual errors fell 40%.' },
  { place: 1, stage: 3, title: 'Component specs and ownership with engineering', labels: ['Design system'], desc: 'I defined component specs and ownership with design and engineering to streamline handoff.' },
  { place: 2, stage: 3, title: 'UX specs as responsive Angular interfaces', labels: ['Front-end'], desc: 'I implemented UX specs as responsive Angular interfaces and reusable components, and flagged technical constraints early in wireframe and prototype reviews with designers, clients and engineers.' },
  { place: 2, stage: 3, title: 'Errors people can recover from', labels: ['Front-end', 'Interaction'], desc: 'I helped users recognize, diagnose and recover from errors by turning server and client validation into inline, actionable messages with recovery steps.' },
  { place: 2, stage: 3, title: 'A faster first load', labels: ['Front-end'], desc: 'I sped up initial load with lazy loading, code splitting and asset optimization.' },
  { place: 2, stage: 4, title: 'A/B tests on two client portals', labels: ['Research'], result: 'Engagement up 15%, conversion up 10%', desc: 'I contributed to A/B tests on two client portals: engagement rose 15% and conversion 10%.' },
  { place: 3, stage: 1, title: 'A folder becomes a map', labels: ['Workflow'], desc: 'Most AI tools treat a folder as a pile of text and re-read it on every question. Telemetric turns the folder into a map of connected notes first, so both you and the AI can move through it quickly.' },
  { place: 3, stage: 2, title: 'Agents you can watch working', labels: ['Interaction'], desc: 'When you ask a question, several small agents each take one task, and you can see what each one did. I designed the product concept, the end-to-end experience and the interface.' },
]
const counts = PLACES.map(() => 0)
const SEED: Card[] = RAW.map((c, id) => ({ ...c, id, key: `${PLACES[c.place].key}-${++counts[c.place]}`, log: [{ who: 0, text: `did this at ${PLACES[c.place].name}` }] }))

// the numbers on the resume, as changes in percent: below zero is a drop
const RESULTS = [
  { place: 0, what: 'Task time', v: -40 },
  { place: 0, what: 'Usability scores', v: 15 },
  { place: 1, what: 'Task time', v: -35 },
  { place: 1, what: 'Manual errors', v: -40 },
  { place: 1, what: 'Adoption, in three months', v: 20 },
  { place: 2, what: 'Engagement', v: 15 },
  { place: 2, what: 'Conversion', v: 10 },
]
const EXPERTISE = [
  ['Research', 'Contextual inquiry, ride-alongs, stakeholder interviews, usability testing, personas, journey maps, GA4 and Hotjar'],
  ['Product', 'Information architecture, user flows, task analysis, workflow and form design, state logic, design strategy'],
  ['Design', 'Interaction design, prototyping, design systems, design tokens, microcopy, WCAG 2.1 AA, Section 508, design QA'],
  ['Build', 'Figma, Dev Mode, Miro, Jira, Angular, Bootstrap, HTML, CSS and JavaScript, ARIA, REST APIs, axe, WAVE, Lighthouse'],
]

/* ---------- small pieces ---------- */

const StageIcon = ({ s }: { s: number }) => { const { Icon, hue } = STAGES[s]; return <Icon className="ico" size={15} strokeWidth={1.9} color={hue} aria-hidden="true" /> }
const Tag = ({ name }: { name: string }) => <span className="tag"><i style={{ background: LABELS[name] }} />{name}</span>

// the emblem of each workplace, without its wordmark: the seal cut from the Georgia DHS logo, the hexagon of the Scobin one (the same
// drawing with a tighter view box), and the Wipro logo whole, since its name sits inside its ring of dots
const MARKS: Record<string, string> = {
  GA: '/logos/georgia-dhs-mark.png',
  SCO: '/logos/scobin-mark.svg',
  WIP: '/logos/wipro.webp',
}

// each workplace shows its real emblem on a small light tile, the ground the logos were drawn for; Telemetric has none yet, so it gets a small map of three joined notes
function PlaceLogo({ p }: { p: number }) {
  const { hue, key } = PLACES[p]
  if (MARKS[key]) return <img className="plogo" src={MARKS[key]} alt="" width={18} height={18} draggable={false} />
  return (
    <svg className="ico" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke={hue} strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M4.2 10.4l3-5.4M9.4 5.2l2.6 4.2M5.4 12h5.2" /><circle cx="8.3" cy="3.6" r="1.7" /><circle cx="3.4" cy="12" r="1.7" /><circle cx="12.6" cy="11" r="1.7" />
    </svg>
  )
}

function Avatar({ who }: { who: number }) {
  return who ? <span className="av" aria-hidden="true"><User size={11} strokeWidth={2.2} /></span> : <img className="av" src="/me/portrait.webp" alt="" width={18} height={18} draggable={false} />
}

const STAGE_OPTS = STAGES.map((s, i) => <><StageIcon s={i} />{s.name}</>)

/** A button that opens a small panel beside itself. Closes on Escape, or when focus leaves; the content is handed a way to close it. */
function Pop({ label, face, end, up, children }: { label: string; face: ReactNode; end?: boolean; up?: boolean; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <span
      className="pick" onClick={(e: MouseEvent) => e.stopPropagation()}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false) }}
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false) } }}
    >
      <button type="button" className="pick-btn" aria-haspopup="menu" aria-expanded={open} aria-label={label} title={open ? undefined : label} onClick={() => setOpen((o) => !o)}>{face}</button>
      {open && <span className="pick-menu" data-end={end || undefined} data-up={up || undefined} role="menu">{children(() => setOpen(false))}</span>}
    </span>
  )
}

/** A Pop that offers one choice from a list, with a tick on the current one. */
function Pick({ label, options, at, onPick, end, children }: { label: string; options: ReactNode[]; at: number; onPick: (i: number) => void; end?: boolean; children: ReactNode }) {
  return (
    <Pop label={label} face={children} end={end}>
      {(close) => options.map((node, i) => (
        <button key={i} type="button" role="menuitemradio" aria-checked={at === i} onClick={() => { onPick(i); close() }}>{node}{at === i && <Check className="pick-tick" size={13} />}</button>
      ))}
    </Pop>
  )
}

/* ---------- the open card: what I did, what came of it, and room for a note ---------- */

function Detail({ card, change, say, close, more, openPlace }: { card: Card; change: (c: Partial<Card>, note?: string) => void; say: (text: string) => void; close: () => void; more: (e: MouseEvent) => void; openPlace: (p: number) => void }) {
  const [text, setText] = useState('')
  const send = (e: FormEvent) => { e.preventDefault(); if (!text.trim()) return; say(text.trim()); setText('') }
  return (
    <aside className="lin-detail" aria-label={card.title}>
      <header>
        <span className="lin-key"><PlaceLogo p={card.place} />{card.key}</span>
        <span className="lin-tools">
          <button type="button" className="lin-icon" aria-label="More for this card" onClick={more}><Ellipsis size={15} /></button>
          <button type="button" className="lin-icon" aria-label="Close the card" data-tip="Close  Esc" data-tip-end="" onClick={close}><X size={15} /></button>
        </span>
      </header>
      {card.yours ? <input className="lin-h" value={card.title} aria-label="Title" onChange={(e) => change({ title: e.target.value })} /> : <h3 className="lin-h">{card.title}</h3>}
      {card.yours ? <textarea className="lin-desc" value={card.desc} aria-label="Description" placeholder="Add a description" rows={3} onChange={(e) => change({ desc: e.target.value })} /> : <p className="lin-desc">{card.desc}</p>}
      {card.result && <p className="lin-result is-big"><Check size={14} strokeWidth={2.4} aria-hidden="true" />{card.result}</p>}
      <div className="lin-props">
        <Pick label="Move to another stage" options={STAGE_OPTS} at={card.stage} onPick={(s) => s !== card.stage && change({ stage: s }, `moved this to ${STAGES[s].name}`)}><StageIcon s={card.stage} />{STAGES[card.stage].name}</Pick>
        <button type="button" className="pick-btn" onClick={() => openPlace(card.place)}><PlaceLogo p={card.place} />{PLACES[card.place].name}</button>
      </div>
      {card.labels.length > 0 && <p className="lin-tags">{card.labels.map((l) => <Tag key={l} name={l} />)}</p>}
      {card.link && <a className="lin-link" href={card.link.href} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" />{card.link.name}<span>New tab</span></a>}
      <h4>Activity</h4>
      <ol className="lin-log">
        {card.log.map((entry, i) => <li key={i} data-said={entry.said || undefined}><Avatar who={entry.who} /><p><b>{PEOPLE[entry.who]}</b> {entry.text}</p></li>)}
      </ol>
      <form className="lin-say" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Leave a note (it stays on this page)" aria-label="Leave a note" />
        <button type="submit" className="lin-icon" aria-label="Add the note" disabled={!text.trim()}><Send size={14} /></button>
      </form>
    </aside>
  )
}

/* ---------- the command menu: type to find a card or an action, arrows and Enter to run it ---------- */

type Action = { label: string; icon: ReactNode; hint?: string; run: () => void }

function Command({ actions, close }: { actions: Action[]; close: () => void }) {
  const [q, setQ] = useState('')
  const [at, setAt] = useState(0)
  const hits = useMemo(() => actions.filter((a) => a.label.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 8), [actions, q])
  const run = (a?: Action) => { if (!a) return; close(); a.run() }
  const keys = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setAt((n) => (n + (e.key === 'ArrowDown' ? 1 : hits.length - 1)) % Math.max(1, hits.length)) }
    if (e.key === 'Enter') { e.preventDefault(); run(hits[Math.min(at, hits.length - 1)]) }
  }
  return (
    <div className="lin-veil" onClick={close}>
      <div className="lin-cmd" role="dialog" aria-label="Command menu" onClick={(e) => e.stopPropagation()} onKeyDown={keys}>
        <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setAt(0) }} placeholder="Search my work, or type a command" aria-label="Search my work, or type a command" />
        <ul>
          {hits.map((a, i) => <li key={a.label}><button type="button" data-on={i === Math.min(at, hits.length - 1) || undefined} onMouseEnter={() => setAt(i)} onClick={() => run(a)}>{a.icon}<span>{a.label}</span>{a.hint && <kbd>{a.hint}</kbd>}</button></li>)}
          {!hits.length && <li className="is-none">Nothing matches</li>}
        </ul>
      </div>
    </div>
  )
}

/* ---------- a card of your own ---------- */

type Draft = { title: string; place: number; stage: number }

function NewCard({ start, create, close }: { start: Partial<Draft>; create: (d: Draft) => void; close: () => void }) {
  const [d, setD] = useState<Draft>({ title: '', place: 0, stage: 0, ...start })
  const num = (key: 'place' | 'stage') => ({ value: d[key], onChange: (e: { target: { value: string } }) => setD({ ...d, [key]: Number(e.target.value) }) })
  return (
    <div className="lin-veil" onClick={close}>
      <form className="lin-new" role="dialog" aria-label="New card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); if (d.title.trim()) create({ ...d, title: d.title.trim() }) }}>
        <header>Add a card of your own<button type="button" className="lin-icon" aria-label="Close" onClick={close}><X size={15} /></button></header>
        <input autoFocus className="lin-h" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="What should I do next?" aria-label="Card title" />
        <div className="lin-fields">
          <select aria-label="Stage" {...num('stage')}>{STAGES.map((s, i) => <option key={s.name} value={i}>{s.name}</option>)}</select>
          <select aria-label="Where" {...num('place')}>{PLACES.map((p, i) => <option key={p.key} value={i}>{p.name}</option>)}</select>
        </div>
        <footer><button type="submit" className="lin-primary" disabled={!d.title.trim()}>Add card</button></footer>
      </form>
    </div>
  )
}

/* ---------- results: the numbers from the resume, and where the work on the board sits ---------- */

function Results({ cards }: { cards: Card[] }) {
  const [hot, setHot] = useState<number | null>(null)
  const by = STAGES.map((_, s) => cards.filter((c) => c.stage === s).length)
  const months = PLACES.slice(0, 3).map((p) => p.end - p.start)
  const tiles = [['Nearly 5', 'years in government and enterprise software'], ['50+', 'caseworkers and experts in my research'], ['3', 'role-based portals at Georgia DHS'], ['AA', 'WCAG 2.1 baseline, checked in the build']]
  return (
    <div className="lin-screen in">
      <dl className="in-tiles">{tiles.map(([value, label]) => <div key={label}><dd>{value}</dd><dt>{label}</dt></div>)}</dl>
      <section className="in-card is-wide">
        <header><h4>Measured results</h4><p className="in-keys"><span>Change in percent, as on my resume</span></p></header>
        <ul className="re-list">
          {RESULTS.map((r, i) => {
            const Way = r.v < 0 ? ArrowDown : ArrowUp
            return (
              <li key={r.place + r.what}>
                <span className="re-place">{(!i || RESULTS[i - 1].place !== r.place) && <><PlaceLogo p={r.place} />{PLACES[r.place].name}</>}</span>
                <span>{r.what}</span>
                <span className="in-bar"><i style={{ width: `${(Math.abs(r.v) / 40) * 100}%` }} /></span>
                <b><Way size={13} strokeWidth={2.4} aria-hidden="true" />{Math.abs(r.v)}% {r.v < 0 ? 'lower' : 'higher'}</b>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="in-card">
        <h4>Where the work sits</h4>
        <div className="in-stack" aria-hidden="true">
          {STAGES.map((st, s) => by[s] > 0 && <i key={st.name} style={{ flexGrow: by[s], background: st.hue }} data-dim={(hot != null && hot !== s) || undefined} onMouseEnter={() => setHot(s)} onMouseLeave={() => setHot(null)} />)}
        </div>
        <ul className="in-legend">
          {STAGES.map((st, s) => <li key={st.name} data-dim={(hot != null && hot !== s) || undefined} onMouseEnter={() => setHot(s)} onMouseLeave={() => setHot(null)}><StageIcon s={s} />{st.name}<b>{by[s]}</b><span>{Math.round((by[s] / Math.max(1, cards.length)) * 100)}%</span></li>)}
        </ul>
      </section>
      <section className="in-card">
        <h4>Time in each role</h4>
        <ul className="in-load">
          {months.map((n, p) => <li key={PLACES[p].key}><PlaceLogo p={p} /><span>{PLACES[p].name}</span><span className="in-bar"><i style={{ width: `${(n / Math.max(...months)) * 100}%` }} /></span><b>{(n / 12).toFixed(1)} yr</b></li>)}
        </ul>
      </section>
      <section className="in-card">
        <h4>{dso.title}</h4>
        <dl className="re-facts">{dso.metrics?.map((m) => <div key={m.value}><dd>{m.value}</dd><dt>{m.label}</dt></div>)}</dl>
      </section>
      <section className="in-card">
        <h4>{scobin.title}</h4>
        <dl className="re-facts">{[['41', 'Documented components'], ['35', 'Icons'], ['95', 'Text styles'], ['120+', 'Employees it supports']].map(([value, label]) => <div key={label}><dd>{value}</dd><dt>{label}</dt></div>)}</dl>
      </section>
    </div>
  )
}

/* ---------- timeline: each role as a bar across the years ---------- */

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026]
const SPAN = YEARS.length * 12

function Timeline({ cards, open }: { cards: Card[]; open: (p: number) => void }) {
  const order = [2, 1, 0, 3] // oldest first
  return (
    <div className="lin-screen rm is-years">
      <div className="rm-row is-head"><span /><div className="rm-weeks">{YEARS.map((y) => <span key={y}>{y}</span>)}</div></div>
      {order.map((p) => {
        const place = PLACES[p]
        const mine = cards.filter((c) => c.place === p).length
        return (
          <div className="rm-row" key={place.key}>
            <button type="button" className="rm-name" aria-label={`${place.name}. Show that work`} onClick={() => open(p)}>
              <PlaceLogo p={p} /><span>{place.name}<small>{place.role} · {mine} cards</small></span>
            </button>
            <div className="rm-track">
              <button type="button" className="rm-bar" aria-label={`${place.name}, ${place.dates}. Show that work`} style={{ left: `${(place.start / SPAN) * 100}%`, width: `${((place.end - place.start) / SPAN) * 100}%`, '--hue': place.hue, '--p': 1 } as CSSProperties} onClick={() => open(p)}>
                <i /><span>{place.dates}</span>
              </button>
            </div>
          </div>
        )
      })}
      <i className="rm-today" style={{ '--at': (NOW - 0.5) / SPAN } as CSSProperties}><b>Now</b></i>
    </div>
  )
}

/* ---------- toolkit: what I used in each role, and what I am good at ---------- */

function Toolkit({ open }: { open: (p: number) => void }) {
  return (
    <div className="lin-screen tk">
      {PLACES.map((place, p) => (
        <section key={place.key} className="tk-card">
          <button type="button" className="tk-head" aria-label={`${place.name}. Show that work`} onClick={() => open(p)}><PlaceLogo p={p} /><span>{place.name}<small>{place.role} · {place.dates}</small></span><ChevronRight size={14} aria-hidden="true" /></button>
          <p className="tk-what">{place.product}</p>
          <p>{place.did}</p>
          <ul className="tk-tools">{place.tools.map((id: ToolId) => <li key={id}><img src={`/tools/${id}.svg`} alt="" width={14} height={14} draggable={false} />{tools[id]}</li>)}</ul>
        </section>
      ))}
      <section className="tk-card is-wide">
        <h4>Core expertise</h4>
        <dl className="tk-skills">{EXPERTISE.map(([name, list]) => <div key={name}><dt>{name}</dt><dd>{list}</dd></div>)}</dl>
      </section>
    </div>
  )
}

/* ---------- the workspace ---------- */

// a number is one workplace
type View = 'work' | 'results' | 'timeline' | 'toolkit' | number
const SCREENS = [
  { id: 'work', name: 'How I work', Icon: Kanban },
  { id: 'results', name: 'Results', Icon: ChartColumn },
  { id: 'timeline', name: 'Timeline', Icon: CalendarRange },
  { id: 'toolkit', name: 'Toolkit', Icon: Wrench },
] as const
const SHORTCUTS: [string[], string][] = [[['C'], 'Add a card'], [['Ctrl', 'K'], 'Search and commands'], [['?'], 'This list'], [['Esc'], 'Close what is open'], [['Right-click'], 'Card menu'], [['↑', '↓', 'Enter'], 'Move and choose in the command menu']]
type Toast = { text: string; action?: string; run?: () => void }

function Workspace() {
  const shell = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState(SEED)
  const [view, setView] = useState<View>('work')
  const [only, setOnly] = useState<string[]>([])
  const [board, setBoard] = useState(true)
  const [openId, setOpenId] = useState<number | null>(null)
  const [cmd, setCmd] = useState(false)
  const [help, setHelp] = useState(false)
  const [draft, setDraft] = useState<Partial<Draft> | null>(null)
  const [menu, setMenu] = useState<{ id: number; x: number; y: number } | null>(null)
  const [folded, setFolded] = useState<number[]>([])
  const [drag, setDrag] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(id)
  }, [toast])

  // whatever a visitor does here is logged as "You"
  const change = (id: number, c: Partial<Card>, note?: string, said?: boolean) =>
    setCards((old) => old.map((x) => (x.id === id ? { ...x, ...c, log: note ? [...x.log, { who: 1, text: note, said }] : x.log } : x)))
  // tell: also say so in a toast, with a way back
  const setStage = (c: Card, s: number, tell?: boolean) => {
    if (s === c.stage) return
    change(c.id, { stage: s }, `moved this to ${STAGES[s].name}`)
    if (tell) setToast({ text: `${c.key} moved to ${STAGES[s].name}`, action: 'Undo', run: () => change(c.id, { stage: c.stage }, `moved this back to ${STAGES[c.stage].name}`) })
  }
  const create = (d: Draft) => {
    const id = Math.max(...cards.map((c) => c.id)) + 1
    const n = Math.max(0, ...cards.filter((c) => c.place === d.place).map((c) => Number(c.key.split('-')[1]))) + 1
    const key = `${PLACES[d.place].key}-${n}`
    setCards((old) => [...old, { ...d, id, key, desc: '', labels: [], yours: true, log: [{ who: 1, text: 'added this card' }] }])
    setDraft(null)
    setToast({ text: `${key} added`, action: 'View', run: () => setOpenId(id) })
  }
  const remove = (c: Card) => {
    const at = cards.findIndex((x) => x.id === c.id)
    setCards((old) => old.filter((x) => x.id !== c.id))
    if (openId === c.id) setOpenId(null)
    setToast({ text: `${c.key} removed`, action: 'Undo', run: () => setCards((old) => [...old.slice(0, at), c, ...old.slice(at)]) })
  }
  const copy = (text: string, what: string) => { navigator.clipboard?.writeText(text).catch(() => {}); setToast({ text: `${what} copied` }) }
  // the card menu opens where the pointer is, kept inside the window
  const openMenu = (e: MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    const b = shell.current!.getBoundingClientRect()
    setMenu({ id, x: Math.max(8, Math.min(e.clientX - b.left, b.width - 216)), y: Math.max(8, Math.min(e.clientY - b.top, b.height - 330)) })
  }
  const go = (v: View) => { setView(v); setOpenId(null) }

  const listing = view === 'work' || typeof view === 'number'
  const shown = cards.filter((c) => (typeof view === 'number' ? c.place === view : true) && (!only.length || c.labels.some((l) => only.includes(l))))
  const here: Partial<Draft> = typeof view === 'number' ? { place: view } : {}
  const open = cards.find((c) => c.id === openId)
  const picked = menu && cards.find((c) => c.id === menu.id)
  const title = typeof view === 'number' ? PLACES[view].name : SCREENS.find((sc) => sc.id === view)!.name
  const actions: Action[] = [
    ...SCREENS.map(({ id, name, Icon }) => ({ label: `Go to ${name}`, icon: <Icon size={14} />, run: () => go(id) })),
    ...PLACES.map((p, i) => ({ label: `Show ${p.name}`, icon: <PlaceLogo p={i} />, run: () => go(i) })),
    { label: board ? 'Show as a list' : 'Show as a board', icon: board ? <Rows3 size={14} /> : <Columns3 size={14} />, run: () => setBoard(!board) },
    { label: 'Add a card', hint: 'C', icon: <SquarePen size={14} />, run: () => setDraft(here) },
    { label: 'Keyboard shortcuts', hint: '?', icon: <Keyboard size={14} />, run: () => setHelp(true) },
    ...cards.map((c) => ({ label: `${c.key} ${c.title}`, icon: <StageIcon s={c.stage} />, run: () => setOpenId(c.id) })),
  ]
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    const typing = (e.target as HTMLElement).closest('input, textarea, select')
    const plain = !typing && !cmd && !draft && !help && !e.ctrlKey && !e.metaKey && !e.altKey
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(true); return }
    if (e.key === 'Escape') { if (menu) setMenu(null); else if (cmd) setCmd(false); else if (help) setHelp(false); else if (draft) setDraft(null); else setOpenId(null); return }
    if (plain && e.key.toLowerCase() === 'c') { e.preventDefault(); setDraft(here) }
    if (plain && e.key === '?') { e.preventDefault(); setHelp(true) }
  }

  const more = (c: Card) => <button type="button" className="lin-icon lin-more" aria-label={`More for ${c.key}`} onClick={(e) => openMenu(e, c.id)}><Ellipsis size={15} /></button>
  const row = (c: Card) => (
    <li key={c.id} className="lin-row" data-on={openId === c.id || undefined} onClick={() => setOpenId(c.id)} onContextMenu={(e) => openMenu(e, c.id)}>
      <Pick label={`Stage: ${STAGES[c.stage].name}. Move it`} options={STAGE_OPTS} at={c.stage} onPick={(s) => setStage(c, s)}><StageIcon s={c.stage} /></Pick>
      <span className="lin-key">{c.key}</span>
      <button type="button" className="lin-title">{c.title}</button>
      {c.result && <span className="lin-result">{c.result}</span>}
      <span className="lin-labels">{c.labels.map((l) => <Tag key={l} name={l} />)}</span>
      {more(c)}
      <PlaceLogo p={c.place} />
    </li>
  )

  return (
    <div className="toy lin" ref={shell} onKeyDown={keys}>
      <aside className="lin-side">
        <div className="lin-top">
          <img className="lin-sign" src="/brand/logo.svg" alt={site.name} width={84} height={22} draggable={false} />
          <button type="button" className="lin-icon" aria-label="Search and commands" data-tip="Search  Ctrl K" onClick={() => setCmd(true)}><Search size={15} /></button>
          <button type="button" className="lin-icon" aria-label="Add a card" data-tip="Add a card  C" onClick={() => setDraft(here)}><SquarePen size={15} /></button>
        </div>
        <nav aria-label="Views">
          {SCREENS.map(({ id, name, Icon }) => <button key={id} type="button" aria-current={view === id ? 'page' : undefined} onClick={() => go(id)}><Icon size={15} />{name}</button>)}
        </nav>
        <p className="lin-label">Where I did it</p>
        <nav aria-label="Workplaces">
          {PLACES.map((place, p) => (
            <button key={place.key} type="button" aria-current={view === p ? 'page' : undefined} onClick={() => go(p)}>
              <PlaceLogo p={p} />{place.name}<span>{cards.filter((c) => c.place === p).length}</span>
            </button>
          ))}
        </nav>
        <div className="lin-me">
          <Pop up label="Contact and help" face={<><Avatar who={0} /><span>{site.name}</span><ChevronsUpDown size={13} /></>}>
            {(close) => (
              <>
                <p>{site.role} · {site.location}</p>
                <button type="button" role="menuitem" onClick={() => { close(); setHelp(true) }}><Keyboard size={14} />Keyboard shortcuts<kbd>?</kbd></button>
              </>
            )}
          </Pop>
        </div>
      </aside>

      <section className="lin-main">
        <header className="lin-bar">
          <h3>{typeof view === 'number' && <PlaceLogo p={view} />}{title}{typeof view === 'number' && <small>{PLACES[view].role} · {PLACES[view].dates}</small>}</h3>
          {listing && (
            <>
              <Pop end label="Filter by kind of work" face={<><ListFilter size={14} />Filter{only.length > 0 && <b>{only.length}</b>}</>}>
                {() => (
                  <>
                    {Object.keys(LABELS).map((name) => {
                      const on = only.includes(name)
                      return <button key={name} type="button" role="menuitemcheckbox" aria-checked={on} onClick={() => setOnly(on ? only.filter((l) => l !== name) : [...only, name])}><i className="pick-dot" style={{ background: LABELS[name] }} />{name}{on && <Check className="pick-tick" size={13} />}</button>
                    })}
                    <hr />
                    <button type="button" role="menuitem" disabled={!only.length} onClick={() => setOnly([])}><X size={14} />Clear filter</button>
                  </>
                )}
              </Pop>
              <div className="lin-tabs is-icons" role="group" aria-label="Layout">
                <button type="button" aria-pressed={!board} aria-label="List" data-tip="List" onClick={() => setBoard(false)}><Rows3 size={14} /></button>
                <button type="button" aria-pressed={board} aria-label="Board" data-tip="Board" onClick={() => setBoard(true)}><Columns3 size={14} /></button>
              </div>
              <button type="button" className="lin-primary" onClick={() => setDraft(here)}><Plus size={14} />Add a card</button>
            </>
          )}
        </header>

        {view === 'results' ? <Results cards={cards} /> : view === 'timeline' ? <Timeline cards={cards} open={go} /> : view === 'toolkit' ? <Toolkit open={go} /> : board ? (
          <div className="lin-board">
            {STAGES.map((stage, s) => {
              const mine = shown.filter((c) => c.stage === s)
              return (
                <section
                  key={stage.name} className="lin-col" aria-label={stage.name} data-over={(drag != null && over === s) || undefined}
                  onDragOver={(e) => { if (drag == null) return; e.preventDefault(); setOver(s) }}
                  onDrop={(e) => { e.preventDefault(); const moved = cards.find((c) => c.id === drag); if (moved) setStage(moved, s, true); setDrag(null); setOver(null) }}
                >
                  <header><StageIcon s={s} />{stage.name}<span>{mine.length}</span><button type="button" className="lin-icon" aria-label={`Add a card to ${stage.name}`} data-tip="Add a card" data-tip-end="" onClick={() => setDraft({ ...here, stage: s })}><Plus size={14} /></button></header>
                  <p className="lin-sub">{stage.what}</p>
                  <ul>
                    {mine.map((c) => (
                      <li
                        key={c.id} className="lin-card" draggable data-drag={drag === c.id || undefined} data-on={openId === c.id || undefined}
                        onClick={() => setOpenId(c.id)} onContextMenu={(e) => openMenu(e, c.id)}
                        onDragStart={(e) => { e.dataTransfer.setData('text/plain', c.key); e.dataTransfer.effectAllowed = 'move'; setDrag(c.id) }}
                        onDragEnd={() => { setDrag(null); setOver(null) }}
                      >
                        <span className="lin-key">{c.key}<span className="lin-tools">{more(c)}<PlaceLogo p={c.place} /></span></span>
                        <button type="button" className="lin-title">{c.title}</button>
                        {c.result && <span className="lin-result">{c.result}</span>}
                        <span className="lin-labels">{c.labels.map((l) => <Tag key={l} name={l} />)}{c.yours && <span className="tag">Added by you</span>}</span>
                      </li>
                    ))}
                    {!mine.length && <li className="lin-none">Drop a card here</li>}
                  </ul>
                </section>
              )
            })}
          </div>
        ) : (
          <ul className="lin-list">
            {STAGES.map((stage, s) => {
              const mine = shown.filter((c) => c.stage === s)
              if (!mine.length) return null
              const shut = folded.includes(s)
              return (
                <li key={stage.name}>
                  <div className="lin-group">
                    <button type="button" aria-expanded={!shut} onClick={() => setFolded(shut ? folded.filter((f) => f !== s) : [...folded, s])}><ChevronRight size={13} /><StageIcon s={s} />{stage.name}<span>{mine.length}</span><span className="lin-sub">{stage.what}</span></button>
                    <button type="button" className="lin-icon" aria-label={`Add a card to ${stage.name}`} data-tip="Add a card" data-tip-end="" onClick={() => setDraft({ ...here, stage: s })}><Plus size={14} /></button>
                  </div>
                  {!shut && <ul>{mine.map(row)}</ul>}
                </li>
              )
            })}
            {!shown.length && <li className="lin-empty">Nothing here with that filter</li>}
          </ul>
        )}

        {open && <Detail key={open.id} card={open} change={(c, note) => change(open.id, c, note)} say={(text) => change(open.id, {}, text, true)} close={() => setOpenId(null)} more={(e) => openMenu(e, open.id)} openPlace={go} />}
      </section>

      {cmd && <Command actions={actions} close={() => setCmd(false)} />}
      {draft && <NewCard start={draft} create={create} close={() => setDraft(null)} />}
      {help && (
        <div className="lin-veil" onClick={() => setHelp(false)}>
          <div className="lin-new lin-help" role="dialog" aria-label="Keyboard shortcuts" onClick={(e) => e.stopPropagation()}>
            <header>Keyboard shortcuts<button type="button" className="lin-icon" aria-label="Close" autoFocus onClick={() => setHelp(false)}><X size={15} /></button></header>
            <dl>{SHORTCUTS.map(([combo, what]) => <div key={what}><dt>{what}</dt><dd>{combo.map((k) => <kbd key={k}>{k}</kbd>)}</dd></div>)}</dl>
          </div>
        </div>
      )}
      {menu && picked && (
        <div className="lin-ctx-veil" onClick={() => setMenu(null)} onContextMenu={(e) => { e.preventDefault(); setMenu(null) }}>
          <div className="pick-menu lin-ctx" role="menu" aria-label={`${picked.key} menu`} style={{ left: menu.x, top: menu.y }} onClick={() => setMenu(null)}>
            <p>{picked.key}</p>
            <button type="button" role="menuitem" autoFocus onClick={() => setOpenId(picked.id)}><Maximize2 size={14} />Open card</button>
            <hr />
            {STAGES.map((st, s) => <button key={st.name} type="button" role="menuitemradio" aria-checked={picked.stage === s} onClick={() => setStage(picked, s, true)}><StageIcon s={s} />{st.name}{picked.stage === s && <Check className="pick-tick" size={13} />}</button>)}
            <hr />
            <button type="button" role="menuitem" onClick={() => copy(picked.title, 'Title')}><Copy size={14} />Copy title</button>
            <button type="button" role="menuitem" className="is-danger" onClick={() => remove(picked)}><Trash size={14} />Remove card</button>
          </div>
        </div>
      )}
      {toast && (
        <div className="lin-toast" role="status">
          <Check size={14} />{toast.text}
          {toast.action && <button type="button" onClick={() => { toast.run?.(); setToast(null) }}>{toast.action}</button>}
          <button type="button" className="lin-icon" aria-label="Dismiss" onClick={() => setToast(null)}><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

/** Playground: my work laid out as a small working app. The board is how I work; the tabs are results, timeline and toolkit. */
export function Playground() {
  return (
    <section className="block play" data-nav="about" aria-label="Playground">
      <div className="col">
        <div className="play-card">
          <figure className="play-cell">
            <Workspace />
            <figcaption>My work as an app.</figcaption>
          </figure>
        </div>
        <p className="play-more"><button type="button" className="key is-big" onClick={() => scrollToSection('projects')}>See the work</button></p>
      </div>
    </section>
  )
}
