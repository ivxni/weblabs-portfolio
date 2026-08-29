import type { Metadata } from 'next';
import { availability, contact } from '@/content/site';
import { skillGroups } from '@/content/skills';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import styles from './About.module.scss';

export const metadata: Metadata = {
  title: 'Über mich',
  description:
    'Can Cadirci, ausgebildeter Fachinformatiker für Anwendungsentwicklung aus Ludwigsburg. Arbeitsweise, technischer Fokus und der Umgang mit AI-Werkzeugen im Entwicklungsalltag.',
  alternates: { canonical: '/ueber-mich' },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="Über mich"
        index="03 / Profil"
        title="Ich will verstehen, wie ein System wirklich funktioniert."
        lead="Ausgebildeter Fachinformatiker aus Ludwigsburg mit professioneller Fullstack-Praxis und einem Schwerpunkt auf vollständigen Software- und AI-Systemen."
      />

      <Section compact>
        <Container>
          <div className={styles.profileGrid}>
            <aside className={styles.profileAside}>
              <p className={styles.profileKey}>Arbeitsprinzip / 01</p>
              <p className={styles.profileThesis}>
                Nicht nur Features bauen. Das System dahinter verstehen und verantworten.
              </p>
            </aside>

            <div className={styles.text}>
              <p>
                Ich bin Can Cadirci, ausgebildeter Fachinformatiker für Anwendungsentwicklung
                aus Ludwigsburg. Bei diconium habe ich drei Jahre in professionellen
                Fullstack-Teams gearbeitet. Seit meinem Abschluss entwickle ich eigene Web-,
                Mobile- und AI-Produkte und vertiefe dabei besonders TypeScript/Next.js,
                Python/FastAPI, PostgreSQL und produktnahe AI-Systeme.
              </p>
              <p>
                Mich reizt die Arbeit an vollständigen Produkten: eine klare Oberfläche, saubere
                APIs, belastbare Datenmodelle, nachvollziehbare Fehlerbehandlung, automatisierte
                Tests und ein Deployment, das nicht nur auf meinem Rechner funktioniert.
              </p>
              <p>
                AI nutze ich intensiv als Werkzeug für Recherche, Planung, Implementierung und
                Debugging. Ich behandle Modellantworten dabei nicht als Wahrheit. Ich prüfe den
                Code, teste kritische Pfade und halte Systemgrenzen bewusst deterministisch. Diese
                Verbindung aus Geschwindigkeit und technischer Verantwortung ist der Kern meiner
                Arbeitsweise.
              </p>
              <p>
                Aktuell suche ich eine Fullstack- oder Applied-AI-Rolle, in der ich früh
                Verantwortung übernehmen, direkt am Produkt arbeiten und mich gemeinsam mit einem
                guten Team weiterentwickeln kann.
              </p>
            </div>
          </div>
        </Container>

        <Container>
          <dl className={styles.facts}>
            <div>
              <dt className={styles.factTerm}>Standort</dt>
              <dd className={styles.factValue}>{contact.city}</dd>
            </div>
            <div>
              <dt className={styles.factTerm}>Fokus</dt>
              <dd className={styles.factValue}>Fullstack / Applied AI</dd>
            </div>
            <div>
              <dt className={styles.factTerm}>Arbeitsmodell</dt>
              <dd className={styles.factValue}>{availability.model}</dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section ruled compact id="technologien">
        <Container>
          <h2 className={styles.heading}>Technologien nach Einsatzgebiet</h2>

          <div className={styles.groups}>
            {skillGroups.map((group) => (
              <section key={group.key} className={styles.group} aria-labelledby={`skill-${group.key}`}>
                <div>
                  <p className={styles.groupKey}>{group.key}</p>
                  <h3 className={styles.groupTitle} id={`skill-${group.key}`}>
                    {group.title}
                  </h3>
                  <p className={styles.groupNote}>{group.note}</p>
                </div>

                <ul className={styles.items} role="list">
                  {group.items.map((item) => (
                    <li key={item} className={styles.item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
