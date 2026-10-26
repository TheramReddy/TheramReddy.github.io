import type { CSSProperties } from 'react'

/** Per-piece styles for the `.contact-burst` confetti popper. */
export const CONFETTI = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.2
  const dist = 90 + (i % 5) * 28
  return {
    '--dx': `${Math.cos(angle) * dist}px`,
    '--dy': `${Math.sin(angle) * dist - 30}px`,
    '--rot': `${(i * 67) % 360}deg`,
    '--c': ['#4a5bff', '#0a0a0a', '#ff6b4a', '#ffc933', '#2fc58a'][i % 5],
    '--d': `${(i % 6) * 0.03}s`,
  } as CSSProperties
})
