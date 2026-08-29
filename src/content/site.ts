/**
 * Zentrale Seitenkonfiguration.
 *
 * Alles, was einer Freigabe unterliegt, steht hier als ein einziger Schalter.
 * Das ist Absicht: Das Kontextdokument führt eine Liste von Dingen, die erst
 * nach Prüfung öffentlich werden dürfen (Lebenslauf-PDF, Repositories,
 * Telefonnummer). Wenn diese Entscheidungen über die Bauteile verstreut wären,
 * müsste man sie vor jedem Livegang suchen. Hier sind es Booleans an einer
 * Stelle, und `site.test.ts` prüft, dass kein Link ins Leere zeigt.
 */

export const site = {
  url: 'https://web-labs.io',
  name: 'Can Cadirci',
  brand: 'WebLabs',
  role: 'Software Engineer · AI Developer · Security Researcher',
  locale: 'de-DE',
} as const;

export const contact = {
  email: 'can.cadirci02@outlook.com',
  /** E.164 für `tel:` — ohne Leerzeichen, sonst wählt iOS nicht. */
  phone: '+4915566655128',
  phoneDisplay: '+49 155 66655 128',
  city: 'Ludwigsburg',
  postalCode: '71638',
  country: 'DE',
  linkedin: 'https://www.linkedin.com/in/berkcan-cadirci-5945a9341/',
  /**
   * OFFEN: GitHub-Benutzername eintragen.
   * Solange dies leer ist, erscheint kein GitHub-Link — lieber kein Link als
   * ein toter. Hinweis: Ein Profil ohne einen einzigen öffentlichen
   * Repository liest sich für einen Recruiter wie ein leeres Profil. Entweder
   * ein bis zwei Repositories öffentlich stellen oder den Link weglassen.
   */
  github: '',
} as const;

export const availability = {
  location: 'Ludwigsburg / Stuttgart',
  model: 'Remote bevorzugt, hybrid möglich',
} as const;

/**
 * Freigabeschalter. Jeder steht auf dem Wert, der ohne weitere Prüfung
 * vertretbar ist. Hochdrehen erst, wenn die jeweilige Bedingung erfüllt ist.
 */
export const release = {
  /** Erst auf `true`, wenn `/downloads/Can_Cadirci_Lebenslauf.pdf` existiert und freigegeben ist. */
  resumePdf: false,
  /** Telefonnummer öffentlich zeigen. Bestätigt. */
  phonePublic: true,
  /**
   * Repository-Links zu UnitFly. Bleibt `false`: Das Kontextdokument nennt
   * einen ungelösten Sicherheitsblocker (hart hinterlegtes Geheimnis in der
   * Deployment-Konfiguration). Erst nach Bereinigung UND Rotation.
   */
  unitflyRepo: false,
} as const;

export const resumePdfPath = '/downloads/Can_Cadirci_Lebenslauf.pdf';

export interface NavItem {
  href: string;
  label: string;
}

/** Hauptnavigation. Reihenfolge = Lesereihenfolge = Tab-Reihenfolge. */
export const navigation: readonly NavItem[] = [
  { href: '/projekte', label: 'Projekte' },
  { href: '/erfahrung', label: 'Erfahrung' },
  { href: '/ueber-mich', label: 'Über mich' },
  { href: '/lebenslauf', label: 'Lebenslauf' },
  { href: '/kontakt', label: 'Kontakt' },
] as const;

/** Rechtliches gehört in den Fuß, nicht in die Hauptnavigation. */
export const legalNavigation: readonly NavItem[] = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
] as const;

/**
 * Rechtliche Angaben.
 *
 * VOR DEM LIVEGANG AUSFÜLLEN. Die Felder stehen bewusst leer statt mit einem
 * Beispielwert: Ein übernommener Platzhalter in einem Impressum ist ein
 * rechtliches Risiko, ein leeres Feld dagegen fällt beim Durchsehen auf.
 * Abschnitte, deren Angaben fehlen, werden auf den Rechtsseiten nicht
 * gerendert — es steht also nie etwas Falsches da, nur weniger.
 *
 * `site.test.ts` protokolliert, welche Felder noch offen sind.
 */
export const legal = {
  /** Umsatzsteuer-Identifikationsnummer nach § 27a UStG, falls vorhanden. */
  vatId: '',
  /**
   * Der Hoster, auf dem die Seite tatsächlich läuft (Name und Sitz).
   * Beispielform: 'Hetzner Online GmbH, Gunzenhausen, Deutschland'.
   */
  hostingProvider: '',
  /** Betreiber des Postfachs, an das Kontaktanfragen zugestellt werden. */
  mailProvider: '',
} as const;
