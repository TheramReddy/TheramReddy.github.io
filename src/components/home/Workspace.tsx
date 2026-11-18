import { type CSSProperties, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode, Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, CalendarRange, ChartColumn, Check, ChevronRight, ChevronsUpDown, Code, Columns3, Copy, Ellipsis, ExternalLink, FlaskConical, Kanban, Keyboard, LayoutTemplate, ListFilter, LogOut, Maximize2, Microscope, PenTool, Plus, Rows3, Search, Send, SquarePen, Trash, User, Workflow, Wrench, X } from 'lucide-react'
import { Law } from '@/components/Law'
import { WORK } from '@/data/cards'
import type { LawId } from '@/data/laws'
import { site } from '@/data/site'
import { TOOL_IDS, type ToolId, apps, tools } from '@/data/tools'
import { fresh } from '@/lib/fresh'
import { useModal } from '@/lib/use-modal'
import { Close, NOW, PLACES, PlaceLogo, SPAN, ToolLogo, YEARS } from './parts'
// the deliverables screen, its templates and its copilot, is a chunk of its own, fetched the first time it is opened
// so is the toolkit: its code and its seventy logos wait until that screen is opened
const Toolkit = lazy(fresh(() => import('./Toolkit').then((m) => ({ default: m.Toolkit }))))
const Studio = lazy(fresh(() => import('./Studio').then((m) => ({ default: m.Studio }))))

/* ---------- the content: where I have worked, how I work, and what I did, all from the resume and data/ ---------- */

// the five stages my work moves through; the board has one column for each
const STAGES = [
  { name: 'Research', hue: '#4ea7fc', Icon: Microscope, what: 'Watch the real work' },
  { name: 'Define', hue: '#f2c94c', Icon: Workflow, what: 'Rules into flows' },
  { name: 'Design', hue: '#e879c7', Icon: PenTool, what: 'Every state, drawn' },
  { name: 'Build', hue: '#4cb782', Icon: Code, what: 'Specs that hold in code' },
  { name: 'Test', hue: '#a1a1aa', Icon: FlaskConical, what: 'Checked with people' },
]
const LABELS: Record<string, string> = { Research: '#4ea7fc', Workflow: '#f2c94c', Interaction: '#e879c7', 'Design system': '#a1a1aa', Accessibility: '#3ecfb2', 'Front-end': '#4cb782' }
const PEOPLE = [site.firstName, 'You'] // the second one is whoever is visiting

type Entry = { who: number; text: string; said?: boolean }
// why, how and out are the detail of a card: before, what I did, and after
type Card = { id: number; key: string; place: number; stage: number; title: string; desc: string; why?: string; how?: string[]; out?: string; law?: LawId; here?: string; labels: string[]; result?: string; link?: { href: string; name: string }; yours?: boolean; log: Entry[] }

const counts = PLACES.map(() => 0)
const SEED: Card[] = WORK.map((c, id) => ({ ...c, id, key: `${PLACES[c.place].key}-${++counts[c.place]}`, log: [{ who: 0, text: `did this at ${PLACES[c.place].name}` }] }))

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
/* ---------- small pieces ---------- */

const StageIcon = ({ s }: { s: number }) => { const { Icon, hue } = STAGES[s]; return <Icon className="ico" size={15} strokeWidth={1.9} color={hue} aria-hidden="true" /> }
const Tag = ({ name }: { name: string }) => <span className="tag"><i style={{ background: LABELS[name] }} />{name}</span>

function Avatar({ who }: { who: number }) {
  return who ? <span className="av" aria-hidden="true"><User size={11} strokeWidth={2.2} /></span> : <img className="av" src="/me/portrait.webp" alt="" width={18} height={18} draggable={false} />
}

const STAGE_OPTS = STAGES.map((s, i) => <><StageIcon s={i} />{s.name}</>)

/** A button that opens a small panel beside itself. Closes on Escape, on a press outside, or when focus leaves; the content is handed a way to close it. */
function Pop({ label, face, end, up, children }: { label: string; face: ReactNode; end?: boolean; up?: boolean; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLSpanElement>(null)
  // Safari and Firefox on a Mac don't focus a button when it is clicked, so blur alone can't be relied on to close the menu
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])
  return (
    <span
      className="pick" ref={box} onClick={(e: MouseEvent) => e.stopPropagation()}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false) }}
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false) } }}
    >
      <button type="button" className="pick-btn" aria-haspopup="menu" aria-expanded={open} aria-label={label} title={open ? undefined : label} onClick={() => setOpen((o) => !o)}>{face}</button>
      {open && <span className="pick-menu" data-end={end || undefined} data-up={up || undefined} role="menu" tabIndex={-1}>{children(() => setOpen(false))}</span>}
    </span>
  )
}

/** A Pop that offers one choice from a list, with a tick on the current one. */
function Pick({ label, options, at, onPick, children }: { label: string; options: ReactNode[]; at: number; onPick: (i: number) => void; children: ReactNode }) {
  return (
    <Pop label={label} face={children}>
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
          <Close label="Close the card" tip="Close  Esc" onClick={close} />
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
      {card.why && <section className="lin-part"><h4>Before</h4><p>{card.why}</p></section>}
      {card.how && <section className="lin-part"><h4>What I did</h4><ol>{card.how.map((step) => <li key={step}>{step}</li>)}</ol></section>}
      {card.out && <section className="lin-part"><h4>After</h4><p>{card.out}</p></section>}
      {card.law && <section className="lin-part"><h4>Why it works</h4><Law id={card.law} here={card.here} className="lin-law" /></section>}
      {card.link && <a className="lin-link" href={card.link.href} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" />{card.link.name}<span>New tab</span></a>}
      <h4>Activity</h4>
      <ol className="lin-log">
        {card.log.map((entry, i) => <li key={i} data-said={entry.said || undefined}><Avatar who={entry.who} /><p><b>{PEOPLE[entry.who]}</b> {entry.text}</p></li>)}
      </ol>
      <form className="lin-say" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Leave a note. It stays on this page." aria-label="Leave a note" />
        <button type="submit" className="lin-icon" aria-label="Send the note" disabled={!text.trim()}><Send size={14} /></button>
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
  const veil = useRef<HTMLDivElement>(null)
  useModal(veil)
  const run = (a?: Action) => { if (!a) return; close(); a.run() }
  const keys = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setAt((n) => (n + (e.key === 'ArrowDown' ? 1 : hits.length - 1)) % Math.max(1, hits.length)) }
    if (e.key === 'Enter') { e.preventDefault(); run(hits[Math.min(at, hits.length - 1)]) }
  }
  return (
    <div className="lin-veil" ref={veil} onClick={close}>
      <div className="lin-cmd" role="dialog" aria-modal="true" aria-label="Command menu" onClick={(e) => e.stopPropagation()} onKeyDown={keys}>
        <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setAt(0) }} placeholder="Search cards, or run a command" aria-label="Search cards, or run a command" />
        <ul>
          {hits.map((a, i) => <li key={a.label}><button type="button" data-on={i === Math.min(at, hits.length - 1) || undefined} onMouseEnter={() => setAt(i)} onClick={() => run(a)}>{a.icon}<span>{a.label}</span>{a.hint && <kbd>{a.hint}</kbd>}</button></li>)}
          {!hits.length && <li className="is-none">No matches</li>}
        </ul>
      </div>
    </div>
  )
}

/** The list of keyboard shortcuts, opened with ? */
function Shortcuts({ close }: { close: () => void }) {
  const veil = useRef<HTMLDivElement>(null)
  useModal(veil)
  return (
    <div className="lin-veil" ref={veil} onClick={close}>
      <div className="lin-new lin-help" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onClick={(e) => e.stopPropagation()}>
        <header>Keyboard shortcuts<Close autoFocus onClick={close} /></header>
        <dl>{SHORTCUTS.map(([combo, what]) => <div key={what}><dt>{what}</dt><dd>{combo.map((k) => <kbd key={k}>{k}</kbd>)}</dd></div>)}</dl>
      </div>
    </div>
  )
}

/* ---------- a card of your own ---------- */

type Draft = { title: string; place: number; stage: number }

function NewCard({ start, create, close }: { start: Partial<Draft>; create: (d: Draft) => void; close: () => void }) {
  const [d, setD] = useState<Draft>({ title: '', place: 0, stage: 0, ...start })
  const veil = useRef<HTMLDivElement>(null)
  useModal(veil)
  const num = (key: 'place' | 'stage') => ({ value: d[key], onChange: (e: { target: { value: string } }) => setD({ ...d, [key]: Number(e.target.value) }) })
  return (
    <div className="lin-veil" ref={veil} onClick={close}>
      <form className="lin-new" role="dialog" aria-modal="true" aria-label="New card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); if (d.title.trim()) create({ ...d, title: d.title.trim() }) }}>
        <header>Add a card<Close onClick={close} /></header>
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
  const years = (months.reduce((a, n) => a + n, 0) / 12).toFixed(1)
  // the headline numbers: what they are, the number, its unit if any, and a line that says where it comes from
  const tiles: [string, string, string, string][] = [
    ['Years in the field', years, 'yrs', 'Government and enterprise software'],
    ['People I researched with', '50', '+', 'Caseworkers and subject experts'],
    ['Portals shipped', '3', '', 'Residents, caseworkers and vendors'],
    ['Accessibility', 'AA', '', 'WCAG 2.1, checked in the build'],
  ]
  // the places that have a measured result, in the order the numbers are listed
  const shops = [...new Set(RESULTS.map((r) => r.place))]
  return (
    <div className="lin-screen in">
      <dl className="in-tiles">{tiles.map(([label, value, unit, note]) => <div key={label}><dt>{label}</dt><dd>{value}{unit && <small>{unit}</small>}</dd><p>{note}</p></div>)}</dl>
      {/* one column for each place: its name and dates, then each number with the share it changed by drawn under it */}
      <section className="in-card is-full">
        <header><h4>Measured results</h4><p>Percent change, from my resume</p></header>
        <div className="re-cols">
          {shops.map((p) => (
            <div key={PLACES[p].key} className="re-col">
              <h5><PlaceLogo p={p} />{PLACES[p].name}<small>{PLACES[p].dates}</small></h5>
              <ul>
                {RESULTS.filter((r) => r.place === p).map((r) => {
                  const Way = r.v < 0 ? ArrowDown : ArrowUp
                  return (
                    <li key={r.what}>
                      <span>{r.what}</span>
                      <b><Way size={15} strokeWidth={2.4} aria-hidden="true" />{Math.abs(r.v)}%<small>{r.v < 0 ? 'lower' : 'higher'}</small></b>
                      <span className="in-bar"><i style={{ width: `${Math.abs(r.v)}%` }} /></span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="in-card is-wide">
        <h4>Years in each role</h4>
        <ul className="in-load">
          {months.map((n, p) => {
            const live = PLACES[p].end === NOW
            return <li key={PLACES[p].key} data-live={live || undefined}><PlaceLogo p={p} /><span>{PLACES[p].name}<small>{PLACES[p].role}</small></span><span className="in-bar"><i style={{ width: `${(n / Math.max(...months)) * 100}%` }} /></span><b>{live && <em><i />now</em>}{(n / 12).toFixed(1)} yr</b></li>
          })}
        </ul>
      </section>
      <section className="in-card">
        <h4>Where my time goes</h4>
        <div className="in-stack" aria-hidden="true">
          {STAGES.map((st, s) => by[s] > 0 && <i key={st.name} style={{ flexGrow: by[s], background: st.hue }} data-dim={(hot != null && hot !== s) || undefined} onMouseEnter={() => setHot(s)} onMouseLeave={() => setHot(null)} />)}
        </div>
        <ul className="in-legend">
          {STAGES.map((st, s) => <li key={st.name} data-dim={(hot != null && hot !== s) || undefined} onMouseEnter={() => setHot(s)} onMouseLeave={() => setHot(null)}><StageIcon s={s} />{st.name}<b>{by[s]}</b><span>{Math.round((by[s] / Math.max(1, cards.length)) * 100)}%</span></li>)}
        </ul>
      </section>
    </div>
  )
}

/* ---------- timeline: each role as a bar across the years ---------- */

function Timeline({ open }: { open: (p: number) => void }) {
  const order = [2, 4, 1, 0, 3] // oldest first
  return (
    <div className="lin-screen rm is-years">
      <div className="rm-row is-head"><span /><div className="rm-weeks">{YEARS.map((y) => <span key={y}>{y}</span>)}</div></div>
      {order.map((p) => {
        const place = PLACES[p]
        return (
          <div className="rm-row" key={place.key}>
            <button type="button" className="rm-name" aria-label={`${place.name}. Show that work`} onClick={() => open(p)}>
              <PlaceLogo p={p} /><span>{place.name}<small>{place.role}</small></span><em className="rm-when">{place.dates}</em>
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

/* ---------- the workspace ---------- */

// a number is one workplace
type View = 'work' | 'results' | 'timeline' | 'toolkit' | 'make' | number
const SCREENS = [
  { id: 'work', name: 'How I work', Icon: Kanban },
  { id: 'results', name: 'Results', Icon: ChartColumn },
  { id: 'timeline', name: 'Timeline', Icon: CalendarRange },
  { id: 'toolkit', name: 'Toolkit', Icon: Wrench },
  { id: 'make', name: 'Deliverables', Icon: LayoutTemplate },
] as const
const SHORTCUTS: [string[], string][] = [[['C'], 'Add a card'], [['Ctrl', 'K'], 'Search and commands'], [['/'], 'Find a tool, in the toolkit'], [['?'], 'This list'], [['Esc'], 'Close whatever is open'], [['Right-click'], 'Card menu'], [['↑', '↓', 'Enter'], 'Move through the command menu']]
type Toast = { text: string; action?: string; run?: () => void }

/** My work laid out as a small working app: the board is how I work; the other screens are results, timeline, toolkit and deliverables. `onSignOut` goes back to the door. */
export default function Workspace({ onSignOut }: { onSignOut?: () => void }) {
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
  const [appsOpen, setAppsOpen] = useState(false)
  const [tool, setTool] = useState<ToolId>('figma')
  const [tkKey, setTkKey] = useState(0)
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
    const id = Math.max(-1, ...cards.map((c) => c.id)) + 1
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
  const copy = (text: string, what: string) => {
    const say = (ok: boolean) => setToast({ text: ok ? `${what} copied` : `Couldn’t copy: ${text}` })
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => say(true), () => say(false))
    else say(false)
  }
  // the card menu opens where the pointer is, kept inside the window
  const openMenu = (e: MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    const b = shell.current!.getBoundingClientRect()
    setMenu({ id, x: Math.max(8, Math.min(e.clientX - b.left, b.width - 216)), y: Math.max(8, Math.min(e.clientY - b.top, b.height - 330)) })
  }
  const go = (v: View) => { setView(v); setOpenId(null) }
  // from outside the toolkit: it opens fresh, on that tool
  const openTool = (id: ToolId) => { setTool(id); setTkKey((k) => k + 1); go('toolkit') }

  const listing = view === 'work' || typeof view === 'number'
  const shown = cards.filter((c) => (typeof view === 'number' ? c.place === view : true) && (!only.length || c.labels.some((l) => only.includes(l))))
  const here: Partial<Draft> = typeof view === 'number' ? { place: view } : {}
  const open = cards.find((c) => c.id === openId)
  const picked = menu && cards.find((c) => c.id === menu.id)
  const actions: Action[] = [
    ...SCREENS.map(({ id, name, Icon }) => ({ label: `Go to ${name}`, icon: <Icon size={14} />, run: () => go(id) })),
    ...PLACES.map((p, i) => ({ label: `Show ${p.name}`, icon: <PlaceLogo p={i} />, run: () => go(i) })),
    { label: board ? 'Show as a list' : 'Show as a board', icon: board ? <Rows3 size={14} /> : <Columns3 size={14} />, run: () => setBoard(!board) },
    { label: 'Add a card', hint: 'C', icon: <SquarePen size={14} />, run: () => setDraft(here) },
    { label: 'Keyboard shortcuts', hint: '?', icon: <Keyboard size={14} />, run: () => setHelp(true) },
    ...TOOL_IDS.map((id) => ({ label: `Open ${tools[id]} in the toolkit`, icon: <ToolLogo id={id} />, run: () => openTool(id) })),
    ...cards.map((c) => ({ label: `${c.key} ${c.title}`, icon: <StageIcon s={c.stage} />, run: () => setOpenId(c.id) })),
  ]
  // the shell takes focus, so the shortcuts work before anything inside it has been focused
  useEffect(() => { shell.current?.focus({ preventScroll: true }) }, [])
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
    <div className="toy lin" ref={shell} tabIndex={-1} data-listing={listing || undefined} onKeyDown={keys}>
      <aside className="lin-side">
        <div className="lin-top">
          <img className="lin-sign" src="/brand/logo.svg" alt={site.name} width={84} height={22} draggable={false} />
          <button type="button" className="lin-icon" aria-label="Search and commands" data-tip="Search  Ctrl K" onClick={() => setCmd(true)}><Search size={15} /></button>
          <button type="button" className="lin-icon lin-add" aria-label="Add a card" data-tip="Add a card  C" onClick={() => setDraft(here)}><SquarePen size={15} /></button>
        </div>
        <nav className="lin-views" aria-label="Views">
          {SCREENS.map(({ id, name, Icon }) => <button key={id} type="button" aria-current={view === id ? 'page' : undefined} onClick={() => go(id)}><Icon size={15} />{name}</button>)}
        </nav>
        <p className="lin-label">Where I did it</p>
        <nav className="lin-places" aria-label="Workplaces">
          {PLACES.map((place, p) => (
            <button key={place.key} type="button" aria-current={view === p ? 'page' : undefined} onClick={() => go(p)}>
              <PlaceLogo p={p} />{place.name}<span>{cards.filter((c) => c.place === p).length}</span>
            </button>
          ))}
        </nav>
        {/* the applications fold away, so the sidebar stays short and the profile keeps its place at the foot */}
        <button type="button" className="lin-label lin-fold" aria-expanded={appsOpen} aria-controls="lin-apps" onClick={() => setAppsOpen(!appsOpen)}><ChevronRight size={12} />Applications<span>{apps.length}</span></button>
        {appsOpen && (
          <ul className="lin-apps" id="lin-apps" aria-label="Applications">
            {apps.map((id) => <li key={id}><button type="button" aria-current={view === 'toolkit' && tool === id ? 'true' : undefined} onClick={() => openTool(id)}><ToolLogo id={id} />{tools[id]}</button></li>)}
          </ul>
        )}
        <div className="lin-me">
          <Pop up label="Contact and help" face={<><Avatar who={0} /><span>{site.name}</span><ChevronsUpDown size={13} /></>}>
            {(close) => (
              <>
                <p>{site.role}<br />{site.location}</p>
                <button type="button" role="menuitem" onClick={() => { close(); setHelp(true) }}><Keyboard size={14} />Keyboard shortcuts<kbd>?</kbd></button>
                {onSignOut && <button type="button" role="menuitem" className="lin-out" onClick={() => { close(); onSignOut() }}><LogOut size={14} />Sign out</button>}
              </>
            )}
          </Pop>
        </div>
      </aside>

      <section className="lin-main">
        <header className="lin-bar">
          {typeof view === 'number' ? <h3><PlaceLogo p={view} />{PLACES[view].name}<small>{PLACES[view].role}, {PLACES[view].dates}</small></h3>
            : <h3>{SCREENS.find((sc) => sc.id === view)!.name}</h3>}
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

        {view === 'results' ? <Results cards={cards} /> : view === 'timeline' ? <Timeline open={go} /> : view === 'toolkit' ? <Suspense fallback={<div className="lin-screen" />}><Toolkit key={tkKey} at={tool} pick={setTool} open={go} /></Suspense> : view === 'make' ? <Suspense fallback={<div className="lin-screen" />}><Studio /></Suspense> : board ? (
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
            {!shown.length && <li className="lin-empty">No cards match this filter</li>}
          </ul>
        )}

        {open && <Detail key={open.id} card={open} change={(c, note) => change(open.id, c, note)} say={(text) => change(open.id, {}, text, true)} close={() => setOpenId(null)} more={(e) => openMenu(e, open.id)} openPlace={go} />}
      </section>

      {cmd && <Command actions={actions} close={() => setCmd(false)} />}
      {draft && <NewCard start={draft} create={create} close={() => setDraft(null)} />}
      {help && <Shortcuts close={() => setHelp(false)} />}
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
          <Close small label="Dismiss" onClick={() => setToast(null)} />
        </div>
      )}
    </div>
  )
}
