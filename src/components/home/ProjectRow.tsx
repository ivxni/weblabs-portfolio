import Link from 'next/link';
import { statusLabel, type Project } from '@/content/projects';
import styles from './ProjectRow.module.scss';

function statusClass(status: Project['status']): string | false {
  if (status === 'live') return styles.statusLive ?? false;
  if (status === 'in-arbeit') return styles.statusProgress ?? false;
  return false;
}

/**
 * Eine Indexzeile. Ohne eigenes `<li>` — sie wird an mehreren Stellen
 * verwendet, und die Listenhülle gehört dorthin, wo auch die Nummerierung
 * bekannt ist.
 *
 * Die gesamte Zeile ist der Link, nicht ein „Mehr erfahren" am Ende: Eine
 * große Trefferfläche entscheidet auf Touch über benutzbar oder nicht, und für
 * die Tastatur bleibt es ein Stopp statt drei.
 */
export function ProjectRow({ project, index }: { project: Project; index?: number }) {
  return (
    <Link href={`/projekte/${project.slug}`} className={styles.row}>
      {index !== undefined && (
        <span className={styles.index} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      <span className={styles.content}>
        {/*
          Eine echte Überschrift, keine gestylte Zeile. Wer eine Seite über die
          Überschriftenliste eines Screenreaders erschließt, springt damit von
          Projekt zu Projekt.
        */}
        <h2 className={styles.name}>{project.name}</h2>
        <span className={styles.summary}>{project.summary}</span>
        <span className={styles.stack}>{project.stack.slice(0, 6).join(' · ')}</span>
      </span>

      <span className={styles.meta}>
        <span className={styles.year} data-numeric>
          {project.year}
        </span>
        <span className={[styles.status, statusClass(project.status)].filter(Boolean).join(' ')}>
          <span className={styles.statusDot} aria-hidden="true" />
          {statusLabel[project.status]}
        </span>
      </span>

      <span className={styles.arrow} aria-hidden="true">↗</span>
    </Link>
  );
}

export { styles as projectRowStyles };
