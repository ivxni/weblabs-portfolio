# Designsystem

Was hier steht, ist die Begründung. Die Werte selbst stehen in
`src/styles/_tokens.scss` — dort und nirgends sonst.

---

## 1. Marke und Betonung

`#FF5C00` bleibt die Markenfarbe, ist aber keine allgemeine UI-Akzentfarbe.
Auf der Oberfläche entsteht Betonung durch den Kontrast aus warmem Creme und
kühlem Dunkelgrau. Orange erscheint nur dort, wo es WebLabs identifiziert:
im App-Icon, Favicon und Social Preview. Das verhindert den typischen
Orange-auf-Schwarz-Gaminglook, ohne die Marke aufzugeben.

Das System ist bewusst Dark-only. Liniengrafiken, Tiefenstaffelung und die
monochrome Bildsprache wurden für genau diesen Grund entworfen und müssen nicht
auf eine zweite, visuell schwächere Variante zurückgerechnet werden.

---

## 2. Neutraltöne sind nicht Grau

Der Grund liegt minimal kühl bei Farbwinkel 260, die Schrift minimal warm bei
85. Beide bleiben mit sehr geringer Buntheit an der Wahrnehmungsschwelle. Man
sieht keine Farbe, aber die Fläche wirkt weniger steril als reines Schwarz mit
reinem Weiß. `tokens.test.ts` prüft die tatsächlichen Kontrastpaare direkt aus
der Token-Datei.

---

## 3. Kontrast wird gerechnet

`src/lib/color.ts` rechnet oklch → sRGB → WCAG-Leuchtdichte → Verhältnis.
`src/styles/tokens.test.ts` liest die echte Token-Datei und prüft jedes Paar:

- Fließtext ≥ 4.5:1 (WCAG 1.4.3)
- Ränder von Bedienelementen ≥ 3:1 (WCAG 1.4.11)
- gegen **Grund und getönte Fläche**

Der bindende Fall ist fast immer die getönte Fläche, nicht der Grund. Drei
Token lagen beim ersten Lauf darunter und wurden korrigiert.

---

## 4. Skalen

**Abstände**, Basis 4 — benannt nach dem Pixelwert, damit ein Zwischenwert wie
40 gar nicht erst unauffällig schreibbar ist:

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192 · 256
```

Der Abstand *zwischen* Sektionen (`--space-section`) skaliert von 96 bis 192 px.
Damit bleibt der redaktionelle Rhythmus deutlich, ohne dass jeder Abschnitt wie
eine eigene Vollbildseite wirkt.

**Schrift**, acht Stufen mit je einer Rolle. Die großen skalieren per `clamp()`
mit der Breite, die kleinen nicht: Ein 13px-Label bleibt auf jedem Gerät 13px,
sonst wird es auf dem Handy unleserlich oder auf dem Desktop zum zweiten
Fließtext.

**Radien**, drei feste Rollen: 3 px für kleine Kontrollen, 6 px für technische
Fenster, 12 px für normale Medien. Große Medienflächen skalieren höchstens bis
20 px. Großer Radius auf allem wirkt verspielt, nicht wertig.

**Erhebung**, zwei Werte — und einer davon ist „keiner".

**Bewegung**, drei Dauern (140 / 260 / 520 ms) und eine Easing-Familie.

---

## 5. Typografie

**Archivo** für alles, was gelesen wird. Die leicht industrielle Grotesk trägt
große Versalien ebenso wie sachlichen Fließtext und passt damit zur Aussage
„vollständige Systeme statt nur Oberflächen".

**JetBrains Mono** ausschließlich für Maschinenfakten: Technologien, Daten,
Zählungen, Zustände. Die Mono trägt hier eine Bedeutung — „das ist ein
überprüfbarer Wert" — und ist keine Dekoration. Nie für Fließtext.

Beide über `next/font` zur Bauzeit heruntergeladen und selbst ausgeliefert.
Der Browser des Besuchers spricht nie mit Google; das ist hier nicht nur
Performance, sondern die datenschutzrechtliche Anforderung.

Zeilenlänge 62 Zeichen im Fließtext. Zeilenhöhe 0.90 bei Displaygraden, 1.68 im
Fließtext. Laufweite −0.042 em bei Displaygraden, 0 im Text, +0.13 em bei
Versalien-Mikrolabels.

---

## 6. Komposition

Keine zwei benachbarten Sektionen haben dieselbe Form. Die Startseite:

| # | Sektion | Form |
|---|---|---|
| 1 | Hero | asymmetrische Typografie und WebGL-Systemkugel |
| 2 | Fachbereiche | drei umschaltbare technische Systempfade |
| 3 | Projekte | helle redaktionelle Case-Study-Fläche |
| 4 | Arbeitsweise | drei kurze, überprüfbare Prinzipien |
| 5 | Abschluss | fokussierter Projektkontakt |

**Kein Rahmen ohne Grund.** Eine Karte behauptet „das hier gehört zusammen und
ist vom Rest getrennt". Wo das nicht stimmt, trennen Abstand und Haarlinien —
das wirkt ruhiger und teurer als Kästen. Die drei Kompetenzen sind deshalb eine
Definitionsliste, die Projekte ein Index, die Belege ein Band mit senkrechten
Haarlinien.

**Ein Rasterbruch:** Der Abschnitt „Arbeitsweise" verlässt als einziger die
linke Achse und sitzt nach rechts versetzt. Deutlich genug, um als Absicht
gelesen zu werden.

---

## 7. Das besondere Element

Die **SystemSphere** im Hero ist eine monochrome WebGL-Linienstruktur. Sie
visualisiert ein lebendes System, bleibt aber hinter der Typografie und fällt
bei fehlendem WebGL kontrolliert auf eine statische Canvas-Darstellung zurück.
Bei reduzierter Bewegung bleibt sie lesbar, ohne permanent zu animieren.

---

## 8. Bewegung

Interface-Bewegung nutzt überwiegend `transform` und `opacity`. Laufende Demos
haben eigene, lokal begrenzte Animationspfade und respektieren
`prefers-reduced-motion`.

Hover ist ein Versatz von 2–4 px oder ein Farbwechsel. Kein `scale(1.05)`, kein
aufpoppender Schatten.

Scroll-Einblendungen genau einmal, Schwelle früh (`-8%`), Staffelung 55 ms und
nach vier Elementen abgeschnitten.

**Einblendungen sind ausfallsicher.** Das ist wichtiger als der Effekt: Der
Grundzustand ist *sichtbar*; versteckt wird nur, wenn JavaScript nachweislich
läuft. Zusätzlich drei Sicherungen —

1. Was beim Laden schon im Bild steht, wird sofort gezeigt, ohne auf ein
   Ereignis zu warten.
2. Antwortet der IntersectionObserver binnen 1200 ms überhaupt nicht, wird
   eingeblendet. (In einem funktionierenden Browser kommt der erste Callback
   binnen eines Bildes.)
3. Erscheint binnen vier Sekunden kein `data-hydrated` am `<html>`, nimmt das
   Inline-Skript die `js`-Klasse zurück — dann greift die versteckende Regel
   gar nicht erst.

Ohne Punkt 2 und 3 hieße ein Fehler in der Hydration: leere Seite. Das ist auf
einem Portfolio der teuerste denkbare Fehler, weil niemand davon erfährt.

---

## 9. Was hier nicht vorkommt

Karten mit Icon im abgerundeten Quadrat · zentrierte Sektionsschemata ·
Bento-Grids · Trusted-by-Leisten · Statistikreihen mit großen Zahlen ·
Testimonial-Karten · Verlaufstext in Überschriften · Glasmorphismus ·
Farbverlaufs-Blobs · `scale(1.05)` beim Hover · Emoji als Icons · Icons ohne
Bedeutung · Prozentbalken für Kenntnisse · Schreibmaschinen-Effekte ·
Platzhalterbilder.
