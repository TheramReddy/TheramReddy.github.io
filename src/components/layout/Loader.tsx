import { useEffect, useState } from 'react'

export function Loader() {
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={done ? 'loader done' : 'loader'} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  )
}
