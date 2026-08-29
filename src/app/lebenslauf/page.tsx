import type { Metadata } from 'next';
import Link from 'next/link';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { positions, qualifications } from '@/content/experience';
import { featuredProjects } from '@/content/projects';
import { skillGroups } from '@/content/skills';
import { availability, contact, release, resumePdfPath, site } from '@/content/site';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { LinkButton } from '@/components/ui/Button';
import styles from './Resume.module.scss';

export const metadata: Metadata = {
  title: 'Lebenslauf',
  description:
    'Web-Lebenslauf von Can Cadirci: Kurzprofil, diconium-Erfahrung, ausgewählte Projekte, IHK-Abschlüsse, Tech-Stack und Kontaktdaten.',
  alternates: { canonical: '/lebenslauf' },
};

export default function ResumePage() {
  const position = positions[0];

  return (
    <>
      <PageHeader
        label="Lebenslauf"
        index="04 / Dokument"
        title={site.name}
        lead={`${site.role}. ${availability.location}. ${availability.model}.`}
      >
        {/*
          Der Download erscheint nur, wenn die Datei freigegeben ist. Ein Knopf,
          der auf ein fehlendes PDF zeigt, ist schlimmer als kein Knopf: Er
          kostet einen Recruiter einen Klick und hinterlässt eine 404.
        */}
        {release.resumePdf ? (
          <p className={styles.downloadNote}>
            <LinkButton href={resumePdfPath} variant="primary" icon={faDownload} iconPosition="start">
              Lebenslauf als PDF
            </LinkButton>
          </p>
        ) : (
          <p className={styles.downloadNote}>
            Die PDF-Fassung ist noch nicht freigegeben. Der vollständige Lebenslauf steht
            unten in der Webansicht; auf Anfrage schicke ich das PDF direkt per{' '}
            <a href={`mailto:${contact.email}`} className={styles.contactLink}>
              E-Mail
            </a>
            .
          </p>
        )}
      </PageHeader>

      <Section compact>
        <Container className={styles.document}>
          <div className={styles.block}>
            <h2 className={styles.blockLabel}>Kurzprofil</h2>
            <p className={styles.profile}>
              Fullstack Software Engineer mit React, Next.js, TypeScript, Python/FastAPI,
              PostgreSQL und Applied AI. Ausgebildeter Fachinformatiker mit drei Jahren
              professioneller Fullstack-Praxis im Rahmen der Ausbildung bei diconium. Schwerpunkt
              auf vollständigen Systemen — von der Oberfläche über API und Datenmodell bis zu
              Tests und containerisiertem Deployment.
            </p>
          </div>

          {position && (
            <div className={styles.block}>
              <h2 className={styles.blockLabel}>Erfahrung</h2>
              <div>
                <div className={styles.entry}>
                  <div className={styles.entryHead}>
                    <h3 className={styles.entryTitle}>{position.company}</h3>
                    <span className={styles.entryMeta}>
                      <time dateTime={position.fromISO}>{position.from}</time>
                      {' – '}
                      <time dateTime={position.toISO}>{position.to}</time>
                    </span>
                  </div>
                  <p className={styles.entrySub}>{position.role}</p>
                  <p className={styles.entryBody}>{position.summary}</p>
                  <ul className={styles.bullets}>
                    {position.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className={styles.block}>
            <h2 className={styles.blockLabel}>Projekte</h2>
            <div>
              {featuredProjects.map((project) => (
                <div key={project.slug} className={styles.entry}>
                  <div className={styles.entryHead}>
                    <h3 className={styles.entryTitle}>
                      <Link href={`/projekte/${project.slug}`} className={styles.contactLink}>
                        {project.name}
                      </Link>
                    </h3>
                    <span className={styles.entryMeta} data-numeric>
                      {project.year}
                    </span>
                  </div>
                  <p className={styles.entryBody}>{project.summary}</p>
                  <p className={styles.entryBody}>{project.stack.join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockLabel}>Ausbildung</h2>
            <div>
              {qualifications.map((entry) => (
                <div key={entry.title} className={styles.entry}>
                  <div className={styles.entryHead}>
                    <h3 className={styles.entryTitle}>{entry.title}</h3>
                    <span className={styles.entryMeta}>
                      <time dateTime={entry.dateISO}>{entry.date}</time>
                    </span>
                  </div>
                  <p className={styles.entrySub}>{entry.institution}</p>
                  {entry.result && <p className={styles.entryBody}>{entry.result}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockLabel}>Tech-Stack</h2>
            <div>
              {skillGroups.map((group) => (
                <div key={group.key} className={styles.stackGroup}>
                  <p className={styles.stackTitle}>{group.title}</p>
                  <p className={styles.stackItems}>{group.items.join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockLabel}>Kontakt</h2>
            <ul className={styles.contactList} role="list">
              <li>
                <a href={`mailto:${contact.email}`} className={styles.contactLink}>
                  {contact.email}
                </a>
              </li>
              {release.phonePublic && (
                <li>
                  <a href={`tel:${contact.phone}`} className={styles.contactLink}>
                    {contact.phoneDisplay}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={contact.linkedin}
                  className={styles.contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                {contact.postalCode} {contact.city}, Deutschland
              </li>
              <li>{availability.model}</li>
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
