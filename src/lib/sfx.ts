// Tiny synthesized sounds and a haptic tick for the hero's toys. Nothing is downloaded: each click is a few ms of
// filtered noise. Browsers keep audio locked until the visitor's first click or key press on the page, so sounds
// asked for before that are skipped quietly, and the first gesture anywhere unlocks them for good.

let ctx: AudioContext | null = null
let noise: AudioBuffer | null = null

function audio() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate)
    const d = noise.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  return ctx
}

if (typeof window !== 'undefined') {
  const unlock = () => { audio()?.resume().catch(() => {}) }
  window.addEventListener('pointerdown', unlock, { once: true, capture: true })
  window.addEventListener('keydown', unlock, { once: true, capture: true })
}

/** One click: a noise burst through a band-pass, `at` seconds from now. */
function click(at: number, { freq, q = 1.2, gain, len }: { freq: number; q?: number; gain: number; len: number }) {
  const ac = audio()
  if (!ac || !noise || ac.state !== 'running') return
  const t = ac.currentTime + at
  const src = ac.createBufferSource()
  src.buffer = noise
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = freq
  bp.Q.value = q
  const g = ac.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + len)
  src.connect(bp).connect(g).connect(ac.destination)
  src.start(t)
  src.stop(t + len + 0.01)
}

/** A split-flap board: a soft rattle while the tiles spin, then a clack as each one lands (times in ms). */
export function flapSound(lands: number[]) {
  const end = Math.max(...lands)
  for (let t = 0; t < end; t += 38 + Math.random() * 14) {
    click(t / 1000, { freq: 2600 + Math.random() * 900, q: 2, gain: 0.05, len: 0.018 })
  }
  for (const t of lands) click(t / 1000, { freq: 1500 + Math.random() * 400, q: 1.4, gain: 0.22, len: 0.04 })
}

/** A key press; deletes are lighter. */
export function keySound(soft = false) {
  click(0, { freq: soft ? 3200 : 1800 + Math.random() * 700, q: 1.6, gain: soft ? 0.06 : 0.12, len: 0.03 })
}

// iOS Safari has no vibrate(), but toggling a native switch fires its system haptic; Android gets a 10ms buzz.
let haptic: HTMLLabelElement | null = null
export function tick() {
  try { navigator.vibrate?.(10) } catch { /* not supported */ }
  if (!haptic) {
    haptic = document.createElement('label')
    haptic.setAttribute('aria-hidden', 'true')
    haptic.style.display = 'none'
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.setAttribute('switch', '')
    haptic.appendChild(input)
    document.body.appendChild(haptic)
  }
  haptic.click()
}
