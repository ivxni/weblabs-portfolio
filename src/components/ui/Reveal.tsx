'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import styles from './Reveal.module.scss';

interface RevealProps {
  children: ReactNode;
  /**
   * Position in der Lesereihenfolge. Erzeugt den Versatz. Wird bei 4 gekappt:
   * Ab dem fünften Element wartet man nur noch, statt etwas wahrzunehmen.
   */
  index?: number;
  as?: ElementType;
  className?: string;
}

const MAX_STAGGER_STEPS = 4;
const STAGGER_MS = 55;

/**
 * Einblendung beim Scrollen — genau einmal.
 *
 * Nicht bei jedem Zurückscrollen erneut: Ein Element, das beim Hoch- und
 * Runterscrollen immer wieder verschwindet, wirkt kaputt.
 *
 * Die Schwelle ist bewusst früh (`rootMargin: -8%`). Ein Element, das erst
 * animiert, wenn es schon zur Hälfte im Bild steht, wirkt hakelig — man sieht
 * es zuerst leer und dann erscheinen.
 */
export function Reveal({ children, index = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Markiert, dass React hydratisiert hat. Das Inline-Skript im `<head>`
    // nimmt die `js`-Klasse zurück, falls diese Markierung ausbleibt — dann
    // greift die versteckende Regel gar nicht erst.
    document.documentElement.setAttribute('data-hydrated', '');

    // Kein Observer nötig, wenn ohnehin nichts animiert werden soll.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    // Was beim Laden schon im Bild steht (oder darüber), wird sofort gezeigt.
    // Sonst hinge der obere Seitenbereich an einem Ereignis, das für bereits
    // sichtbare Elemente gar nicht mehr kommen muss.
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setIsVisible(true);
      return;
    }

    // Sicherheitsnetz. Ein IntersectionObserver ruft seinen Callback direkt
    // nach `observe()` einmal auf — auch wenn nichts schneidet. Bleibt dieser
    // erste Aufruf aus, ist der Beobachter in dieser Umgebung nicht
    // funktionsfähig (blockierende Erweiterung, exotischer Browser,
    // Automatisierung). Dann wird eingeblendet, statt den Inhalt dauerhaft
    // unsichtbar zu lassen.
    //
    // In einem funktionierenden Browser läuft dieser Timer nie in die
    // Einblendung hinein: Der Callback kommt binnen eines Bildes, lange vor
    // den 1200 ms, und räumt den Timer weg.
    let observerResponded = false;

    const observer = new IntersectionObserver(
      (entries) => {
        observerResponded = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setIsVisible(true);
          // Sofort abmelden: Die Einblendung ist ein einmaliges Ereignis, und
          // ein weiterlaufender Observer kostet bei jedem Scrollbild Arbeit.
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );

    observer.observe(node);

    const safetyNet = window.setTimeout(() => {
      if (observerResponded) return;
      setIsVisible(true);
      observer.disconnect();
    }, 1200);

    return () => {
      window.clearTimeout(safetyNet);
      observer.disconnect();
    };
  }, []);

  const delay = Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS;
  const classes = [styles.reveal, isVisible && styles.visible, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      style={delay > 0 ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
