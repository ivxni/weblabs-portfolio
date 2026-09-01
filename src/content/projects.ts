/**
 * Projektdaten.
 *
 * Warum als typisierte Daten und nicht als JSX pro Seite: Jede Case-Study
 * braucht dieselben Bestandteile (Problem, Umsetzung, Entscheidungen, Grenze).
 * Als Daten lässt sich per Test prüfen, dass keines davon fehlt — als JSX
 * fällt eine vergessene Sektion erst beim Hinsehen auf, und meist nicht.
 *
 * Die Felder folgen dem Kontextdokument, insbesondere `limitation`: Zu jedem
 * Projekt gehört eine ehrliche Grenze. Das Feld ist deshalb Pflicht, nicht
 * optional — man kann es nicht vergessen, ohne dass TypeScript meckert.
 */

export type ProjectStatus =
  | 'live'          // öffentlich erreichbar
  | 'in-arbeit'     // wird gerade gebaut, noch nichts zu zeigen
  | 'lokal'         // lokal entwickelt und getestet, keine öffentliche Instanz
  | 'diese-seite';  // das Projekt, auf dem der Besucher gerade steht

export interface ProjectDecision {
  /** Die Entscheidung in einem Satz. */
  title: string;
  /** Warum so und nicht anders. Ohne das ist es kein Beleg, sondern eine Liste. */
  rationale: string;
}

export interface ProjectSection {
  heading: string;
  body: string;
}

export interface Project {
  slug: string;
  /** Kurzname für Navigation und Index. */
  name: string;
  /** Vollständiger Titel für die Case-Study-Überschrift. */
  title: string;
  /** Ein Satz Nutzen. Keine Marketingzeile — was das System tut. */
  summary: string;
  /** Längerer Kartentext für die Übersicht. */
  description: string;
  role: string;
  year: string;
  status: ProjectStatus;
  /** Fachliche Einordnung für die Projektübersicht. */
  discipline: 'ai-systems' | 'product-platforms' | 'privacy-engineering';
  /** Öffentlich erreichbare Instanz. Leer lassen, wenn es keine gibt. */
  liveUrl?: string;
  /** Optionales redaktionelles Titelbild für die technische Case-Study. */
  cover?: { src: string; alt: string; position?: string };
  stack: readonly string[];
  /** Die eine Entscheidung, die auf der Übersichtskarte steht. */
  headlineDecision: string;
  problem: string;
  approach: string;
  decisions: readonly ProjectDecision[];
  /** Pflichtfeld. Was das Projekt NICHT belegt. */
  limitation: string;
  /** Zusätzliche Abschnitte, projektspezifisch. */
  sections?: readonly ProjectSection[];
  /**
   * Bildbereiche. Erscheinen nur, wenn die Datei unter `/public` liegt —
   * `hasMedia` steuert das, damit kein leerer Rahmen stehen bleibt.
   */
  media?: readonly { src: string; alt: string; caption: string; width: number; height: number }[];
  /** Auf der Startseite zeigen. Genau drei. */
  featured: boolean;
}

export const projects: readonly Project[] = [
  {
    slug: 'ml-market-runtime',
    name: 'ML Market Runtime',
    title: 'ML Market Runtime — Zeitreihen, Modellvalidierung und kontrollierte Ausführung',
    summary:
      'Research-Plattform für acht Forex-Zeitreihen mit Mehrquellen-Features, instrumentenspezifischen XGBoost-Modellen, Walk-forward-Validierung und getrennter Risikoebene.',
    description:
      'Die technische Case-Study betrachtet historische Kurs-, Makro- und Nachrichtendaten, Merkmalsberechnung, Training, Backtesting, Modellbereitstellung und Monitoring als zusammenhängendes ML-System. Sie enthält keine Renditeversprechen und keine Handelsempfehlung.',
    role: 'ML-Pipeline, Backend, Desktop-Anwendung, Web-Dashboard, Risikologik und Systemintegration — eigenständig',
    year: '2024 – 2025',
    status: 'lokal',
    discipline: 'ai-systems',
    stack: [
      'Python', 'XGBoost', 'scikit-learn', 'pandas', 'NumPy',
      'FastAPI', 'Electron', 'React', 'MongoDB', 'MetaTrader 5',
      'yFinance', 'FRED API', 'News API',
    ],
    headlineDecision:
      'Modellprognose und Ausführung sind getrennt: Ein Signal muss zusätzlich deterministische Risiko- und Verlustgrenzen passieren.',
    problem:
      'Modelle auf Finanzzeitreihen überfitten leicht, wenn zukünftige Informationen unbemerkt ins Training gelangen oder eine zufällige Aufteilung zeitliche Abhängigkeiten ignoriert. Selbst ein brauchbares Modell darf außerdem niemals direkt und unbegrenzt Aktionen auslösen.',
    approach:
      'Eine Python-Pipeline verbindet historische OHLCV-Daten von acht Währungspaaren mit Makro- und Nachrichtenmerkmalen. Sie berechnet Momentum-, Trend-, Volatilitäts-, Korrelations-, Session- und retracementbasierte Features und trainiert getrennte XGBoost-Klassifikatoren. Rollierende Trainings- und Testfenster bilden die zeitliche Reihenfolge ab. FastAPI, Electron und React stellen Steuerung, Verlauf und Risikometriken bereit.',
    decisions: [
      {
        title: 'Walk-forward-Validierung statt zufälligem Train-Test-Split.',
        rationale:
          'Zeitreihen haben eine Richtung. Rollierende Fenster verhindern, dass zukünftige Marktphasen unbemerkt zum Training früherer Vorhersagen verwendet werden.',
      },
      {
        title: 'Instrumentenspezifische Modelle und versionierte Feature-Konfiguration.',
        rationale:
          'Die acht Währungspaare besitzen unterschiedliche Dynamiken. Modell, Feature-Reihenfolge, Datenquellen und Trainingsparameter werden deshalb gemeinsam versioniert und beim Laden geprüft.',
      },
      {
        title: 'Deterministische Risikoebene nach der Modellprognose.',
        rationale:
          'Confidence allein ist keine Risikosteuerung. Positionsgröße, Verlustgrenzen, Drawdown-Limit und zeitliche Regeln können ein Modellresultat jederzeit verwerfen.',
      },
      {
        title: 'Monitoring über Desktop-Client und Web-Dashboard.',
        rationale:
          'Modellzustand, offene Prozesse, Historie und Risikometriken müssen unabhängig von der Trainingsumgebung beobachtbar und nachvollziehbar sein.',
      },
    ],
    limitation:
      'Research- und Engineering-Projekt. Backtests belegen keine zukünftige Profitabilität; es werden weder Anlageberatung noch öffentliche Live-Performance oder reale Erträge behauptet.',
    sections: [
      {
        heading: 'Technischer Fokus',
        body:
          'Feature Engineering aus OHLCV-, Makro-, Nachrichten- und Cross-Pair-Daten, technische Indikatoren, retracementbasierte Merkmale, XGBoost, Walk-forward-Validierung, Backtesting ohne Look-ahead Bias, Modellversionierung und deterministische Risiko-Gates.',
      },
    ],
    featured: false,
  },
  {
    slug: 'realtime-vision-runtime',
    name: 'Realtime Vision Runtime',
    title: 'Realtime Vision Runtime — hardwarebeschleunigte Computer-Vision-Pipeline',
    summary:
      'Private Computer-Vision-Plattform für latenzarme Objekterkennung mit austauschbaren Inferenz-Runtimes und einer seriellen Mikrocontroller-Schnittstelle.',
    description:
      'Die Case-Study konzentriert sich ausschließlich auf die technische Umsetzung: Capture, Preprocessing, neuronale Inferenz, Postprocessing, Runtime-Auswahl und Hardware-Kommunikation. Produktname, Einsatzzweck, Modelle und betrieblicher Kontext bleiben bewusst privat.',
    role: 'Architektur, Computer Vision, Inferenz-Pipeline, Desktop-Client, Runtime-Abstraktion und Mikrocontroller-Integration — eigenständig',
    year: '2023 – 2026',
    status: 'lokal',
    discipline: 'ai-systems',
    stack: [
      'Python', 'C++', 'PyQt6', 'OpenCV', 'YOLO', 'ONNX Runtime',
      'TensorRT', 'OpenVINO', 'CUDA', 'Arduino',
    ],
    headlineDecision:
      'Die Inferenz ist von der Anwendung entkoppelt: TensorRT, ONNX Runtime und OpenVINO laufen hinter derselben Pipeline-Schnittstelle.',
    problem:
      'Eine Echtzeit-Vision-Pipeline muss auf sehr unterschiedlicher Hardware niedrige und stabile Latenzen liefern. Capture, Preprocessing, Inferenz und Postprocessing dürfen sich dabei nicht gegenseitig blockieren, und ein fehlendes GPU-Backend darf die Anwendung nicht unbrauchbar machen.',
    approach:
      'Ein standardisierter Frame-Flow verbindet Capture, normalisiertes Preprocessing, YOLO-Inferenz, Confidence-Filter und Non-Maximum Suppression. TensorRT, ONNX Runtime oder OpenVINO führen das Modell auf dem Hostsystem aus und werden passend zur vorhandenen Hardware gewählt. Erst die strukturierten Ergebnisse gehen über ein versioniertes serielles Protokoll an den Arduino-basierten Ausgabe-Layer.',
    decisions: [
      {
        title: 'Mehrere Inferenz-Runtimes hinter einem Adapter.',
        rationale:
          'TensorRT nutzt NVIDIA-Hardware maximal aus, ONNX Runtime deckt CUDA, DirectML und CPU ab, OpenVINO Intel-Systeme. Die fachliche Pipeline bleibt dabei unverändert und damit testbar.',
      },
      {
        title: 'Deterministischer Hardware-Fallback statt harter GPU-Abhängigkeit.',
        rationale:
          'Beim Start werden verfügbare Provider geprüft und nach Eignung gewählt. Fehlt der schnellste Pfad, läuft dieselbe Pipeline kontrolliert auf einem kompatiblen Backend weiter.',
      },
      {
        title: 'Pre- und Postprocessing als eigene Pipeline-Stufen.',
        rationale:
          'Resize, Normalisierung, Tensor-Layout, Confidence-Filter und NMS sind unabhängig vom Modellaufruf. Das erleichtert Profiling, Austausch und reproduzierbare Tests.',
      },
      {
        title: 'Inferenz und Hardware-Ausgabe bleiben getrennte Systeme.',
        rationale:
          'Die Modelle laufen im Host-Runtime-Layer, nicht auf dem Mikrocontroller. Die Desktop-Anwendung sendet nur strukturierte Ergebnisse; Firmware und Transport lassen sich dadurch unabhängig entwickeln und diagnostizieren.',
      },
    ],
    limitation:
      'Privates proprietäres Projekt. Produktname, konkreter Einsatzzweck, Datensätze, Modellgewichte, Konfigurationen und ausführbare Artefakte werden absichtlich nicht veröffentlicht.',
    sections: [
      {
        heading: 'Technischer Fokus',
        body:
          'Der belegbare Schwerpunkt liegt auf Echtzeit-Computer-Vision, YOLO-Inferenz, ONNX-Modellformaten, TensorRT-Optimierung, OpenVINO, OpenCV, Provider-Fallbacks, Desktop-UI sowie einer getrennten seriellen Hardware-Ausgabe. Produktfunktion und Zielkontext bleiben privat.',
      },
    ],
    featured: false,
  },
  {
    slug: 'unitfly',
    name: 'UnitFly',
    title: 'UnitFly — Commerce Operations mit kontrollierten AI-Agenten',
    summary:
      'Multi-Tenant-Plattform, die Produkt-, Preis-, Bestands- und Marketingabläufe analysiert und AI-gestützte Aktionen nachvollziehbar und begrenzbar macht.',
    description:
      'Sechs getrennte Agentendomänen bearbeiten Preis, Bestand, Content, Bilder, Marketing und Analyse. Deterministische Analyzer wählen die zulässigen Kandidaten aus; das Sprachmodell berät nur innerhalb hart begrenzter Werte.',
    role: 'Produktidee, Architektur, Frontend, Backend, Datenmodell, AI-Integration, Tests, Containerisierung — eigenständig',
    year: '2025 – 2026',
    status: 'live',
    discipline: 'product-platforms',
    liveUrl: 'https://unitfly.de',
    cover: {
      src: '/images/work/unitfly.jpg',
      alt: 'Produktoberfläche und Administrationsbereich der UnitFly-Plattform',
      position: 'top center',
    },
    stack: [
      'Next.js', 'React', 'TypeScript', 'Python', 'FastAPI',
      'SQLAlchemy', 'PostgreSQL', 'Docker', 'Claude', 'OpenAI Embeddings', 'Shopware',
    ],
    headlineDecision:
      'Schreibschutz ist standardmäßig aktiv. Jede schreibende Produktänderung läuft über einen einzigen Write-back-Pfad.',
    problem:
      'Commerce-Teams treffen täglich viele wiederkehrende Entscheidungen über Preise, Bestände, Inhalte, Bilder und Marketing. Ein Sprachmodell kann dabei helfen. Es darf aber nicht unkontrolliert Produktdaten verändern, und ein Ausfall des Modellanbieters darf das System nicht unbenutzbar machen.',
    approach:
      'UnitFly ist als Fullstack-Plattform mit Storefront, Admin-Cockpit, FastAPI-Backend, mandantenweisen Datenbanken und Shopware-Anbindung gebaut. Die sechs Agentendomänen sind bewusst getrennt: Ein Preisagent kennt keine Bildverarbeitung, ein Contentagent keine Bestandslogik. Jede Domäne hat ihre eigenen zulässigen Aktionen, und diese Liste ist Code, nicht Prompt.',
    decisions: [
      {
        title: 'Deterministische Analyzer wählen die Kandidaten, nicht das Modell.',
        rationale:
          'Welche Produkte überhaupt zur Diskussion stehen, entscheidet Code mit nachvollziehbaren Regeln. Das Modell sieht nur eine bereits gefilterte Menge. Damit ist die riskanteste Frage — „was fasst das System an?" — dem Modell entzogen.',
      },
      {
        title: 'Semantische Suche mit transparentem Keyword-Fallback.',
        rationale:
          'Embeddings brauchen einen externen Dienst. Fällt er aus, schaltet die Suche auf Stichwortsuche um und sagt das im Interface. Ein stiller Qualitätsabfall wäre schlimmer als ein sichtbarer.',
      },
      {
        title: 'Ein einziger Write-back-Pfad.',
        rationale:
          'Alle schreibenden Änderungen gehen durch dieselbe Funktion. Nur so lassen sich Schreibschutz, Rollenprüfung, Tenant-Kontext und Audit an genau einer Stelle erzwingen statt an sieben.',
      },
      {
        title: 'Rollen-, Tenant- und Rate-Limit-Prüfung gilt auch im Autopilot.',
        rationale:
          'Automatisierte Abläufe umgehen sonst gern die Prüfungen, die für Nutzeranfragen gelten. Hier laufen sie durch dieselben Wächter — ein Agent hat keine Sonderrechte.',
      },
      {
        title: 'Aktionen und feldbezogene Ergebnisse werden auditiert.',
        rationale:
          'Nachvollziehbarkeit ist bei AI-gestützten Änderungen keine Kür. Ohne Audit lässt sich nach einem Fehler nicht rekonstruieren, was das System warum getan hat.',
      },
    ],
    limitation:
      'Der belegte Stand ist ein eigenständig entwickeltes und getestetes Projekt. Ein produktiver Kundenbetrieb wird nicht behauptet.',
    sections: [
      {
        heading: 'Qualität',
        body:
          'Am 22. August 2026 liefen lokal 274 Backend- und 8 Frontend-Tests erfolgreich. Sie decken unter anderem Agentenläufe, Autopilot, Tenant-Kontext, Fallbacks, Schreibschutz, Audit und fehlgeschlagene Write-backs ab.',
      },
    ],
    featured: true,
  },

  {
    slug: 'void',
    name: 'VOiD',
    title: 'VOiD — Privacy-orientierte Mobile Camera App',
    summary:
      'React-Native-App mit FastAPI-Backend und Computer-Vision-Pipeline, die erkannte Gesichtsbereiche adversariell verändert und die Grenzen dieser Methode offen benennt.',
    description:
      'Kamera- und Galerieabläufe, Stärkeauswahl, Kontoverwaltung und Export im Client; authentifizierte API, Quoten, Rate Limits und die OpenCV-Pipeline serverseitig. Bilddaten werden verarbeitet, aber nicht dauerhaft gespeichert.',
    role: 'Mobile Client, API, Datenmodell, Subscription-Logik, Verarbeitungspipeline — eigenständig',
    year: '2026',
    status: 'in-arbeit',
    discipline: 'privacy-engineering',
    stack: ['Expo', 'React Native', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'OpenCV', 'SFace', 'Docker'],
    headlineDecision:
      'Bilddaten werden verarbeitet, aber nicht dauerhaft serverseitig gespeichert.',
    problem:
      'Biometrische Gesichtserkennung und automatisierte Profilbildung werden immer leichter zugänglich. VOiD untersucht, wie gezielte, visuell möglichst unauffällige Bildveränderungen die Wiedererkennung erschweren können — ohne Anonymität oder allgemeinen Schutz vor generativen Deepfakes zu versprechen.',
    approach:
      'Mobile Client, authentifizierte API, Daten- und Subscription-Logik sowie die OpenCV-basierte Verarbeitungspipeline sind als ein zusammenhängendes Produkt umgesetzt. Nach der Gesichtslokalisierung werden SPSA-basierte adversarielle Perturbationen gegen Referenz-Embeddings optimiert. Kamera- und Galerieabläufe, Stärkeauswahl, Export, Quoten, Rate Limits und Eingabevalidierung bilden den Produktpfad darum.',
    decisions: [
      {
        title: 'Keine dauerhafte serverseitige Bildspeicherung.',
        rationale:
          'Eine Privacy-App, die Gesichtsbilder aufbewahrt, widerlegt sich selbst. Die Verarbeitung läuft im Arbeitsspeicher, das Ergebnis geht zurück, danach bleibt nichts.',
      },
      {
        title: 'Quoten und Limits werden serverseitig erzwungen.',
        rationale:
          'Ein mobiler Client ist manipulierbar. Jede Prüfung, die nur dort stattfindet, ist keine Prüfung.',
      },
      {
        title: 'Die Wirksamkeit wird als Signal dargestellt, nicht als Garantie.',
        rationale:
          'Die Verfremdung wirkt gegen das getestete Erkennungsmodell. Ob sie gegen ein fremdes wirkt, weiß niemand. Das Interface sagt das, statt einen Haken anzuzeigen.',
      },
      {
        title: 'Mobile UI, API, ML-Pipeline und Datenbank sind klar getrennt.',
        rationale:
          'Die Pipeline ist der Teil, der sich am häufigsten ändert. Getrennt lässt sie sich austauschen, ohne den Client anzufassen.',
      },
    ],
    limitation:
      'VOiD ist ein technisches Privacy-Projekt und befindet sich noch in Arbeit. Die Methode garantiert weder Anonymität noch allgemeinen Deepfake-Schutz; ihre Wirksamkeit kann zwischen Erkennungs- und Generationsmodellen variieren.',
    featured: true,
  },

  {
    slug: 'weblabs',
    name: 'WebLabs',
    title: 'WebLabs — die Seite, auf der Sie gerade sind',
    summary:
      'Dieses Portfolio: Next.js App Router, Dark-only-Designsystem, technische Case-Studies, strukturierte SEO-Daten, validierter Kontaktweg und Coolify-Deployment.',
    description:
      'Kein Content-Management-System und keine Datenbank, weil beides für diesen Umfang nur Betriebsaufwand wäre. Typisierte Inhalte erzeugen Case-Studies, Leistungsseiten, Metadaten und Sitemap aus konsistenten Quellen; Tests prüfen Vollständigkeit, Kontraste und Links.',
    role: 'Konzept, Designsystem, Umsetzung, Tests, Deployment — eigenständig',
    year: '2026',
    status: 'diese-seite',
    discipline: 'product-platforms',
    stack: ['Next.js', 'React', 'TypeScript', 'SCSS Modules', 'Vitest', 'JSON-LD', 'Docker', 'Coolify'],
    headlineDecision:
      'Keine Datenbank. Inhalte sind typisierte Daten im Repository und damit testbar.',
    problem:
      'Ein Portfolio soll nicht nur Projekte auflisten. Es braucht schnelle, zugängliche Seiten, strukturierte Inhalte, einen verlässlichen Kontaktweg und eine Grundlage, die sich später erweitern lässt — ohne dass man dafür heute schon eine Datenbank betreiben muss.',
    approach:
      'Next.js App Router erzeugt Portfolio, Leistungsseiten und Case-Studies statisch. Farb-, Typografie-, Abstands- und Bewegungsebene werden zentral über CSS-Custom-Properties gesteuert. Das feste dunkle Farbsystem, die monochrome Bildsprache und bewusst reduzierte Radien bilden eine konsistente Oberfläche; Docker und Coolify liefern denselben Build reproduzierbar aus.',
    decisions: [
      {
        title: 'Kontraste werden gerechnet, nicht geschätzt.',
        rationale:
          'Ein Test liest die Token-Datei, konvertiert jede oklch-Farbe nach sRGB und prüft jedes Textpaar gegen 4.5:1 und jeden Bedienelementrand gegen 3:1. Ein zu blasser Grauton fällt damit im Testlauf auf, nicht beim Nutzer.',
      },
      {
        title: 'Ein festes Farbsystem statt paralleler Designvarianten.',
        rationale:
          'Die gesamte visuelle Sprache ist für einen kontrollierten dunklen Grund entworfen. Dadurch bleiben Liniengrafiken, Tiefenstaffelung und die warme monochrome Typografie konsistent, während das Markenorange nur die Identität kennzeichnet.',
      },
      {
        title: 'Das Kontaktformular behauptet keinen Erfolg.',
        rationale:
          'Ohne konfiguriertes SMTP meldet es einen Fehler und bietet den direkten Mailto-Weg an, statt eine grüne Bestätigung für eine Nachricht anzuzeigen, die nie versendet wurde.',
      },
      {
        title: 'Inhalte als typisierte Daten, nicht als JSX pro Seite.',
        rationale:
          'Damit ist eine fehlende Case-Study-Sektion ein Typfehler und ein toter Link ein fehlgeschlagener Test — statt etwas, das man beim Durchklicken hoffentlich bemerkt.',
      },
    ],
    limitation:
      'Diese Seite hat bewusst kein CMS und keine Datenbank. Serverseitig existieren nur Healthcheck und Kontaktversand; Buchungen, Zahlungen und ein Adminbereich sind nicht vorhanden.',
    featured: true,
  },

  {
    slug: 'pa-it-services',
    name: 'PA-IT-Services',
    title: 'PA-IT-Services — Website mit geschütztem Admin-Dashboard',
    summary:
      'Next.js-Plattform für Kontakt- und Terminabläufe mit PostgreSQL, Authentifizierung, E-Mail-Flows, Rate Limiting und automatisierten Tests.',
    description:
      'Formularvalidierung mit verständlichen Fehlermeldungen, geschützter Adminbereich, Benachrichtigungsabläufe und grundlegende Missbrauchsgrenzen. Containerisiert ausgeliefert.',
    role: 'Konzeption und Entwicklung',
    year: '2025',
    status: 'live',
    discipline: 'product-platforms',
    liveUrl: 'https://www.plp-itservice.de',
    cover: {
      src: '/images/work/plp-it-services.jpg',
      alt: 'Website und Serviceoberfläche von PA-IT-Services',
      position: 'top center',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Auth', 'SMTP', 'Vitest', 'Docker'],
    headlineDecision:
      'Rate Limiting und serverseitige Validierung vor jedem schreibenden Formularpfad.',
    problem:
      'Kontakt- und Terminanfragen sind für einen Dienstleister der wichtigste Eingang. Ein Formular, das Anfragen still verliert oder von Bots geflutet wird, kostet direkt Aufträge.',
    approach:
      'Öffentliche Website mit Kontakt- und Terminstrecke, dahinter ein geschützter Adminbereich für die Bearbeitung. Validierung findet serverseitig statt; die clientseitige Prüfung ist nur Komfort. Ein- und ausgehende E-Mails laufen über SMTP mit klaren Fehlerzuständen.',
    decisions: [
      {
        title: 'Serverseitige Validierung als einzige Wahrheit.',
        rationale:
          'Clientseitige Prüfung verbessert die Bedienung, schützt aber nichts. Beide Ebenen teilen sich hier dasselbe Schema, damit die Meldungen nicht auseinanderlaufen.',
      },
      {
        title: 'Rate Limiting statt CAPTCHA.',
        rationale:
          'Ein CAPTCHA belastet jeden echten Nutzer, um wenige Bots abzuhalten, und bringt ein Tracking-Problem mit. Eine Begrenzung pro IP und Zeitfenster reicht für diese Angriffsfläche.',
      },
      {
        title: 'Automatisierte UI- und Logiktests.',
        rationale:
          'Formularpfade sind der Teil, der bei jeder Änderung kaputtgeht und den niemand freiwillig manuell durchklickt.',
      },
    ],
    limitation:
      'Auftragsarbeit. Screenshots, Kundenname und Referenznennung stehen nur im Rahmen der erteilten Freigabe.',
    featured: false,
  },
  {
    slug: 'paydos-lounge',
    name: 'Paydos Lounge',
    title: 'Paydos Lounge — digitale Marken- und Standortpräsenz',
    summary:
      'Responsive Next.js-Website mit bildgeführtem Storytelling, digitaler Karte, Reservierungswegen, Standortinformationen und containerisiertem Deployment.',
    description:
      'Die Website übersetzt die dunkle, hochwertige Atmosphäre der Lounge in eine eigenständige digitale Präsenz. Inhalte, Bilder, Karte, Öffnungszeiten, Reservierung und Anfahrt bilden einen durchgängigen mobilen und desktopfähigen Informationsweg.',
    role: 'Konzeption, Art Direction, Designsystem, Frontend und Deployment — eigenständig',
    year: '2025',
    status: 'live',
    discipline: 'product-platforms',
    liveUrl: 'https://paydoslounge.de',
    cover: {
      src: '/images/work/paydos-lounge.jpg',
      alt: 'Dunkle, bildgeführte Website der Paydos Lounge',
      position: 'top center',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'SCSS Modules', 'Docker', 'Coolify'],
    headlineDecision:
      'Die Markenwirkung entsteht aus Typografie, Bildrhythmus und Raum — nicht aus dekorativen Interface-Komponenten.',
    problem:
      'Eine lokale Lounge muss Atmosphäre vermitteln und gleichzeitig praktische Fragen zu Karte, Öffnungszeiten, Reservierung und Anfahrt schnell beantworten. Zu viel Effekt würde die Bedienung schwächen; eine rein funktionale Seite würde den Charakter des Ortes verlieren.',
    approach:
      'Eine responsive Next.js-Anwendung verbindet große redaktionelle Bildflächen mit kurzen, klar gegliederten Inhaltsblöcken. Karte, Galerie, Bewertungen, direkte Reservierungskanäle und Standortinformationen bleiben über die gesamte Seite leicht erreichbar. Docker und Coolify bilden den reproduzierbaren Auslieferungsweg.',
    decisions: [
      {
        title: 'Redaktioneller Bildrhythmus statt klassischem Kartenraster.',
        rationale:
          'Die Räume und Lichtstimmungen sind der stärkste Beleg für die Marke. Wechselnde Bild-Text-Kompositionen führen durch den Ort, ohne die Seite in gleichförmige UI-Boxen zu zerlegen.',
      },
      {
        title: 'Direkte Reservierungswege statt eines künstlichen Buchungssystems.',
        rationale:
          'Reservierungen werden telefonisch oder über Instagram entgegengenommen. Die Website bildet diesen realen Ablauf ehrlich ab, statt ein Formular ohne angebundenen Betriebsprozess vorzutäuschen.',
      },
      {
        title: 'Responsive Bildflächen mit stabilen Seitenverhältnissen.',
        rationale:
          'Große Fotos dürfen beim Laden weder den Inhalt verschieben noch auf kleinen Geräten ihren Fokus verlieren. Definierte Bildrahmen und gerätespezifische Größen halten den visuellen Rhythmus stabil.',
      },
      {
        title: 'Containerisierte Auslieferung über einen kontrollierten Deployment-Pfad.',
        rationale:
          'Docker vereinheitlicht Laufzeit und Build; Coolify übernimmt den reproduzierbaren Rollout, ohne die Anwendung an einen proprietären Frontend-Host zu koppeln.',
      },
    ],
    limitation:
      'Die Case-Study belegt Konzeption, Umsetzung und öffentliche Auslieferung der Website. Sie enthält keine Aussagen über Besucherzahlen, Reservierungsquote oder geschäftliche Ergebnisse.',
    featured: false,
  },
  {
    slug: 'ipekten-dienstleistung',
    name: 'Ipekten Dienstleistung',
    title: 'Ipekten Dienstleistung — serviceorientierte Unternehmenswebsite',
    summary:
      'Responsive Next.js-Website für einen regionalen Dienstleister mit klarer Leistungsarchitektur, Notdienst-Pfad, Kontaktstrecke, lokaler SEO-Basis und Docker-Deployment.',
    description:
      'Die Website bündelt Rohrreinigung, Gebäudereinigung und weitere Gebäudedienstleistungen in einer schnell erfassbaren Seitenstruktur. Region, Erreichbarkeit, Leistungsumfang und Kontaktmöglichkeiten werden ohne Umwege sichtbar gemacht.',
    role: 'Konzeption, Informationsarchitektur, Frontend, Kontaktstrecke und Deployment — eigenständig',
    year: '2025',
    status: 'live',
    discipline: 'product-platforms',
    liveUrl: 'https://ipekten.de',
    cover: {
      src: '/images/work/ipekten-dienstleistung.jpg',
      alt: 'Helle Unternehmenswebsite von Ipekten Dienstleistung mit Leistungsübersicht und Kontaktstrecke',
      position: 'top center',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'SCSS Modules', 'SMTP', 'Docker'],
    headlineDecision:
      'Notdienst, Kernleistung und Kontakt bleiben als durchgängiger Handlungspfad auf jeder Bildschirmgröße sichtbar.',
    problem:
      'Bei regionalen Dienstleistungen kommen Besucher häufig mit einem konkreten und teilweise dringenden Anliegen. Eine unklare Navigation, versteckte Telefonnummern oder eine ungegliederte Leistungsmenge verlängern den Weg zur Anfrage und schwächen das Vertrauen.',
    approach:
      'Die Next.js-Website ordnet Inhalte nach Nutzerintention: akute Rohrreinigung zuerst, ergänzende Leistungen danach, Vertrauen und Ablauf als Begründung und eine klare Kontaktstrecke als Abschluss. Semantische Inhalte schaffen die Grundlage für lokale Auffindbarkeit; das Formular übergibt Anfragen per SMTP.',
    decisions: [
      {
        title: 'Dringender Kontaktweg und Hauptleistung stehen vor der Unternehmensgeschichte.',
        rationale:
          'Wer wegen eines akuten Problems kommt, braucht Telefonnummer, Region und Leistung sofort. Unternehmensdetails bleiben wichtig, dürfen diesen primären Weg aber nicht blockieren.',
      },
      {
        title: 'Leistungen werden nach Aufgaben gegliedert statt in einer langen Textseite versteckt.',
        rationale:
          'Klare Abschnittsüberschriften und eigenständige Leistungsblöcke verbessern Scanbarkeit, interne Verlinkung und die semantische Grundlage für regionale Suchanfragen.',
      },
      {
        title: 'Die Kontaktstrecke verbindet direkte Kanäle mit einem strukturierten Formular.',
        rationale:
          'Telefon eignet sich für dringende Fälle, ein Formular für planbare Anfragen. Beide Wege bleiben sichtbar und führen zu einem tatsächlichen Kommunikationskanal statt zu einer rein dekorativen CTA.',
      },
      {
        title: 'Containerisiertes Deployment statt manueller Serverzustände.',
        rationale:
          'Docker hält Anwendung und Laufzeit reproduzierbar. Änderungen lassen sich damit als definierter Build ausliefern, ohne vom zufälligen Zustand des Servers abhängig zu sein.',
      },
    ],
    limitation:
      'Die Case-Study dokumentiert die technische Website-Umsetzung und öffentliche Erreichbarkeit. Rankings, Anfragevolumen und geschäftliche Wirkung werden nicht als Ergebnis behauptet.',
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const statusLabel: Record<ProjectStatus, string> = {
  live: 'Öffentlich erreichbar',
  'in-arbeit': 'In Arbeit',
  lokal: 'Lokal entwickelt',
  'diese-seite': 'Diese Seite',
};
