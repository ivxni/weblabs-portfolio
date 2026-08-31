import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Die API liefert nichts, was in einem Index etwas verloren hätte, und
        // ein Crawler auf `/api/kontakt` löst nur die Ratenbegrenzung aus.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
