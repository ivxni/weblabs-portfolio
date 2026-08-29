'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Container } from '@/components/ui/Container';
import styles from './ScrollStatement.module.scss';

interface ScrollStatementProps {
  label: string;
  text: string;
  aside?: readonly { term: string; text: string }[];
}

/** Anteil der Strecke, über den ein einzelnes Wort aufhellt. */
const WORD_SPAN = 0.28;

/**
 * Deckkraft eines noch nicht erreichten Wortes.
 *
 * GERECHNET, nicht gewählt. Der Wert ist die untere Grenze der Gestaltung und
 * zugleich eine Lesbarkeitsfrage: Cremetext bei 0.22 über dem Grund ergibt
 * 4.53:1 — formal knapp bestanden, aber ohne jede Reserve. Bei 0.32 sind es
 * 6.2:1, und der Unterschied zum vollen Wort bleibt trotzdem deutlich sichtbar.
 *
 * Der Effekt darf nicht damit bezahlt werden, dass die Hälfte des Absatzes
 * unlesbar ist. Ein Besucher, der nicht scrollt, muss den Text trotzdem lesen
 * können — `scroll-statement.test.ts` rechnet das nach.
 */
export const DIM = 0.32;

/**
 * Eigenes Bauteil je Wort — nicht aus Ordnungsliebe: `useTransform` ist ein
 * Hook und darf nicht in einer Schleife stehen.
 */
function Word({
  children,
  progress,
  start,
}: {
  children: string;
  progress: MotionValue<number> | null;
  start: number;
}) {
  const constant = useTransform(() => 1);
  const opacity = useTransform(
    progress ?? constant,
    [start, Math.min(1, start + WORD_SPAN)],
    [DIM, 1],
  );
  return (
    <motion.span className={styles.word} style={{ opacity: progress ? opacity : 1 }}>
      {children}
    </motion.span>
  );
}

export function ScrollStatement({ label, text, aside }: ScrollStatementProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /**
   * Vor dem Mounten — und damit auch im ausgelieferten HTML — steht der Absatz
   * vollständig hell da. Erst danach übernimmt die Scrollsteuerung.
   *
   * Ohne das bäckt die Bibliothek den Anfangswert der Deckkraft in das
   * Server-HTML ein: Ohne JavaScript stünde der halbe Absatz dauerhaft
   * abgedunkelt da, und niemand erführe davon.
   */
  const [isInteractive, setIsInteractive] = useState(false);
  useEffect(() => {
    document.documentElement.setAttribute('data-hydrated', '');
    setIsInteractive(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    // Beginnt, wenn der Absatz zu drei Vierteln ins Bild gekommen ist, und
    // endet, wenn seine Unterkante die Mitte erreicht. Wäre das Ende weiter
    // unten, müsste man über den Absatz hinausscrollen, um ihn fertig zu lesen.
    offset: ['start 0.82', 'end 0.55'],
  });

  // Ruhiger Zustand: Der Satz steht vollständig da. Das ist eine vollwertige
  // Alternative — der Text sagt aufgehellt genau dasselbe, nur auf einmal.
  const progress = prefersReducedMotion || !isInteractive ? null : scrollYProgress;

  // Trennzeichen mitführen, damit die Wortabstände erhalten bleiben.
  const words = text.split(/(\s+)/);
  const wordCount = words.filter((part) => part.trim().length > 0).length;
  let index = 0;

  return (
    <section className={styles.section}>
      <Container>
        <p className={styles.label}>{label}</p>

        <p className={styles.statement} ref={ref}>
          {words.map((part, i) => {
            if (!part.trim()) return <span key={i}>{part}</span>;
            // Die Wörter starten gestaffelt über die erste Hälfte der Strecke;
            // die zweite Hälfte braucht das letzte Wort, um selbst aufzuhellen.
            const start = (index++ / Math.max(1, wordCount - 1)) * (1 - WORD_SPAN);
            return (
              <Word key={i} progress={progress} start={start}>
                {part}
              </Word>
            );
          })}
        </p>

        {aside && aside.length > 0 && (
          <div className={styles.aside}>
            {aside.map((item) => (
              <div key={item.term} className={styles.asideItem}>
                <p className={styles.asideTerm}>{item.term}</p>
                <p className={styles.asideText}>{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
