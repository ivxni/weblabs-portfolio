import type { Metadata } from 'next';
import { positions, qualifications, referenceSummary } from '@/content/experience';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import styles from './Experience.module.scss';

export const metadata: Metadata = {
  title: 'Erfahrung',
  description:
    'Drei Jahre professionelle Fullstack-Praxis bei diconium in Scrum-Teams, IHK-Abschluss als Fachinformatiker für Anwendungsentwicklung und die IHK-Zusatzqualifikation KI und maschinelles Lernen.',
  alternates: { canonical: '/erfahrung' },
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        label="Erfahrung"
        index="02 / Praxis"
        title="Drei Jahre Produktentwicklung im professionellen Team."
        lead="Meine Praxis kommt aus drei Jahren in professionellen Scrum-Teams — mit Code Reviews, Legacy-Code, CI/CD und Abstimmung, nicht nur aus eigenen Projekten."
      />

      <Section compact>
        <Container>
          <dl className={styles.signals}>
            <div>
              <dt>Praxis</dt>
              <dd>3 Jahre</dd>
            </div>
            <div>
              <dt>Arbeitsweise</dt>
              <dd>Scrum / Reviews</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>Frontend bis CI/CD</dd>
            </div>
          </dl>

          {positions.map((position) => (
            <article className={styles.position} key={position.company}>
              <p className={styles.period}>
                <time dateTime={position.fromISO}>{position.from}</time>
                {' – '}
                <time dateTime={position.toISO}>{position.to}</time>
              </p>

              <div>
                <h2 className={styles.company}>{position.company}</h2>
                {/*
                  Der Firmenname steht typografisch, nicht als Logo. Fremde
                  Marken einzubinden setzt eine Nutzungserlaubnis voraus, die
                  hier nicht geprüft ist — und ein Name in guter Schrift wirkt
                  ohnehin ruhiger als ein fremdes Logo im eigenen Layout.
                */}
                <p className={styles.role}>{position.role}</p>
                <p className={styles.summary}>{position.summary}</p>

                <ul className={styles.highlights} role="list">
                  {position.highlights.map((item, index) => (
                    <li key={item} className={styles.highlight}>
                      <span className={styles.highlightKey} aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className={styles.stackLabel}>Eingesetzte Technologien</p>
                <p className={styles.stack}>{position.stack.join(' · ')}</p>
              </div>
            </article>
          ))}
        </Container>
      </Section>

      <Section ruled tinted compact>
        <Container>
          <h2 className={styles.heading}>Abschlüsse</h2>
          <ul className={styles.qualifications} role="list">
            {qualifications.map((entry) => (
              <li key={entry.title} className={styles.qualification}>
                <span className={styles.qualificationTitle}>{entry.title}</span>
                <span className={styles.qualificationInstitution}>
                  {entry.institution} · <time dateTime={entry.dateISO}>{entry.date}</time>
                </span>
                {entry.result && <span className={styles.qualificationResult}>{entry.result}</span>}
              </li>
            ))}
          </ul>

          {/*
            Paraphrasiert, kein Zitat und keine Sternebewertung. Ein
            scheinbares Direktzitat aus einem Arbeitszeugnis wäre eine Aussage,
            die sich nicht belegen lässt.
          */}
          <div className={styles.note}>
            <p className={styles.noteLabel}>Arbeitszeugnis, zusammengefasst</p>
            <p>{referenceSummary}</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
