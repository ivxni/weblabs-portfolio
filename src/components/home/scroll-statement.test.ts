import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { compositeOver, contrastRatio, oklchToHex, parseOklch, type Oklch } from '@/lib/color';
import { DIM } from './ScrollStatement';

/**
 * Der abgedunkelte Zustand der Scroll-Aussage ist eine Lesbarkeitsfrage, keine
 * Geschmacksfrage.
 *
 * Ein Absatz, dessen untere Hälfte auf 22 % Deckkraft steht, sieht auf einem
 * Screenshot elegant aus und ist für einen Teil der Leser schlicht nicht mehr
 * zu entziffern — und wer nicht scrollt, sieht nie etwas anderes. Deshalb wird
 * der Wert hier gegen dieselbe Grenze gerechnet wie jeder andere Fließtext.
 */

const tokens = readFileSync(
  path.resolve(__dirname, '../../styles/_tokens.scss'),
  'utf8',
);

function token(name: string): Oklch {
  const match = new RegExp(`--${name}:\\s*([^;]+);`).exec(tokens);
  const color = match?.[1] ? parseOklch(match[1]) : null;
  if (!color) throw new Error(`--${name} nicht gefunden.`);
  return color;
}

describe('Scroll-Aussage', () => {
  it('hält den abgedunkelten Zustand über 4.5:1', () => {
    const bg = token('c-bg');
    const dimmed = compositeOver({ ...token('c-text'), alpha: DIM }, bg);
    const ratio = contrastRatio(dimmed, bg);
    expect(
      ratio,
      `Abgedunkelter Text (${oklchToHex(dimmed)}) bei Deckkraft ${DIM} = ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('lässt genug Reserve für die Rundung von Browsern', () => {
    // 4.53:1 wäre formal bestanden und praktisch am Rand. Verlangt wird ein
    // Wert, der auch dann hält, wenn die Deckkraft auf dem Weg durch
    // Compositing minimal verloren geht.
    const bg = token('c-bg');
    const dimmed = compositeOver({ ...token('c-text'), alpha: DIM }, bg);
    expect(contrastRatio(dimmed, bg)).toBeGreaterThanOrEqual(5.5);
  });

  it('bleibt deutlich unter dem vollen Wort, sonst gäbe es keinen Effekt', () => {
    expect(DIM).toBeLessThan(0.6);
  });
});
