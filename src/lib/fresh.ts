const KEY = 'reloaded-for-chunk'

/**
 * Wraps the import of a lazy chunk. A deploy replaces the hashed chunk files, so a tab left open from before it asks
 * for files that are gone. When that happens the page reloads once to pick up the new build; if the import still
 * fails after that, the error goes to the error boundary, which says so.
 */
export function fresh<T>(load: () => Promise<T>): () => Promise<T> {
  return () => load().then(
    (m) => {
      try { sessionStorage.removeItem(KEY) } catch { /* storage is blocked: nothing to clear */ }
      return m
    },
    (err: unknown) => {
      let again = false
      try {
        again = !sessionStorage.getItem(KEY)
        if (again) sessionStorage.setItem(KEY, '1')
      } catch { /* storage is blocked: don't risk a reload loop */ }
      if (!again) throw err
      location.reload()
      // the page is on its way out; keep the fallback on screen until it goes
      return new Promise<T>(() => {})
    },
  )
}
