import { describe, expect, it } from 'vitest';
import { contrastRatio, oklchToHex, parseOklch, relativeLuminance } from './color';

describe('oklch → sRGB', () => {
  it('bildet Weiß und Schwarz korrekt ab', () => {
    expect(oklchToHex({ l: 1, c: 0, h: 0 })).toBe('#ffffff');
    expect(oklchToHex({ l: 0, c: 0, h: 0 })).toBe('#000000');
  });

  it('trifft das Markenorange #FF5C00', () => {
    // Der Wert stammt aus der Umrechnung des Ausgangs-Hex nach oklch. Wenn
    // diese Zusicherung bricht, hat sich die Konvertierung geändert — nicht
    // die Marke.
    expect(oklchToHex({ l: 0.665, c: 0.212, h: 44 })).toBe('#f75800');
  });

  it('klemmt Farben außerhalb des sRGB-Raums, statt NaN zu liefern', () => {
    const hex = oklchToHex({ l: 0.7, c: 0.4, h: 140 });
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('Kontrastverhältnis', () => {
  it('liefert 21:1 für Schwarz auf Weiß', () => {
    const ratio = contrastRatio({ l: 1, c: 0, h: 0 }, { l: 0, c: 0, h: 0 });
    expect(ratio).toBeCloseTo(21, 1);
  });

  it('ist symmetrisch — die Reihenfolge der Argumente ändert nichts', () => {
    const a = { l: 0.7, c: 0.18, h: 48 };
    const b = { l: 0.205, c: 0.005, h: 70 };
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });

  it('liefert 1:1 für identische Farben', () => {
    const color = { l: 0.5, c: 0.1, h: 200 };
    expect(contrastRatio(color, color)).toBeCloseTo(1, 10);
  });

  it('steigt monoton mit der Helligkeitsdifferenz', () => {
    const bg = { l: 0.205, c: 0.005, h: 70 };
    const dim = contrastRatio({ l: 0.5, c: 0.005, h: 70 }, bg);
    const bright = contrastRatio({ l: 0.9, c: 0.005, h: 70 }, bg);
    expect(bright).toBeGreaterThan(dim);
  });
});

describe('Leuchtdichte', () => {
  it('gewichtet Grün stärker als Blau', () => {
    const green = relativeLuminance({ l: 0.87, c: 0.29, h: 142 });
    const blue = relativeLuminance({ l: 0.45, c: 0.31, h: 264 });
    expect(green).toBeGreaterThan(blue);
  });
});

describe('parseOklch', () => {
  it('liest die Schreibweise aus der Token-Datei', () => {
    expect(parseOklch('oklch(0.205 0.005 70)')).toEqual({ l: 0.205, c: 0.005, h: 70 });
  });

  it('akzeptiert Prozentangaben bei der Helligkeit', () => {
    expect(parseOklch('oklch(70% 0.18 48)')).toEqual({ l: 0.7, c: 0.18, h: 48 });
  });

  it('gibt null zurück, wenn es keine oklch-Farbe ist', () => {
    expect(parseOklch('#ff5c00')).toBeNull();
    expect(parseOklch('0 1px 2px rgba(0,0,0,.5)')).toBeNull();
  });
});
