import Link from 'next/link';
import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SystemSphere } from '@/components/visual/SystemSphere';
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.meta}>
        <p>Can Cadirci</p>
        <p>Software Engineer · Ludwigsburg, DE</p>
      </div>

      <div className={styles.main}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Softwareentwicklung / AI engineering / Security research</p>
          <h1 id="hero-heading">
            <span>Software</span>
            <span>built</span>
            <span>end to end.</span>
          </h1>
          <div className={styles.introRow}>
            <p>
              Individuelle Webanwendungen und AI-Systeme für Unternehmen — von der
              Produktoberfläche über APIs und Daten bis zu Tests und Deployment.
            </p>
            <div className={styles.actions}>
              <Link href="/leistungen">Leistungen <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
              <Link href="/projekte">Case Studies</Link>
            </div>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <SystemSphere className={styles.sphere} />
        </div>
      </div>

      <div className={styles.bottom}>
        <p>Next.js · Python · Computer Vision · SystemVerilog</p>
        <a href="#focus">Explore <FontAwesomeIcon icon={faArrowDown} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
