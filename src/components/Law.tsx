import { laws, type LawId } from '@/data/laws'

/**
 * The thinking behind a decision: one principle, said plainly, then `here`, the line that ties it to the screen or
 * the moment it explains.
 */
export function Law({ id, here, className }: { id: LawId; here?: string; className?: string }) {
  const law = laws[id]
  return (
    <p className={className ? `law ${className}` : 'law'}>
      <span className="law-says">{law.says}</span>
      {here && <span className="law-here">{here}</span>}
    </p>
  )
}
