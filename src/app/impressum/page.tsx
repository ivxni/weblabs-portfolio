import { contact, legal, site } from '@/content/site';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import styles from './Legal.module.scss';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Impressum',
  description: `Impressum und Anbieterkennzeichnung für ${site.url}.`,
  path: '/impressum',
  noIndex: true,
});

export default function ImprintPage() {
  return (
    <>
      <PageHeader label="Rechtliches" title="Impressum" />

      <Section>
        <Container width="narrow">
          <div className={styles.block}>
            <h2 className={styles.heading}>Angaben gemäß § 5 DDG</h2>
            <div className={styles.body}>
              <p>
                {site.brand}
                <br />
                Inhaber: {site.name}
                <br />
                {contact.streetAddress}
                <br />
                {contact.postalCode} {contact.city}
                <br />
                Deutschland
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Kontakt</h2>
            <div className={styles.body}>
              <p>
                E-Mail:{' '}
                <a href={`mailto:${contact.email}`} className={styles.link}>
                  {contact.email}
                </a>
                <br />
                Telefon:{' '}
                <a href={`tel:${contact.phone}`} className={styles.link}>
                  {contact.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          {legal.vatId && (
            <div className={styles.block}>
              <h2 className={styles.heading}>Umsatzsteuer-Identifikationsnummer</h2>
              <div className={styles.body}>
                <p>Gemäß § 27a Umsatzsteuergesetz: {legal.vatId}</p>
              </div>
            </div>
          )}

          <div className={styles.block}>
            <h2 className={styles.heading}>Verantwortlich für den Inhalt</h2>
            <div className={styles.body}>
              <p>
                {site.name}, Anschrift wie oben. Diese Website ist ein persönliches Portfolio
                und beschreibt angebotene Entwicklungsleistungen. Verträge oder Zahlungen
                werden nicht unmittelbar über die Website abgeschlossen.
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Haftung für Links</h2>
            <div className={styles.body}>
              <p>
                Diese Seite verlinkt auf externe Websites, auf deren Inhalte ich keinen Einfluss
                habe. Für diese Inhalte ist stets der jeweilige Anbieter verantwortlich. Zum
                Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Werde ich
                auf eine Rechtsverletzung aufmerksam, entferne ich den Link umgehend.
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Urheberrecht</h2>
            <div className={styles.body}>
              <p>
                Die auf dieser Seite gezeigten Texte, Screenshots und Grafiken stammen von mir,
                sofern nicht anders angegeben. Screenshots aus Auftragsarbeiten werden nur im
                Rahmen der jeweils erteilten Freigabe verwendet.
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Streitbeilegung</h2>
            <div className={styles.body}>
              <p>
                Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor
                einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>

          <p className={styles.updated}>Stand: 31. August 2026</p>
        </Container>
      </Section>
    </>
  );
}
