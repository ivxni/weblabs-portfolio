import Link from 'next/link';
import { statusLabel, type Project } from '@/content/projects';
import styles from './ProjectDirectory.module.scss';

const disciplineCopy: Record<
  Project['discipline'],
  { index: string; label: string; description: string }
> = {
  'ai-systems': {
    index: '01',
    label: 'AI Systems',
    description: 'Modelle, Inferenz-Laufzeiten und kontrollierte Ausführung.',
  },
  'product-platforms': {
    index: '02',
    label: 'Product Platforms',
    description: 'Websysteme vom Interface über Daten und APIs bis zum Betrieb.',
  },
  'privacy-engineering': {
    index: '03',
    label: 'Privacy Engineering',
    description: 'Computer Vision mit bewusst gesetzten technischen Schutzgrenzen.',
  },
};

const disciplineOrder: readonly Project['discipline'][] = [
  'ai-systems',
  'product-platforms',
  'privacy-engineering',
];

function statusClass(status: Project['status']): string | undefined {
  if (status === 'live') return styles.statusLive;
  if (status === 'in-arbeit') return styles.statusProgress;
  return undefined;
}

export function ProjectDirectory({ projects }: { projects: readonly Project[] }) {
  let projectIndex = 0;

  return (
    <div className={styles.directory}>
      <div className={styles.directoryHeader}>
        <span>Selected work</span>
        <span>{String(projects.length).padStart(2, '0')} Case Studies / 2023 bis 2026</span>
      </div>

      {disciplineOrder.map((discipline) => {
        const copy = disciplineCopy[discipline];
        const disciplineProjects = projects.filter((project) => project.discipline === discipline);

        return (
          <section
            className={styles.group}
            key={discipline}
            aria-labelledby={`projects-${discipline}`}
          >
            <header className={styles.groupHeader}>
              <span className={styles.groupIndex}>{copy.index}</span>
              <div>
                <h2 id={`projects-${discipline}`} className={styles.groupTitle}>
                  {copy.label}
                  <span data-numeric>{String(disciplineProjects.length).padStart(2, '0')}</span>
                </h2>
                <p className={styles.groupDescription}>{copy.description}</p>
              </div>
            </header>

            <ol className={styles.list} role="list">
              {disciplineProjects.map((project) => {
                projectIndex += 1;

                return (
                  <li key={project.slug}>
                    <Link href={`/projekte/${project.slug}`} className={styles.row}>
                      <span className={styles.index} aria-hidden="true">
                        {String(projectIndex).padStart(2, '0')}
                      </span>

                      <span className={styles.content}>
                        <span className={styles.name}>{project.name}</span>
                        <span className={styles.summary}>{project.summary}</span>
                        <span className={styles.stack}>
                          {project.stack.slice(0, 5).join(' · ')}
                        </span>
                      </span>

                      <span className={styles.meta}>
                        <span data-numeric>{project.year}</span>
                        <span
                          className={[
                            styles.status,
                            statusClass(project.status),
                          ].filter(Boolean).join(' ')}
                        >
                          <span className={styles.statusDot} aria-hidden="true" />
                          {statusLabel[project.status]}
                        </span>
                      </span>

                      <span className={styles.arrow} aria-hidden="true">↗</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
