import { Fragment, memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type RefObject } from 'react'
import { site } from '@/data/site'
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

/** Landing screen: the name large in the middle with a design lens drifting over it, and the written-out line with
 *  its live words, plus the link to the work, set small in the bottom-right corner. */
export function Hero() {
  return (
    <header className="hero">
      <div className="hero-center">
        <p className="hero-role">Product Designer</p>
        <NameLens name={site.name} />
      </div>
      <div className="hero-note">
        <p className="hero-lede">
          I’ve spent <Pill>my career</Pill> learning how people <em>actually</em> use software, and
          how small decisions keep <Flap word="RESHAPING" /> the way they <Prompt lines={WAYS} />. Because a
          well-crafted experience doesn’t just look good. It makes someone’s day a little easier.
        </p>
        <p className="hero-more">
          <button type="button" className="work-link" onClick={() => scrollToSection('projects')}>check my work<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></button>
        </p>
      </div>
    </header>
  )
}

/** The name with a glass lens over it. Through the lens the name is magnified and shows how it is built: ink letter
 *  outlines on the 8px grid, the cap height, x-height and baseline with their measured sizes, every letter's box, and
 *  at each end of a line the line height, side bearing and tracking, plus a readout of the letter under the lens. The lens drifts along the name on its own, follows the pointer (or a finger dragged across
 *  the name) while it is over the hero, and squashes a little in the direction it moves. It only ever travels along
 *  the line of the name, so it never covers the role above or the note below. With reduced motion it rests on the
 *  name and moves only with the pointer. */
type Glyph = { ch: string; left: number; right: number; width: number; line: number }
type Line = { top: number; mid: number; left: number; right: number }
/** everything measured from the name in one pass: the face, its cap and x heights, and what the lens annotates
 *  (line height, tracking, the side bearing at each end and every letter's box) */
type Spec = {
  face: string
  cap: number
  x: number
  lh: number
  track: number
  bl: number
  boxes: { left: number; top: number; width: number }[]
  lines: Line[]
}
const minus = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`)

/** the magnified spec's labels and annotations; memoised, so the readout changing letter does not rebuild them */
const SpecMarks = memo(function SpecMarks({ spec, marks }: { spec: Spec; marks: RefObject<HTMLSpanElement | null> }) {
  return (
    <>
      <span className="lens-marks" ref={marks}>
        <span className="anno-label" style={{ top: 'var(--cap)' }}>cap {spec.cap}</span>
        <span className="anno-label" style={{ top: 'var(--xh)' }}>x {spec.x}</span>
        <span className="anno-label" style={{ top: 'var(--base)' }}>base</span>
      </span>
      <span className="lens-anno">
        {spec.boxes.map((b, i) => (
          <i key={i} className="anno-glyph" style={{ left: b.left, top: b.top, width: b.width, height: spec.lh }} />
        ))}
        {spec.lines.map((l, i) => {
          const mid = `calc(${l.top}px + (var(--xh) + var(--base)) / 2)`
          return (
            <span key={i}>
              <i className="anno-bear" style={{ left: l.left, top: l.top, width: spec.bl, height: spec.lh }} />
              {[
                { side: 'is-start', dim: l.left - 16, edge: l.left, note: `bearing ${spec.bl}` },
                { side: 'is-end', dim: l.right + 16, edge: l.right, note: `tracking ${minus(spec.track)}` },
              ].map((e) => (
                <Fragment key={e.side}>
                  <span className={`anno-dim ${e.side}`} style={{ left: e.dim, top: l.top, height: spec.lh }}>
                    <span className="anno-label">line-height {spec.lh}</span>
                  </span>
                  <span className={`anno-label anno-note ${e.side}`} style={{ left: e.edge, top: mid }}>
                    {e.note}
                  </span>
                </Fragment>
              ))}
            </span>
          )
        })}
      </span>
    </>
  )
})

function NameLens({ name }: { name: string }) {
  const box = useRef<HTMLDivElement>(null)
  const specRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const marksRef = useRef<HTMLSpanElement>(null)
  const readRef = useRef<HTMLSpanElement>(null)
  const [spec, setSpec] = useState<Spec | null>(null)
  const [glyph, setGlyph] = useState<{ ch: string; width: number } | null>(null)

  useEffect(() => {
    const el = box.current
    const h1 = el?.querySelector('h1')
    const area = el?.closest<HTMLElement>('.hero')
    const c = document.createElement('canvas').getContext('2d')
    if (!el || !h1 || !area || !c) return
    const calm = still()

    // ---- measuring: the face's real metrics, and where every letter and line of the name sits ----
    let glyphs: Glyph[] = []
    let lines: Line[] = []
    let em = 0, r = 0, zoom = 1
    const measure = () => {
      const cs = getComputedStyle(h1)
      em = parseFloat(cs.fontSize)
      c.font = `${cs.fontWeight} ${em}px ${cs.fontFamily}`
      const H = c.measureText('H')
      const x = c.measureText('x')
      const base = (em - (H.fontBoundingBoxAscent + H.fontBoundingBoxDescent)) / 2 + H.fontBoundingBoxAscent
      el.style.setProperty('--em', `${em}px`)
      el.style.setProperty('--base', `${base}px`)
      el.style.setProperty('--cap', `${base - H.actualBoundingBoxAscent}px`)
      el.style.setProperty('--xh', `${base - x.actualBoundingBoxAscent}px`)
      el.style.setProperty('--w', `${el.offsetWidth}px`)
      el.style.setProperty('--h', `${el.offsetHeight}px`)
      // the lens radius and zoom are set in CSS; read them back now the size is known
      zoom = parseFloat(getComputedStyle(el).getPropertyValue('--zoom')) || 1
      r = specRef.current ? specRef.current.offsetWidth / 2 : 0

      const origin = el.getBoundingClientRect()
      const text = h1.firstChild
      const chars = text?.textContent ?? ''
      glyphs = []
      lines = []
      const range = document.createRange()
      for (let i = 0; text && i < chars.length; i++) {
        range.setStart(text, i)
        range.setEnd(text, i + 1)
        const b = range.getBoundingClientRect()
        const top = b.top - origin.top
        let line = lines.findIndex((l) => Math.abs(l.top - top) < em / 2)
        const left = b.left - origin.left
        const right = b.right - origin.left
        if (line < 0) { lines.push({ top, mid: top + b.height / 2, left, right }); line = lines.length - 1 }
        lines[line].left = Math.min(lines[line].left, left)
        lines[line].right = Math.max(lines[line].right, right)
        glyphs.push({ ch: chars[i], left, right, width: b.width, line })
      }
      if (!lines.length) return
      // side bearing: the room the face leaves between the start of the text box and the first letter's ink
      const first = c.measureText(chars[0])
      setSpec({
        face: `${cs.fontFamily.split(',')[0].replace(/["']/g, '').replace(/ Variable$/, '')} ${Math.round(em)}px`,
        cap: Math.round(H.actualBoundingBoxAscent),
        x: Math.round(x.actualBoundingBoxAscent),
        lh: Math.round(parseFloat(cs.lineHeight)),
        track: Math.round((parseFloat(cs.letterSpacing) || 0) * 10) / 10,
        bl: Math.max(0, Math.round(-first.actualBoundingBoxLeft)),
        boxes: glyphs.filter((g) => g.ch.trim()).map((g) => ({ left: g.left, top: lines[g.line].top, width: g.width })),
        lines,
      })
      // the readout always sits under the last line, so on a wrapped name it never lands on the second line
      el.style.setProperty('--read', `${lines[lines.length - 1].mid}px`)
    }

    // ---- motion: everything moves by translate and scale only, so a frame is composited rather than laid out ----
    let x = -1, y = 0, tx = 0, ty = 0, lastX = 0, lastY = 0, sx = 0, sy = 0
    let aim = false, raf = 0, on = false, shown = ''
    let readText: string | null = null, half = 0
    const t0 = performance.now()
    const nearestLine = (py: number) => lines.reduce((b, l, i) => (Math.abs(l.mid - py) < Math.abs(lines[b].mid - py) ? i : b), 0)

    const frame = (now: number) => {
      raf = 0
      if (!lines.length) return
      const w = el.offsetWidth
      if (!aim) {
        const t = (now - t0) / 1000
        const line = lines[lines.length > 1 && Math.sin(t * 0.16) < 0 ? lines.length - 1 : 0]
        // it sweeps the full line, end to end, so it dwells at each end where the spacing is annotated
        tx = calm ? w * 0.72 : line.left + (line.right - line.left) * (0.5 + 0.5 * Math.sin(t * 0.32))
        ty = line.mid + (calm ? 0 : em * 0.06 * Math.sin(t * 0.64))
      }
      if (x < 0) { x = lastX = tx; y = lastY = ty }
      const k = calm ? 1 : 0.1
      x += (tx - x) * k
      y += (ty - y) * k
      // squash: stretch along the way it moves, a little, and ease back when it stops
      const vx = x - lastX, vy = y - lastY
      lastX = x; lastY = y
      sx += (Math.min(Math.abs(vx) / 60, 0.08) - sx) * 0.2
      sy += (Math.min(Math.abs(vy) / 60, 0.08) - sy) * 0.2
      const scaleX = 1 + sx - sy, scaleY = 1 + sy - sx
      // the window and the glass squash together; the magnified name inside is counter-scaled so it never distorts
      for (const part of [ringRef.current, specRef.current]) {
        if (part) { part.style.translate = `${x}px ${y}px`; part.style.scale = `${scaleX} ${scaleY}` }
      }
      if (zoomRef.current) {
        zoomRef.current.style.transform = `translate(${r}px, ${r}px) scale(${zoom / scaleX}, ${zoom / scaleY}) translate(${-x - r}px, ${-y - r}px)`
      }
      const line = nearestLine(y)
      if (marksRef.current) marksRef.current.style.translate = `${x}px ${lines[line].top}px`
      el.dataset.ready = ''

      // the readout names the letter under the lens and keeps itself inside the name's width
      const g = glyphs.find((g) => g.line === line && x >= g.left && x < g.right && g.ch.trim())
      const key = g ? `${g.ch}${Math.round(g.width)}` : ''
      if (key !== shown) { shown = key; setGlyph(g ? { ch: g.ch, width: Math.round(g.width) } : null) }
      const read = readRef.current
      if (read) {
        // measure the readout only when its text changes, not on every frame
        if (read.textContent !== readText) { readText = read.textContent; half = read.offsetWidth / 2 }
        read.style.translate = `${Math.min(Math.max(x, half), Math.max(half, w - half)) - half}px 0`
      }

      const moving = Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 || sx + sy > 0.001
      if (on && (!calm || moving)) raf = requestAnimationFrame(frame)
    }
    const start = () => { if (!raf) raf = requestAnimationFrame(frame) }

    // the pointer steers along the name: across freely, and up or down only onto the nearest line of it
    const move = (e: PointerEvent) => {
      if (!lines.length) return
      const b = el.getBoundingClientRect()
      aim = true
      tx = Math.min(Math.max(e.clientX - b.left, 0), b.width)
      ty = lines[nearestLine(e.clientY - b.top)].mid
      start()
    }
    const leave = () => { aim = false; start() }
    // a resize remeasures at most once a frame, and only when the name's box has actually changed size
    let size = '', pending = 0
    const remeasure = () => {
      pending = 0
      const now = `${el.offsetWidth}x${el.offsetHeight}`
      if (now === size) return
      size = now
      measure()
      start()
    }
    const queue = () => { if (!pending) pending = requestAnimationFrame(remeasure) }

    // once the web font has loaded the letters change width, so measure again even if the box has not resized
    document.fonts.ready.then(() => { size = ''; queue() })
    const ro = new ResizeObserver(queue)
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) start() })
    io.observe(el)
    area.addEventListener('pointermove', move)
    area.addEventListener('pointerleave', leave)
    area.addEventListener('pointercancel', leave)
    return () => {
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
      cancelAnimationFrame(pending)
      area.removeEventListener('pointermove', move)
      area.removeEventListener('pointerleave', leave)
      area.removeEventListener('pointercancel', leave)
    }
  }, [])

  return (
    <div className="lens" ref={box}>
      <h1 className="hero-name">{name}</h1>
      <div className="lens-spec" ref={specRef} aria-hidden="true">
        <div className="lens-zoom" ref={zoomRef}>
          <span className="hero-name lens-type">{name}</span>
          {spec && <SpecMarks spec={spec} marks={marksRef} />}
        </div>
      </div>
      <div className="lens-ring" ref={ringRef} aria-hidden="true" />
      {spec && (
        <span className="lens-read" ref={readRef} aria-hidden="true">
          {glyph ? <><b>{glyph.ch}</b> · {glyph.width}px wide · </> : null}{spec.face}
        </span>
      )}
    </div>
  )
}
