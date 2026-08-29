import type { ElementType, ReactNode } from 'react';
import styles from './Container.module.scss';

type Width = 'page' | 'narrow' | 'bleed' | 'offsetLeft';

interface ContainerProps {
  children: ReactNode;
  width?: Width;
  as?: ElementType;
  className?: string;
  id?: string;
}

/**
 * Die einzige Stelle, an der die horizontale Begrenzung der Seite definiert
 * ist. Kein Bauteil setzt eigene `max-width`- oder `padding-inline`-Werte —
 * sonst driften die Ränder zwischen Sektionen auseinander, und genau das ist
 * der Grund, warum eine Seite „irgendwie unruhig" wirkt.
 */
export function Container({
  children,
  width = 'page',
  as: Tag = 'div',
  className,
  id,
}: ContainerProps) {
  const classes = [styles.container, styles[width], className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} id={id}>
      {children}
    </Tag>
  );
}
