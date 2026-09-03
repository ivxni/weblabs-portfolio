import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { closing } from '@/content/home';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import styles from './ClosingCta.module.scss';

export function ClosingCta() {
  return (
    <section className={styles.section} aria-labelledby="closing-heading">
      <Container>
        <h2 className={styles.heading} id="closing-heading">
          {closing.heading}
        </h2>
        <p className={styles.body}>{closing.body}</p>
        <div className={styles.actions}>
          <LinkButton href="/kontakt" variant="primary" icon={faArrowRight}>
            Kontakt aufnehmen
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
