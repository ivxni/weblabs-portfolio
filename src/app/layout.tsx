import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { contact, site } from '@/content/site';
import '@/lib/fontawesome';
import './globals.scss';

/**
 * Zwei Familien mit klar getrennten Rollen.
 *
 * ARCHIVO trägt alles. Es ist eine Grotesk mit leicht industriellem Charakter
 * — etwas engere Rundungen, gerade Schnitte, ein sachliches „a" und „g". Das
 * ist hier kein Geschmack, sondern Inhalt: Die Seite verkauft vollständige
 * Softwaresysteme, keine Gestaltung. Eine freundlich-runde Grotesk wie Poppins
 * würde dagegenarbeiten, eine Display-Serif ebenso.
 *
 * Entscheidend ist der FETTE Schnitt bei großem Grad. Beide Referenzen setzen
 * ihre Überschrift fett; dieselbe Größe in Light wäre eine andere Gestaltung,
 * keine Variante davon. Archivo ist variabel (100–900) und trägt 700 auch bei
 * 130 px, ohne zu verklumpen.
 *
 * JETBRAINS MONO ausschließlich für MASCHINENWERTE: Technologien, Testzahlen,
 * Daten, Statuswerte. Nicht für Sektionsüberschriften — genau daran ist ein
 * früherer Entwurf gescheitert, weil dann jede Sektion mit demselben kleinen
 * Versalienlabel begann und die Seite nach zusammengesteckten Bausteinen
 * aussah. Sparsam eingesetzt trägt die Mono dagegen die Aussage „hier steht
 * ein überprüfbarer Wert".
 *
 * Beide werden über `next/font` zur Bauzeit heruntergeladen und mit
 * ausgeliefert. Der Browser des Besuchers spricht nie mit Google — das ist
 * nicht nur Performance, sondern die datenschutzrechtliche Anforderung
 * „externe Schriftarten lokal hosten".
 */
const sans = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

/** Siehe Kommentar an der Einbindung im `<head>`. */
const BOOT_SCRIPT =
  "(function(){var d=document.documentElement;d.classList.add('js');" +
  "setTimeout(function(){if(!d.hasAttribute('data-hydrated')){d.classList.remove('js')}},4000)})();";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – Fullstack Software Engineer & AI Engineer`,
    template: `%s – ${site.name}`,
  },
  description:
    'Portfolio von Can Cadirci aus Ludwigsburg: Fullstack-Entwicklung mit Next.js, TypeScript, Python/FastAPI und PostgreSQL sowie Applied AI, Agenten-Workflows, Computer Vision, Tests und Docker.',
  alternates: { canonical: '/' },
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: site.url,
    siteName: site.name,
    title: `${site.name} – Fullstack Software Engineer & AI Engineer`,
    description:
      'Fullstack-Entwicklung mit Next.js, TypeScript, Python/FastAPI und PostgreSQL sowie Applied AI, Tests und Docker.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Ein fester Wert, weil es nur einen Modus gibt. Ohne ihn bekommt die
  // Adressleiste auf iOS einen hellen Balken über einer dunklen Seite.
  themeColor: '#0c0d0f',
  colorScheme: 'dark',
};

/**
 * `Person`-JSON-LD. diconium erscheint bewusst NICHT als `worksFor`: Es ist
 * eine abgeschlossene Ausbildungsstation, und eine aktuelle Anstellung
 * auszuzeichnen wäre eine falsche Aussage gegenüber Suchmaschinen.
 */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: 'Software Engineer / AI Developer / Security Researcher',
  url: site.url,
  email: `mailto:${contact.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: contact.city,
    postalCode: contact.postalCode,
    addressCountry: contact.country,
  },
  sameAs: [contact.linkedin, ...(contact.github ? [contact.github] : [])],
  knowsAbout: [
    'React', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL',
    'Java', 'Spring Boot', 'Applied AI', 'AI Agents', 'Computer Vision',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning`: Das Inline-Skript unten setzt vor der
    // Hydration `class` und `data-theme` auf genau diesem Element. React würde
    // die Abweichung sonst als Fehler melden — hier ist sie beabsichtigt.
    <html lang="de" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Setzt `js` auf dem Wurzelelement und nimmt es nach vier Sekunden
          zurück, falls kein `data-hydrated` erschienen ist.
          An der `js`-Klasse hängt die Regel, die Scroll-Einblendungen zunächst
          unsichtbar macht. Läuft React nicht an — ein Chunk kommt nicht durch,
          eine Erweiterung greift ein —, bliebe der halbe Seiteninhalt dauerhaft
          auf `opacity: 0`. Ein Besucher sähe eine leere Seite, und niemand
          erführe davon. Die Rücknahme macht daraus schlimmstenfalls eine Seite
          ohne Animation.
        */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      {/*
        Manche Browser-Erweiterungen schreiben vor der React-Hydration eigene
        Attribute auf den Body (z. B. `cz-shortcut-listen`). Diese Attribute
        stammen nicht aus der Anwendung und sollen keinen Dev-Overlay auslösen.
      */}
      <body suppressHydrationWarning>
        <a href="#inhalt" className="skip-link">
          Zum Inhalt springen
        </a>
        <Header />
        <main id="inhalt">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
