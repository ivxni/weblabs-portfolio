export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceProof {
  slug: string;
  label: string;
  note: string;
}

export interface Service {
  slug: string;
  index: string;
  shortName: string;
  title: string;
  metaTitle: string;
  description: string;
  lead: string;
  searchIntent: string;
  fitHeading: string;
  fit: readonly string[];
  deliverables: readonly { title: string; body: string }[];
  process: readonly { title: string; body: string }[];
  proofs: readonly ServiceProof[];
  faq: readonly ServiceFaq[];
  keywords: readonly string[];
}

export const services: readonly Service[] = [
  {
    slug: 'individuelle-softwareentwicklung',
    index: '01',
    shortName: 'Softwareentwicklung',
    title: 'Individuelle Softwareentwicklung für Unternehmen in Stuttgart.',
    metaTitle: 'Individuelle Softwareentwicklung Stuttgart',
    description:
      'Individuelle Softwareentwicklung in Stuttgart und Ludwigsburg: Webanwendungen, APIs, Datenbanken, Automatisierung, Tests und Docker aus einer Hand.',
    lead:
      'Ich entwickle Webanwendungen, interne Plattformen und digitale Prozesse, wenn Standardsoftware nicht sauber zu Ihrem Ablauf passt. Direkt mit dem Entwickler — von Architektur und Oberfläche bis API, Datenmodell, Tests und Deployment.',
    searchIntent: 'Für Unternehmen, die eine belastbare Webanwendung statt eines weiteren isolierten Tools brauchen.',
    fitHeading: 'Wann Individualsoftware sinnvoll ist',
    fit: [
      'Excel, E-Mail und mehrere Einzellösungen bilden denselben Prozess ab.',
      'Eine Standardsoftware verlangt mehr Umwege als sie Arbeit abnimmt.',
      'Kunden, Mitarbeitende oder Partner brauchen ein eigenes Portal.',
      'Bestehende Systeme müssen über APIs und klare Datenflüsse verbunden werden.',
    ],
    deliverables: [
      {
        title: 'Webanwendungen und Portale',
        body: 'Responsive Produktoberflächen mit Next.js und React, klaren Rollen, Zuständen und barrierearmen Bedienwegen.',
      },
      {
        title: 'Backends und Schnittstellen',
        body: 'Typisierte APIs mit Python/FastAPI, Node.js oder Java/Spring Boot sowie Integrationen in vorhandene Systeme.',
      },
      {
        title: 'Daten und Berechtigungen',
        body: 'PostgreSQL-Datenmodelle, Migrationen, Authentifizierung, Rollen- und Mandantenkontext statt ungeprüfter Einzelabfragen.',
      },
      {
        title: 'Qualität und Betrieb',
        body: 'Automatisierte Tests, Fehlerpfade, Docker, CI/CD und ein Deployment, das nachvollziehbar aktualisiert werden kann.',
      },
    ],
    process: [
      { title: 'Verstehen', body: 'Ziel, Nutzer, bestehende Abläufe und die teuersten Reibungspunkte werden konkret abgegrenzt.' },
      { title: 'Schneiden', body: 'Ich entwerfe Datenmodell, Systemgrenzen und einen ersten nutzbaren Umfang ohne unnötige Plattformteile.' },
      { title: 'Bauen', body: 'Frontend, Backend und Integrationen entstehen in überprüfbaren Schritten mit sichtbaren Zwischenständen.' },
      { title: 'Absichern', body: 'Kritische Abläufe, Fehlerfälle und Berechtigungen werden getestet, dokumentiert und containerisiert ausgeliefert.' },
    ],
    proofs: [
      { slug: 'unitfly', label: 'UnitFly', note: 'Multi-Tenant-Plattform, FastAPI, PostgreSQL, Agenten und kontrollierte Write-backs.' },
      { slug: 'pa-it-services', label: 'PA-IT-Services', note: 'Next.js-Plattform mit Terminabläufen, Authentifizierung und Admin-Dashboard.' },
      { slug: 'weblabs', label: 'WebLabs', note: 'Statisch erzeugtes Next.js-System mit Tests, Kontaktweg und Docker-Deployment.' },
    ],
    faq: [
      {
        question: 'Welche Art von Software entwickeln Sie?',
        answer: 'Der Schwerpunkt liegt auf individuellen Webanwendungen, Portalen, internen Tools, APIs und Prozessautomatisierung. Desktop-, Mobile- oder AI-Komponenten können Teil desselben Systems sein, wenn sie fachlich notwendig sind.',
      },
      {
        question: 'Übernehmen Sie auch bestehende Anwendungen?',
        answer: 'Ja, sofern Quellcode, Zugänge und ein prüfbarer technischer Stand vorhanden sind. Vor einer Zusage analysiere ich Architektur, Risiken und offenen Wartungsaufwand, statt eine pauschale Übernahme zu versprechen.',
      },
      {
        question: 'Was kostet individuelle Softwareentwicklung?',
        answer: 'Das hängt vor allem von Rollen, Datenmodell, Integrationen und Betriebsanforderungen ab. Nach einem ersten Gespräch grenze ich einen sinnvollen Startumfang ab und benenne transparent, welche Punkte die Schätzung noch verändern können.',
      },
    ],
    keywords: ['Individuelle Softwareentwicklung', 'Softwareentwicklung Stuttgart', 'Webanwendung', 'FastAPI', 'Next.js', 'PostgreSQL'],
  },
  {
    slug: 'webentwicklung',
    index: '02',
    shortName: 'Webentwicklung',
    title: 'Webentwicklung für Ludwigsburg und Stuttgart — schnell, klar, wartbar.',
    metaTitle: 'Webentwicklung Ludwigsburg & Stuttgart',
    description:
      'Professionelle Webentwicklung in Ludwigsburg und Stuttgart: schnelle Unternehmenswebsites und Web-Apps mit Next.js, SEO, sauberem Code und persönlichem Kontakt.',
    lead:
      'Ich entwickle individuelle Unternehmenswebsites und Web-Apps, die nicht nur hochwertig aussehen, sondern schnell laden, bei Google verständlich sind und sich technisch weiterentwickeln lassen.',
    searchIntent: 'Für Unternehmen, deren Website Vertrauen schaffen, Anfragen gewinnen oder einen echten digitalen Ablauf abbilden soll.',
    fitHeading: 'Mehr als eine schöne Oberfläche',
    fit: [
      'Der aktuelle Webauftritt ist langsam, unübersichtlich oder auf Mobilgeräten schwach.',
      'Leistungen und regionale Relevanz werden von Kunden und Suchmaschinen nicht klar verstanden.',
      'Formulare, Termine, geschützte Bereiche oder eigene Daten machen einen Baukasten unpraktisch.',
      'Design, Entwicklung, technisches SEO und Deployment sollen zusammen gedacht werden.',
    ],
    deliverables: [
      {
        title: 'Unternehmenswebsites',
        body: 'Eigenständiges Design, klare Informationsarchitektur und überzeugende Leistungsseiten statt austauschbarer Template-Sektionen.',
      },
      {
        title: 'Web-Apps und Funktionen',
        body: 'Kontakt- und Terminabläufe, Dashboards, Authentifizierung, APIs und Datenbanken, wenn die Seite mehr als Inhalte ausliefert.',
      },
      {
        title: 'Technisches SEO',
        body: 'Crawlbare Inhalte, eindeutige Metadaten, Canonicals, Sitemap, strukturierte Daten und eine saubere interne Verlinkung.',
      },
      {
        title: 'Performance und Pflege',
        body: 'Optimierte Bilder, stabile Layouts, minimale Client-Last, Docker-Deployment und eine Struktur, die spätere Änderungen nicht blockiert.',
      },
    ],
    process: [
      { title: 'Positionierung', body: 'Zielgruppe, Leistungen, Suchintention und der wichtigste nächste Schritt werden vor dem Layout festgelegt.' },
      { title: 'System und Design', body: 'Inhalte, Seitenhierarchie und visuelle Regeln entstehen als zusammenhängendes System.' },
      { title: 'Umsetzung', body: 'Die Seite wird responsive, semantisch und performant mit Next.js und TypeScript umgesetzt.' },
      { title: 'Launch', body: 'Domain, HTTPS, Sitemap, Formulare und technische Prüfungen werden bis zum produktiven Betrieb begleitet.' },
    ],
    proofs: [
      { slug: 'paydos-lounge', label: 'Paydos Lounge', note: 'Editoriale Gastronomie-Website mit Reservierungswegen und lokaler Positionierung.' },
      { slug: 'ipekten-dienstleistung', label: 'Ipekten Dienstleistung', note: 'Lokale Leistungswebsite für Reinigung und Notdienst mit klarer Anfrageführung.' },
      { slug: 'pa-it-services', label: 'PA-IT-Services', note: 'IT-Service-Website mit Terminablauf und geschütztem Administrationsbereich.' },
    ],
    faq: [
      {
        question: 'Entwickeln Sie nur Websites oder auch Webanwendungen?',
        answer: 'Beides. Eine Unternehmenswebsite kann bewusst schlank bleiben. Wenn Login, Rollen, Termine, Daten oder interne Abläufe dazukommen, entwickle ich daraus eine vollständige Webanwendung mit Backend und Datenbank.',
      },
      {
        question: 'Ist SEO bei der Entwicklung enthalten?',
        answer: 'Die technische SEO-Grundlage gehört zur Entwicklung: semantisches HTML, crawlbare Seiten, individuelle Metadaten, Sitemap, strukturierte Daten, Bildoptimierung und Performance. Sichtbare Rankings benötigen danach zusätzlich echte Inhalte, Autorität und fortlaufende Messung.',
      },
      {
        question: 'Arbeiten Sie nur in Ludwigsburg und Stuttgart?',
        answer: 'Persönliche Termine sind im Raum Ludwigsburg und Stuttgart möglich. Projekte können ebenso vollständig remote in Deutschland umgesetzt werden.',
      },
    ],
    keywords: ['Webentwicklung Ludwigsburg', 'Webentwickler Stuttgart', 'Next.js Website', 'Web-App Entwicklung', 'technisches SEO'],
  },
  {
    slug: 'ki-entwicklung',
    index: '03',
    shortName: 'KI-Entwicklung',
    title: 'KI-Entwicklung in Stuttgart — integriert statt nur demonstriert.',
    metaTitle: 'KI-Entwicklung Stuttgart & AI-Automatisierung',
    description:
      'Individuelle KI-Entwicklung in Stuttgart: AI-Agenten, Computer Vision, RAG, Inferenz-Pipelines, Guardrails und Integration in produktive Software.',
    lead:
      'Ich entwickle AI-Funktionen als kontrollierte Teile eines Softwaresystems: mit klaren Datenflüssen, messbaren Fallbacks, Berechtigungen und nachvollziehbaren Aktionen — nicht als isolierten Chatbot ohne Betriebsmodell.',
    searchIntent: 'Für Unternehmen, die einen konkreten Prozess mit AI unterstützen wollen und dabei Kontrolle über Daten, Kosten und Aktionen brauchen.',
    fitHeading: 'Wo AI einen belastbaren Hebel hat',
    fit: [
      'Wissen aus Dokumenten oder Systemen soll kontextbezogen auffindbar werden.',
      'Wiederkehrende Entscheidungen lassen sich vorbereiten, aber nicht blind automatisieren.',
      'Bilder oder Videoströme müssen mit Computer Vision analysiert werden.',
      'Ein bestehendes Produkt braucht AI-Funktionen mit Rollen, Audit und Fallbacks.',
    ],
    deliverables: [
      {
        title: 'AI-Agenten und Workflows',
        body: 'Begrenzte Werkzeuge, Freigabeschritte, Rollenprüfung und Audit statt unkontrollierter autonomer Aktionen.',
      },
      {
        title: 'RAG und semantische Suche',
        body: 'Aufbereitung, Embeddings, Retrieval, Quellenbezug und deterministische Fallbacks für internes Wissen und Produktdaten.',
      },
      {
        title: 'Computer Vision',
        body: 'OpenCV, YOLO, ONNX Runtime, TensorRT und OpenVINO für Bildanalyse und latenzarme Inferenz-Pipelines.',
      },
      {
        title: 'Produktintegration',
        body: 'FastAPI-Backends, Datenmodelle, Monitoring, Rate Limits und Kostenkontrolle rund um das eigentliche Modell.',
      },
    ],
    process: [
      { title: 'Use Case prüfen', body: 'Ziel, Datenqualität und ein messbarer Vergleich ohne AI werden zuerst geklärt.' },
      { title: 'Grenzen definieren', body: 'Erlaubte Daten, Aktionen, Fallbacks und menschliche Freigaben werden vor dem Modell festgelegt.' },
      { title: 'Prototyp messen', body: 'Ein schmaler technischer Pfad prüft Qualität, Latenz, Kosten und Fehlermuster mit echten Beispielen.' },
      { title: 'Integrieren', body: 'Erst danach entstehen Produktoberfläche, API, Berechtigungen, Audit, Tests und Betrieb.' },
    ],
    proofs: [
      { slug: 'unitfly', label: 'UnitFly', note: 'Sechs Agentendomänen mit deterministischen Kandidaten, Schreibschutz und Audit.' },
      { slug: 'realtime-vision-runtime', label: 'Realtime Vision Runtime', note: 'Hardwarebeschleunigte Inferenz mit TensorRT-, ONNX- und OpenVINO-Fallbacks.' },
      { slug: 'ml-market-runtime', label: 'ML Market Runtime', note: 'Zeitreihenmodelle, Walk-forward-Validierung und getrennte Risikoebene.' },
    ],
    faq: [
      {
        question: 'Entwickeln Sie eigene KI-Modelle oder integrieren Sie APIs?',
        answer: 'Beides ist möglich. Je nach Aufgabe nutze ich Modell-APIs, Open-Source-Modelle, klassische Machine-Learning-Verfahren oder Computer-Vision-Modelle. Entscheidend sind Datenlage, Qualitätsziel, Latenz, Kosten und Betriebsanforderungen.',
      },
      {
        question: 'Wie verhindern Sie unkontrollierte AI-Aktionen?',
        answer: 'Werkzeuge und Wertebereiche werden in Code begrenzt. Rollen, Mandantenkontext, Rate Limits, Freigaben und Audit gelten auch für automatisierte Abläufe. Ein Modell erhält keine Sonderrechte gegenüber einem normalen Nutzer.',
      },
      {
        question: 'Kann eine KI-Lösung vollständig lokal betrieben werden?',
        answer: 'Je nach Modellgröße und Hardware ja. Ob On-Premise, europäisches Hosting oder eine externe API sinnvoller ist, wird anhand von Datenschutz, Qualität, Latenz, Wartung und Gesamtkosten entschieden — nicht anhand eines pauschalen Versprechens.',
      },
    ],
    keywords: ['KI-Entwicklung Stuttgart', 'AI-Agenten', 'Computer Vision', 'RAG Entwicklung', 'ONNX Runtime', 'TensorRT'],
  },
] as const;

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
