import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { contact, release } from '@/content/site';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContactForm } from './ContactForm';
import styles from './Contact.module.scss';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Projekt anfragen — Kontakt',
  description: 'Kontakt zu Can Cadirci für individuelle Softwareentwicklung, Webentwicklung und KI-Projekte in Ludwigsburg, Stuttgart und deutschlandweit.',
  path: '/kontakt',
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Kontakt"
        index="05 / Direkt"
        title="Lassen Sie uns über Ihr System sprechen."
        lead="Beschreiben Sie kurz den heutigen Ablauf, das gewünschte Ergebnis und vorhandene Systeme. Ich antworte direkt mit konkreten Rückfragen — ohne Vertriebsübergabe und ohne Standardtext."
      />

      <Section compact>
        <Container>
          <div className={styles.grid}>
            <div className={styles.direct}>
              <p className={styles.channelLabel}>Direkte Wege</p>
              <p className={styles.directStatement}>Eine konkrete Frage ist der beste Start. E-Mail, Telefon oder LinkedIn führen direkt zu mir.</p>
              <ul className={styles.channels} role="list">
                <li className={styles.channel}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.channelIcon} aria-hidden="true" />
                  <span>
                    <a href={`mailto:${contact.email}`} className={styles.channelLink}>
                      {contact.email}
                    </a>
                    <span className={styles.channelHint}>Antwort meist am selben Werktag</span>
                  </span>
                </li>

                {release.phonePublic && (
                  <li className={styles.channel}>
                    <FontAwesomeIcon icon={faPhone} className={styles.channelIcon} aria-hidden="true" />
                    <span>
                      <a href={`tel:${contact.phone}`} className={styles.channelLink}>
                        {contact.phoneDisplay}
                      </a>
                      <span className={styles.channelHint}>Mo–Fr</span>
                    </span>
                  </li>
                )}

                <li className={styles.channel}>
                  <FontAwesomeIcon icon={faLinkedinIn} className={styles.channelIcon} aria-hidden="true" />
                  <span>
                    <a
                      href={contact.linkedin}
                      className={styles.channelLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn-Profil
                      <span className="visually-hidden"> (öffnet in neuem Tab)</span>
                    </a>
                  </span>
                </li>

                <li className={styles.channel}>
                  <FontAwesomeIcon icon={faLocationDot} className={styles.channelIcon} aria-hidden="true" />
                  <span>
                    <span className={styles.channelLink}>
                      {contact.postalCode} {contact.city}, Deutschland
                    </span>
                    <span className={styles.channelHint}>Region Stuttgart · remote bevorzugt</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className={styles.formPanel}>
              <p className={styles.formLabel}>Oder direkt hier schreiben</p>
              <ContactForm />

              <p className={styles.privacyNote}>
                Ihre Angaben werden ausschließlich zur Bearbeitung dieser Anfrage verwendet, per
                E-Mail an mich zugestellt und nicht an Dritte weitergegeben. Es findet kein
                Tracking statt. Die Nachricht wird gelöscht, sobald der Vorgang abgeschlossen
                ist, spätestens nach zwölf Monaten.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
