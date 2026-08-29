import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio, oklchToHex, parseOklch, type Oklch } from '@/lib/color';

/**
 * Kontrast wird gerechnet, nicht geschätzt.
 *
 * Dieser Test liest die ECHTE Token-Datei — nicht eine Kopie der Werte in
 * einem Fixture. Das ist der ganze Punkt: Wer eine Farbe in `_tokens.scss`
 * ändert, bekommt hier sofort eine Antwort, statt sie erst beim Nutzer zu
 * bekommen. „Blasses Grau auf Weiß" ist einer der häufigsten sichtbaren
 * Qualitätsfehler und gleichzeitig einer der am leichtesten messbaren.
 *
 * Grenzwerte nach WCAG 2.1:
 *   1.4.3  Fließtext ≥ 4.5:1
 *   1.4.11 Ränder von Bedienelementen ≥ 3:1
 */

const TOKENS_PATH = path.resolve(__dirname, '_tokens.scss');
const source = readFileSync(TOKENS_PATH, 'utf8');

type Palette = Map<string, Oklch>;

/**
 * Es gibt nur noch EINE Palette. Sie steht direkt in `:root` statt in einem
 * Mixin, weil es nichts mehr gibt, zwischen dem umgeschaltet werden müsste.
 */
function extractPalette(): Palette {
  const palette: Palette = new Map();
  for (const match of source.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    const [, token, value] = match;
    if (!token || !value) continue;
    const color = parseOklch(value);
    // Werte mit Alpha (`… / 0.14`) und Schatten werden übersprungen: Sie sind
    // per Definition transparent, ein Kontrastwert gegen sie ist bedeutungslos.
    if (color) palette.set(token, color);
  }
  return palette;
}

const palette = extractPalette();

/** Textpaare: Vordergrund muss ≥ 4.5:1 gegen den Hintergrund erreichen. */
const TEXT_PAIRS: readonly [string, string][] = [
  ['c-text', 'c-bg'],
  ['c-text-muted', 'c-bg'],
  ['c-text-subtle', 'c-bg'],
  ['c-text', 'c-surface'],
  ['c-text-muted', 'c-surface'],
  ['c-text-subtle', 'c-surface'],
  ['c-success', 'c-bg'],
  ['c-danger', 'c-bg'],
  // Beschriftung auf gefüllter Betonungsfläche — der primäre Knopf.
  ['c-on-emphasis', 'c-emphasis'],
];

/** Ränder von Bedienelementen: ≥ 3:1. */
const CONTROL_PAIRS: readonly [string, string][] = [
  ['c-border-control', 'c-bg'],
  ['c-border-control', 'c-surface'],
];

describe('Farbpalette', () => {

  const get = (token: string): Oklch => {
    const color = palette.get(token);
    if (!color) throw new Error(`Token --${token} fehlt in der Palette.`);
    return color;
  };

  it.each(TEXT_PAIRS)('--%s auf --%s erreicht 4.5:1', (fg, bg) => {
    const ratio = contrastRatio(get(fg), get(bg));
    expect(
      ratio,
      `--${fg} (${oklchToHex(get(fg))}) auf --${bg} (${oklchToHex(get(bg))}) = ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each(CONTROL_PAIRS)('--%s auf --%s erreicht 3:1', (fg, bg) => {
    const ratio = contrastRatio(get(fg), get(bg));
    expect(
      ratio,
      `--${fg} (${oklchToHex(get(fg))}) auf --${bg} (${oklchToHex(get(bg))}) = ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(3);
  });
});

describe('Palettenstruktur', () => {
  it('ist monochrom — kein Token trägt eine sichtbare Buntheit', () => {
    // Die zentrale Entscheidung dieses Entwurfs. Signalfarben und das
    // Markenorange sind ausgenommen: Sie sind funktional bzw. identifizierend,
    // nicht dekorativ. Ein Fehlerzustand in Grau wäre kein Signal mehr.
    const exempt = new Set(['c-success', 'c-danger', 'c-brand']);
    for (const [token, color] of palette) {
      if (exempt.has(token)) continue;
      expect(color.c, `--${token} ist bunt (Chroma ${color.c})`).toBeLessThan(0.02);
    }
  });

  it('setzt Grund und Text in entgegengesetzte Wärme', () => {
    // Der Grund, warum die Graustufenseite nicht hart wirkt: Der Grund liegt
    // kühl (Farbwinkel ~260), der Text warm (~85). Man sieht keine Farbe — man
    // sieht, dass die Fläche lebt. Reines Weiß auf reinem Schwarz wirkt
    // dagegen wie ein Terminal.
    const bg = palette.get('c-bg');
    const text = palette.get('c-text');
    expect(bg).toBeDefined();
    expect(text).toBeDefined();
    expect(bg!.h, 'Grund ist nicht kühl').toBeGreaterThan(200);
    expect(bg!.h, 'Grund ist nicht kühl').toBeLessThan(320);
    expect(text!.h, 'Text ist nicht warm').toBeGreaterThan(40);
    expect(text!.h, 'Text ist nicht warm').toBeLessThan(120);
  });

  it('hält alle Neutraltöne minimal getönt statt reingrau', () => {
    // Reines Grau (Chroma 0) wirkt tot — das ist der Unterschied zwischen
    // monochrom und farblos.
    for (const token of ['c-bg', 'c-surface', 'c-line', 'c-text', 'c-text-muted', 'c-text-subtle']) {
      const color = palette.get(token);
      expect(color, `--${token} fehlt`).toBeDefined();
      expect(color!.c, `--${token} ist reines Grau`).toBeGreaterThan(0);
      expect(color!.c, `--${token} ist keine Neutralfarbe mehr`).toBeLessThan(0.02);
    }
  });

  it('staffelt die Flächen gleichmäßig in der Helligkeit', () => {
    // void < bg < surface < surface-high, mit ähnlichen Schritten. In oklch
    // bedeutet das auch wahrnehmungsgleiche Abstände — genau dafür ist der
    // Farbraum gewählt.
    const steps = ['c-void', 'c-bg', 'c-surface', 'c-surface-high'].map(
      (token) => palette.get(token)?.l ?? 0,
    );
    for (let i = 1; i < steps.length; i += 1) {
      expect(steps[i]!, `Stufe ${i} ist nicht heller als die vorige`).toBeGreaterThan(steps[i - 1]!);
    }
  });
});

describe('Token-Referenzen', () => {
  /**
   * Jede im Code verwendete Farbvariable muss in `_tokens.scss` auch definiert
   * sein.
   *
   * Der Grund für diesen Test: Eine `var(--c-gibtsnicht)` ohne Rückfallwert
   * wirft keinen Fehler. Die Eigenschaft fällt still auf ihren Anfangswert
   * zurück — Text wird schwarz statt cremefarben, ein Rand verschwindet. Beim
   * Umbenennen von `--c-accent` auf `--c-emphasis` sind auf diese Weise vier
   * Verwendungen liegengeblieben, ohne dass Build oder Typprüfung etwas
   * gemeldet hätten.
   */
  it('definiert jede verwendete --c-*-Variable', () => {
    const root = path.resolve(__dirname, '..');
    const used = new Map<string, string[]>();

    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        // Testdateien überspringen: Diese hier nennt in ihrem eigenen
        // Kommentar ein absichtlich nicht existierendes Token als Beispiel.
        if (entry.name.includes('.test.')) continue;
        if (!/\.(scss|tsx|ts)$/.test(entry.name)) continue;
        const content = readFileSync(full, 'utf8');
        for (const match of content.matchAll(/var\(\s*(--c-[a-z0-9-]+)/g)) {
          const token = match[1];
          if (!token) continue;
          const list = used.get(token) ?? [];
          list.push(path.relative(root, full));
          used.set(token, list);
        }
      }
    };
    walk(root);

    const missing = [...used.entries()]
      .filter(([token]) => !new RegExp(`${token}\\s*:`).test(source))
      .map(([token, files]) => `${token} (in ${[...new Set(files)].join(', ')})`);

    expect(missing, `Nicht definierte Token:\n${missing.join('\n')}`).toEqual([]);
  });
});
