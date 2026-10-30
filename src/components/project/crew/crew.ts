import { useEffect, useState } from 'react'

export type Act = 'idle' | 'sit' | 'type' | 'draw' | 'search' | 'find' | 'pass' | 'catch'
export type Dir = 'l' | 'r' | 'u' | 'd'
export type AgentId = 'converter' | 'structurer' | 'linker' | 'organizer'
export type Id = 'boss' | AgentId

export type Beat = { from: number; to: number; act: Act; label: string; target?: Id; dir?: Dir }
export type Convo = { id: number; from: Id; to: Id; at: number; end: number; text: string }
export type Snapshot = {
  beats: Record<Id, Beat & { index: number }>
  piles: Record<Id, { in: number; out: number }>
  sent: Record<Id, number>
  says: Partial<Record<Id, Convo>>
  looks: Partial<Record<Id, Dir>>
}

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

const beat = (from: number, to: number, act: Act, label: string, extra: Partial<Beat> = {}): Beat => ({ from, to, act, label, ...extra })

/** Everything runs at this pace; raise it to slow the whole office down. */
const SLOW = 1.8
export const FLIGHT = 650 * SLOW
const STAGGER = 160 * SLOW
const WINDUP = 350 * SLOW

export const AGENTS: AgentId[] = ['converter', 'structurer', 'linker', 'organizer']
export const ALL: Id[] = ['boss', ...AGENTS]

/** Where each agent sits on the 2x2 desk grid, used to work out which way to face. */
const SPOT: Record<Id, [number, number]> = { boss: [0.5, -1], converter: [0, 0], structurer: [1, 0], linker: [0, 1], organizer: [1, 1] }

export function dirBetween(a: Id, b: Id): Dir {
  const dx = SPOT[b][0] - SPOT[a][0]
  const dy = SPOT[b][1] - SPOT[a][1]
  return Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'l' : 'r') : dy < 0 ? 'u' : 'd'
}

/** The route each document takes through the crew; the last stop is always the boss. */
const ROUTES: AgentId[][] = [
  ['converter', 'structurer', 'organizer'], ['structurer', 'organizer'], ['linker', 'structurer', 'organizer'], ['organizer'],
  ['converter', 'linker', 'structurer', 'organizer'], ['linker', 'organizer'], ['organizer', 'linker'], ['structurer', 'linker', 'organizer'],
  ['converter', 'organizer'], ['linker', 'structurer', 'organizer'], ['structurer', 'linker', 'organizer'], ['organizer'],
]

const WORK_MS: Record<AgentId, number> = { converter: 1200 * SLOW, structurer: 1000 * SLOW, linker: 950 * SLOW, organizer: 700 * SLOW }

const WORK: Record<AgentId, { act: Act; label: string; share: number }[]> = {
  converter: [{ act: 'search', label: 'searching files', share: 0.45 }, { act: 'type', label: 'converting', share: 0.55 }],
  structurer: [{ act: 'draw', label: 'outlining', share: 1 }],
  linker: [{ act: 'find', label: 'finding links', share: 1 }],
  organizer: [{ act: 'search', label: 'filing', share: 0.5 }, { act: 'type', label: 'tagging', share: 0.5 }],
}

const WORK_TALK: Record<AgentId, string[]> = {
  converter: ['3 tables inside', 'p.9 is scanned', 'pdf fought back', 'pulling text out'],
  structurer: ['tagged: vendor', 'title looks odd', 'summary: 62 words', 'who owns this?'],
  linker: ['cites launch plan', '2 backlinks found', 'linking to roadmap', 'popular note, this'],
  organizer: ['0.91 match', '03 Workstreams?', 'renaming it', 'filed: Decisions'],
}

const IDLE: Record<AgentId, { act: Act; label: string }[]> = {
  converter: [{ act: 'search', label: 'checking sources' }, { act: 'type', label: 'cleaning tables' }],
  structurer: [{ act: 'draw', label: 'refining summaries' }, { act: 'type', label: 'fixing headings' }],
  linker: [{ act: 'find', label: 'scanning for links' }, { act: 'search', label: 'checking backlinks' }],
  organizer: [{ act: 'search', label: 'checking folders' }, { act: 'type', label: 'renaming notes' }],
}

const REPLIES: Record<Id, string[]> = {
  boss: ['nice, filed', 'good, next', 'thanks'],
  converter: ['on it', 'got it'],
  structurer: ['send ’em over', 'in the queue', 'ugh, fine'],
  linker: ['noted', 'nice find'],
  organizer: ['filing it', 'ack'],
}

type Job = { item: number; step: number }
const record = <T,>(make: () => T) => Object.fromEntries(ALL.map((k) => [k, make()])) as Record<Id, T>

function simulate() {
  const queue = record<{ job: Job; at: number }[]>(() => [])
  const held = record<Job[]>(() => [])
  const free = record(() => 0)
  const picks = record<number[]>(() => [])
  const drops = record<number[]>(() => [])
  const throws = record<{ to: Id; t: number }[]>(() => [])
  const lands = record<number[]>(() => [])
  const busy = record<Beat[]>(() => [])
  const talk: [Id, Id, number, number, string][] = [['boss', ROUTES[0][0], 100, 1400 * SLOW, 'new batch in']]
  const said = record(() => 0)

  const nextStop = (j: Job): Id => ROUTES[j.item][j.step + 1] ?? 'boss'

  const send = (from: Id, job: Job, t: number, to: Id) => {
    throws[from].push({ to, t })
    const land = t + FLIGHT
    lands[to].push(land)
    if (to !== 'boss') queue[to].push({ job: { item: job.item, step: job.step + 1 }, at: land })
    queue[to].sort((a, b) => a.at - b.at)
    if (lands[to].length % 2 === 0) talk.push([to, from, land + 80, 1000 * SLOW, REPLIES[to][said[to]++ % REPLIES[to].length]])
  }

  ROUTES.forEach((route, i) => send('boss', { item: i, step: -1 }, WINDUP + i * STAGGER, route[0]))
  busy.boss.push(beat(0, WINDUP + (ROUTES.length - 1) * STAGGER + 450 * SLOW, 'pass', 'dispatching', { target: ROUTES[0][0], dir: 'd' }))

  for (let guard = 0; guard < 400; guard++) {
    let who: AgentId | null = null
    let mode: 'pick' | 'ship' = 'pick'
    let at = Infinity
    for (const r of AGENTS) {
      const nx = queue[r][0]
      const fr = free[r]
      let kind: 'pick' | 'ship'
      let time: number
      if (nx && nx.at <= fr + 250 && held[r].length < 2) { kind = 'pick'; time = Math.max(fr, nx.at) }
      else if (held[r].length) { kind = 'ship'; time = fr }
      else if (nx) { kind = 'pick'; time = Math.max(fr, nx.at) }
      else continue
      if (time < at) { who = r; mode = kind; at = time }
    }
    if (!who) break

    if (mode === 'pick') {
      const { job } = queue[who].shift()!
      const dur = WORK_MS[who] + (job.item % 3) * 150 * SLOW
      picks[who].push(at)
      drops[who].push(at + dur)
      let c = at
      for (const s of WORK[who]) {
        const len = dur * s.share
        busy[who].push(beat(c, c + len, s.act, s.label))
        c += len
      }
      free[who] = at + dur
      held[who].push(job)
      talk.push([who, nextStop(job), at + 450 * SLOW, 1500 * SLOW, WORK_TALK[who][said[who]++ % WORK_TALK[who].length]])
    } else {
      const jobs = held[who].splice(0)
      jobs.forEach((j, k) => send(who!, j, at + WINDUP + k * STAGGER, nextStop(j)))
      const end = at + WINDUP + (jobs.length - 1) * STAGGER + 450 * SLOW
      const target = nextStop(jobs[0])
      busy[who].push(beat(at, end, 'pass', target === 'boss' ? 'reporting' : 'passing along', { target, dir: dirBetween(who, target) }))
      free[who] = end
    }
  }

  const end = Math.max(...ALL.flatMap((k) => [...lands[k], ...busy[k].map((b) => b.to)]))
  return { busy, throws, lands, picks, drops, talk, end }
}

const sim = simulate()
export const CYCLE = Math.max(12000, sim.end + 1800)

function timeline(id: Id): Beat[] {
  const watching = id === 'boss'
  const catchLabel = watching ? 'report in' : 'got it'
  const landTimes = [...sim.lands[id]].sort((a, b) => a - b)
  const out: Beat[] = []

  const fill = (from: number, to: number) => {
    if (watching) { out.push(beat(from, to, 'sit', 'watching')); return }
    const idle = IDLE[id as AgentId]
    for (let t = from, k = 0; t < to; k++) {
      const n = Math.min(to, t + 2400)
      out.push(beat(t, n, idle[k % idle.length].act, idle[k % idle.length].label))
      t = n
    }
  }

  const gap = (a: number, b: number) => {
    let cur = a
    for (const l of landTimes) {
      const s = Math.max(cur, l - 400)
      const e = Math.min(b, l + 300)
      if (e <= s) continue
      if (s > cur) fill(cur, s)
      out.push(beat(s, e, 'catch', catchLabel))
      cur = e
    }
    if (cur < b) fill(cur, b)
  }

  let s = 0
  for (const b of [...sim.busy[id]].sort((x, y) => x.from - y.from)) {
    if (b.from > s) gap(s, b.from)
    out.push(b)
    s = b.to
  }
  gap(s, CYCLE + 1)
  return out
}

const timelines = Object.fromEntries(ALL.map((k) => [k, timeline(k)])) as Record<Id, Beat[]>

const talks: Convo[] = (() => {
  const lastEnd: Partial<Record<Id, number>> = {}
  const out: Convo[] = []
  for (const [from, to, at, dur, text] of [...sim.talk].sort((a, b) => a[2] - b[2])) {
    if ((lastEnd[from] ?? -1) > at) continue
    lastEnd[from] = at + dur
    out.push({ id: out.length, from, to, at, end: at + dur, text })
  }
  return out
})()

/** Who an agent hands its nth packet to. */
export const throwTarget = (id: Id, n: number): Id => sim.throws[id][n]?.to ?? 'boss'

const count = (xs: number[], t: number) => xs.filter((x) => x <= t).length

function snapshot(t: number): Snapshot {
  const beats = {} as Snapshot['beats']
  const piles = {} as Snapshot['piles']
  const sent = {} as Snapshot['sent']
  for (const id of ALL) {
    const tl = timelines[id]
    const i = Math.max(0, tl.findIndex((b) => t >= b.from && t < b.to))
    beats[id] = { ...tl[i], index: i }
    sent[id] = count(sim.throws[id].map((x) => x.t), t)
    piles[id] = id === 'boss'
      ? { in: 0, out: ROUTES.length - sent[id] }
      : { in: count(sim.lands[id], t) - count(sim.picks[id], t), out: count(sim.drops[id], t) - sent[id] }
  }
  const says: Snapshot['says'] = {}
  const looks: Snapshot['looks'] = {}
  for (const c of talks) if (t >= c.at && t < c.end) says[c.from] = c
  for (const c of Object.values(says)) looks[c.from] = dirBetween(c.from, c.to)
  for (const c of Object.values(says)) looks[c.to] ??= dirBetween(c.to, c.from)
  return { beats, piles, sent, says, looks }
}

const signature = (s: Snapshot) =>
  ALL.map((k) => `${s.beats[k].index}.${s.piles[k].in}${s.piles[k].out}${s.sent[k]}.${s.says[k]?.id ?? ''}`).join(',')

/** The settled picture shown when motion is reduced. */
const REST = snapshot(CYCLE - 1)

/** Survives remounts so the office resumes where it left off. */
const snapKeep = { t: 0 }

/** Plays the office on a loop while `active`; the clock holds still when it is off screen. */
export function useCrew(active: boolean): Snapshot {
  const [snap, setSnap] = useState<Snapshot>(() => (reducedMotion() ? REST : snapshot(0)))

  useEffect(() => {
    if (reducedMotion() || !active) return
    let elapsed = snapKeep.t
    let last = performance.now()
    let sig = ''
    const tick = () => {
      const now = performance.now()
      elapsed += now - last
      last = now
      snapKeep.t = elapsed
      const s = snapshot(elapsed % CYCLE)
      const k = signature(s)
      if (k !== sig) { sig = k; setSnap(s) }
    }
    tick()
    const id = setInterval(tick, 80)
    return () => clearInterval(id)
  }, [active])

  return snap
}
