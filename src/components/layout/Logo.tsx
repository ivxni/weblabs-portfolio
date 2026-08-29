import Link from 'next/link';
import { site } from '@/content/site';
import styles from './Logo.module.scss';

/**
 * Marke im Kopf: Zeichen plus Name.
 *
 * Das Zeichen steht als Inline-SVG und nicht als `<img>`. Der Grund ist
 * `currentColor`: Eine eingebundene Bilddatei kann die Textfarbe der Seite
 * nicht erben, ein eingebettetes SVG schon. Auf einer monochromen Seite muss
 * die Marke mit dem Text mitlaufen — ein einzelnes farbiges Zeichen wäre kein
 * Markenauftritt, sondern ein Rest.
 *
 * Der Name steht bewusst neben dem Zeichen und nicht darunter: Dies ist ein
 * persönliches Portfolio, keine Agenturseite. Wer die Seite öffnet, soll in der
 * ersten Sekunde einen Menschen lesen, nicht ein Firmenlogo.
 */
export function Logo() {
  return (
    <Link href="/" className={styles.link} aria-label={`${site.name} — zur Startseite`}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M17.6 2.4h11.2v7.2L14.4 20.1v2.3h-6.4v-7.2L22.4 4.5v-2.1z" />
        <path
          fill="currentColor"
          opacity="0.55"
          d="M14.4 29.6H3.2v-7.2l14.4-10.5V9.6h6.4v7.2L9.6 27.5v2.1z"
        />
      </svg>
      <span className={styles.name}>
        {site.name} <span className={styles.suffix}>/ {site.brand}</span>
      </span>
    </Link>
  );
}
