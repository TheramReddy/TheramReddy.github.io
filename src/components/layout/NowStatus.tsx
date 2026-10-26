import { useEffect, useState } from 'react'

const workThoughts = [
  'Shipping the LIHEAP portals for Georgia DHS',
  'Building the design system behind three connected portals',
  'Leading a junior UX designer through design reviews',
  'Auditing screens against WCAG 2.1 AA with axe and WAVE',
  'Turning mainframe business rules into clear user flows',
  'Pairing with Angular developers on component handoff',
]

const weekendThoughts = [
  'Offline, spending the weekend with family',
  'Slow breakfast, no Figma files open',
  'Out on a walk with the family, phone on silent',
  'Cooking something that is definitely not a prototype',
  'Recharging so Monday’s pixels look sharper',
]

const eveningThoughts = [
  'Logged off from DHS, winding down for the day',
  'Dinner first, design tweaks later',
  'Sketching side ideas, just for fun',
  'Reading up on accessibility patterns after hours',
]

/** Pick the thought list from Georgia (Eastern) time: weekdays 9–5 are DHS work, other weekday hours are evenings, Sat/Sun are family time. */
function thoughtsFor(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(now)
  const day = parts.find((p) => p.type === 'weekday')?.value
  const hour = Number(parts.find((p) => p.type === 'hour')?.value) % 24
  if (day === 'Sat' || day === 'Sun') return weekendThoughts
  return hour >= 9 && hour < 17 ? workThoughts : eveningThoughts
}

/** "What I'm doing right now": a shimmering line that cycles, and an elapsed timer. */
export function NowStatus({ thoughts: override }: { thoughts?: string[] }) {
  const [i, setI] = useState(0)
  const [secs, setSecs] = useState(0)
  const [now, setNow] = useState(() => new Date())
  const thoughts = override ?? thoughtsFor(now)

  useEffect(() => {
    const swap = setInterval(() => setI((n) => n + 1), 3600)
    const tick = setInterval(() => {
      setSecs((s) => s + 1)
      setNow(new Date())
    }, 1000)
    return () => {
      clearInterval(swap)
      clearInterval(tick)
    }
  }, [])

  return (
    <p className="now" role="status" aria-live="off">
      <span className="now-text" key={i}>
        {thoughts[i % thoughts.length]}
      </span>
      <span className="now-time" aria-hidden="true">
        {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}
      </span>
    </p>
  )
}
