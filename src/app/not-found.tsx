import type { Metadata } from 'next';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <Container width="narrow">
        <p className={styles.code} data-numeric>
          Fehler 404
        </p>
        <h1 className={styles.heading}>Diese Seite gibt es nicht.</h1>
        <p className={styles.body}>
          Entweder hat sich die Adresse geändert oder sie hat nie existiert. Beides lässt sich
          von hier aus in zwei Klicks beheben.
        </p>
        <div className={styles.links}>
          <LinkButton href="/" variant="primary" icon={faArrowRight}>
            Zur Startseite
          </LinkButton>
          <LinkButton href="/projekte" variant="secondary">
            Projekte ansehen
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
