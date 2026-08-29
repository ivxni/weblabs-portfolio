/**
 * Farbrechnung für die Token-Ebene.
 *
 * Warum eigener Code statt einer Bibliothek: Gebraucht wird genau eine Kette
 * — oklch → sRGB → Leuchtdichte → Kontrastverhältnis. Das sind unter siebzig
 * Zeilen. Eine Abhängigkeit dafür in den Produktionsbaum zu ziehen, die dann
 * auch noch beim Test der Tokens mitläuft, wäre der teurere Weg.
 *
 * Die Matrizen stammen aus Björn Ottossons Oklab-Definition.
 */

export interface Oklch {
  /** Wahrgenommene Helligkeit, 0…1 */
  l: number;
  /** Buntheit; ab ~0.37 verlässt man den sRGB-Raum */
  c: number;
  /** Farbwinkel in Grad */
  h: number;
  /** Deckkraft, 0…1. Fehlt sie, gilt 1. */
  alpha?: number;
}

export interface LinearRgb {
  r: number;
  g: number;
  b: number;
}

/** oklch → lineares sRGB (noch ungeklemmt, kann außerhalb 0…1 liegen). */
export function oklchToLinearRgb({ l, c, h }: Oklch): LinearRgb {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const bb = c * Math.sin(rad);

  const lCube = (l + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const mCube = (l - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const sCube = (l - 0.0894841775 * a - 1.291485548 * bb) ** 3;

  return {
    r: 4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube,
    g: -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube,
    b: -0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube,
  };
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Gamma-Kodierung nach sRGB-Übertragungsfunktion. */
export function encodeGamma(v: number): number {
  const x = clamp01(v);
  return x <= 0.0031308 ? x * 12.92 : 1.055 * x ** (1 / 2.4) - 0.055;
}

/** oldch → `#rrggbb`. Werte außerhalb des Gamuts werden geklemmt. */
export function oklchToHex(color: Oklch): string {
  const lin = oklchToLinearRgb(color);
  const toByte = (v: number): string =>
    Math.round(encodeGamma(v) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toByte(lin.r)}${toByte(lin.g)}${toByte(lin.b)}`;
}

/** Relative Leuchtdichte nach WCAG 2.1. */
export function relativeLuminance(color: Oklch): number {
  const { r, g, b } = oklchToLinearRgb(color);
  return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
}

/** Kontrastverhältnis nach WCAG 2.1; Reihenfolge der Argumente egal. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Liest `oklch(L C H)` und `oklch(L C H / A)` aus einem String.
 *
 * Prozent bei L wird akzeptiert, weil die CSS-Notation beides erlaubt und die
 * Token-Datei sonst schweigend durchfiele.
 */
export function parseOklch(input: string): Oklch | null {
  const match = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?)\s*)?\)/i.exec(
    input,
  );
  if (!match) return null;
  const [, rawL, rawC, rawH, rawA] = match;
  if (rawL === undefined || rawC === undefined || rawH === undefined) return null;
  const toUnit = (value: string): number =>
    value.endsWith('%') ? Number.parseFloat(value) / 100 : Number.parseFloat(value);

  const color: Oklch = { l: toUnit(rawL), c: Number.parseFloat(rawC), h: Number.parseFloat(rawH) };
  if (rawA !== undefined) color.alpha = toUnit(rawA);
  return color;
}

/**
 * Legt eine halbtransparente Farbe über eine deckende und liefert das
 * Ergebnis als deckende Farbe.
 *
 * Warum das gebraucht wird: Eine Glasfläche über dem Farbfeld hat einen
 * Hintergrund, den weder die Glasfarbe noch die Feldfarbe allein beschreibt.
 * Der Text darauf steht auf der MISCHUNG. Genau diese Mischung wurde beim
 * ersten Entwurf nicht geprüft — mit dem Ergebnis, dass weißliches Glas über
 * den hellen Stellen des Feldes heller wurde als der hellste Feldton und der
 * Text darauf unter 3:1 fiel.
 *
 * Gemischt wird in linearem sRGB, nicht in oklch: Alpha-Compositing ist
 * physikalisch eine Mischung von Lichtmengen, und die ist linear.
 */
export function compositeOver(foreground: Oklch, background: Oklch): Oklch {
  const alpha = foreground.alpha ?? 1;
  if (alpha >= 1) return { ...foreground, alpha: 1 };

  const fg = oklchToLinearRgb(foreground);
  const bg = oklchToLinearRgb(background);
  const mixed: LinearRgb = {
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  };
  return linearRgbToOklch(mixed);
}

/** Lineares sRGB zurück nach oklch. Gegenstück zu `oklchToLinearRgb`. */
export function linearRgbToOklch({ r, g, b }: LinearRgb): Oklch {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const chroma = Math.hypot(a, bb);
  const hue = ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l: lightness, c: chroma, h: hue, alpha: 1 };
}

/**
 * oklch → sRGB als drei Werte zwischen 0 und 1.
 *
 * Für Shader-Uniforms. Die Werte sind GAMMA-KODIERT, nicht linear: Der
 * Mesh-Shader interpoliert bewusst im Gammaraum und schreibt direkt in einen
 * Zeichenpuffer ohne Farbraumkonvertierung. Damit ist das, was im Shader
 * gerechnet wird, exakt das, was auf dem Bildschirm erscheint — und die
 * Übergänge sehen aus wie ein CSS-Verlauf zwischen denselben Farben.
 */
export function oklchToRgb01(color: Oklch): [number, number, number] {
  const lin = oklchToLinearRgb(color);
  return [encodeGamma(lin.r), encodeGamma(lin.g), encodeGamma(lin.b)];
}
