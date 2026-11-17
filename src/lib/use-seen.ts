import { useEffect, useState, type RefObject } from 'react'

/**
 * True once the element has come into view, and it stays true. `rootMargin` widens the view (to start loading
 * something before it arrives), `threshold` asks for that share of the element to show, and `start` is the value
 * before anything has been seen.
 */
export function useSeen(target: RefObject<HTMLElement | null>, { rootMargin, threshold, start = false }: { rootMargin?: string; threshold?: number; start?: boolean } = {}) {
  const [seen, setSeen] = useState(start)
  useEffect(() => {
    const el = target.current
    if (!el || seen) return
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) setSeen(true) }, { rootMargin, threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [target, seen, rootMargin, threshold])
  return seen
}
