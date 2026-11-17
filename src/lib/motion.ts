/** True when the visitor has asked for less motion. Read when called, so a change of the setting is picked up. */
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
