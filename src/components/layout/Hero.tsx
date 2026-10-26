import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { NowStatus } from './NowStatus'

type Kind = 'spark' | 'flower' | 'burst' | 'star' | 'plus'
const order: Kind[] = ['spark', 'flower']
const [role, ...phrases] = site.disciplines

/** Animated glyphs separating the hero phrases. */
function Glyph({ kind }: { kind: Kind }) {
  return (
    <svg className={`glyph glyph-${kind}`} viewBox="0 0 24 24" aria-hidden="true">
      {kind === 'spark' && <path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2L4.2 19.8" />}
      {kind === 'burst' && <path d="M12 1v22M2.5 6.5l19 11M2.5 17.5l19-11" />}
      {kind === 'plus' && <path d="M12 3v18M3 12h18" />}
      {kind === 'star' && <path className="fill" d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" />}
      {kind === 'flower' && (
        <g className="fill">
          {[0, 45, 90, 135].map((r) => (
            <ellipse key={r} cx="12" cy="12" rx="3.2" ry="10.5" transform={`rotate(${r} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="2.6" className="eye" />
        </g>
      )}
    </svg>
  )
}

/** Live local date and time, ticking each second but only re-rendering digits that changed. */
function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const date = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return (
    <time className="clock" dateTime={now.toISOString()}>
      <span className="clock-date">{date}</span>
      <span className="clock-time" key={time}>{time}</span>
    </time>
  )
}

/** Landing intro: name, disciplines separated by animated glyphs, and a contact nudge. */
export function Hero() {
  return (
    <header className="hero">
      <h1>
        <span>
          {site.name}&nbsp;
          <span className="role-chip">{role}</span>
        </span>{' '}
        {phrases.map((t, i) => (
          <Fragment key={t}>
            <span>
              {t}&nbsp;
              <Glyph kind={order[i]} />
            </span>{' '}
          </Fragment>
        ))}
      </h1>
      <p>
        <Link to="/contact">Contact me here</Link> if you want to collaborate or <Link to="/work">check my work</Link>.
      </p>
      <div className="me">
        <LiveClock />
      </div>
      <NowStatus />
    </header>
  )
}
