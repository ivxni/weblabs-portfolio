import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getService, services } from '@/content/services';
import { site } from '@/content/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import {
  absoluteUrl,
  breadcrumbEntity,
  createPageMetadata,
  PERSON_ID,
} from '@/lib/seo';
import styles from './ServiceDetail.module.scss';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return createPageMetadata({
    title: service.metaTitle,
    description: service.description,
    path: `/leistungen/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const serviceUrl = absoluteUrl(`/leistungen/${service.slug}`);
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${serviceUrl}#service`,
        name: service.shortName,
        serviceType: service.metaTitle,
        url: serviceUrl,
        description: service.description,
        provider: { '@id': PERSON_ID },
        areaServed: [
          { '@type': 'City', name: 'Ludwigsburg' },
          { '@type': 'City', name: 'Stuttgart' },
          { '@type': 'Country', name: 'Deutschland' },
        ],
        audience: { '@type': 'BusinessAudience', audienceType: 'Unternehmen und Organisationen' },
        category: service.keywords,
      },
      breadcrumbEntity([
        { name: site.brand, path: '/' },
        { name: 'Leistungen', path: '/leistungen' },
        { name: service.shortName, path: `/leistungen/${service.slug}` },
      ]),
    ],
  };

  return (
    <>
      <PageHeader
        label={`${service.index} / Leistung`}
        index="Ludwigsburg · Stuttgart · Remote"
        title={service.title}
        lead={service.lead}
      />

      <Section compact>
        <Container>
          <div className={styles.fitLayout}>
            <div className={styles.fitStatement}>
              <p className={styles.label}>Einsatz</p>
              <h2>{service.fitHeading}</h2>
              <p>{service.searchIntent}</p>
            </div>
            <ul className={styles.fitList} role="list">
              {service.fit.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section ruled tinted compact>
        <Container>
          <div className={styles.chapterHead}>
            <p className={styles.label}>Leistungsbild</p>
            <h2>Was Teil der Umsetzung sein kann.</h2>
          </div>
          <div className={styles.deliverables}>
            {service.deliverables.map((item, index) => (
              <article key={item.title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section ruled compact>
        <Container>
          <div className={styles.chapterHead}>
            <p className={styles.label}>Ablauf</p>
            <h2>Vom Problem zu einem prüfbaren System.</h2>
          </div>
          <ol className={styles.process} role="list">
            {service.process.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section ruled tinted compact>
        <Container>
          <div className={styles.proofLayout}>
            <div className={styles.chapterHead}>
              <p className={styles.label}>Belege</p>
              <h2>Passende technische Case Studies.</h2>
            </div>
            <ul className={styles.proofs} role="list">
              {service.proofs.map((proof) => (
                <li key={proof.slug}>
                  <Link href={`/projekte/${proof.slug}`}>
                    <strong>{proof.label}</strong>
                    <span>{proof.note}</span>
                    <i aria-hidden="true">↗</i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section ruled compact>
        <Container width="narrow">
          <div className={styles.chapterHead}>
            <p className={styles.label}>Klarheit vor dem Start</p>
            <h2>Häufige Fragen.</h2>
          </div>
          <dl className={styles.faq}>
            {service.faq.map((entry) => (
              <div key={entry.question}>
                <dt>{entry.question}</dt>
                <dd>{entry.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section ruled compact>
        <Container>
          <div className={styles.cta}>
            <p className={styles.label}>Nächster Schritt</p>
            <h2>Beschreiben Sie mir den Ablauf, der heute Zeit oder Möglichkeiten kostet.</h2>
            <p>Ich antworte mit konkreten Rückfragen — nicht mit einem vorgefertigten Angebot.</p>
            <Link href="/kontakt">Projekt unverbindlich besprechen →</Link>
          </div>
        </Container>
      </Section>

      <JsonLd data={serviceJsonLd} />
    </>
  );
}
