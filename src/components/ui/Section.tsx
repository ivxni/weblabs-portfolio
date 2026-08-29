import type { ReactNode } from 'react';
import styles from './Section.module.scss';

interface SectionProps {
  children: ReactNode;
  id?: string;
  /** Haarlinie über die volle Breite als obere Kante. */
  ruled?: boolean;
  /** Getönte Fläche statt Seitengrund. */
  tinted?: boolean;
  /** Halber vertikaler Rhythmus — für Bänder, nicht für Sektionen. */
  compact?: boolean;
  /** Zugängliche Beschriftung, wenn die Sektion keine sichtbare Überschrift hat. */
  ariaLabel?: string;
  className?: string;
}

export function Section({
  children,
  id,
  ruled = false,
  tinted = false,
  compact = false,
  ariaLabel,
  className,
}: SectionProps) {
  const classes = [
    styles.section,
    ruled && styles.ruled,
    tinted && styles.tinted,
    compact && styles.compact,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes} id={id} aria-label={ariaLabel}>
      {children}
    </section>
  );
}
