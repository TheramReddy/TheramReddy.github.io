"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, X } from "lucide-react";
import styles from "./banner.module.css";

export interface BannerProps { restoreLabel: string; children: ReactNode; more?: ReactNode; className?: string }

/** A dark bar with a close button; once closed, a small link in the same spot brings it back. Pass `more` to add a View more toggle that reveals the longer text. */
export function Banner({ restoreLabel, children, more, className }: BannerProps) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  if (gone) {
    return (
      <button type="button" className={`kit ${styles.restore}`} onClick={() => setGone(false)}>
        {restoreLabel}
      </button>
    );
  }
  return (
    <aside role="note" className={`kit ${styles.banner}${className ? ` ${className}` : ""}`}>
      <div className={styles.body}>
        <p>
          {children}
          {more && (
            <>
              {" "}
              <button type="button" className={styles.toggle} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                {open ? "View less" : "View more"}
                <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </>
          )}
        </p>
        {more && open && <p className={styles.more}>{more}</p>}
      </div>
      <button type="button" className={styles.close} aria-label="Dismiss" onClick={() => setGone(true)}>
        <X size={16} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </aside>
  );
}
