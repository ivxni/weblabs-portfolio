# SEO-Strategie für web-labs.io

Stand: 30. August 2026

## Ziel

Die Website soll qualifizierte Projektanfragen für individuelle Software,
Webentwicklung und AI-Integration erzeugen. Rankings sind kein Selbstzweck.
Gemessen wird, ob nicht-markenbezogene Suchanfragen zu passenden
Leistungsseiten und anschließend zu echten Kontaktaufnahmen führen.

Eine Spitzenposition lässt sich nicht technisch garantieren. Die Strategie
setzt deshalb auf die vier Signale, die dauerhaft beeinflussbar sind:

1. klare Übereinstimmung mit einer konkreten Suchintention,
2. nachweisbare eigene Erfahrung statt zusammengefasster Standardtexte,
3. technisch eindeutige, schnelle und crawlbare Seiten,
4. echte externe Empfehlungen und Erwähnungen.

## Positionierung

Regionale Wettbewerber sind überwiegend Agenturen. Sie besitzen mehr
Unternehmenshistorie, Referenzen und Backlinks. WebLabs kann nicht glaubwürdig
mit erfundenen Größenangaben dagegenhalten. Der bessere Winkel ist:

- direkter Kontakt zum Entwickler statt Übergabe zwischen Vertrieb und Technik,
- sichtbare Tiefe von Frontend über API und Daten bis Tests und Deployment,
- AI-Agenten und Computer Vision mit Guardrails, Fallbacks und Audit,
- ehrliche Grenzen in jeder Case Study,
- lokale Nähe zu Ludwigsburg und Stuttgart, deutschlandweit remote.

## Keyword- und Seitenarchitektur

Jede URL besitzt genau eine primäre Absicht. Es werden keine nahezu gleichen
Ortsseiten für jede Nachbarstadt erzeugt.

- `/` — Marke, Person und Gesamtangebot
- `/leistungen` — Orientierung zwischen den drei Leistungsfeldern
- `/leistungen/individuelle-softwareentwicklung`
  - primär: individuelle Softwareentwicklung Stuttgart
  - sekundär: Webanwendung entwickeln lassen, Softwareentwickler Ludwigsburg,
    Prozessautomatisierung, Portalentwicklung
- `/leistungen/webentwicklung`
  - primär: Webentwicklung Ludwigsburg
  - sekundär: Webentwickler Stuttgart, Next.js Website, professionelle
    Unternehmenswebsite, Web-App Entwicklung
- `/leistungen/ki-entwicklung`
  - primär: KI-Entwicklung Stuttgart
  - sekundär: AI-Agenten entwickeln, RAG-Entwicklung, Computer Vision,
    KI-Automatisierung
- `/projekte` und `/projekte/[slug]` — Erfahrung belegen und kommerzielle
  Leistungsseiten intern stützen
- `/ueber-mich`, `/erfahrung`, `/lebenslauf` — Person, Qualifikation und
  Vertrauenssignale

## Bereits technisch umgesetzt

- statisch gerenderte, crawlbare HTML-Seiten
- eindeutige Titles, Descriptions, Canonicals und `og:url` pro URL
- Open-Graph- und Twitter-Vorschauen
- `Person`, `WebSite`, `WebPage`, `ProfilePage`, `Service`, `ItemList`,
  `CreativeWork` und `BreadcrumbList` als ehrliches JSON-LD
- XML-Sitemap mit Leistungs-, Projekt- und Bild-URLs
- `robots.txt` und Manifest
- deutsche Sprache und lokale Gebietssignale ohne erfundene Geschäftsadresse
- semantische Überschriften und normale crawlbare Links
- Next.js Image Optimization, lokale Schriftarten und statischer Build
- responsive Prüfung ohne horizontalen Überlauf bei 390 und 1440 Pixeln
- Google-Verifizierung als optionaler Coolify-Buildparameter

## Unmittelbar nach dem Launch

1. Google Search Console als Domain- oder URL-Prefix-Property verifizieren.
2. `/sitemap.xml` einreichen.
3. `/`, alle drei Leistungsseiten und zwei stärkste Case Studies mit der
   URL-Prüfung kontrollieren und Indexierung anstoßen.
4. Bing Webmaster Tools verbinden und Sitemap einreichen.
5. HTTPS-, `www`- und HTTP-Varianten dauerhaft auf genau
   `https://web-labs.io` umleiten.
6. Rich Results Test für Breadcrumb und ProfilePage durchführen; allgemeines
   Schema zusätzlich im Schema.org Validator prüfen.
7. Core Web Vitals nach realen Felddaten überwachen: LCP, INP und CLS.

## Größter Hebel: externe Autorität

Technisches Onpage-SEO allein überholt keine etablierten Agenturen. Der nächste
Hebel sind echte, thematisch passende Erwähnungen:

- Auf UnitFly und auf freigegebenen Kundenprojekten einen dezenten,
  redaktionell passenden Entwicklernachweis zu WebLabs verlinken. Nur mit
  Zustimmung des jeweiligen Betreibers.
- LinkedIn-Profil auf `Can Cadirci` und `web-labs.io` konsistent ausrichten;
  neue Case Studies als fachliche Beiträge erklären statt nur den Link zu posten.
- Kunden um eine konkrete, überprüfbare Aussage zur Zusammenarbeit bitten.
  Keine selbst formulierten oder anonym erfundenen Testimonials.
- Google-Unternehmensprofil nur anlegen, wenn die tatsächlichen
  Teilnahmebedingungen für ein lokales beziehungsweise Service-Area-Business
  erfüllt sind. Name, Telefon und Anschrift müssen überall identisch sein.
- Relevante IHK-, regionale Unternehmer- oder Technologieprofile nutzen, wenn
  dort ein echtes Mitglieds- oder Personenprofil besteht.

## Content mit eigener Erfahrung statt SEO-Massenware

Maximal ein substanzieller Beitrag pro Monat ist wertvoller als wöchentliche
generische AI-Texte. Gute erste Themen:

1. „Wann lohnt sich Individualsoftware statt eines weiteren SaaS-Tools?“ —
   mit Entscheidungsbaum aus echten Architekturfragen.
2. „AI-Agenten sicher in Produktdaten integrieren“ — Candidate Selection,
   Write-back-Pfad, Rollen, Audit und Fallback anhand UnitFly.
3. „TensorRT, ONNX Runtime oder OpenVINO?“ — messbarer Runtime-Vergleich aus
   der eigenen Computer-Vision-Pipeline.
4. „Technisches SEO in Next.js ohne Plugin-Stack“ — die konkrete Architektur
   dieser Website mit Vorher-Nachher-Signalen aus Search Console.

Jeder Beitrag braucht eigene Screenshots, Codeentscheidungen, Messwerte oder
Fehlerbilder. Wenn diese fehlen, wird der Beitrag nicht veröffentlicht.

## Messplan

Wöchentlich in Search Console:

- indexierte Seiten und technische Fehler,
- Impressionen und Klicks ohne Markensuchen wie „Can Cadirci“ oder „WebLabs“,
- Suchanfragen und Position je Leistungsseite,
- CTR bei Impressionen auf Position 3–15,
- Geräteverteilung und Core Web Vitals.
- Sichtbarkeit im Generative-AI-Bericht der Search Console, sobald Daten vorliegen.

Monatlich intern:

- Anzahl qualifizierter Kontaktanfragen,
- Einstiegsseite jeder Anfrage, soweit der Interessent sie freiwillig nennt,
- Verhältnis aus Anfrage, Erstgespräch und passendem Projekt,
- Inhalte oder Suchanfragen, die zwar Traffic, aber keine passenden Anfragen
  bringen.

Ohne Analytics kann das Kontaktformular optional ein freiwilliges Feld „Wie
sind Sie auf mich aufmerksam geworden?“ erhalten. Tracking wird erst ergänzt,
wenn Zweck, Rechtsgrundlage und Datenschutzerklärung geklärt sind.

## Quellen für die technische Leitlinie

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: strukturierte Daten](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google: Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google: Optimierung für generative AI-Suche](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
