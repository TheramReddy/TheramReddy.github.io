import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { flapSound, keySound, tick } from '@/lib/sfx'

const still = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SPINS = 12
const press = (go: () => void) => (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go() } }

/** A split-flap word. Each tile's reel runs through twelve random letters and overshoots onto its own letter, a beat
 *  after the tile before it, so the word lands unevenly like a real board. It plays once on load, then on hover or
 *  click. With reduced motion the reel steps letter by letter in place instead of scrolling. */
export function Flap({ word, delay = 1700 }: { word: string; delay?: number }) {
  const [reels, setReels] = useState(() => [...word])
  const [run, setRun] = useState(0)
  const cols = useRef<(HTMLSpanElement | null)[]>([])
  const busy = useRef(false)

  const play = useCallback(() => {
    if (busy.current) return
    busy.current = true
    setReels([...word].map(c => Array.from({ length: SPINS }, () => ABC[Math.floor(Math.random() * 26)]).join('') + c))
    setRun(r => r + 1)
  }, [word])

  useLayoutEffect(() => {
    if (!run) return
    const moving = !still()
    const lands: number[] = []
    const at = (n: number) => `translateY(calc(${-n} * var(--cell)))`
    cols.current.forEach((col, i) => {
      if (!col) return
      const wait = 60 * i
      const spin = 600 + 100 * i + 200 * Math.random()
      col.getAnimations().forEach(a => a.cancel())
      if (moving) {
        const a = col.animate([{ transform: at(0) }, { transform: at(SPINS - 2) }], { duration: spin, delay: wait, easing: 'cubic-bezier(.2,0,.8,1)', fill: 'forwards' })
        a.finished.then(() => { col.animate([{ transform: at(SPINS - 2) }, { transform: at(SPINS) }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }) }).catch(() => {})
        lands.push(wait + spin + 120)
      } else {
        col.animate([{ transform: at(0) }, { transform: at(SPINS) }], { duration: spin + 300, delay: wait, easing: `steps(${SPINS}, end)`, fill: 'forwards' })
        lands.push(wait + spin + 300)
      }
    })
    flapSound(lands)
    const done = window.setTimeout(() => { busy.current = false }, Math.max(...lands) + 200)
    return () => { window.clearTimeout(done); busy.current = false }
  }, [run])

  useEffect(() => {
    const t = window.setTimeout(play, delay)
    return () => window.clearTimeout(t)
  }, [play, delay])

  const tap = () => { tick(); play() }
  return (
    <span className="flap" role="button" tabIndex={0} aria-label={word.toLowerCase()} onClick={tap} onKeyDown={press(tap)} onMouseEnter={play}>
      {reels.map((reel, i) => (
        <span className="flap-tile" key={i} aria-hidden="true">
          <span className="flap-reel" ref={el => { cols.current[i] = el }}>
            {[...reel].map((c, j) => <span key={j} className={j === reel.length - 1 ? 'is-on' : undefined}>{c}</span>)}
          </span>
        </span>
      ))}
    </span>
  )
}

/** A terminal chip. It types its first line on load; each click deletes the line and types the next, with a key
 *  sound per letter. A hidden copy of the longest line holds the width so the sentence never shifts. */
export function Prompt({ lines, delay = 2600 }: { lines: string[]; delay?: number }) {
  const [text, setText] = useState('')
  const [at, setAt] = useState(0)
  const busy = useRef(true)
  const timer = useRef(0)
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a))

  const retype = useCallback((from: string, to: string) => {
    busy.current = true
    const step = (cur: string) => {
      if (cur.length && !to.startsWith(cur)) {
        timer.current = window.setTimeout(() => { keySound(true); const n = cur.slice(0, -1); setText(n); step(n) }, 40)
      } else if (cur.length < to.length) {
        timer.current = window.setTimeout(() => { keySound(); const n = to.slice(0, cur.length + 1); setText(n); step(n) }, 55 + Math.random() * 30)
      } else busy.current = false
    }
    step(from)
  }, [])

  useEffect(() => {
    timer.current = window.setTimeout(() => retype('', lines[0]), delay)
    return () => window.clearTimeout(timer.current)
  }, [lines, delay, retype])

  const next = () => {
    if (busy.current) return
    tick()
    const to = (at + 1) % lines.length
    setAt(to)
    retype(lines[at], lines[to])
  }
  return (
    <span className="prompt" role="button" tabIndex={0} aria-label={`${lines[at]}. Show another`} onClick={next} onKeyDown={press(next)}>
      <span className="prompt-sign" aria-hidden="true">&gt;/</span>
      <span className="prompt-line" aria-hidden="true">
        <span className="prompt-size">~{longest}</span>
        <span className="prompt-text">~{text}<span className="prompt-caret" /></span>
      </span>
    </span>
  )
}

/** A grey pill that fills with ink from wherever the pointer comes in. */
export function Pill({ children }: { children: string }) {
  const enter = (e: MouseEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return <span className="pill" onMouseEnter={enter}>{children}</span>
}

export const WAYS = ['think and work', 'find what they need', 'trust a product', 'make decisions', 'get through the day', 'ask for help']
