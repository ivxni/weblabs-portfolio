import { availability } from './site';

export const hero = {
  status: `${availability.location} · ${availability.model}`,
  headline: 'Ich entwickle Software, die nicht bei der Demo aufhört.',
  lead:
    'Ich bin Can Cadirci, Fullstack Software Engineer und Applied AI Engineer. Ich entwickle Produkte mit Next.js, TypeScript, Python/FastAPI und PostgreSQL — von der Oberfläche über APIs und Datenmodelle bis zu Tests, sicheren AI-Workflows und Deployment.',
} as const;

/**
 * Der Systemschnitt — das eine Element, an das man sich erinnern soll.
 *
 * Er ist keine Dekoration, sondern die Überschrift als Grafik: Ein Schnitt
 * durch ein System, Schicht für Schicht. Nach der ersten Schicht steht die
 * Linie, hinter der die meisten Demos aufhören. Alles darunter ist die
 * eigentliche Aussage der Seite.
 *
 * Warum das und nicht eine Partikelkugel: Ein rotierendes Objekt sagt nichts
 * über den Inhalt. Diese Grafik ist der Inhalt.
 */
export interface SystemLayer {
  key: string;
  name: string;
  stack: readonly string[];
  note: string;
}

export const systemLayers: readonly SystemLayer[] = [
  {
    key: '01',
    name: 'Oberfläche',
    stack: ['Next.js', 'React', 'TypeScript'],
    note: 'Zustände für Laden, Leere und Fehler — nicht nur den Erfolgsfall.',
  },
  {
    key: '02',
    name: 'API',
    stack: ['FastAPI', 'Node/Express', 'Spring Boot'],
    note: 'Typisierte Verträge, serverseitige Validierung, echte Statuscodes.',
  },
  {
    key: '03',
    name: 'Daten',
    stack: ['PostgreSQL', 'SQLAlchemy', 'Alembic'],
    note: 'Ein Modell, das eine Migration überlebt, statt Spalten nach Bedarf.',
  },
  {
    key: '04',
    name: 'Tests',
    stack: ['pytest', 'Vitest', 'JUnit'],
    note: 'Normalfall, Fehlerfall und Fallback. Der Fehlerfall zuerst.',
  },
  {
    key: '05',
    name: 'Betrieb',
    stack: ['Docker', 'Coolify', 'GitHub Actions'],
    note: 'Läuft nicht nur auf meinem Rechner. Das ist der ganze Punkt.',
  },
];

/**
 * Der Index der Schicht, NACH der die Demo-Linie sitzt.
 * 0 = direkt nach der Oberfläche.
 */
export const demoBoundaryAfter = 0;

export const demoBoundaryLabel = 'Viele Demos enden hier';

/**
 * Vier überprüfbare Belege. Bewusst KEINE Vanity-Metriken (10k+ Nutzer,
 * 99,9 % Uptime) — jeder Punkt ist eine Urkunde, ein Zeitraum oder ein
 * Testlauf mit Datum, den man nachfragen kann.
 */
export interface Credential {
  value: string;
  label: string;
  /** Erscheint als Fußnote, wenn die Angabe präzisiert werden muss. */
  footnote?: string;
}

export const credentials: readonly Credential[] = [
  {
    value: '3 Jahre',
    label: 'professionelle Fullstack-Praxis bei diconium im Rahmen der Ausbildung',
  },
  {
    value: '81 Punkte',
    label: 'IHK-Fachinformatiker Anwendungsentwicklung, Abschluss gut',
  },
  {
    value: '73 Punkte',
    label: 'IHK-Zusatzqualifikation KI und maschinelles Lernen',
  },
  {
    value: '282 Tests',
    label: 'bestanden im UnitFly-Prüfstand vom 22.08.2026',
    footnote:
      '274 Backend- und 8 Frontend-Tests, lokaler Prüfstand vom 22.08.2026. Kein Nachweis für einen produktiven Kundenbetrieb.',
  },
];

export const delivery = {
  heading: 'Von der Idee bis zum belastbaren System',
  body:
    'Mein Schwerpunkt liegt auf Anwendungen, bei denen Frontend, Backend, Daten und Betrieb zusammen gedacht werden müssen. Ich kann eine React-Oberfläche bauen, eine typisierte API und ein relationales Datenmodell entwerfen, das System mit Tests absichern und es containerisiert ausliefern. Bei AI-Funktionen achte ich besonders darauf, was ein Modell entscheiden darf, wie Fehler abgefangen werden und wie Aktionen nachvollziehbar bleiben.',
  competences: [
    {
      term: 'Fullstack-Produkte',
      definition:
        'Next.js, React und TypeScript im Frontend; Python/FastAPI, Node.js/Express oder Java/Spring Boot im Backend; PostgreSQL und MongoDB für die Datenhaltung.',
    },
    {
      term: 'Applied AI',
      definition:
        'LLM-APIs, semantische Suche, Embeddings, RAG-artige Systeme, Agenten-Workflows, Computer Vision, Guardrails, Fallbacks und Audit.',
    },
    {
      term: 'Engineering-Qualität',
      definition:
        'Automatisierte Tests, Code Reviews, Refactoring, CI/CD, Docker, Rollen- und Tenant-Kontext, Rate Limits und nachvollziehbare Systemgrenzen.',
    },
  ],
} as const;

export const aiPractice = {
  heading: 'AI beschleunigt meine Arbeit. Die Verantwortung bleibt bei mir.',
  body:
    'Ich arbeite seit Jahren intensiv mit AI-Werkzeugen bei Recherche, Planung, Architektur, Implementierung, Debugging und Dokumentation. Entscheidend ist für mich nicht, wie viel Code ein Modell erzeugt, sondern ob ich jede relevante Entscheidung erklären, testen und bei Bedarf selbst korrigieren kann. Deshalb gehören Code-Review, Tests, reproduzierbare Fehleranalysen und klare Grenzen für Modellaktionen fest zu meinem Workflow.',
  principles: [
    'Problem und Akzeptanzkriterien zuerst klären',
    'AI-Ausgaben wie fremden Code prüfen',
    'Kritische Logik deterministisch absichern',
    'Tests für normale Abläufe, Fehlerfälle und Fallbacks schreiben',
    'Keine Fähigkeiten behaupten, die sich nicht zeigen lassen',
  ],
} as const;

export const experienceTeaser = {
  heading: 'Professionelle Praxis im Team',
  body:
    'Von September 2022 bis Juli 2025 habe ich bei diconium meine Ausbildung zum Fachinformatiker für Anwendungsentwicklung absolviert und in professionellen Scrum-Teams an Frontend- und Backend-Systemen gearbeitet. Dazu gehörten React, TypeScript, Java/Spring Boot, Node.js/Express, REST, MongoDB, WebSocket, automatisierte Tests, Code Reviews und CI/CD mit GitHub und Azure DevOps.',
} as const;

export const closing = {
  heading: 'Sie suchen jemanden, der sich schnell in ein System einarbeitet und wirklich baut?',
  body:
    'Ich suche eine Software-, Fullstack- oder Applied-AI-Rolle im Raum Stuttgart oder remote. Im Gespräch zeige ich lieber konkrete Architektur- und Codeentscheidungen als eine Liste großer Versprechen.',
} as const;
