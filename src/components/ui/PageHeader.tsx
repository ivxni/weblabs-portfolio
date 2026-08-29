import type { ReactNode } from 'react';
import { Container } from './Container';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  label: string;
  title: string;
  lead?: string;
  index?: string;
  children?: ReactNode;
}

export function PageHeader({ label, title, lead, index, children }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.topline}>
          <p className={styles.label}>
            {index && <span className={styles.index}>{index}</span>}
            <span>{label}</span>
          </p>
          <p className={styles.signature} aria-hidden="true">Can Cadirci / WebLabs</p>
        </div>

        <div className={styles.layout}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.aside}>
            {lead && <p className={styles.lead}>{lead}</p>}
            {children}
            <p className={styles.disciplines} aria-hidden="true">
              Software / AI / Security
            </p>
          </div>
        </div>
      </Container>
    </header>
  );
}
