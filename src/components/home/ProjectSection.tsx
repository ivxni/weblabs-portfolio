import Image from 'next/image';
import Link from 'next/link';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ProjectSection.module.scss';

const works = [
  {
    index: '01',
    name: 'UnitFly',
    type: 'AI Commerce Platform',
    image: '/images/work/unitfly.jpg',
    href: '/projekte/unitfly',
    stack: 'Next.js / FastAPI / PostgreSQL / Applied AI',
    tone: 'dark',
  },
  {
    index: '02',
    name: 'PLP IT-Services',
    type: 'Service Platform',
    image: '/images/work/plp-it-services.jpg',
    href: '/projekte/pa-it-services',
    stack: 'Next.js / TypeScript / PostgreSQL / Docker',
    tone: 'light',
  },
  {
    index: '03',
    name: 'Paydos Lounge',
    type: 'Hospitality Experience',
    image: '/images/work/paydos-lounge.jpg',
    href: '/projekte/paydos-lounge',
    stack: 'Next.js / TypeScript / Responsive UI',
    tone: 'dark',
  },
  {
    index: '04',
    name: 'Ipekten',
    type: 'Local Service Platform',
    image: '/images/work/ipekten-dienstleistung.jpg',
    href: '/projekte/ipekten-dienstleistung',
    stack: 'Next.js / TypeScript / SMTP / Docker',
    tone: 'light',
  },
] as const;

export function ProjectSection() {
  return (
    <section className={styles.section} id="projekte" aria-labelledby="projects-heading">
      <header className={styles.header}>
        <p className={styles.kicker}>Selected work / 2025—2026</p>
        <h2 className={styles.heading} id="projects-heading">Built for the<br />real world.</h2>
        <p className={styles.summary}>Produkt, Plattform oder lokale Dienstleistung: Jede Oberfläche folgt einem echten System dahinter.</p>
      </header>

      <div className={styles.grid}>
        {works.map((work) => {
          const external = work.href.startsWith('http');
          return (
            <article className={styles.work} key={work.name}>
              <Link
                href={work.href}
                className={`${styles.visual} ${styles[work.tone]}`}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                <Image
                  src={work.image}
                  alt={`Screenshot der von Can entwickelten Website ${work.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image}
                />
                <span className={styles.openIcon} aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
              </Link>
              <div className={styles.caption}>
                <span>{work.index}</span>
                <div><h3>{work.name}</h3><p>{work.type}</p></div>
                <p className={styles.stack}>{work.stack}</p>
              </div>
            </article>
          );
        })}
      </div>

      <Link href="/projekte" className={styles.allProjects}>Alle Case Studies <span>→</span></Link>
    </section>
  );
}
