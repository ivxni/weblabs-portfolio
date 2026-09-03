import Image from 'next/image';
import Link from 'next/link';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/*
        Drei weit auslaufende blaue Felder. Sie liegen hinter allem, reagieren
        auf nichts und tragen keine Bedeutung — deshalb `aria-hidden` und
        `pointer-events: none`. Bewegt wird ausschließlich `transform`.
      */}
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.fieldBlue} />
        <span className={styles.fieldBlueTwo} />
        <span className={styles.fieldBlueThree} />
      </div>

      <div className={styles.shell}>
        <div className={styles.brandLine}>
          <Image
            src="/brand/weblabs-mark-light.svg"
            alt=""
            width={309}
            height={189}
            className={styles.mark}
            priority
          />
          <p className={styles.eyebrow}>WebLabs · Can Cadirci</p>
        </div>

        <h1 id="hero-heading">
          Software built
          <br />
          end to end.
        </h1>

        <p className={styles.lead}>
          Individuelle Software und KI-Systeme, klar konzipiert, sauber entwickelt und
          zuverlässig ausgeliefert.
        </p>

        <div className={styles.actions}>
          <Link href="/projekte">
            Projekte ansehen <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </Link>
          <Link href="/kontakt">Projekt besprechen</Link>
        </div>
      </div>
    </section>
  );
}
