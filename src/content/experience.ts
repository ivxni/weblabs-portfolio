export interface Position {
  company: string;
  role: string;
  from: string;
  to: string;
  /** Für `<time datetime>` — maschinenlesbar. */
  fromISO: string;
  toISO: string;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
}

export const positions: readonly Position[] = [
  {
    company: 'diconium Germany GmbH',
    role: 'Full Stack Developer — Ausbildung zum Fachinformatiker für Anwendungsentwicklung',
    from: 'September 2022',
    to: 'Juli 2025',
    fromISO: '2022-09',
    toISO: '2025-07',
    summary:
      'Drei Jahre professionelle Fullstack-Praxis in Scrum-Teams. Entwicklung und Optimierung von Frontend- und Backend-Funktionen, Refactoring bestehender Services, Aufbau automatisierter Tests, Code Reviews, CI/CD und technische Abstimmung auf Deutsch und Englisch.',
    highlights: [
      'Weiterentwicklung eines internen Mitarbeitenden-Marktplatzes mit React und Java/Spring Boot',
      'Refactoring von Java-Legacy-Services und Aufbau umfassender JUnit-Tests',
      'React-/Java-Webtool mit Bildverarbeitungs-API und Drag-and-Drop-Oberfläche',
      'Echtzeit-Schätzanwendung mit React, Node.js/Express, MongoDB und WebSocket',
      'Technische Demos und Abstimmung auf Deutsch und Englisch',
    ],
    stack: [
      'React', 'TypeScript', 'JavaScript', 'Java', 'Spring Boot', 'Node.js', 'Express',
      'REST', 'MongoDB', 'WebSocket', 'JUnit', 'Jest', 'React Testing Library',
      'GitHub', 'Azure DevOps', 'Scrum',
    ],
  },
];

export interface Qualification {
  title: string;
  institution: string;
  date: string;
  dateISO: string;
  result?: string;
}

export const qualifications: readonly Qualification[] = [
  {
    title: 'Fachinformatiker für Anwendungsentwicklung',
    institution: 'diconium Germany GmbH / IHK Region Stuttgart',
    date: 'Juli 2025',
    dateISO: '2025-07',
    result: 'Gesamtergebnis gut — 81 Punkte',
  },
  {
    title: 'IHK-Zusatzqualifikation Künstliche Intelligenz und maschinelles Lernen',
    institution: 'IHK Region Stuttgart',
    date: 'Mai 2025',
    dateISO: '2025-05',
    result: 'Bestanden — 73 Punkte',
  },
  {
    title: 'Berufsschulabschluss',
    institution: 'it.schule stuttgart',
    date: 'Juli 2025',
    dateISO: '2025-07',
    result: 'Durchschnitt der Schulabschlussprüfung 2,4',
  },
];

/**
 * Paraphrasiert, kein Direktzitat. Das Kontextdokument verbietet ausdrücklich
 * scheinbare Zitate aus dem Arbeitszeugnis.
 */
export const referenceSummary =
  'Mein Arbeitszeugnis hebt schnelle Auffassungsgabe, Eigeninitiative, Lernbereitschaft, Belastbarkeit, Zuverlässigkeit und professionelles Verhalten hervor.';
