"use client";

import { cloneElement, useId, useState } from "react";
import type { ReactElement } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { motionTokens } from "../lib/motion-tokens";
import styles from "./tooltip.module.css";

export interface TooltipProps { label: string; children: ReactElement<Record<string, unknown>>; gap?: number }

/** A small label that rises in above its trigger on hover or keyboard focus. Portalled, so overflow clipping never cuts it off. */
export function Tooltip({ label, children, gap = 8 }: TooltipProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const show = (el: Element) => { const r = el.getBoundingClientRect(); setPos({ x: r.left + r.width / 2, y: r.top - gap }); };
  const hide = () => setPos(null);
  return (
    <>
      {cloneElement(children, {
        "aria-describedby": pos ? id : undefined,
        onMouseEnter: (e: React.MouseEvent) => show(e.currentTarget),
        onMouseLeave: hide,
        onFocus: (e: React.FocusEvent) => show(e.currentTarget),
        onBlur: hide,
      })}
      {createPortal(
        <AnimatePresence>
          {pos && (
            <motion.div
              key="tip" id={id} role="tooltip" className={`kit ${styles.tip}`} style={{ left: pos.x, top: pos.y }}
              initial={{ opacity: 0, y: reduce ? 0 : 4, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.enter } }}
              exit={{ opacity: 0, transition: { duration: motionTokens.duration.instant } }}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
