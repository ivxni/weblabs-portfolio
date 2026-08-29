# Designsystem

Was hier steht, ist die Begründung. Die Werte selbst stehen in
`src/styles/_tokens.scss` — dort und nirgends sonst.

---

## 1. Der Akzent

`#FF5C00` bleibt die Marke. Als Oberflächenfarbe ist es mit 0.212 Buntheit
fast am Rand des sRGB-Raums und damit zu laut — genau der Punkt, an dem
gesättigtes Orange billig wirkt. Deshalb zwei Token:

| Token | Wert | Rolle |
|---|---|---|
| `--c-brand` | `oklch(0.665 0.212 44)` = `#FF5C00` | nur das Logo |
| `--c-accent` (dunkel) | `oklch(0.705 0.180 48)` = `#f67621` | Oberfläche |
| `--c-accent` (hell) | `oklch(0.535 0.190 42)` = `#c13400` | Oberfläche |

**Warum überhaupt Orange:** Der Default-Akzent ist Blau oder Violett. Orange
ist sofort unterscheidbar und gehört bereits zur Marke. Das „Gaming"-Risiko
kommt nicht von der Farbe, sondern von der Nachbarschaft — Orange plus
Neon-Glühen plus reines Schwarz plus große Farbflächen. Hier ist es eine
Haarlinie, ein Knopf und ein Wort in der Überschrift. Sonst nichts.

**Warum der Hellmodus einen eigenen Wert hat:** Dasselbe Orange erreicht auf
dunklem Grund 6.42:1 und auf hellem Papier 2.9:1 — unlesbar. Eine invertierte
Palette hätte genau hier gekippt. Beide Modi sind eigens entworfen; ein Test
erzwingt, dass die Helligkeitswerte sich unterscheiden.

---

## 2. Neutraltöne sind nicht Grau

Alle Neutraltöne liegen auf Farbwinkel 70° (warmes Gelb-Orange) mit einer
Buntheit zwischen 0.005 und 0.012 — an der Wahrnehmungsschwelle. Man sieht sie
nicht als Farbe, man merkt nur, dass die Fläche nicht kalt ist.

Reines Grau neben einem gesättigten Orange sieht immer so aus, als wäre die
Farbe nachträglich daraufgeklebt worden. `tokens.test.ts` erzwingt deshalb
`0 < Chroma < 0.02` für jeden Neutralton.

Der dunkle Grund ist `#191715`, nicht Schwarz: Reines Schwarz erzeugt gegen
helle Schrift ein Nachbild-Flimmern und lässt jede Erhebung darüber grau statt
hell wirken. Der helle Grund ist `#fbfaf7`, nicht Weiß.

---

## 3. Kontrast wird gerechnet

`src/lib/color.ts` rechnet oklch → sRGB → WCAG-Leuchtdichte → Verhältnis.
`src/styles/tokens.test.ts` liest die echte Token-Datei und prüft jedes Paar:

- Fließtext ≥ 4.5:1 (WCAG 1.4.3)
- Ränder von Bedienelementen ≥ 3:1 (WCAG 1.4.11)
- gegen **Grund und getönte Fläche**, in **beiden** Modi

Der bindende Fall ist fast immer die getönte Fläche, nicht der Grund. Drei
Token lagen beim ersten Lauf darunter und wurden korrigiert.

---

## 4. Skalen

**Abstände**, Basis 4 — benannt nach dem Pixelwert, damit ein Zwischenwert wie
40 gar nicht erst unauffällig schreibbar ist:

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192
```

Der Abstand *zwischen* Sektionen (`--space-section`) ist immer mindestens
doppelt so groß wie der größte *innerhalb*. Gleichmäßige Abstände überall lesen
sich wie ein Raster, nicht wie eine Komposition.

**Schrift**, acht Stufen mit je einer Rolle. Die großen skalieren per `clamp()`
mit der Breite, die kleinen nicht: Ein 13px-Label bleibt auf jedem Gerät 13px,
sonst wird es auf dem Handy unleserlich oder auf dem Desktop zum zweiten
Fließtext.

**Radien**, drei Werte: 3px, 6px, 12px. Der große ist ausschließlich für
Medienrahmen. Großer Radius auf allem wirkt verspielt, nicht wertig.

**Erhebung**, zwei Werte — und einer davon ist „keiner".

**Bewegung**, drei Dauern (120 / 220 / 340 ms) und eine Easing-Familie.

---

## 5. Typografie

**Schibsted Grotesk** für alles, was gelesen wird. Nicht Inter: Inter ist gut
und genau deshalb der Default-Look — man erkennt eine Inter-Seite sofort als
eine, bei der die Schrift nicht entschieden wurde.

**JetBrains Mono** ausschließlich für Maschinenfakten: Technologien, Daten,
Zählungen, Zustände. Die Mono trägt hier eine Bedeutung — „das ist ein
überprüfbarer Wert" — und ist keine Dekoration. Nie für Fließtext.

Beide über `next/font` zur Bauzeit heruntergeladen und selbst ausgeliefert.
Der Browser des Besuchers spricht nie mit Google; das ist hier nicht nur
Performance, sondern die datenschutzrechtliche Anforderung.

Zeilenlänge 62 Zeichen im Fließtext. Zeilenhöhe 1.02 bei Displaygraden, 1.62 im
Fließtext. Laufweite −0.032 em bei Displaygraden, 0 im Text, +0.09 em bei
Versalien-Mikrolabels.

---

## 6. Komposition

Keine zwei benachbarten Sektionen haben dieselbe Form. Die Startseite:

| # | Sektion | Form |
|---|---|---|
| 1 | Hero | geteilt 1:1, Text links, Grafik rechts |
| 2 | Belege | waagerechtes Band, vier Spalten, getönte Fläche |
| 3 | Was ich liefere | versetzte schmale Spalte, Definitionsliste |
| 4 | Projekte | randloser Index, große Zeilen |
| 5 | Erfahrung | klebender Text links, laufende Liste rechts |
| 6 | Arbeitsweise | einzelne schmale Spalte, nach rechts versetzt |
| 7 | Abschluss | ein Element, sehr viel Luft |

**Kein Rahmen ohne Grund.** Eine Karte behauptet „das hier gehört zusammen und
ist vom Rest getrennt". Wo das nicht stimmt, trennen Abstand und Haarlinien —
das wirkt ruhiger und teurer als Kästen. Die drei Kompetenzen sind deshalb eine
Definitionsliste, die Projekte ein Index, die Belege ein Band mit senkrechten
Haarlinien.

**Ein Rasterbruch:** Der Abschnitt „Arbeitsweise" verlässt als einziger die
linke Achse und sitzt nach rechts versetzt. Deutlich genug, um als Absicht
gelesen zu werden.

---

## 7. Das eine besondere Element

Der **Systemschnitt** im Hero. Fünf Schichten eines Systems — Oberfläche, API,
Daten, Tests, Betrieb — mit einer gestrichelten Linie nach der ersten:
„Viele Demos enden hier."

Er ist die Überschrift der Seite als Grafik, nicht Dekoration. Ein rotierendes
Objekt hätte über den Inhalt nichts gesagt.

**Kosten pro Bild: keine.** Es gibt keinen Scroll-Handler. Ein
IntersectionObserver mit einem schmalen Band in der Bildschirmmitte meldet den
Wechsel — fünf Ereignisse pro Seitenbesuch. Auf der CPU ändert sich eine Zahl
(`--cut`), das Zeichnen übernimmt `transform: scaleY()`.

**Er funktioniert in drei Zuständen:**

1. *Normal* — der Schnitt wächst beim Scrollen nach unten.
2. *Reduzierte Bewegung* — der Schnitt ist vollständig gezogen, alle
   Querstriche stehen. Dieselbe Aussage, nur auf einmal.
3. *Ohne JavaScript* — alle Schichten sind lesbar, es fehlt nur die Betonung.

---

## 8. Bewegung

Nur `transform` und `opacity`. Zwei bewusste Ausnahmen, beide dokumentiert:
der Themewechsel auf `body` (ein Moment pro Besuch) und der Farbwechsel der
aktiven Schicht im Systemschnitt (höchstens fünfmal pro Besuch). Beides sind
Zustandswechsel, keine Animationen pro Bild.

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
