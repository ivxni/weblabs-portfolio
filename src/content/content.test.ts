import { describe, expect, it } from 'vitest';
import { featuredProjects, projects, statusLabel } from './projects';
import { positions, qualifications } from './experience';
import { skillGroups } from './skills';
import { credentials, systemLayers, demoBoundaryAfter } from './home';
import { contact, legalNavigation, navigation, release, site } from './site';

/**
 * Inhalts-Integrität.
 *
 * Der Grund für diese Tests: Die Abnahmekriterien der Seite verlangen unter
 * anderem „keine unfertigen Platzhalter oder leeren Links" und „alle
 * öffentlichen Projektaussagen belegbar". Das lässt sich beim Durchklicken
 * übersehen — hier nicht. Deshalb liegen die Inhalte als typisierte Daten vor
 * und nicht als JSX pro Seite.
 */

describe('Projekte', () => {
  it('haben eindeutige Slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(projects.map((p) => [p.slug, p] as const))(
    '„%s" ist vollständig',
    (_slug, project) => {
      expect(project.name.length).toBeGreaterThan(0);
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.summary.length).toBeGreaterThan(30);
      expect(project.role.length).toBeGreaterThan(0);
      expect(project.problem.length).toBeGreaterThan(50);
      expect(project.approach.length).toBeGreaterThan(50);
      expect(project.stack.length).toBeGreaterThanOrEqual(4);
      expect(project.decisions.length).toBeGreaterThanOrEqual(3);
      expect(statusLabel[project.status]).toBeDefined();
    },
  );

  it.each(projects.map((p) => [p.slug, p] as const))(
    '„%s" benennt eine ehrliche Grenze',
    (_slug, project) => {
      // Das Feld ist im Typ Pflicht — aber ein leerer String wäre erlaubt.
      // Diese Zusicherung schließt die Lücke: Zu jedem Projekt gehört eine
      // Aussage darüber, was es NICHT belegt.
      expect(project.limitation.trim().length).toBeGreaterThan(40);
    },
  );

  it.each(projects.map((p) => [p.slug, p] as const))(
    'begründet jede Entscheidung von „%s"',
    (_slug, project) => {
      for (const decision of project.decisions) {
        expect(decision.title.length).toBeGreaterThan(10);
        // Eine Entscheidung ohne Begründung ist eine Liste, kein Beleg.
        expect(decision.rationale.length).toBeGreaterThan(40);
      }
    },
  );

  it('zeigt genau drei Projekte auf der Startseite', () => {
    // Mehr verwässert die stärksten Belege, weniger wirkt dünn.
    expect(featuredProjects).toHaveLength(3);
  });

  it('verlinkt nur vollständige, absolute URLs', () => {
    const urls = projects.flatMap((p) => (p.liveUrl ? [p.liveUrl] : []));
    for (const url of urls) {
      expect(url, `"${url}" ist keine absolute https-Adresse`).toMatch(/^https:\/\/[^\s]+$/);
      expect(() => new URL(url)).not.toThrow();
    }
  });

  it('verlinkt kein Projekt, das als „in Arbeit" gilt', () => {
    // Ein Link auf eine unfertige Seite ist schlimmer als kein Link.
    for (const project of projects.filter((p) => p.status === 'in-arbeit')) {
      expect(project.liveUrl, `${project.name} ist in Arbeit, hat aber einen Link`).toBeUndefined();
    }
  });

  it('gibt jedem Projekt mit Status „live" auch eine Adresse', () => {
    for (const project of projects.filter((p) => p.status === 'live')) {
      expect(project.liveUrl, `${project.name} gilt als live, hat aber keine Adresse`).toBeDefined();
    }
  });

  it('behauptet keinen produktiven Kundenbetrieb', () => {
    // Ausdrücklich unzulässige Formulierung aus dem Kontextdokument. Der Test
    // steht hier, weil solche Sätze beim Umformulieren leicht zurückkehren.
    const forbidden = [
      /produktiv (von|bei) kunden/i,
      /im produktiven kundenbetrieb/i,
      /garantiert (sicher|fehlerfrei)/i,
      /senior engineer/i,
      /mehrjährige berufserfahrung als ai engineer/i,
    ];
    const haystack = JSON.stringify(projects);
    for (const pattern of forbidden) {
      expect(haystack, `Unzulässige Aussage gefunden: ${pattern}`).not.toMatch(pattern);
    }
  });
});

describe('Navigation', () => {
  const routes = new Set([
    '/',
    '/projekte',
    '/erfahrung',
    '/ueber-mich',
    '/lebenslauf',
    '/kontakt',
    '/impressum',
    '/datenschutz',
    ...projects.map((p) => `/projekte/${p.slug}`),
  ]);

  it.each([...navigation, ...legalNavigation])('„$label" zeigt auf eine echte Route', (item) => {
    expect(routes.has(item.href), `${item.href} existiert nicht`).toBe(true);
  });

  it('hat keine doppelten Einträge', () => {
    const hrefs = [...navigation, ...legalNavigation].map((n) => n.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe('Kontaktdaten', () => {
  it('hat eine gültige E-Mail-Adresse', () => {
    expect(contact.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
  });

  it('speichert die Telefonnummer im E.164-Format', () => {
    // Mit Leerzeichen wählt iOS aus einem `tel:`-Link heraus nicht.
    expect(contact.phone).toMatch(/^\+\d{8,15}$/);
  });

  it('nutzt eine absolute LinkedIn-Adresse', () => {
    expect(contact.linkedin).toMatch(/^https:\/\/(www\.)?linkedin\.com\//);
  });

  it('hat eine Basis-URL ohne abschließenden Schrägstrich', () => {
    // Sonst entstehen in Sitemap und Canonicals doppelte Schrägstriche.
    expect(site.url).not.toMatch(/\/$/);
  });

  it('verlinkt GitHub nur, wenn eine Adresse hinterlegt ist', () => {
    if (contact.github === '') return;
    expect(contact.github).toMatch(/^https:\/\/(www\.)?(github|gitlab)\.com\/.+/);
  });
});

describe('Freigaben', () => {
  it('verlinkt das Lebenslauf-PDF nur nach Freigabe', () => {
    // Der Schalter ist die einzige Stelle, an der das entschieden wird.
    expect(typeof release.resumePdf).toBe('boolean');
  });

  it('hält den UnitFly-Repository-Link geschlossen, solange der Sicherheitsblocker offen ist', () => {
    expect(release.unitflyRepo).toBe(false);
  });
});

describe('Startseiteninhalte', () => {
  it('hat fünf Systemschichten mit fortlaufenden Schlüsseln', () => {
    expect(systemLayers).toHaveLength(5);
    systemLayers.forEach((layer, index) => {
      expect(layer.key).toBe(String(index + 1).padStart(2, '0'));
      expect(layer.stack.length).toBeGreaterThanOrEqual(2);
      expect(layer.note.length).toBeGreaterThan(20);
    });
  });

  it('setzt die Demo-Grenze innerhalb der Schichten', () => {
    expect(demoBoundaryAfter).toBeGreaterThanOrEqual(0);
    expect(demoBoundaryAfter).toBeLessThan(systemLayers.length - 1);
  });

  it('versieht die Testzahl mit einer Fußnote', () => {
    // Eine nackte Zahl wie „282 Tests" ohne Einordnung wäre genau die Art von
    // Angabe, die das Kontextdokument verbietet.
    const testCount = credentials.find((c) => c.value.includes('Tests'));
    expect(testCount?.footnote).toBeDefined();
    expect(testCount?.footnote).toMatch(/22\.08\.2026/);
  });
});

describe('Erfahrung und Skills', () => {
  it('hat maschinenlesbare Zeiträume', () => {
    for (const position of positions) {
      expect(position.fromISO).toMatch(/^\d{4}-\d{2}$/);
      expect(position.toISO).toMatch(/^\d{4}-\d{2}$/);
      expect(position.fromISO < position.toISO).toBe(true);
    }
    for (const entry of qualifications) {
      expect(entry.dateISO).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it('nennt keine Prozentwerte oder Kompetenzstufen', () => {
    // Prozentbalken sind ausdrücklich ausgeschlossen: nicht überprüfbar.
    const haystack = JSON.stringify(skillGroups);
    expect(haystack).not.toMatch(/\d+\s?%/);
    expect(haystack).not.toMatch(/(anfänger|fortgeschritten|experte|expert level)/i);
  });

  it('ordnet jede Skill-Gruppe einem Einsatzgebiet zu', () => {
    for (const group of skillGroups) {
      expect(group.items.length).toBeGreaterThanOrEqual(5);
      expect(group.note.length).toBeGreaterThan(20);
    }
  });
});
