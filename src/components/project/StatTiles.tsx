import { useEffect, useRef, useState } from 'react'

type Stat = { to: number; suffix?: string; label: string }

/** A row of big pixel numbers that count up once, when they first scroll into view. */
export function StatTiles({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLUListElement>(null)
  const [k, setK] = useState(() => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0))

  useEffect(() => {
    const el = ref.current
    if (!el || k >= 1) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (now: number) => {
        const u = Math.min(1, (now - start) / 1200)
        setK(1 - (1 - u) ** 3)
        if (u < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [k])

  return (
    <ul className="stat-tiles" ref={ref}>
      {stats.map((s) => (
        <li className="stat px-plate" key={s.label}>
          <b aria-label={`${s.to}${s.suffix ?? ''}`}>{Math.round(s.to * k)}{s.suffix}</b>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  )
}
