import { ImageResponse } from 'next/og';
import { availability, site } from '@/content/site';

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Vorschaubild für Link-Vorschauen.
 *
 * Bewusst rein typografisch: Es wird in Slack, LinkedIn und WhatsApp oft auf
 * unter 400 px Breite skaliert. Alles außer Name, Rolle und Adresse wäre dort
 * nicht mehr lesbar — ein Screenshot der Seite ergäbe in dieser Größe nur
 * graue Streifen.
 *
 * Die Farben stehen hier als Hex-Literale und nicht als Token: Diese Datei
 * wird von Satori gerendert, nicht vom Browser. Es gibt kein CSS, das eine
 * Custom Property auflösen könnte. Die Werte sind die gerechneten
 * sRGB-Entsprechungen der dunklen Palette aus `_tokens.scss`.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#191715', // --c-bg (dunkel)
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#f67621' }} />
          <div style={{ fontSize: 24, color: '#96918c', letterSpacing: 2 }}>
            {availability.location.toUpperCase()}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, color: '#f4f3f1', lineHeight: 1.05, letterSpacing: -2 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 40, color: '#bdbab6', marginTop: 20, lineHeight: 1.25 }}>
            Fullstack Software Engineer
          </div>
          <div style={{ fontSize: 40, color: '#f67621', lineHeight: 1.25 }}>
            &amp; Applied AI Engineer
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #383531',
            paddingTop: 28,
            fontSize: 24,
            color: '#96918c',
          }}
        >
          <div>Next.js · TypeScript · Python/FastAPI · PostgreSQL</div>
          <div>web-labs.io</div>
        </div>
      </div>
    ),
    size,
  );
}
