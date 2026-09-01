import { availability } from './site';

export const hero = {
  status: `${availability.location} · ${availability.model}`,
  headline: 'Individuelle Software, die nicht bei der Demo aufhört.',
  lead:
    'Ich bin Can Cadirci, Software- und KI-Entwickler aus Ludwigsburg. Ich entwickle Produkte mit Next.js, TypeScript, Python/FastAPI und PostgreSQL — von der Oberfläche über APIs und Datenmodelle bis zu Tests, sicheren AI-Workflows und Deployment.',
} as const;

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
  heading: 'Sie haben einen Prozess, für den Standardsoftware nicht sauber passt?',
  body:
    'Ich entwickle individuelle Software-, Web- und AI-Systeme für Unternehmen im Raum Stuttgart und deutschlandweit. Im ersten Gespräch klären wir Problem, vorhandene Systeme und den kleinsten belastbaren Start — direkt mit dem Entwickler.',
} as const;
