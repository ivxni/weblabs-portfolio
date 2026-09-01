/**
 * Technologien nach Einsatzgebiet.
 *
 * Keine Prozentbalken, keine Sterne, keine erfundenen Kompetenzstufen. Eine
 * Zahl wie „React 85 %" ist nicht überprüfbar und wird von jedem technischen
 * Leser als das gelesen, was sie ist. Die Gruppierung nach Einsatzgebiet sagt
 * mehr: Sie zeigt, wo jemand im System arbeitet.
 */

export interface SkillGroup {
  /** Kurzes Mono-Label über der Gruppe. */
  key: string;
  title: string;
  /** Ein Satz, was diese Gruppe im System tut. */
  note: string;
  items: readonly string[];
}

export const skillGroups: readonly SkillGroup[] = [
  {
    key: '01',
    title: 'Frontend',
    note: 'Das, was der Nutzer bedient, inklusive Tastaturbedienung und Verhalten unter 320 px.',
    items: [
      'React', 'Next.js', 'TypeScript', 'JavaScript', 'React Native / Expo',
      'HTML', 'CSS / SCSS', 'Responsive Layouts', 'Designsysteme & Visual QA',
      'Barrierefreie Oberflächen',
    ],
  },
  {
    key: '02',
    title: 'Backend',
    note: 'Typisierte Schnittstellen, klare Fehlerzustände, keine Logik im Controller.',
    items: [
      'Python', 'FastAPI', 'Node.js', 'Express', 'Java', 'Spring Boot',
      'REST-APIs', 'WebSocket',
    ],
  },
  {
    key: '03',
    title: 'Daten',
    note: 'Relationale Modelle, die eine Migration überstehen, statt Tabellen, die zufällig passen.',
    items: ['PostgreSQL', 'SQLAlchemy', 'SQL', 'Alembic', 'MongoDB', 'Datenmodellierung'],
  },
  {
    key: '04',
    title: 'Applied AI',
    note: 'Modellaktionen begrenzen, Ausfälle abfangen, Entscheidungen nachvollziehbar halten.',
    items: [
      'LLM-APIs', 'Semantische Suche & Embeddings', 'RAG-artige Systeme',
      'Agenten- und Tool-Workflows', 'Prompt Engineering', 'AI-assisted Engineering',
      'Guardrails, Fallbacks & Audit', 'OpenCV', 'YOLO / OpenCV DNN / SFace',
    ],
  },
  {
    key: '05',
    title: 'Engineering',
    note: 'Der Teil, der entscheidet, ob ein Projekt in sechs Monaten noch änderbar ist.',
    items: [
      'Docker', 'Git & GitHub', 'GitHub Actions', 'Azure DevOps CI/CD',
      'pytest', 'Vitest', 'Jest', 'React Testing Library', 'JUnit',
      'Code Reviews', 'Refactoring', 'Scrum',
    ],
  },
];
