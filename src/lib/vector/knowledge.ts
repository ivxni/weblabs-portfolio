export interface VectorKnowledgeDocument {
  id: string;
  title: string;
  section: string;
  url: string;
  text: string;
  keywords: readonly string[];
  priority?: number;
}

/**
 * Ausschließlich freigegebene, bereits öffentlich sichtbare Portfolioinhalte.
 * Private Anhänge, interne Produktnamen und operative Security-Anleitungen
 * werden bewusst nicht automatisch aus Dateien oder Seiten gecrawlt.
 */
export const vectorKnowledge: readonly VectorKnowledgeDocument[] = [
  {
    id: 'profile', title: 'Can Cadirci', section: 'Profil', url: '/ueber-mich', priority: 1.2,
    text: 'Can Cadirci ist Software- und KI-Entwickler aus Ludwigsburg. Er entwickelt vollständige digitale Systeme von der Produktoberfläche über APIs und Datenmodelle bis zu Tests, sicheren AI-Workflows, Docker und Deployment. Projekte sind im Raum Stuttgart sowie deutschlandweit remote möglich.',
    keywords: ['Can Cadirci', 'WebLabs', 'Softwareentwickler', 'KI Entwickler', 'Ludwigsburg', 'Stuttgart', 'remote'],
  },
  {
    id: 'software', title: 'Individuelle Softwareentwicklung', section: 'Leistung', url: '/leistungen/individuelle-softwareentwicklung', priority: 1.15,
    text: 'Der Schwerpunkt liegt auf individuellen Webanwendungen, Portalen, internen Tools, APIs und Prozessautomatisierung. Can verbindet Frontend, Backend, Datenbank, Rollen, Tests und Betrieb. Geeignet ist das besonders, wenn Excel, E-Mail und isolierte Standardtools einen zusammenhängenden Unternehmensprozess nicht sauber abbilden.',
    keywords: ['Individualsoftware', 'Softwareentwicklung', 'Webanwendung', 'Portal', 'internes Tool', 'Automatisierung', 'API', 'Prozess'],
  },
  {
    id: 'web', title: 'Webentwicklung', section: 'Leistung', url: '/leistungen/webentwicklung', priority: 1.15,
    text: 'Can entwickelt individuelle Unternehmenswebsites und Web-Apps mit Next.js, React, TypeScript und SCSS. Dazu gehören eigenständiges Design, responsive Umsetzung, Performance, technisches SEO, Formulare, geschützte Bereiche, APIs, Datenbanken und Docker-Deployment. Persönliche Termine sind in Ludwigsburg und Stuttgart möglich.',
    keywords: ['Website', 'Webseite', 'Webentwicklung', 'Web App', 'Next.js', 'React', 'SEO', 'responsive', 'Design'],
  },
  {
    id: 'ai', title: 'KI-Entwicklung und RAG', section: 'Leistung', url: '/leistungen/ki-entwicklung', priority: 1.2,
    text: 'Can entwickelt AI-Funktionen als kontrollierte Teile eines Softwaresystems. Dazu gehören RAG und semantische Suche, LLM-Integrationen, AI-Agenten mit Guardrails, Computer Vision, Zeitreihenmodelle, Rollenprüfung, Audit, Fallbacks, Rate Limits und Kostenkontrolle. Je nach Aufgabe nutzt er Cloud-APIs, Open-Source-Modelle oder klassische Machine-Learning-Verfahren.',
    keywords: ['KI', 'AI', 'RAG', 'Chatbot', 'LLM', 'Agenten', 'Machine Learning', 'semantische Suche', 'Guardrails'],
  },
  {
    id: 'vision', title: 'Realtime Vision Runtime', section: 'Projekt', url: '/projekte/realtime-vision-runtime',
    text: 'Die öffentliche Case Study beschreibt eine hardwarebeschleunigte Computer-Vision-Pipeline. Capture und OpenCV werden mit YOLO-Inferenz über TensorRT, ONNX Runtime oder OpenVINO verbunden. Ein getrennt entwickelter Arduino-Layer übernimmt Protokoll, Firmware und Hardware-Ausgabe. Produktname und konkrete Nutzung bleiben bewusst unveröffentlicht.',
    keywords: ['Computer Vision', 'YOLO', 'TensorRT', 'ONNX', 'OpenVINO', 'OpenCV', 'Arduino', 'Inference'],
  },
  {
    id: 'agents', title: 'UnitFly und kontrollierte AI-Agenten', section: 'Projekt', url: '/projekte/unitfly',
    text: 'UnitFly ist eine Fullstack-Plattform mit Next.js, FastAPI, PostgreSQL und kontrollierten AI-Agenten. Deterministischer Code begrenzt Kandidaten und Wertebereiche. Rollen, Schreibschutz, Freigaben und Audit gelten auch für automatisierte Abläufe. Agenten erhalten keine Sonderrechte gegenüber normalen Nutzern.',
    keywords: ['UnitFly', 'AI Agent', 'FastAPI', 'PostgreSQL', 'Guardrails', 'Audit', 'Multi Tenant'],
  },
  {
    id: 'market', title: 'ML Market Runtime', section: 'Projekt', url: '/projekte/ml-market-runtime',
    text: 'Die ML Market Runtime ist eine eigenständig entwickelte Forex-Zeitreihenpipeline. Sie kombiniert historische Daten mehrerer Währungspaare, technische und makroökonomische Merkmale, Walk-forward-Validierung, Modellprognosen und eine getrennte deterministische Risikoebene. Die Portfolio-Demo verwendet keine echten Marktdaten und ist kein Handelssignal.',
    keywords: ['Trading Bot', 'Forex', 'Zeitreihe', 'XGBoost', 'Walk Forward', 'Risk Management', 'Marktdaten'],
  },
  {
    id: 'privacy-app', title: 'VOiD Privacy Engineering', section: 'Projekt', url: '/projekte/void',
    text: 'VOiD ist eine Privacy-orientierte Mobile Camera App mit React Native und Python/FastAPI. Bilder werden verschlüsselt übertragen, mit OpenCV verarbeitet und nicht dauerhaft serverseitig gespeichert. Die Case Study untersucht visuell unauffällige adversariale Veränderungen gegen Gesichtserkennung, ohne allgemeine Anonymität oder sicheren Schutz vor Deepfakes zu versprechen.',
    keywords: ['VOiD', 'Privacy', 'React Native', 'FastAPI', 'OpenCV', 'AES', 'Gesichtserkennung', 'Deepfake'],
  },
  {
    id: 'security', title: 'Security Research', section: 'Fachbereich', url: '/#focus',
    text: 'Cans Security Research umfasst FPGA- und PCIe-Geräteforschung, Windows-Kernel-Internals, defensive Analyse von Treiberangriffsflächen und Platform Integrity. Die Arbeit findet in isolierten Testumgebungen statt. Öffentlich werden Architektur, Messung und defensive Erkenntnisse beschrieben, aber keine operativen Umgehungsanleitungen bereitgestellt.',
    keywords: ['IT Security', 'Reverse Engineering', 'FPGA', 'PCIe', 'Kernel', 'Treiber', 'Platform Integrity', 'SystemVerilog'],
  },
  {
    id: 'web-projects', title: 'Webprojekte für Unternehmen', section: 'Projekte', url: '/projekte',
    text: 'Öffentlich gezeigte Webprojekte sind PA-IT-Services mit Website, Terminablauf und geschütztem Adminbereich, Paydos Lounge mit redaktioneller Marken- und Standortpräsenz sowie Ipekten Dienstleistung mit lokaler Leistungsstruktur und Kontaktstrecke. Alle Projekte sind responsive und reproduzierbar mit Docker ausgeliefert.',
    keywords: ['PA IT Services', 'Paydos', 'Ipekten', 'Unternehmenswebsite', 'Admin Dashboard', 'Reservierung', 'Kontaktformular'],
  },
  {
    id: 'experience', title: 'Berufserfahrung und Qualifikation', section: 'Erfahrung', url: '/erfahrung', priority: 1.1,
    text: 'Can absolvierte von September 2022 bis Juli 2025 bei diconium Germany die Ausbildung zum Fachinformatiker für Anwendungsentwicklung. In professionellen Scrum-Teams arbeitete er mit React, TypeScript, Java und Spring Boot, Node.js, Express, REST, MongoDB, WebSocket, automatisierten Tests, Code Reviews, GitHub und Azure DevOps. Der IHK-Abschluss wurde mit 81 Punkten bewertet, die Zusatzqualifikation KI und maschinelles Lernen mit 73 Punkten.',
    keywords: ['diconium', 'Berufserfahrung', 'Ausbildung', 'IHK', 'Fachinformatiker', 'Scrum', 'Java', 'Spring Boot'],
  },
  {
    id: 'process', title: 'Arbeitsweise und Qualität', section: 'Arbeitsweise', url: '/erfahrung', priority: 1.05,
    text: 'Die Arbeit beginnt mit Ziel, Nutzern, Scope, Constraints und Akzeptanzkriterien. Architektur, Datenfluss und Systemgrenzen werden vor der Implementierung geklärt. Kleine überprüfbare Schritte, Clean Code, Unit Tests, Fehlerfälle, responsive Design-QA, CI/CD und ein reproduzierbarer Docker-Build schließen die Umsetzung ab. AI beschleunigt die Arbeit, die fachliche Verantwortung bleibt bei Can.',
    keywords: ['Arbeitsweise', 'Clean Code', 'Unit Tests', 'Testing', 'CI/CD', 'Docker', 'Prompt Engineering', 'Qualität'],
  },
  {
    id: 'stack', title: 'Technologien', section: 'Profil', url: '/lebenslauf',
    text: 'Zum Technologieprofil gehören Next.js, React, TypeScript, JavaScript, SCSS, Python, FastAPI, Node.js, Express, Java, Spring Boot, PostgreSQL, MongoDB, Docker, CI/CD, GitHub, Azure DevOps, OpenCV, YOLO, ONNX Runtime, TensorRT, OpenVINO, Arduino, C++, C#, SystemVerilog, FPGA und Windows Internals.',
    keywords: ['Tech Stack', 'Technologien', 'Programmiersprachen', 'Frameworks', 'Backend', 'Frontend', 'Docker'],
  },
  {
    id: 'contact', title: 'Projektanfrage und Zusammenarbeit', section: 'Kontakt', url: '/kontakt', priority: 1.2,
    text: 'Für eine Projektanfrage reichen zunächst der heutige Ablauf, das gewünschte Ergebnis und vorhandene Systeme. Can antwortet direkt mit konkreten Rückfragen, ohne Vertriebsübergabe. Projekte sind im Raum Ludwigsburg und Stuttgart sowie remote in Deutschland möglich. Preise und Zeitpläne hängen vom konkreten Umfang ab und werden nicht pauschal versprochen.',
    keywords: ['Kontakt', 'Projekt', 'Projektanfrage', 'Zusammenarbeit', 'Kosten', 'Preis', 'Dauer', 'Angebot', 'Stuttgart', 'Ludwigsburg'],
  },
] as const;
