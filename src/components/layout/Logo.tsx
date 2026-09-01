import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/content/site';
import styles from './Logo.module.scss';

/**
 * Marke im Kopf: Zeichen plus Name.
 *
 * Das Zeichen ist die freigegebene helle WebLabs-Marke. Das orange Signet
 * bleibt Favicon und App-Icon; im dunklen Header wirkt die monochrome Variante
 * ruhiger und hält die persönliche Positionierung im Vordergrund.
 *
 * Der Name steht bewusst neben dem Zeichen und nicht darunter: Dies ist ein
 * persönliches Portfolio, keine Agenturseite. Wer die Seite öffnet, soll in der
 * ersten Sekunde einen Menschen lesen, nicht ein Firmenlogo.
 */
export function Logo() {
  return (
    <Link href="/" className={styles.link} aria-label={`${site.name}, zur Startseite`}>
      <Image
        src="/brand/weblabs-mark-light.svg"
        alt=""
        width={309}
        height={189}
        className={styles.mark}
        priority
      />
      <span className={styles.name}>
        {site.name} <span className={styles.suffix}>/ {site.brand}</span>
      </span>
    </Link>
  );
}
