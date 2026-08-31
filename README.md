# web-labs.io — Portfolio Can Cadirci

Portfolio und Leistungswebsite für individuelle Softwareentwicklung,
Webentwicklung und KI-Entwicklung. Next.js (App Router), TypeScript, SCSS
Modules und Font Awesome. Kein CMS und keine Datenbank.

---

## Schnellstart

```bash
npm install
npm run dev
```

| Befehl | Wirkung |
|---|---|
| `npm run dev` | Entwicklungsserver auf Port 3000 |
| `npm run build` | Produktionsbuild (`output: 'standalone'`) |
| `npm start` | Produktionsserver |
| `npm test` | Vitest, einmalig |
| `npm run test:watch` | Vitest im Beobachtungsmodus |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | Typen **und** Tests — vor jedem Commit |

---

## Warum kein CMS und keine Datenbank

Die Inhalte dieser Seite ändern sich nicht zur Laufzeit. Sie liegen als
typisierte Daten unter `src/content/` im Repository. Das ist keine Sparlösung,
sondern hat einen konkreten Vorteil: Weil die Inhalte Typen haben, prüft
`src/content/content.test.ts` bei jedem Testlauf, dass jede Case-Study
vollständig ist, jede Entscheidung eine Begründung hat, kein Navigationspunkt
ins Leere zeigt und keine der im Kontextdokument untersagten Formulierungen
zurückgekehrt ist.

Ein CMS mit Datenbank würde dafür Migrationen, Backups und einen zweiten
laufenden Dienst kosten — und diese Prüfungen unmöglich machen.

Die einzigen serverseitigen Routen sind der Healthcheck und das Kontaktformular.
Sie speichern keine Inhalte in einer Datenbank.

---

## Aufbau

```
src/
├─ app/                     Routen (App Router)
│  ├─ api/health/           Healthcheck für Docker und Coolify
│  ├─ api/kontakt/          Kontaktformular: Validierung, Rate Limit, SMTP
│  ├─ leistungen/[slug]/    SEO-Landingpages, zur Bauzeit erzeugt
│  ├─ projekte/[slug]/      Case-Studies, zur Bauzeit erzeugt
│  ├─ manifest.ts           Web-App- und Markenmetadaten
│  ├─ opengraph-image.tsx   Vorschaubild, aus Code gerendert
│  ├─ sitemap.ts robots.ts  aus denselben Daten wie die Navigation
│  └─ globals.scss          einzige globale Stylesheet-Datei
├─ components/
│  ├─ ui/                   Container, Section, Button, Reveal, PageHeader
│  ├─ layout/               Header, Footer, Logo, ThemeToggle
│  └─ home/                 Sektionen der Startseite
├─ content/                 ALLE Inhalte, typisiert
├─ lib/                     color, theme, rate-limit, contact-schema
└─ styles/                  Token, Reset, Basis, Mixins, Breakpoints
```

**Regel für Styling:** CSS-Custom-Properties für alles, was zur Laufzeit
umschaltbar sein muss (Farben, Abstände, Dauern) — SCSS nur für Nesting,
Mixins und Breakpoints. Kein Bauteil enthält einen rohen Wert.
`src/styles/_abstracts.scss` wird über `sassOptions.additionalData` in jedes
Modul injiziert; sie darf deshalb niemals CSS ausgeben.

---

## Vor dem Livegang

Diese Punkte sind in `src/content/site.ts` an genau einer Stelle gebündelt.
Geschäftsanschrift, USt-IdNr. und die finalen WebLabs-Logos sind bereits
hinterlegt. Noch offene Anbieterfelder bleiben bewusst leer: Ein übernommener
Platzhalter in einer Datenschutzerklärung wäre ein rechtliches Risiko.

### Muss

- [ ] `legal.hostingProvider` — Name und Sitz des Hosters (für die Datenschutzerklärung)
- [ ] `legal.mailProvider` — Betreiber des Postfachs, an das Anfragen gehen
- [ ] Impressum und Datenschutz gegen den tatsächlichen Betrieb prüfen lassen

### Optional, aber empfohlen

- [ ] `contact.github` — URL eintragen.
      **Hinweis:** Ein Profil ohne einen einzigen öffentlichen Repository liest
      sich für Recruiter wie ein leeres Profil. Entweder ein bis zwei
      Repositories öffentlich stellen oder den Link weglassen. Solange das Feld
      leer ist, erscheint gar kein Link — nicht ein toter.
- [ ] `release.resumePdf` auf `true`, sobald
      `public/downloads/Can_Cadirci_Lebenslauf.pdf` liegt und freigegeben ist
- [ ] Echte Screenshots ergänzen (siehe unten)

### Bleibt geschlossen

- `release.unitflyRepo` — das Kontextdokument nennt einen ungelösten
  Sicherheitsblocker: ein hart hinterlegtes Geheimnis in einer getrackten
  UnitFly-Deployment-Konfiguration. Erst nach Bereinigung **und** Rotation des
  betroffenen Secrets öffnen. `content.test.ts` prüft, dass dieser Schalter auf
  `false` steht.

---

## Screenshots ergänzen

Die Case-Studies funktionieren vollständig ohne Bilder — sie werden
typografisch getragen. Sobald Screenshots vorliegen, den Bildbereich in
`src/content/projects.ts` beim jeweiligen Projekt ergänzen:

```ts
media: [
  {
    src: '/projekte/unitfly/cockpit.png',
    alt: 'Admin-Cockpit von UnitFly mit der Liste offener Agentenvorschläge',
    caption: 'Jeder Vorschlag zeigt Feld, alten Wert, neuen Wert und Begründung.',
    width: 2400,
    height: 1500,
  },
],
```

Die Datei unter `public/projekte/<slug>/` ablegen. `width` und `height` sind
Pflicht — ohne sie springt beim Laden das Layout.

**Vor jedem Screenshot entfernen oder unkenntlich machen:** API-Keys, Tokens,
reale E-Mail-Adressen Dritter, Kundendaten, interne URLs und IP-Adressen,
Zugangs- und Zahlungsdaten.

---

## Kontaktformular

Ohne SMTP-Konfiguration läuft die Seite normal — das Formular meldet dann einen
**ehrlichen Fehler** mit direktem Mailto-Verweis. Es zeigt nie eine
Erfolgsmeldung für eine Nachricht, die nicht zugestellt wurde. Das ist die
wichtigste Entscheidung an `src/app/api/kontakt/route.ts`.

Aktiv wird der Versand erst, wenn **alle sechs** Variablen gesetzt sind:

```
SMTP_HOST=  SMTP_PORT=587  SMTP_USER=  SMTP_PASSWORD=  SMTP_FROM=  CONTACT_TO=
```

Schutz ohne Tracking: ein Honigtopf-Feld und eine Ratenbegrenzung von fünf
Nachrichten pro Absender und Stunde. Kein CAPTCHA — es belastet jeden echten
Nutzer und bringt ein Datenschutzproblem mit, das bei dieser Angriffsfläche
nicht zu rechtfertigen ist.

Die Ratenbegrenzung liegt im Arbeitsspeicher des Prozesses. Bei mehreren
Instanzen zählt jede für sich; die Seite läuft als eine Instanz.

---

## Deployment auf Coolify

1. **Neue Resource → Docker Compose**, Repository verbinden.
2. Compose-Datei: `docker-compose.coolify.yml`.
3. Unter **Domains** beim Dienst `web` eintragen: `https://web-labs.io:3000`.
4. Unter **Environment Variables** die SMTP-Werte setzen (optional, siehe oben).
5. Optional `GOOGLE_SITE_VERIFICATION` als **Build Variable** setzen.

**Keine Traefik-Labels von Hand eintragen.** Coolify schreibt sie selbst,
sobald eine Domain gesetzt ist. Handgeschriebene Labels kollidieren damit — man
bekommt entweder zwei Router auf derselben Regel oder ein Zertifikat, das nie
ausgestellt wird.

**DNS:** ein A-Record `web-labs.io` auf die Server-IP, plus `www` falls
gewünscht.

Der Build braucht **Netzwerkzugang**: `next/font/google` lädt die
Schriftdateien zur Bauzeit herunter und legt sie ins Bundle. Zur Laufzeit
spricht die Seite dann nie mit Google — genau das verlangt die
Datenschutzerklärung.

Prüfen nach dem ersten Start:

```bash
curl -s https://web-labs.io/api/health
```

### SEO nach dem Deployment aktivieren

1. Property `https://web-labs.io` in der Google Search Console anlegen.
2. Verifizierungstoken als `GOOGLE_SITE_VERIFICATION` in Coolify eintragen,
   **Build Variable** aktivieren und neu deployen.
3. `https://web-labs.io/sitemap.xml` in der Search Console einreichen.
4. Startseite und die drei `/leistungen/...`-Seiten per URL-Prüfung anstoßen.
5. Die ausführliche Akquise- und Messstrategie in `SEO-STRATEGIE.md` verwenden.

---

## Tests

132 Tests. Zwei davon sind ungewöhnlich und der eigentliche Grund für den
Aufbau:

**`src/styles/tokens.test.ts`** liest die echte Datei `_tokens.scss`,
konvertiert jede oklch-Farbe nach sRGB und rechnet die Kontraste — Fließtext
gegen 4.5:1, Ränder von Bedienelementen gegen 3:1 und jeweils gegen Grund
*und* getönte Fläche. Beim ersten Lauf hat er drei
echte Fehler gefunden, die auf getönten Sektionen unter dem Grenzwert lagen.

**`src/app/kontakt/ContactForm.test.tsx`** prüft vor allem, wann *kein* Erfolg
gemeldet wird — insbesondere den Fall HTTP 200 mit `ok: false` im Rumpf. Wer
dort nur `response.ok` auswertet, zeigt eine grüne Bestätigung für eine
Nachricht an, die nie versendet wurde.
