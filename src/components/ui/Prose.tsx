import type { ReactNode } from 'react';
import styles from './Prose.module.scss';

interface ProseProps {
  children: ReactNode;
  /** Größerer Grad für einleitende Absätze. */
  lead?: boolean;
  className?: string;
}

export function Prose({ children, lead = false, className }: ProseProps) {
  return (
    <div className={[styles.prose, lead && styles.lead, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
