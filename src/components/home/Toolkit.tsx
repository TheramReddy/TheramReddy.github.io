import { type KeyboardEvent, type PointerEvent as ReactPointerEvent, useRef, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { TOOL_IDS, TOOL_KINDS, type ToolId, toolKind, tools } from '@/data/tools'
import { keySound } from '@/lib/sfx'
import { Close, EXPERTISE, PLACES, PlaceLogo, SPAN, ToolLogo, YEARS } from './parts'

/* ---------- toolkit: every tool as a tile. Search, or press a tile to see where I used it ---------- */

// a tile has room for a short name
const SHORT: Partial<Record<ToolId, string>> = { ga4: 'GA4', optimal: 'Optimal', clarity: 'Clarity', teams: 'Teams', tailwind: 'Tailwind', premiere: 'Premiere' }
// the workplaces that have tools to show
const SHOPS = PLACES.flatMap((p, i) => (p.tools.length ? [i] : []))
const usedAt = (id: ToolId) => SHOPS.filter((p) => PLACES[p].tools.includes(id))
const TOOL_NAMES = new Set<string>([...Object.values(tools), ...Object.values(SHORT)])
const ARROWS: Record<string, [number, number] | undefined> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }

export function Toolkit({ at, pick, open }: { at: ToolId; pick: (id: ToolId) => void; open: (p: number) => void }) {
  const [tab, setTab] = useState<'tools' | 'methods'>('tools')
  const [q, setQ] = useState('')
  const find = useRef<HTMLInputElement>(null)
  const needle = q.trim().toLowerCase()
  const has = (name: string) => name.toLowerCase().includes(needle)
  const hits = TOOL_IDS.filter((id) => has(tools[id]) || has(toolKind[id]))
  // the methods leave out anything that already has a tile among the tools
  const areas = EXPERTISE.map((area) => ({ ...area, list: area.list.filter((name) => has(name) && !TOOL_NAMES.has(name)) })).filter((area) => area.list.length)
  const choose = (id: ToolId) => { if (id !== at) keySound(true); pick(id) }

  // the arrow keys walk the tiles, and the tile they land on opens
  const walk = (e: KeyboardEvent<HTMLDivElement>) => {
    const from = (e.target as HTMLElement).closest<HTMLButtonElement>('.tk-tile')
    const dir = ARROWS[e.key]
    if (!from || !dir) return
    e.preventDefault()
    const all = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('.tk-tile')]
    const a = from.getBoundingClientRect()
    const far = (b: HTMLElement) => { const r = b.getBoundingClientRect(); return Math.abs(r.top - a.top) * 100 + Math.abs(r.left - a.left) }
    const to = dir[0] ? all[all.indexOf(from) + dir[0]] : all.filter((b) => (b.getBoundingClientRect().top - a.top) * dir[1] > 4).sort((x, y) => far(x) - far(y))[0]
    to?.focus()
    to?.click()
  }
  // a soft light sits under the pointer on whichever tile it is over
  const light = (e: ReactPointerEvent<HTMLDivElement>) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>('.tk-tile')
    if (!tile) return
    const r = tile.getBoundingClientRect()
    tile.style.setProperty('--mx', `${e.clientX - r.left}px`)
    tile.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== '/' || (e.target as HTMLElement).closest('input')) return
    e.preventDefault()
    find.current?.focus()
  }

  const mine = usedAt(at)
  const covered = new Set(mine.flatMap((p) => Array.from({ length: PLACES[p].end - PLACES[p].start }, (_, m) => PLACES[p].start + m)))
  const stats: [string, string][] = [
    ['Roles', String(mine.length)],
    ['Since', String(2021 + Math.floor(Math.min(...mine.map((p) => PLACES[p].start)) / 12))],
    ['Years', (covered.size / 12).toFixed(1)],
  ]

  return (
    <div className="lin-screen tk" data-tab={tab} onKeyDown={keys}>
      <div className="tk-bar">
        <div className="tk-seg" role="group" aria-label="Show" data-at={tab}>
          <button type="button" aria-pressed={tab === 'tools'} onClick={() => setTab('tools')}>Tools</button>
          <button type="button" aria-pressed={tab === 'methods'} onClick={() => setTab('methods')}>Methods</button>
        </div>
        <label className="tk-find">
          <Search size={14} aria-hidden="true" />
          <input
            ref={find} value={q} placeholder={tab === 'tools' ? 'Find a tool' : 'Find a method'} aria-label={tab === 'tools' ? 'Find a tool' : 'Find a method'}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && tab === 'tools' && hits[0]) choose(hits[0]); if (e.key === 'Escape' && q) { e.stopPropagation(); setQ('') } }}
          />
          {q ? <Close small label="Clear the search" onClick={() => { setQ(''); find.current?.focus() }} /> : <kbd aria-hidden="true">/</kbd>}
        </label>
      </div>

      {tab === 'tools' ? (
        <div className="tk-body">
          <div className="tk-grid" onKeyDown={walk} onPointerMove={light}>
            {TOOL_KINDS.map((kind) => {
              const row = hits.filter((id) => toolKind[id] === kind)
              if (!row.length) return null
              return (
                <section key={kind} className="tk-group">
                  <h4>{kind}<span>{row.length}</span></h4>
                  <div className="tk-tiles">
                    {row.map((id) => (
                      <button key={id} type="button" className="tk-tile" aria-pressed={at === id} aria-label={`${tools[id]}, ${kind}`} title={SHORT[id] ? tools[id] : undefined} onClick={() => choose(id)}>
                        <span className="tk-icon"><ToolLogo id={id} /></span>
                        <span>{SHORT[id] ?? tools[id]}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )
            })}
            {!hits.length && <p className="tk-none">No tool matches “{q.trim()}”<button type="button" onClick={() => setQ('')}>Clear the search</button></p>}
          </div>

          <aside className="tk-info" aria-label={tools[at]}>
            <div className="tk-hero" key={at}>
              <span className="tk-icon"><ToolLogo id={at} /></span>
              <div><h4>{tools[at]}</h4><p>{toolKind[at]}</p></div>
            </div>
            {/* a tool that belongs to no one role shows only itself */}
            {mine.length > 0 ? <>
            <dl className="tk-stats">{stats.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            <div className="tk-span" aria-hidden="true">
              <div>{mine.map((p) => <i key={p} style={{ marginLeft: `${(PLACES[p].start / SPAN) * 100}%`, width: `${((PLACES[p].end - PLACES[p].start) / SPAN) * 100}%`, background: PLACES[p].hue }} />)}</div>
              <p>{YEARS.map((y) => <span key={y}>{y}</span>)}</p>
            </div>
            <h5>Where I used it</h5>
            <div className="tk-at">
              {mine.map((p) => (
                <button key={p} type="button" aria-label={`${PLACES[p].name}, ${PLACES[p].dates}. Show that work`} onClick={() => open(p)}>
                  <PlaceLogo p={p} /><span>{PLACES[p].name}<small>{PLACES[p].dates}</small></span><ArrowUpRight size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
            </> : <p className="tk-loose">In my kit, outside the roles listed here.</p>}
          </aside>
        </div>
      ) : (
        <div className="tk-grid tk-areas">
          {areas.map(({ name, hue: tint, Icon, list }) => (
            <section key={name} className="tk-area">
              <h4><Icon size={15} strokeWidth={1.9} color={tint} aria-hidden="true" />{name}<span>{list.length}</span></h4>
              <ul>{list.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </section>
          ))}
          {!areas.length && <p className="tk-none">No method matches “{q.trim()}”<button type="button" onClick={() => setQ('')}>Clear the search</button></p>}
        </div>
      )}
    </div>
  )
}
