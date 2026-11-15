import { LAWS_SOURCE, laws, type LawId } from '@/data/laws'

/**
 * The thinking behind a decision: one principle from growth.design's list, said plainly, then `here`, the line that
 * ties it to the screen or the moment it explains. The name links to the list, so a reader who wants the research
 * can find it.
 */
export function Law({ id, here, className }: { id: LawId; here?: string; className?: string }) {
  const law = laws[id]
  return (
    <p className={className ? `law ${className}` : 'law'}>
      <a className="law-name" href={LAWS_SOURCE} target="_blank" rel="noopener noreferrer" title="From growth.design’s list of cognitive biases and principles">{law.name}</a>
      <span className="law-says">{law.says}</span>
      {here && <span className="law-here">{here}</span>}
    </p>
  )
}
