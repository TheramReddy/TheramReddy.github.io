import { useState } from 'react'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Feature } from '@/data/projects'

const DISCLAIMER =
  'These screens are not the real product. This is a fictional recreation made for portfolio purposes. Every screen, menu, label and piece of data has been changed or made up, and nothing shows a real system or confidential information.'

/** Disclaimer icon. Hover/focus on desktop; tap to toggle on touch, where Radix tooltips never open on their own. */
function InfoTip() {
  const [open, setOpen] = useState(false)
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger
          className="action-info"
          aria-label={DISCLAIMER}
          onPointerDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault()
            setOpen((o) => !o)
          }}
        >
          <Info size={16} aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent side="top" collisionPadding={16} className="tip-bubble">{DISCLAIMER}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/** Every clip in one grid at the end. Plain tiles: no zoom, and the images resist dragging and right-click saving. */
export function Gallery({ features }: { features: Feature[] }) {
  return (
    <section className="shots" id="cs-gallery" aria-label="Gallery">
      <h3 className="in-action-title">Gallery<InfoTip /></h3>
      <ul className="shots-grid">
        {features.map((f) => (
          <li key={f.gif} className="shots-tile" onContextMenu={(e) => e.preventDefault()}>
            <img loading="lazy" decoding="async" draggable={false} src={f.gif} alt={f.alt} />
          </li>
        ))}
      </ul>
    </section>
  )
}
