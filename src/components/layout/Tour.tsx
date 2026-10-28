import { createPortal } from 'react-dom'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Briefcase, FolderOpen, Mail, User, X } from 'lucide-react'
import '@/styles/tour.css'

const steps = [
  { id: 'me', Icon: User, title: "Hi, I'm Dasavanth", body: "A short intro, and what I'm working on right now." },
  { id: 'work', Icon: Briefcase, title: "Where I've worked", body: 'My past roles and what I built in each.' },
  { id: 'projects', Icon: FolderOpen, title: "What I've built", body: 'Open a project to see how it looks and how I put it together.' },
  { id: 'contact', Icon: Mail, title: 'Get in touch', body: 'Got an idea or a role in mind? Send me a message here.' },
]

type Box = { x: number; y: number; w: number; h: number; text: string }

function read(id: string): Box | null {
  const el = document.querySelector<HTMLElement>(`[data-tour="${id}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height, text: el.textContent ?? '' }
}

/** Walkthrough that highlights each nav button in turn. Shown on request from the Fun components. */
export function Tour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<number | null>(null)
  const [box, setBox] = useState<Box | null>(null)

  useEffect(() => {
    setStep(open ? 0 : null)
  }, [open])

  const close = useCallback(() => {
    setStep(null)
    onClose()
  }, [onClose])

  const go = useCallback((i: number) => {
    if (i >= steps.length) return close()
    setStep(i)
  }, [close])

  useLayoutEffect(() => {
    if (step === null) return
    const measure = () => setBox(read(steps[step].id))
    measure()
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [step])

  useEffect(() => {
    if (step === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); close() }
      if (e.key === 'ArrowRight' || e.key === 'Enter') go(step + 1)
      if (e.key === 'ArrowLeft' && step > 0) go(step - 1)
    }
    addEventListener('keydown', onKey, true)
    return () => removeEventListener('keydown', onKey, true)
  }, [step, go, close])

  if (step === null || !box) return null
  const s = steps[step]
  const below = box.y < innerHeight / 2
  const W = Math.min(320, innerWidth - 32)
  const left = Math.max(16, Math.min(box.x + box.w / 2 - W / 2, innerWidth - W - 16))
  const arrow = box.x + box.w / 2 - left
  const pos = below ? { top: box.y + box.h + 18 } : { bottom: innerHeight - box.y + 18 }

  // portalled to <body>: inside a scrolling, transformed panel `position: fixed` no longer means the viewport
  return createPortal(
    <div className="tour" role="dialog" aria-label="Site tour" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="tour-ring" style={{ left: box.x - 12, top: box.y - 8, width: box.w + 24, height: box.h + 16 }}>
        <span className="label">{box.text}</span>
      </div>
      <div className={`tour-card ${below ? 'below' : 'above'}`} style={{ ...pos, left, width: W, ['--arrow' as string]: `${arrow}px` }}>
        <button className="tour-x" aria-label="Skip tour" onClick={close}><X size={18} /></button>
        <s.Icon className="tour-icon" size={30} strokeWidth={1.75} />
        <h2>{s.title}</h2>
        <p>{s.body}</p>
        <div className="tour-foot">
          <span>{step + 1} of {steps.length}</span>
          <button className="tour-next" onClick={() => go(step + 1)}>
            {step === steps.length - 1 ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
