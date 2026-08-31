import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  availability,
  contact,
  legalNavigation,
  navigation,
  release,
  site,
} from '@/content/site';
import { Container } from '@/components/ui/Container';
import styles from './Footer.module.scss';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.statement}>
            <div className={styles.footerBrand}>
              <Image
                src="/brand/weblabs-mark-light.svg"
                alt=""
                width={309}
                height={189}
                className={styles.footerMark}
              />
              <p className={styles.columnTitle}>{site.brand}</p>
            </div>
            <p className={styles.statementText}>
              {site.name} — {site.role}. {availability.location}. {availability.model}.
            </p>
          </div>

          <nav aria-label="Fußnavigation">
            <p className={styles.columnTitle}>Seiten</p>
            <ul className={styles.list} role="list">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={styles.columnTitle}>Kontakt</p>
            <ul className={styles.list} role="list">
              <li>
                <a href={`mailto:${contact.email}`} className={`${styles.link} ${styles.iconLink}`}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.icon} aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              {release.phonePublic && (
                <li>
                  <a href={`tel:${contact.phone}`} className={`${styles.link} ${styles.iconLink}`}>
                    <FontAwesomeIcon icon={faPhone} className={styles.icon} aria-hidden="true" />
                    {contact.phoneDisplay}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={contact.linkedin}
                  className={`${styles.link} ${styles.iconLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faLinkedinIn} className={styles.icon} aria-hidden="true" />
                  LinkedIn
                </a>
              </li>
              {/*
                Nur wenn eine Adresse hinterlegt ist. Ein Link auf ein leeres
                Profil wäre schlechter als kein Link.
              */}
              {contact.github !== '' && (
                <li>
                  <a
                    href={contact.github}
                    className={`${styles.link} ${styles.iconLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faGithub} className={styles.icon} aria-hidden="true" />
                    GitHub
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className={styles.columnTitle}>Rechtliches</p>
            <ul className={styles.list} role="list">
              {legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.baseline}>
          <span data-numeric>
            © {year} {site.brand} · {site.name}
          </span>
          {/*
            Der Fuß verlinkt auf die eigene Case-Study. Das ist kein
            Selbstzweck: Diese Seite ist eines der drei Hauptprojekte, und wer
            wissen will, wie sie gebaut ist, soll es an der Stelle finden, an
            der man danach sucht.
          */}
          <Link href="/projekte/weblabs" className={styles.colophon}>
            Wie diese Seite gebaut ist
          </Link>
        </div>
      </Container>
    </footer>
  );
}
