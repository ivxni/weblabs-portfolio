import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { getProject, projects, statusLabel } from '@/content/projects';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProjectLiveDemo, type ProjectDemoType } from '@/components/projects/ProjectLiveDemo';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/content/site';
import { absoluteUrl, breadcrumbEntity, createPageMetadata, PERSON_ID } from '@/lib/seo';
import styles from './CaseStudy.module.scss';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Alle Case-Studies werden zur Bauzeit erzeugt. Es gibt keine Inhalte, die
 * sich zur Laufzeit ändern könnten — jede Anfrage aus der Datei zu beantworten
 * wäre Arbeit ohne Gegenwert.
 */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return createPageMetadata({
    title: `${project.name}: technische Case Study`,
    description: project.summary,
    path: `/projekte/${project.slug}`,
    type: 'article',
    image: project.cover?.src,
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((entry) => entry.slug === slug);
  // Modulo statt Grenzprüfung: Am Ende der Liste geht es wieder zum ersten
  // Projekt, statt in eine Sackgasse zu führen.
  const next = projects[(currentIndex + 1) % projects.length];
  const projectUrl = absoluteUrl(`/projekte/${project.slug}`);
  const demoType: ProjectDemoType | null = project.slug === 'realtime-vision-runtime'
    ? 'vision'
    : project.slug === 'ml-market-runtime'
      ? 'market'
      : null;
  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${projectUrl}#case-study`,
        name: project.title,
        headline: project.title,
        description: project.summary,
        url: projectUrl,
        inLanguage: 'de-DE',
        creator: { '@id': PERSON_ID },
        author: { '@id': PERSON_ID },
        dateModified: site.lastUpdated,
        keywords: project.stack,
        ...(project.cover ? { image: absoluteUrl(project.cover.src) } : {}),
        about: project.stack.map((name) => ({ '@type': 'Thing', name })),
      },
      breadcrumbEntity([
        { name: site.brand, path: '/' },
        { name: 'Projekte', path: '/projekte' },
        { name: project.name, path: `/projekte/${project.slug}` },
      ]),
    ],
  };

  return (
    <>
      <PageHeader
        label="Case-Study"
        index={`CS / ${String(currentIndex + 1).padStart(2, '0')}`}
        title={project.title}
        lead={project.summary}
      />

      <Section compact className={styles.metaSection}>
        <Container>
          <dl className={styles.meta}>
            <div>
              <dt className={styles.metaTerm}>Rolle</dt>
              <dd className={styles.metaValue}>{project.role}</dd>
            </div>
            <div>
              <dt className={styles.metaTerm}>Zeitraum</dt>
              <dd className={styles.metaValue} data-numeric>
                {project.year}
              </dd>
            </div>
            <div>
              <dt className={styles.metaTerm}>Status</dt>
              <dd className={styles.metaValue}>{statusLabel[project.status]}</dd>
            </div>
            <div>
              <dt className={styles.metaTerm}>Erreichbar unter</dt>
              <dd className={styles.metaValue}>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    className={styles.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.liveUrl.replace(/^https?:\/\//, '')}
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className={styles.externalIcon}
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">(öffnet in neuem Tab)</span>
                  </a>
                ) : (
                  // Kein Platzhalter und kein toter Link: Wenn es nichts zu
                  // verlinken gibt, steht hier warum.
                  <span>Keine öffentliche Instanz</span>
                )}
              </dd>
            </div>
          </dl>

          <div className={styles.thesis}>
            <p className={styles.thesisLabel}>Zentrale Architekturentscheidung</p>
            <p className={styles.thesisText}>{project.headlineDecision}</p>
          </div>
        </Container>
      </Section>

      {project.cover && (
        <Section ruled compact>
          <Container>
            <figure className={styles.coverFigure}>
              <div className={styles.coverFrame}>
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  fill
                  priority
                  className={styles.coverImage}
                  style={{ objectPosition: project.cover.position ?? 'top center' }}
                  sizes="(min-width: 92rem) 82rem, 100vw"
                />
              </div>
              <figcaption className={styles.coverCaption}>
                <span>Interface / System view</span>
                <span>{project.name} · {project.year}</span>
              </figcaption>
            </figure>
          </Container>
        </Section>
      )}

      {demoType && (
        <Section ruled compact>
          <Container>
            <ProjectLiveDemo type={demoType} />
          </Container>
        </Section>
      )}

      <Section ruled compact>
        <Container>
          <div className={styles.chapterHeader}>
            <p>01 / System</p>
            <h2>Kontext, Problem und Umsetzung.</h2>
          </div>

          <div className={styles.overviewGrid}>
            <article className={styles.overviewItem}>
              <p className={styles.overviewKey}>01 / Kontext</p>
              <h3 className={styles.overviewTitle}>Systemrahmen</h3>
              <p className={styles.overviewBody}>{project.description}</p>
            </article>

            <article className={styles.overviewItem}>
              <p className={styles.overviewKey}>02 / Problem</p>
              <h3 className={styles.overviewTitle}>Ausgangslage</h3>
              <p className={styles.overviewBody}>{project.problem}</p>
            </article>

            <article className={styles.overviewItem}>
              <p className={styles.overviewKey}>03 / Umsetzung</p>
              <h3 className={styles.overviewTitle}>Technischer Ansatz</h3>
              <p className={styles.overviewBody}>{project.approach}</p>
            </article>

            {project.sections?.map((section, index) => (
              <article key={section.heading} className={styles.overviewItem}>
                <p className={styles.overviewKey}>{String(index + 4).padStart(2, '0')} / Vertiefung</p>
                <h3 className={styles.overviewTitle}>{section.heading}</h3>
                <p className={styles.overviewBody}>{section.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section ruled tinted compact>
        <Container>
          <div className={styles.chapterHeader}>
            <p>02 / Decisions</p>
            <h2>Zentrale technische Entscheidungen.</h2>
          </div>

          <div className={styles.decisionLayout}>
            <p className={styles.decisionIntro}>Nicht nur was gebaut wurde, sondern warum das System genau diese Form bekommen hat.</p>
            <ol className={styles.decisions} role="list">
              {project.decisions.map((decision, index) => (
                <li key={decision.title} className={styles.decision}>
                  <span className={styles.decisionKey} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className={styles.decisionTitle}>{decision.title}</h3>
                    <p className={styles.decisionRationale}>{decision.rationale}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {project.media && project.media.length > 0 && (
        <Section ruled compact>
          <Container>
            <div className={styles.block}>
              <h2 className={styles.blockHeading}>Ansichten</h2>
              <div className={styles.media}>
                {project.media.map((item) => (
                  <figure key={item.src} className={styles.figure}>
                    {/*
                      Feste Dimensionen aus den Daten: Ohne sie springt das
                      Layout beim Laden jedes Bildes.
                    */}
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      className={styles.image}
                      sizes="(min-width: 64rem) 60rem, 100vw"
                    />
                    <figcaption className={styles.caption}>{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      <Section ruled compact>
        <Container>
          <div className={styles.chapterHeader}>
            <p>03 / Delivery</p>
            <h2>Stack und belegbare Grenze.</h2>
          </div>

          <div className={styles.deliveryGrid}>
            <div>
              <p className={styles.deliveryLabel}>Technologien</p>
              <ul className={styles.stackList} role="list">
                {project.stack.map((item) => (
                  <li key={item} className={styles.stackItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.limit}>
              <p className={styles.limitLabel}>Ehrliche Grenze</p>
              <p className={styles.limitBody}>{project.limitation}</p>
            </div>
          </div>
        </Container>
      </Section>

      {next && (
        <Section ruled compact>
          <Container>
            <div className={styles.pager}>
              <div>
                <p className={styles.pagerLabel}>Nächstes Projekt</p>
                <Link href={`/projekte/${next.slug}`} className={styles.pagerLink}>
                  {next.name} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <Link href="/projekte" className={styles.pagerLabel}>
                Alle Projekte
              </Link>
            </div>
          </Container>
        </Section>
      )}
      <JsonLd data={projectJsonLd} />
    </>
  );
}
