import Link from 'next/link';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { createPageMetadata, PERSON_ID } from '@/lib/seo';
import styles from './Services.module.scss';

export const metadata = createPageMetadata({
  title: 'Softwareentwicklung, Webentwicklung & KI',
  description:
    'Individuelle Softwareentwicklung, Webentwicklung und KI-Entwicklung von Can Cadirci für Unternehmen in Ludwigsburg, Stuttgart und deutschlandweit.',
  path: '/leistungen',
});

const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Leistungen von Can Cadirci / WebLabs',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${site.url}/leistungen/${service.slug}`,
    item: {
      '@type': 'Service',
      name: service.shortName,
      description: service.description,
      provider: { '@id': PERSON_ID },
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Leistungen"
        index="01 / Angebot"
        title="Software, Web und AI als ein zusammenhängendes System."
        lead="Ich unterstütze Unternehmen in Ludwigsburg, Stuttgart und deutschlandweit bei individuellen Webanwendungen, hochwertigen Websites und kontrolliert integrierten AI-Funktionen. Direkt, technisch und ohne Übergabe zwischen Vertrieb und Entwicklung."
      />

      <Section compact>
        <Container>
          <div className={styles.intro}>
            <p className={styles.introLabel}>Der gemeinsame Nenner</p>
            <p className={styles.introText}>
              Nicht möglichst viele Leistungen, sondern Verantwortung an den Übergängen:
              Oberfläche, API, Daten, AI-Komponenten, Tests und Betrieb werden gemeinsam geplant.
            </p>
          </div>

          <ol className={styles.serviceList} role="list">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/leistungen/${service.slug}`} className={styles.serviceLink}>
                  <span className={styles.index} aria-hidden="true">{service.index}</span>
                  <span className={styles.serviceCopy}>
                    <strong>{service.shortName}</strong>
                    <span>{service.searchIntent}</span>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section ruled tinted compact>
        <Container>
          <div className={styles.delivery}>
            <p className={styles.introLabel}>Zusammenarbeit</p>
            <h2>Ein Ansprechpartner vom ersten Systembild bis zum Deployment.</h2>
            <p>
              Ein Erstgespräch dient nicht dazu, Ihnen sofort ein möglichst großes Projekt zu
              verkaufen. Wir grenzen das eigentliche Problem, bestehende Systeme und den kleinsten
              belastbaren Start ab. Wenn Standardsoftware die bessere Lösung ist, sage ich das.
            </p>
            <Link href="/kontakt" className={styles.textLink}>Projekt besprechen →</Link>
          </div>
        </Container>
      </Section>

      <JsonLd data={servicesJsonLd} />
    </>
  );
}
