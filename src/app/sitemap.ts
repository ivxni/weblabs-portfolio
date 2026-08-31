import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { services } from '@/content/services';
import { site } from '@/content/site';

/**
 * Die Sitemap wird aus denselben Daten erzeugt wie die Navigation und die
 * Case-Studies. Eine handgepflegte Liste wäre nach dem zweiten neuen Projekt
 * unvollständig, ohne dass es jemand merkt.
 *
 * Impressum und Datenschutz stehen bewusst NICHT drin: Sie sind auf
 * `noindex` gesetzt, und eine Sitemap, die auf nicht indexierbare Seiten
 * verweist, sendet widersprüchliche Signale.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.lastUpdated);

  const staticRoutes = [
    '',
    '/leistungen',
    '/projekte',
    '/erfahrung',
    '/ueber-mich',
    '/lebenslauf',
    '/kontakt',
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      lastModified,
      ...(path === ''
        ? {
            images: [
              `${site.url}/images/work/unitfly.jpg`,
              `${site.url}/images/work/plp-it-services.jpg`,
              `${site.url}/images/work/paydos-lounge.jpg`,
              `${site.url}/images/work/ipekten-dienstleistung.jpg`,
            ],
          }
        : {}),
    })),
    ...services.map((service) => ({
      url: `${site.url}/leistungen/${service.slug}`,
      lastModified,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/projekte/${project.slug}`,
      lastModified,
      images: [
        ...(project.cover ? [`${site.url}${project.cover.src}`] : []),
        ...(project.media?.map((item) => `${site.url}${item.src}`) ?? []),
      ],
    })),
  ];
}
