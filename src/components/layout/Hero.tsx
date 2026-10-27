import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { motionTokens } from '@/components/arc/lib/motion-tokens'
import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { NowStatus } from './NowStatus'

const CYCLE_MS = 4200
const COLORS = ['#3b8fe8', '#2fa37a', '#e0793a', '#8b5cf6', '#d9467a', '#c99a1c', '#1fa5b8']
const { stagger, spring, blur, duration, ease } = motionTokens

/** Figma-style selection frame whose text keeps swapping; the frame springs to fit the current phrase. */
function SelectionFrame({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const reduce = useReducedMotion()

  const [grab, setGrab] = useState(false)
  const frameRef = useRef<HTMLSpanElement>(null)

  // Each cycle: a cursor flies to the corner handle, drags the frame to the next phrase's size, then drifts off.
  useEffect(() => {
    const timers: number[] = []
    const tick = () => {
      setGrab(true)
      timers.push(window.setTimeout(() => setI((n) => (n + 1) % phrases.length), 700))
      timers.push(window.setTimeout(() => setGrab(false), 1900))
    }
    const loop = window.setInterval(tick, CYCLE_MS)
    timers.push(window.setTimeout(tick, 1200))
    return () => { clearInterval(loop); timers.forEach(clearTimeout) }
  }, [phrases.length])

  useLayoutEffect(() => {
    const measure = () => setWidths(refs.current.map((el) => el?.offsetWidth ?? 0))
    measure()
    document.fonts?.ready.then(measure)
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [])

  const phrase = phrases[i]
  const color = COLORS[i % COLORS.length]
  const rest = { x: 64, y: 44, opacity: 0 }
  return (
    <motion.span
      ref={frameRef}
      className="frame"
      style={{ ['--c' as string]: color }}
      initial={false}
      animate={{ width: widths[i] || 'auto' }}
      transition={reduce ? { duration: 0 } : spring.morph}
    >
      {phrases.map((t, n) => (
        <span key={t} ref={(el) => { refs.current[n] = el }} className="frame-measure" aria-hidden="true">{t}</span>
      ))}
      <AnimatePresence initial={false}>
        <span key={phrase} className="frame-text" aria-label={phrase}>
          {[...phrase].map((ch, n) => (
            <motion.span
              key={n}
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, y: '0.5em', filter: `blur(${blur.text}px)` }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: n * stagger.char + 0.08, duration: duration.considered, ease: ease.enter } }}
              exit={{ opacity: 0, y: '-0.4em', filter: `blur(${blur.text}px)`, transition: { delay: n * stagger.char * 0.5, duration: duration.exit, ease: ease.exit } }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </span>
      </AnimatePresence>
      <i className="handle tl-h" /><i className="handle tr-h" /><i className="handle bl-h" /><i className="handle br-h" />
      {!reduce && (
        <motion.span
          className="cursor"
          aria-hidden="true"
          initial={rest}
          animate={grab ? { x: 0, y: 0, opacity: 1, scale: 1 } : rest}
          transition={grab ? { type: 'spring', visualDuration: 0.6, bounce: 0.15 } : { duration: 0.5, ease: ease.exit }}
        >
          <svg viewBox="0 0 16 20" width="18" height="22"><path d="M1 1v15l4.2-3.8L8 19l2.6-1.1-2.8-6.2H14z" /></svg>
          <b>{Math.round(widths[i] || 0)} × {frameRef.current?.offsetHeight ?? 0}</b>
        </motion.span>
      )}
    </motion.span>
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

/** Landing intro: a headline with a cycling selection frame, and a link to the work. */
export function Hero() {
  return (
    <header className="hero">
      <h1>
        <span>I make</span> <SelectionFrame phrases={site.disciplines} />
      </h1>
      <p>
        <Link to="/work" className="work-link">check my work<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></Link>
      </p>
      <div className="me">
        <LiveClock />
      </div>
      <NowStatus />
    </header>
  )
}
