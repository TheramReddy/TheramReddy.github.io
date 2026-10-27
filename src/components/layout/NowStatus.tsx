import { useEffect, useState } from 'react'
import { PixelLife, type Activity } from './PixelLife'

/** `tag` is the small side note shown beside the line. */
type Thought = { text: string; tag: string; act: Activity }

const workThoughts: Thought[] = [
  { text: 'Shipping the LIHEAP portals for Georgia DHS', tag: 'ship it', act: 'work' },
  { text: 'Building the design system behind three connected portals', tag: 'tokens on', act: 'work' },
  { text: 'Leading a junior UX designer through design reviews', tag: 'mentor mode', act: 'work' },
  { text: 'Auditing screens against WCAG 2.1 AA with axe and WAVE', tag: 'contrast ok', act: 'work' },
  { text: 'Turning mainframe business rules into clear user flows', tag: 'decoding rules', act: 'work' },
  { text: 'Pairing with Angular developers on component handoff', tag: 'handoff time', act: 'work' },
]

const weekendThoughts: Thought[] = [
  { text: 'Offline, spending the weekend with family', tag: 'family mode', act: 'read' },
  { text: 'Slow breakfast, no Figma files open', tag: 'pancake o’clock', act: 'eat' },
  { text: 'Out on a walk with the family, phone on silent', tag: 'phone on silent', act: 'walk' },
  { text: 'Cooking something that is definitely not a prototype', tag: 'chef mode', act: 'cook' },
  { text: 'Recharging so Monday’s pixels look sharper', tag: 'battery low', act: 'sleep' },
]

const eveningThoughts: Thought[] = [
  { text: 'Logged off from DHS, winding down for the day', tag: 'logged off', act: 'read' },
  { text: 'Dinner first, design tweaks later', tag: 'dinner o’clock', act: 'eat' },
  { text: 'Sketching side ideas, just for fun', tag: 'just for fun', act: 'sketch' },
  { text: 'Reading up on accessibility patterns after hours', tag: 'nerding out', act: 'read' },
]

const nightThoughts: Thought[] = [
  { text: 'Asleep, recharging for tomorrow’s pixels', tag: 'zzz', act: 'sleep' },
  { text: 'Dreaming in auto layout', tag: 'auto layout', act: 'sleep' },
  { text: 'Offline until morning, do not disturb', tag: 'do not disturb', act: 'sleep' },
]

/** Temporary: cycle one line per activity so every animation can be checked. Set to false to follow the clock again. */
const PREVIEW_ALL = true

const allActivities = (): Thought[] => {
  const seen = new Set<Activity>()
  return [...workThoughts, ...eveningThoughts, ...weekendThoughts, ...nightThoughts].filter((t) => !seen.has(t.act) && !!seen.add(t.act))
}

/** Day and hour in Georgia (Eastern) time. */
function easternTime(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(now)
  const day = parts.find((p) => p.type === 'weekday')?.value
  return { weekend: day === 'Sat' || day === 'Sun', hour: Number(parts.find((p) => p.type === 'hour')?.value) % 24 }
}

/** Pick the thought list: nights are sleep, weekdays 9–5 are DHS work, other weekday hours are evenings, Sat/Sun days are family time. */
function thoughtsFor(now: Date) {
  const { weekend, hour } = easternTime(now)
  if (hour >= 23 || hour < 6) return nightThoughts
  if (weekend) return weekendThoughts
  return hour >= 9 && hour < 17 ? workThoughts : eveningThoughts
}

/** "What I'm doing right now": a pixel person acting it out, a shimmering line that cycles, and a short side note. */
export function NowStatus() {
  const [i, setI] = useState(0)
  const [now, setNow] = useState(() => new Date())
  const thoughts = PREVIEW_ALL ? allActivities() : thoughtsFor(now)
  const thought = thoughts[i % thoughts.length]

  useEffect(() => {
    const swap = setInterval(() => setI((n) => n + 1), 3600)
    const tick = setInterval(() => setNow(new Date()), 1000)
    return () => {
      clearInterval(swap)
      clearInterval(tick)
    }
  }, [])

  return (
    <div className="now-wrap">
      <PixelLife activity={thought.act} />
      <p className="now" role="status" aria-live="off">
        <span className="now-text" key={i}>
          {thought.text}
        </span>
        <span className="now-tag" aria-hidden="true">
          {thought.tag}
        </span>
      </p>
    </div>
  )
}
