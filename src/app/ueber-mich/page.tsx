import { availability, contact } from '@/content/site';
import { skillGroups } from '@/content/skills';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import styles from './About.module.scss';
import { JsonLd } from '@/components/seo/JsonLd';
import { createPageMetadata, personEntity } from '@/lib/seo';
import { site } from '@/content/site';

export const metadata = createPageMetadata({
  title: 'Über Can Cadirci — Softwareentwickler',
  description: 'Can Cadirci ist Software- und KI-Entwickler aus Ludwigsburg: IHK-Fachinformatiker mit Fullstack-Praxis, technischen Case Studies und direkter Arbeitsweise.',
  path: '/ueber-mich',
  type: 'profile',
});

const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: `Über ${site.name}`,
  url: `${site.url}/ueber-mich`,
  dateModified: site.lastUpdated,
  mainEntity: personEntity(),
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
                Heute entwickle ich eigene Produkte und individuelle Lösungen für Unternehmen.
                Gleichzeitig bin ich offen für eine passende Fullstack- oder Applied-AI-Rolle,
                wenn technische Verantwortung, direkte Produktarbeit und ein gutes Team
                zusammenkommen.
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
      <JsonLd data={profileJsonLd} />
    </>
  );
}
