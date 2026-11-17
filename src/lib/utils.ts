import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** A count as two digits: 3 becomes "03". */
export const pad2 = (n: number) => String(n).padStart(2, '0')
