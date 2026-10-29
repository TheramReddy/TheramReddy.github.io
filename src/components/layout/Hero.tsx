import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { motionTokens } from '@/components/arc/lib/motion-tokens'
import { Link } from 'react-router-dom'
import { site } from '@/data/site'

const CYCLE_MS = 4200
const COLORS = ['#3b8fe8', '#2fa37a', '#e0793a', '#8b5cf6', '#d9467a', '#c99a1c', '#1fa5b8']
const { stagger, blur, duration, ease } = motionTokens
// the frame glides to the next phrase's width: slower and softer than the UI springs, no overshoot
const frameSpring = { type: 'spring', visualDuration: 0.7, bounce: 0 } as const

/** Figma-style selection frame whose text keeps swapping; the frame springs to fit the current phrase. */
function SelectionFrame({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const reduce = useReducedMotion()

  // the first load plays an intro: the cursor drags the frame open from a tiny box, then the first phrase types in
  const [grab, setGrab] = useState(!reduce)
  const intro = useRef(!reduce)
  const frameRef = useRef<HTMLSpanElement>(null)

  // Each cycle: a cursor flies to the corner handle, drags the frame to the next phrase's size, then drifts off.
  useEffect(() => {
    const timers: number[] = []
    if (intro.current) timers.push(window.setTimeout(() => setGrab(false), 1500))
    const tick = () => {
      intro.current = false
      setGrab(true)
      timers.push(window.setTimeout(() => setI((n) => (n + 1) % phrases.length), 800))
      timers.push(window.setTimeout(() => setGrab(false), 2000))
    }
    const loop = window.setInterval(tick, CYCLE_MS)
    timers.push(window.setTimeout(tick, 3400))
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
      initial={reduce ? false : { width: 28, opacity: 0 }}
      animate={{ width: widths[i] || 'auto', opacity: 1 }}
      transition={reduce ? { duration: 0 } : { ...frameSpring, opacity: { duration: 0.35, ease: ease.enter } }}
    >
      {phrases.map((t, n) => (
        <span key={t} ref={(el) => { refs.current[n] = el }} className="frame-measure" aria-hidden="true">
          {[...t].map((ch, k) => <span key={k}>{ch === ' ' ? ' ' : ch}</span>)}
        </span>
      ))}
      <AnimatePresence>
        <span key={phrase} className="frame-text" aria-label={phrase}>
          {[...phrase].map((ch, n) => (
            <motion.span
              key={n}
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, y: '0.5em', filter: `blur(${blur.soft}px)` }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: n * stagger.char + (intro.current ? 0.7 : 0.16), duration: duration.considered, ease: ease.enter } }}
              exit={{ opacity: 0, y: '-0.4em', filter: `blur(${blur.subtle}px)`, transition: { delay: n * stagger.char * 0.4, duration: duration.standard, ease: ease.standard } }}
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
          transition={grab ? { type: 'spring', visualDuration: 0.7, bounce: 0.1 } : { type: 'spring', visualDuration: 0.8, bounce: 0 }}
        >
          <svg viewBox="0 0 16 20" width="18" height="22"><path d="M1 1v15l4.2-3.8L8 19l2.6-1.1-2.8-6.2H14z" /></svg>
          <b>{Math.round(widths[i] || 0)} × {frameRef.current?.offsetHeight ?? 0}</b>
        </motion.span>
      )}
    </motion.span>
  )
}

/** Headline lead-in: each character rises out of a blur, one after the other. */
function Lead({ text }: { text: string }) {
  const reduce = useReducedMotion()
  return (
    <span aria-label={text}>
      {[...text].map((ch, n) => (
        <motion.span
          key={n}
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          initial={reduce ? false : { opacity: 0, y: '0.6em', filter: `blur(${blur.soft}px)` }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: 0.05 + n * stagger.char * 1.4, duration: duration.considered, ease: ease.enter } }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/** Landing intro: a headline with a cycling selection frame, and a link to the work. */
export function Hero() {
  return (
    <header className="hero">
      <h1>
        <Lead text="I make" /> <SelectionFrame phrases={site.disciplines} />
      </h1>
      <p>
        <Link to="/work" className="work-link">check my work<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></Link>
      </p>
    </header>
  )
}
