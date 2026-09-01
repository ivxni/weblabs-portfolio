import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brand}: ${site.name}`,
    short_name: site.brand,
    description: 'Individuelle Softwareentwicklung, Webentwicklung und KI-Systeme aus Ludwigsburg.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0d0f',
    theme_color: '#0c0d0f',
    lang: 'de-DE',
    icons: [
      {
        src: '/brand/weblabs-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
