/**
 * The landing played as a team at work in a shared file. Five named pointers build the opening screen in passes:
 * research leaves a note, wireframe draws the two cards and their placeholders, copy types the statement (and
 * rewrites one phrase), visual brings in the portrait and switches the chips on, and the owner straightens the
 * portrait and hangs the badge.
 *
 * The page's own elements do the work: each step adds a word to `data-build` on the stage and the stylesheet shows
 * that pass (see "the build" in home.css). The pointers are the only elements made here. Each one runs a single
 * keyframe animation on `transform`, so nothing is laid out again after the one measuring pass at the start.
 *
 * Any click, key, scroll or resize finishes the build at once. This file is loaded only when the build will play.
 */

/** What the landing does for the build when its moment comes. */
type Hooks = { type(): void; art(): void; chips(): void; badge(): void }

/* the statement is typed a word every BEAT; after the rewritten phrase it holds for HOLD (ms) */
const BEAT = 26, HOLD = 700
/* a card's outline takes this long to draw; the stylesheet's clip-path transition is the same length and curve */
const DRAW = 500, EASE = 'cubic-bezier(.4, 0, .2, 1)'
/* how far off the wireframe places the portrait before the owner straightens it; the stylesheet has the same 12px */
const OFF = 12

/* when each pass happens, in ms from the start */
const T = { note: 350, frameB: 400, bars: 950, type: 1300, frameA: 1450, img: 2000, fill: 2150, art: 2450, chips: 3150, fix: 3550, badge: 4150, end: 4800 }

const CREW = ['research', 'wireframe', 'copy', 'visual', 'dasavanth'] as const
const ARROW = '<svg viewBox="0 0 14 18" aria-hidden="true"><path d="M1 1v14l4-4 3 6 2-1-3-6h6z"/></svg>'

/** A point on a pointer's path: when (ms), then where (px from the stage's corner). */
type Pt = [at: number, x: number, y: number]

export function build(root: HTMLElement, hooks: Hooks): () => void {
  // ---- measure once: everything a pointer visits, from the stage's corner
  const o = root.getBoundingClientRect()
  const box = (el: Element | null) => {
    const r = el?.getBoundingClientRect() ?? o
    return { l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top, cx: r.left - o.left + r.width / 2, cy: r.top - o.top + r.height / 2, h: r.height }
  }
  const find = (sel: string) => box(root.querySelector(sel))
  const me = find('.is-me'), text = find('.intro-text'), fig = find('.intro-figure')
  const flap = find('.is-live'), prompt = find('.keep .is-live')
  const words = [...root.querySelectorAll('.say .w')]
  const plain = words.findIndex((w) => w.classList.contains('is-plain'))
  const spots = words.map(box)
  /* when word n is typed, from the start of typing: the stylesheet works out the same delay from these two */
  const typed = (n: number) => n * BEAT + (n > plain ? HOLD : 0)
  root.style.setProperty('--bb', `${BEAT}ms`)
  root.style.setProperty('--hold', `${HOLD}ms`)

  // ---- the pointers and the note
  const layer = document.createElement('div')
  layer.className = 'crew'
  layer.setAttribute('aria-hidden', 'true')
  layer.innerHTML = `<p class="crew-note" style="right:${Math.round(o.width - text.r + 24)}px;top:${Math.round(text.t + 24)}px">people just want to finish.</p>`
    + CREW.map((name) => `<div class="crew-ptr">${ARROW}<b>${name}</b></div>`).join('')
  root.append(layer)
  const [research, wireframe, copy, visual, owner] = [...layer.querySelectorAll<HTMLElement>('.crew-ptr')]
  owner.classList.add('is-own')

  const out = { top: -40, left: -40, right: o.width + 40, bottom: o.height + 40 }
  const moves: Animation[] = []
  /** Runs a pointer along its path. It fades in on the way to its first stop and out on the way from its last. */
  const move = (el: HTMLElement, path: Pt[], easing = EASE) => {
    const frames = path.map(([at, x, y], n) => ({ transform: `translate(${Math.round(x)}px, ${Math.round(y)}px)`, opacity: n === 0 || n === path.length - 1 ? 0 : 1, offset: at / T.end, easing }))
    moves.push(el.animate([{ ...frames[0], offset: 0 }, ...frames], { duration: T.end, fill: 'both' }))
  }

  move(research, [[0, text.r - 140, out.top], [T.note, text.r - 60, text.t + 44], [900, text.r - 60, text.t + 44], [1350, out.right, text.t + 80]])
  move(wireframe, [
    [200, text.l - 80, out.top], [T.frameB, text.l, text.t], [T.frameB + DRAW, text.r, text.b], [T.bars + 200, text.cx, text.cy],
    [T.frameA, me.l, me.t], [T.frameA + DRAW, me.r, me.b], [T.img + 50, fig.cx, fig.cy], [2250, fig.cx, fig.cy], [2700, out.left, me.b + 20],
  ])
  // copy follows its own typing: the end of each word as it lands, and back and forth over the phrase it rewrites
  const draft = spots[plain], last = T.type + typed(words.length - 1)
  move(copy, [
    [1000, text.cx, out.bottom], [T.type, spots[0].l, spots[0].b],
    ...spots.slice(0, plain).map((s, n): Pt => [T.type + typed(n) + 60, s.r, s.b]),
    [T.type + typed(plain) + 280, draft.r, draft.b], [T.type + typed(plain) + 480, draft.r, draft.b], [T.type + typed(plain) + 660, draft.l + 8, draft.b],
    ...spots.slice(plain).map((s, n): Pt => [T.type + typed(plain + n) + (n ? 60 : HOLD + 60), s.r, s.b]),
    [last + 500, text.r + 60, out.bottom],
  ], 'linear')
  move(visual, [
    [2100, out.right, me.t + 100], [T.art, fig.cx + 30, fig.cy], [2900, fig.cx + 30, fig.cy],
    [T.chips, flap.cx, flap.cy + 6], [3450, prompt.cx, prompt.cy + 6], [3650, prompt.cx, prompt.cy + 6], [4050, out.right, text.b - 60],
  ])
  const hold = fig.t + fig.h * 0.2, neck = fig.t + fig.h * 0.72
  move(owner, [
    [3050, me.l + 40, out.bottom], [3500, fig.cx - 40, hold], [T.fix, fig.cx - 40, hold], [T.fix + 350, fig.cx - 40 + OFF, hold],
    [T.badge, fig.cx + OFF + 26, neck], [4350, fig.cx + OFF + 26, neck], [T.end, out.left, me.b],
  ])

  // ---- the passes, in order: each shows on the page by adding its word to data-build
  const show = (word: string) => { root.dataset.build = `${root.dataset.build} ${word}`.trim() }
  const steps: [at: number, run: () => void][] = [
    [T.note, () => layer.classList.add('has-note')],
    [T.frameB, () => show('frame-b')],
    [T.bars, () => show('bars')],
    [T.type, hooks.type],
    [T.frameA, () => show('frame-a')],
    [T.img, () => show('img')],
    [T.fill, () => show('fill')],
    [T.art, () => { show('art'); hooks.art() }],
    [T.chips, () => { show('chips'); hooks.chips() }],
    [T.fix, () => show('fix')],
    [T.badge, hooks.badge],
    [T.end - 400, () => layer.classList.add('is-off')],
    [T.end, () => finish(false)],
  ]
  let next = 0
  const timers = steps.map(([at], n) => window.setTimeout(() => { if (next === n) steps[next++][1]() }, at))

  const skip = () => finish(true)
  const signals = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'resize'] as const
  const clear = () => {
    timers.forEach(clearTimeout)
    signals.forEach((name) => window.removeEventListener(name, skip))
    moves.forEach((m) => m.cancel())
    layer.remove()
  }
  /** Ends the build. Cut short, every pass still to come happens at once, with no transitions. */
  function finish(early: boolean) {
    if (early) {
      show('skip')
      window.setTimeout(() => {
        if (root.dataset.build !== undefined) root.dataset.build = root.dataset.build.split(' ').filter((w) => w !== 'skip').join(' ')
      }, 300)
    }
    clear()
    while (next < steps.length - 1) steps[next++][1]()
    next = steps.length
  }
  signals.forEach((name) => window.addEventListener(name, skip, { passive: true }))

  return clear
}
