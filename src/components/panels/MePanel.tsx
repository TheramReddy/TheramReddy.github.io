import { Hero } from '@/components/layout/Hero'
import { cn } from '@/lib/utils'

export function MePanel({ open }: { open: boolean }) {
  return (
    <section className={cn('panel me', open && 'open')} aria-label="About me" aria-hidden={!open}>
      <div className="inner">
        <Hero />
      </div>
    </section>
  )
}
