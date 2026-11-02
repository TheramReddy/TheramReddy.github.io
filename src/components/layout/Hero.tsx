import { Link } from 'react-router-dom'

// the card sits tilted inside its 275×291 artwork; the wind lifts its right corner. The crease runs from A to B,
// 58 units back along each edge from the corner, and the flap swings about that line onto the card.
const STAMP = '/brand/post-card.svg'
const CREASE_SIDE = '246.71,128.36 212.41,245.48 269.99,262.35 304.29,145.23'
const CARD_SIDE = '353.55,-236.35 105.57,610.19 -278.31,497.75 -30.33,-348.79'
// the paper's back is drawn where the flap lands and pre-turned onto the corner, so it only faces you once folded
const BACK = '190.20,175.39 241.09,147.56 218.03,226.28'
const SHADOW = '241.09,147.56 218.03,226.28 186.2,181.4'

/** Landing intro: a headline, a quiet subline, a link to the work, and the Portfolio Post stamp. */
export function Hero() {
  return (
    <header className="hero">
      <h1>Notice how you read this before anything else?</h1>
      <p className="hero-sub">That’s the job.</p>
      <p>
        <Link to="/work" className="work-link">check my work<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></Link>
      </p>
      <div className="hero-stamp" aria-hidden="true">
        <svg className="stamp-card" viewBox="0 0 275 291">
          <defs>
            <clipPath id="stamp-card-side"><polygon points={CARD_SIDE} /></clipPath>
            <clipPath id="stamp-crease-side"><polygon points={CREASE_SIDE} /></clipPath>
            <pattern id="stamp-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <rect width=".6" height="5" fill="#1d1d1b" fillOpacity=".55" />
            </pattern>
          </defs>
          <image href={STAMP} width="275" height="291" clipPath="url(#stamp-card-side)" />
          <polygon className="stamp-shadow" points={SHADOW} fill="url(#stamp-hatch)" />
        </svg>
        <svg className="stamp-wind" viewBox="0 0 275 291">
          <path pathLength="1" d="M440 168c-46-6-88 10-130 4s-70-16-104-6c-20 6-24 22-10 26 12 3 18-8 10-14" />
          <path pathLength="1" d="M470 212c-52 2-94-12-142-6s-82 18-126 10" />
          <path pathLength="1" d="M455 246c-40-8-80 6-118 2-30-3-52-14-80-6-16 5-18 19-6 22 10 2 15-7 8-12" />
        </svg>
        <div className="stamp-flap">
          <svg className="stamp-back" viewBox="0 0 275 291">
            <polygon points={BACK} fill="#f4f1e8" stroke="#1d1d1b" strokeWidth=".8" strokeLinejoin="round" />
          </svg>
          <svg className="stamp-front" viewBox="0 0 275 291">
            <image href={STAMP} width="275" height="291" clipPath="url(#stamp-crease-side)" />
          </svg>
        </div>
      </div>
    </header>
  )
}
