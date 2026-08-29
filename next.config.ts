import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `next dev` und `next build` dürfen nicht denselben Chunk-Cache teilen.
  // Sonst kann ein Build während des laufenden Dev-Servers dessen Runtime
  // ersetzen und zu "Cannot find module './<chunk>.js'" führen.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',

  // Standalone-Ausgabe: Der Docker-Container braucht dann kein node_modules
  // aus dem Build-Stage, sondern nur den mitgelieferten Server. Das halbiert
  // das Image und ist die Voraussetzung für den schlanken Runner in Dockerfile.
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  sassOptions: {
    // Erlaubt `@use "styles/abstracts" as *` ohne relative Pfadketten.
    includePaths: [path.join(process.cwd(), 'src')],
    // Nur Mixins, Funktionen und Breakpoints — kein CSS-Output. Deshalb kann
    // das gefahrlos in jedes Modul injiziert werden: es dupliziert nichts.
    additionalData: '@use "styles/abstracts" as *;',
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
