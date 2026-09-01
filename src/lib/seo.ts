import type { Metadata } from 'next';
import { contact, legal, site } from '@/content/site';

export const PERSON_ID = `${site.url}/#can-cadirci`;
export const BUSINESS_ID = `${site.url}/#weblabs`;
export const WEBSITE_ID = `${site.url}/#website`;

export function absoluteUrl(path = ''): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  noIndex?: boolean;
}

/**
 * Eine Quelle für Canonical, Open Graph und Twitter.
 *
 * Ohne diesen Helfer drifteten Unterseiten auseinander: Der Canonical zeigte
 * auf die Unterseite, `og:url` erbte aber die Startseite. Das ist für Crawler
 * und Link-Vorschauen ein widersprüchliches Signal.
 */
export function createPageMetadata({
  title,
  description,
  path,
  type = 'website',
  image = '/opengraph-image',
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.brand,
      locale: 'de_DE',
      type,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${title}. ${site.brand}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

export function personEntity() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    alternateName: 'Can von WebLabs',
    url: site.url,
    email: `mailto:${contact.email}`,
    telephone: contact.phone,
    jobTitle: 'Softwareentwickler und KI-Entwickler',
    worksFor: { '@id': BUSINESS_ID },
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.streetAddress,
      addressLocality: contact.city,
      postalCode: contact.postalCode,
      addressRegion: 'Baden-Württemberg',
      addressCountry: contact.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Ludwigsburg' },
      { '@type': 'City', name: 'Stuttgart' },
      { '@type': 'Country', name: 'Deutschland' },
    ],
    sameAs: [contact.linkedin, ...(contact.github ? [contact.github] : [])],
    knowsAbout: [
      'Individuelle Softwareentwicklung',
      'Webentwicklung',
      'Next.js',
      'React',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Künstliche Intelligenz',
      'KI-Agenten',
      'Computer Vision',
      'Docker',
      'Softwaretests',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Fachinformatiker für Anwendungsentwicklung',
        credentialCategory: 'IHK-Berufsabschluss',
        recognizedBy: { '@type': 'Organization', name: 'IHK Region Stuttgart' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Künstliche Intelligenz und maschinelles Lernen',
        credentialCategory: 'IHK-Zusatzqualifikation',
        recognizedBy: { '@type': 'Organization', name: 'IHK Region Stuttgart' },
      },
    ],
  } as const;
}

/**
 * WebLabs ist die geschäftliche Identität hinter dem persönlichen Portfolio.
 * Ein `ProfessionalService` ist präziser als ein generisches `Organization`
 * und vermeidet erfundene Eigenschaften wie Öffnungszeiten oder Preisspannen.
 */
export function businessEntity() {
  return {
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID,
    name: site.brand,
    alternateName: `${site.brand} by ${site.name}`,
    url: site.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/brand/weblabs-icon.svg'),
      width: 1024,
      height: 1024,
    },
    image: absoluteUrl('/opengraph-image'),
    founder: { '@id': PERSON_ID },
    email: `mailto:${contact.email}`,
    telephone: contact.phone,
    vatID: legal.vatId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.streetAddress,
      postalCode: contact.postalCode,
      addressLocality: contact.city,
      addressRegion: 'Baden-Württemberg',
      addressCountry: contact.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Ludwigsburg' },
      { '@type': 'City', name: 'Stuttgart' },
      { '@type': 'Country', name: 'Deutschland' },
    ],
    serviceType: [
      'Individuelle Softwareentwicklung',
      'Webentwicklung',
      'KI-Entwicklung',
    ],
  } as const;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbEntity(items: readonly BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  } as const;
}
