import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { scrollToSection } from '@/lib/me-section'
import { flapSound, keySound, tick } from '@/lib/sfx'

const still = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SPINS = 12
const press = (go: () => void) => (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go() } }

/** A split-flap word. Each tile's reel runs through twelve random letters and overshoots onto its own letter, a beat
 *  after the tile before it, so the word lands unevenly like a real board. It plays once on load, then on hover or
 *  click. With reduced motion the reel steps letter by letter in place instead of scrolling. */
function Flap({ word, delay = 1700 }: { word: string; delay?: number }) {
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
function Prompt({ lines, delay = 2600 }: { lines: string[]; delay?: number }) {
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
function Pill({ children }: { children: string }) {
  const enter = (e: MouseEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return <span className="pill" onMouseEnter={enter}>{children}</span>
}

const WAYS = ['think and work', 'find what they need', 'trust a product', 'make decisions', 'get through the day', 'ask for help']

// the card sits tilted inside its 275×291 artwork; the wind lifts its right corner. The crease runs from A to B,
// 58 units back along each edge from the corner, and the flap swings about that line onto the card.
const STAMP = '/brand/post-card.svg'
const CREASE_SIDE = '246.71,128.36 212.41,245.48 269.99,262.35 304.29,145.23'
const CARD_SIDE = '353.55,-236.35 105.57,610.19 -278.31,497.75 -30.33,-348.79'
// the paper's back is drawn where the flap lands and pre-turned onto the corner, so it only faces you once folded
const BACK = '190.20,175.39 241.09,147.56 218.03,226.28'
const SHADOW = '241.09,147.56 218.03,226.28 186.2,181.4'

/** Landing intro: one written-out line with live words in it, a link to the work, and the Portfolio Post stamp. */
export function Hero() {
  return (
    <header className="hero">
      <h1 className="hero-lede">
        I’ve spent <Pill>my career</Pill> learning how people <em>actually</em> use software, and
        how small decisions keep <Flap word="RESHAPING" /> the way they <Prompt lines={WAYS} />. Because a
        well-crafted experience doesn’t just look good. It makes someone’s day a little easier.
      </h1>
      <p>
        <button type="button" className="work-link" onClick={() => scrollToSection('projects')}>check my work<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></button>
      </p>
      <div className="hero-stamp" aria-hidden="true">
        <svg className="stamp-card" viewBox="0 0 275 291">
          <defs>
            <clipPath id="stamp-card-side"><polygon points={CARD_SIDE} /></clipPath>
            <clipPath id="stamp-crease-side"><polygon points={CREASE_SIDE} /></clipPath>
            <pattern id="stamp-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <rect width=".6" height="5" fill="#1d1d1b" fillOpacity=".55" />
            </pattern>
          </defs>
          <image href={STAMP} width="275" height="291" clipPath="url(#stamp-card-side)" />
          <polygon className="stamp-shadow" points={SHADOW} fill="url(#stamp-hatch)" />
        </svg>
        <svg className="stamp-wind" viewBox="0 0 275 291">
          <path pathLength="1" d="M440 168c-46-6-88 10-130 4s-70-16-104-6c-20 6-24 22-10 26 12 3 18-8 10-14" />
          <path pathLength="1" d="M470 212c-52 2-94-12-142-6s-82 18-126 10" />
          <path pathLength="1" d="M455 246c-40-8-80 6-118 2-30-3-52-14-80-6-16 5-18 19-6 22 10 2 15-7 8-12" />
        </svg>
        <div className="stamp-flap">
          <svg className="stamp-back" viewBox="0 0 275 291">
            <polygon points={BACK} fill="#f4f1e8" stroke="#1d1d1b" strokeWidth=".8" strokeLinejoin="round" />
          </svg>
          <svg className="stamp-front" viewBox="0 0 275 291">
            <image href={STAMP} width="275" height="291" clipPath="url(#stamp-crease-side)" />
          </svg>
        </div>
      </div>
    </header>
  )
}
