import { useLayoutEffect, type RefObject } from 'react'

/**
 * Sizes a one-line word so it spans its box exactly: measures it at 100px and writes the matching size to `--fit`
 * on the box. Runs again when the box resizes and once the webfont has loaded.
 */
export function useFit(box: RefObject<HTMLElement | null>, word: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const b = box.current
    const w = word.current
    if (!b || !w) return
    const fit = () => {
      const prev = w.style.fontSize
      w.style.fontSize = '100px'
      const natural = w.offsetWidth
      w.style.fontSize = prev
      const style = getComputedStyle(b)
      const room = b.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      if (natural > 0 && room > 0) b.style.setProperty('--fit', `${((100 * room) / natural).toFixed(2)}px`)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(b)
    document.fonts?.ready.then(fit).catch(() => {})
    return () => ro.disconnect()
  }, [box, word])
}
