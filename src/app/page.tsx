import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { ProjectSection } from '@/components/home/ProjectSection';
import { ClosingCta } from '@/components/home/ClosingCta';
import { WorkingPrinciples } from '@/components/home/ProfileSections';
import { FocusTabs } from '@/components/home/FocusTabs';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/content/site';
import { BUSINESS_ID, PERSON_ID, WEBSITE_ID } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: site.brand,
      alternateName: [site.name, `${site.brand} by ${site.name}`],
      url: site.url,
      inLanguage: 'de-DE',
      publisher: { '@id': BUSINESS_ID },
    },
    {
      '@type': 'WebPage',
      '@id': `${site.url}/#webpage`,
      url: site.url,
      name: `Softwareentwicklung & KI aus Ludwigsburg | ${site.name}`,
      description: 'Individuelle Softwareentwicklung, Webentwicklung und KI-Systeme für Unternehmen.',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': PERSON_ID },
      inLanguage: 'de-DE',
      dateModified: site.lastUpdated,
    },
  ],
};

/**
 * Die Sektionsfolge ist durchkomponiert. Keine zwei benachbarten Sektionen
 * haben dieselbe Form — und der Rhythmus wechselt zwischen ruhig und laut:
 *
 *   1 Hero          Person und Positionierung
 *   2 Fachbereiche  drei Wege in dieselbe technische Arbeitsweise
 *   3 Projekte      sichtbare Belege statt weiterer Behauptungen
 *   4 Arbeitsweise  drei knappe Prinzipien
 *   5 Abschluss     Kontakt als einziges Ziel
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <FocusTabs />

      <ProjectSection />

      <WorkingPrinciples />

      <ClosingCta />

      <JsonLd data={homeJsonLd} />
    </>
  );
}
