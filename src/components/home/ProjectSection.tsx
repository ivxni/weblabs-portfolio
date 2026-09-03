import Image from 'next/image';
import Link from 'next/link';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ProjectSection.module.scss';

const works = [
  {
    name: 'UnitFly',
    type: 'AI Commerce Platform',
    image: '/images/work/unitfly.jpg',
    href: '/projekte/unitfly',
  },
  {
    name: 'PLP IT-Services',
    type: 'Service Platform',
    image: '/images/work/plp-it-services.jpg',
    href: '/projekte/pa-it-services',
  },
  {
    name: 'Paydos Lounge',
    type: 'Hospitality Experience',
    image: '/images/work/paydos-lounge.jpg',
    href: '/projekte/paydos-lounge',
  },
  {
    name: 'Ipekten',
    type: 'Local Service Platform',
    image: '/images/work/ipekten-dienstleistung.jpg',
    href: '/projekte/ipekten-dienstleistung',
  },
] as const;

export function ProjectSection() {
  return (
    <section className={styles.section} id="projekte" aria-labelledby="projects-heading">
      <header className={styles.header}>
        <p className={styles.kicker}>Ausgewählte Projekte</p>
        <h2 className={styles.heading} id="projects-heading">Arbeit, die für sich spricht.</h2>
        <p className={styles.summary}>Vier Systeme, vier unterschiedliche Anforderungen, jeweils vollständig umgesetzt.</p>
      </header>

      <div className={styles.grid}>
        {works.map((work) => {
          const external = work.href.startsWith('http');
          return (
            <article className={styles.work} key={work.name}>
              <Link
                href={work.href}
                className={styles.visual}
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
                <div><h3>{work.name}</h3><p>{work.type}</p></div>
                <span aria-hidden="true">↗</span>
              </div>
            </article>
          );
        })}
      </div>

      <Link href="/projekte" className={styles.allProjects}>Alle Case Studies <span>→</span></Link>
    </section>
  );
}
