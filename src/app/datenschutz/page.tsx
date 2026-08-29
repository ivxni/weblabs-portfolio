import type { Metadata } from 'next';
import { contact, legal, site } from '@/content/site';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import styles from '../impressum/Legal.module.scss';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: `Datenschutzerklärung für ${site.url}.`,
  alternates: { canonical: '/datenschutz' },
  robots: { index: false, follow: true },
};

/**
 * Diese Erklärung beschreibt, was der Code TATSÄCHLICH tut — nicht, was eine
 * Vorlage üblicherweise auflistet. Konkret gibt es hier kein Analytics, keine
 * Cookies, keinen externen Schriftabruf und keine Einbettungen. Genau das steht
 * deshalb auch drin. Ein Abschnitt über Google Fonts oder Cookie-Einwilligung
 * wäre falsch und würde die übrigen Angaben unglaubwürdig machen.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        label="Rechtliches"
        title="Datenschutzerklärung"
        lead="Diese Website erhebt so wenig Daten wie technisch möglich. Es gibt keine Analyse-Werkzeuge, keine Cookies zur Wiedererkennung und keine eingebetteten Inhalte Dritter."
      />

      <Section>
        <Container width="narrow">
          <div className={styles.block}>
            <h2 className={styles.heading}>Verantwortliche Stelle</h2>
            <div className={styles.body}>
              <p>
                {site.name}, {contact.postalCode} {contact.city}, Deutschland.
                <br />
                E-Mail:{' '}
                <a href={`mailto:${contact.email}`} className={styles.link}>
                  {contact.email}
                </a>
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Server-Logdateien</h2>
            <div className={styles.body}>
              <p>
                Beim Aufruf der Seite verarbeitet der Server technisch notwendige Daten, die Ihr
                Browser automatisch übermittelt: IP-Adresse, Datum und Uhrzeit, aufgerufene
                Adresse, übertragene Datenmenge, Statuscode sowie Browser- und
                Betriebssystemangaben.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt
                im technisch fehlerfreien Betrieb und in der Abwehr von Angriffen. Diese Daten
                werden nicht mit anderen Quellen zusammengeführt und nicht zur Analyse des
                Nutzungsverhaltens verwendet.
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Kontaktformular und E-Mail</h2>
            <div className={styles.body}>
              <p>
                Wenn Sie das Kontaktformular nutzen, verarbeite ich die dort eingegebenen Daten
                — Name, E-Mail-Adresse, optional das Unternehmen, das genannte Thema sowie den
                Nachrichtentext — ausschließlich zur Bearbeitung Ihrer Anfrage. Dasselbe gilt
                für eine Nachricht, die Sie mir direkt per E-Mail schicken.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei anbahnungsbezogenen Anfragen,
                sonst Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden gelöscht, sobald der Vorgang
                abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen,
                spätestens nach zwölf Monaten.
              </p>
              <p>
                Die Angaben aus dem Formular werden nicht in einer Datenbank gespeichert. Sie
                werden unmittelbar als E-Mail an mein Postfach zugestellt.
                {legal.mailProvider && ` Betreiber des Postfachs ist ${legal.mailProvider}.`}
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Missbrauchsschutz</h2>
            <div className={styles.body}>
              <p>
                Um automatisierte Massensendungen zu verhindern, begrenzt der Server die Anzahl
                der Formularabsendungen pro Absenderadresse und Stunde. Dafür wird die
                IP-Adresse für die Dauer eines Zeitfensters im Arbeitsspeicher gehalten und
                danach verworfen. Es kommt kein CAPTCHA und kein externer Dienst zum Einsatz.
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Cookies, Analyse und Tracking</h2>
            <div className={styles.body}>
              <p>
                Diese Website setzt keine Cookies zur Wiedererkennung und verwendet keine
                Analyse- oder Trackingwerkzeuge. Es gibt daher auch kein Einwilligungsbanner.
              </p>
              <p>
                Die von Ihnen gewählte Farbschema-Einstellung (hell, dunkel oder
                Systemeinstellung) wird ausschließlich lokal in Ihrem Browser gespeichert
                (localStorage). Diese Angabe verlässt Ihr Gerät nicht und wird nicht an den
                Server übertragen.
              </p>
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.heading}>Schriftarten und externe Inhalte</h2>
            <div className={styles.body}>
              <p>
                Alle Schriftarten werden vom eigenen Server ausgeliefert. Es findet kein Abruf
                bei Google Fonts oder einem anderen Anbieter statt, und Ihre IP-Adresse wird
                dabei an keinen Dritten übermittelt. Es sind keine Karten, Videos oder
                Social-Media-Elemente eingebettet.
              </p>
            </div>
          </div>

          {legal.hostingProvider && (
            <div className={styles.block}>
              <h2 className={styles.heading}>Hosting</h2>
              <div className={styles.body}>
                <p>
                  Die Website wird bei {legal.hostingProvider} betrieben. Mit dem Anbieter
                  besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.
                </p>
              </div>
            </div>
          )}

          <div className={styles.block}>
            <h2 className={styles.heading}>Ihre Rechte</h2>
            <div className={styles.body}>
              <p>Sie haben jederzeit das Recht auf:</p>
            </div>
            <ul className={styles.list}>
              <li>Auskunft über die zu Ihnen gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <div className={styles.body}>
              <p>
                Eine formlose E-Mail an{' '}
                <a href={`mailto:${contact.email}`} className={styles.link}>
                  {contact.email}
                </a>{' '}
                genügt. Außerdem steht Ihnen ein Beschwerderecht bei einer
                Datenschutz-Aufsichtsbehörde zu; zuständig ist der Landesbeauftragte für den
                Datenschutz und die Informationsfreiheit Baden-Württemberg.
              </p>
            </div>
          </div>

          <p className={styles.updated}>Stand: August 2026</p>
        </Container>
      </Section>
    </>
  );
}
