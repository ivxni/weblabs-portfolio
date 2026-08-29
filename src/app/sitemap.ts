import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
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
  const now = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/projekte', priority: 0.9 },
    { path: '/erfahrung', priority: 0.8 },
    { path: '/ueber-mich', priority: 0.8 },
    { path: '/lebenslauf', priority: 0.7 },
    { path: '/kontakt', priority: 0.7 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route.priority,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/projekte/${project.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
