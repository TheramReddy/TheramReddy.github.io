import { useState } from 'react'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Feature } from '@/data/projects'

const DISCLAIMER =
  'These screens are not the real product. All screens, menus, labels, and data have been altered or fabricated for illustration.'

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

/** The GIF walkthrough as a plain vertical list: one clip and its note per row. */
export function ActionSlider({ features }: { features: Feature[] }) {
  return (
    <section className="action" id="cs-action" aria-label="See it in action">
      <h3 className="in-action-title">See it in action</h3>
      <ol className="action-list">
        {features.map((f) => (
          <li className="action-item" key={f.gif}>
            <div className="action-shot">
              <img loading="lazy" decoding="async" src={f.gif} alt={f.alt} />
            </div>
            <div className="action-copy">
              <h4>
                {f.title}
                <InfoTip />
              </h4>
              <p>{f.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
