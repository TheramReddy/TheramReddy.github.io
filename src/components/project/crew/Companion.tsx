import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Bot } from './Bot'
import { AGENTS, reducedMotion, type Act, type AgentId, type Dir } from './crew'
import { NAMES } from './Mission'
import './crew.css'

/** Things the agent mutters while you read. Shuffled, never the same line twice in a row. */
const LINES = [
  'still reading?', 'nice scroll', 'I filed that already', 'psst, keep going', 'did you see that?',
  'three tables inside', 'who owns this note?', 'tagging as I go', 'coffee break soon?', 'just passing through',
  'I read the whole PDF', 'p.9 was a scan', 'linking things up', 'this part is good', 'don’t re-ask, search',
  'I brought files', 'one more section', 'you can pause me', 'markdown, always', 'is it lunch yet?',
  'I’m not lost, I’m indexing', 'backlinks found: 2', 'sorting by vibes', 'carry on',
]

const MIN_ROOM = 150
const SIZE = 84

const shuffled = () => [...LINES].sort(() => Math.random() - 0.5)

/**
 * One of the crew hops out of the strip once you scroll past it, then floats in the left margin
 * following the page and saying things. Scroll back up and it walks home.
 */
export function Companion({ sheet, open, onAway }: { sheet: RefObject<HTMLDivElement | null>; open: boolean; onAway: (id: AgentId | null) => void }) {
  const [id] = useState<AgentId>(() => AGENTS[Math.floor(Math.random() * AGENTS.length)])
  const box = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const [out, setOut] = useState(false)
  const [act, setAct] = useState<Act>('idle')
  const [look, setLook] = useState<Dir | undefined>()
  const [say, setSay] = useState<string | null>(null)

  // follow the page
  useEffect(() => {
    const root = sheet.current
    const el = box.current
    const sprite = body.current
    if (!open || !root || !el || !sprite) return
    const reduce = reducedMotion()
    const tile = () => document.querySelector(`.crew:not(.crew-pal) [data-name="${NAMES[id]}"] .bot`)

    let isOut = false
    let shown = false
    let x = 0
    let y = 0
    let size = 0.45
    let last = performance.now()
    let lastScroll = 0
    let lastTop = root.scrollTop
    let heading: Dir | undefined
    let curAct: Act = 'idle'
    let curLook: Dir | undefined
    let raf = 0

    const hide = () => {
      shown = false
      el.style.visibility = 'hidden'
      onAway(null)
    }

    const onScroll = () => {
      const top = root.scrollTop
      if (top !== lastTop) heading = top > lastTop ? 'd' : 'u'
      lastTop = top
      lastScroll = performance.now()
    }
    root.addEventListener('scroll', onScroll, { passive: true })

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const sr = root.getBoundingClientRect()
      const tb = tile()?.getBoundingClientRect()
      const home = tb ? { x: tb.left + tb.width / 2, y: tb.top + tb.height / 2 } : null
      const room = (sr.width - Math.min(sr.width, 1040)) / 2 + 32
      const enabled = room >= MIN_ROOM

      if (!isOut && home && enabled && home.y < sr.top + 140) {
        isOut = true
        shown = true
        x = home.x
        y = home.y
        size = (tb?.width ?? SIZE * 0.45) / SIZE
        el.style.visibility = 'visible'
        setOut(true)
        onAway(id)
      } else if (isOut && (!enabled || !home || home.y > sr.top + 200)) {
        isOut = false
        setOut(false)
        setSay(null)
        if (!enabled || !home) hide()
      }

      if (shown) {
        const bob = reduce ? 0 : Math.sin(now / 700) * 6
        const tx = isOut ? sr.left + room / 2 : home?.x ?? x
        const ty = isOut ? sr.top + sr.height * 0.55 + bob : home?.y ?? y
        const k = reduce ? 1 : 1 - Math.exp(-dt * 5)
        const ts = isOut ? 1 : (tb?.width ?? SIZE * 0.45) / SIZE
        x += (tx - x) * k
        y += (ty - y) * k
        size += (ts - size) * k
        sprite.style.transform = `scale(${size.toFixed(3)})`
        if (!isOut && Math.hypot(tx - x, ty - y) < 4) hide()
        else el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      }

      const scrolling = now - lastScroll < 180
      const nextAct: Act = isOut && scrolling ? 'search' : 'idle'
      if (nextAct !== curAct) { curAct = nextAct; setAct(nextAct) }
      const nextLook = isOut && scrolling ? heading : undefined
      if (nextLook !== curLook) { curLook = nextLook; setLook(nextLook) }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('scroll', onScroll)
      el.style.visibility = 'hidden'
      setOut(false)
      setSay(null)
      onAway(null)
    }
  }, [open, sheet, id, onAway])

  // say something now and then while out
  useEffect(() => {
    if (!out) return
    let bag = shuffled()
    let hideTimer = 0
    let nextTimer = 0
    const speak = () => {
      if (!bag.length) bag = shuffled()
      setSay(bag.pop()!)
      hideTimer = window.setTimeout(() => setSay(null), 3200)
      nextTimer = window.setTimeout(speak, 6500 + Math.random() * 4500)
    }
    nextTimer = window.setTimeout(speak, 1200)
    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer) }
  }, [out])

  return (
    <div className="crew crew-pal" ref={box} data-working="true" style={{ '--c': `var(--a-${id})` } as CSSProperties} aria-hidden="true">
      <div className="pal-in">
        {say && <span className="pal-say"><span className="ap-bubble" key={say} data-say="u">{say}</span></span>}
        <div className="pal-bot" ref={body}><Bot act={act} look={look} size={SIZE} /></div>
      </div>
    </div>
  )
}
