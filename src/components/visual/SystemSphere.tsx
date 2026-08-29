'use client';

import { useEffect, useRef, useState } from 'react';
import { oklchToRgb01, parseOklch } from '@/lib/color';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './sphere-shader';
import styles from './SystemSphere.module.scss';

/**
 * Die Systemkugel — das eine Element, an das man sich erinnern soll.
 *
 * -- Warum sie hier steht -------------------------------------------------------
 * Sie ist kein rotierender Würfel. Die Kugel besteht aus Schichten, und genau
 * darum geht es auf dieser Seite: nicht um eine Oberfläche, sondern um ein
 * System aus Ebenen. Die Beschriftungen ringsum sind diese Ebenen. Das Objekt
 * behauptet nichts, was der Text nicht auch sagt — es zeigt es.
 *
 * -- Warum rohes WebGL und nicht three.js ---------------------------------------
 * Es ist EIN Objekt aus Linien. Kein Szenengraph, kein Licht, keine Materialien,
 * keine Kamera-Steuerung — nichts, wofür eine Szenenbibliothek gemacht ist.
 * three.js kostete rund 150 kB komprimiert; das hier sind etwa 220 Zeilen und
 * keine zusätzliche Abhängigkeit. Auf einem Portfolio, dessen Aussage
 * technische Sorgfalt ist, ist das Gewicht selbst Teil der Aussage.
 *
 * -- Kosten pro Bild ------------------------------------------------------------
 * Auf der CPU ändert sich pro Bild EINE Zahl (die Zeit). Der Punktepuffer ist
 * statisch und wird einmal beim Mounten gefüllt; die gesamte Verformung
 * passiert im Vertex-Shader. Gezeichnet wird in einem einzigen `drawElements`
 * mit etwa 30 Bildern pro Sekunde — die Kugel dreht sich langsam, 60 Bilder
 * wären doppelte Arbeit ohne sichtbaren Unterschied.
 */

/**
 * Ringe und Punkte je Ring.
 *
 * Masse entsteht aus DICHTE, nicht aus Strichstärke. Mit 54 Ringen standen
 * sichtbare Lücken zwischen den Konturen und das Objekt sah aus wie ein
 * Drahtgestell; mit 96 schließen sie sich zu einer Fläche, und daraus wird ein
 * Körper. Die Einzellinie wird dafür leiser gestellt — sonst summieren sich
 * die Überlagerungen zu einer weißen Kugel.
 */
const QUALITY = {
  high: { rings: 84, segments: 300 },
  low: { rings: 56, segments: 170 },
} as const;

/** Ab dieser Breite wird die feine Auflösung gezeichnet. */
const HIGH_QUALITY_WIDTH = 768;
/** Zielabstand zwischen zwei Bildern (≈ 30 fps). */
const FRAME_INTERVAL = 33;
/**
 * Deckel auf das Gerätepixelverhältnis — hier NICHT nur aus Leistungsgründen.
 *
 * Eine 1-px-Linie bleibt bei jedem Verhältnis eine Gerätepixelzeile breit.
 * Wird der Puffer doppelt so groß gerechnet, deckt dieselbe Linie relativ zur
 * Fläche nur noch die Hälfte ab — die Kugel wird auf einem Retina-Display
 * sichtbar blasser als auf einem gewöhnlichen. Der Deckel hält die Dichte
 * über alle Displays gleich.
 */
const MAX_DPR = 1;
/** Stärke der Verformung. Über 0.65 zerfällt die Kugel in Fetzen. */
const AMPLITUDE = 0.60;
/** Abstand der Kamera. Kleiner = stärkere Perspektive. */
const DISTANCE = 3.15;

/**
 * Baut Breitenringe auf der Einheitskugel.
 *
 * Die Pole werden ausgespart (`i + 1` von `rings + 1`): Ein Ring exakt am Pol
 * hätte den Radius null und würde zu einem Punkt entarten, an dem sich alle
 * Segmente überlagern — das ergibt einen hellen Fleck.
 */
function buildRings(rings: number, segments: number): {
  positions: Float32Array;
  indices: Uint32Array;
} {
  const positions = new Float32Array(rings * segments * 3);
  const indices = new Uint32Array(rings * segments * 2);
  let p = 0;
  let k = 0;

  for (let i = 0; i < rings; i += 1) {
    const phi = (Math.PI * (i + 1)) / (rings + 1);
    const y = Math.cos(phi);
    const r = Math.sin(phi);
    const base = i * segments;

    for (let j = 0; j < segments; j += 1) {
      const theta = (2 * Math.PI * j) / segments;
      positions[p] = r * Math.cos(theta);
      positions[p + 1] = y;
      positions[p + 2] = r * Math.sin(theta);
      p += 3;

      // Jeder Ring ist geschlossen: Der letzte Punkt verbindet zurück zum ersten.
      indices[k] = base + j;
      indices[k + 1] = base + ((j + 1) % segments);
      k += 2;
    }
  }

  return { positions, indices };
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)?.trim();
    // Ein verlorener WebGL-Kontext liefert häufig `COMPILE_STATUS = false`,
    // aber keinen Log. Das ist kein kaputter Shader, sondern ein Signal für den
    // bereits vorhandenen CSS-Fallback und soll die Konsole nicht verunreinigen.
    if (message && !gl.isContextLost() && process.env.NODE_ENV === 'development') {
      console.warn('[SystemSphere] Shader konnte nicht kompiliert werden:', message);
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface Appearance {
  color: [number, number, number];
  opacity: number;
  depthFloor: number;
}

/**
 * Erscheinungsbild aus der Token-Ebene lesen statt es hier festzuschreiben.
 *
 * Deckkraft und Tiefenboden stehen bewusst NICHT als Konstanten im Bauteil:
 * Sie unterscheiden sich zwischen Hell- und Dunkelmodus erheblich, und die
 * Palette ist der Ort, an dem solche Unterschiede begründet zusammenstehen.
 */
function readAppearance(): Appearance {
  const computed = getComputedStyle(document.documentElement);
  const parsed = parseOklch(computed.getPropertyValue('--c-text'));
  const number = (token: string, fallback: number): number => {
    const value = Number.parseFloat(computed.getPropertyValue(token));
    return Number.isFinite(value) ? value : fallback;
  };
  return {
    color: parsed ? oklchToRgb01(parsed) : [1, 1, 1],
    opacity: number('--sphere-opacity', 0.72),
    depthFloor: number('--sphere-depth-floor', 0.05),
  };
}

export function SystemSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return; // Kein WebGL — die CSS-Ringe bleiben stehen.

    // Mehr als 65 536 Punkte brauchen 32-Bit-Indizes. Fehlt die Erweiterung,
    // wird die grobe Auflösung gezeichnet — sichtbar weniger fein, aber
    // vollständig, statt gar nicht.
    const uint32 = gl.getExtension('OES_element_index_uint');
    const quality =
      window.innerWidth >= HIGH_QUALITY_WIDTH && uint32 ? QUALITY.high : QUALITY.low;
    const { positions, indices } = buildRings(quality.rings, quality.segments);

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program)?.trim();
      if (message && !gl.isContextLost() && process.env.NODE_ENV === 'development') {
        console.warn('[SystemSphere] Shader-Programm konnte nicht verlinkt werden:', message);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indexType = uint32 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      uint32 ? indices : new Uint16Array(indices),
      gl.STATIC_DRAW,
    );

    // Kein Tiefentest: Die Linien sollen sich überlagern und aufsummieren —
    // genau das erzeugt die Dichte. Die Tiefenwirkung kommt aus der Abstufung
    // im Fragment-Shader, nicht aus Verdeckung.
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uAspect = gl.getUniformLocation(program, 'uAspect');
    const uColor = gl.getUniformLocation(program, 'uColor');
    const uOpacity = gl.getUniformLocation(program, 'uOpacity');
    const uDepthFloor = gl.getUniformLocation(program, 'uDepthFloor');
    gl.uniform1f(gl.getUniformLocation(program, 'uAmplitude'), AMPLITUDE);
    gl.uniform1f(gl.getUniformLocation(program, 'uDistance'), DISTANCE);

    // Je feiner die Auflösung, desto mehr Linien überlagern sich — die
    // Einzellinie muss dann leiser sein, sonst wird aus der Kugel eine Scheibe.
    const densityFactor = quality === QUALITY.high ? 1 : 1.2;
    const applyAppearance = () => {
      const appearance = readAppearance();
      gl.uniform3fv(uColor, appearance.color);
      gl.uniform1f(uOpacity, Math.min(1, appearance.opacity * densityFactor));
      gl.uniform1f(uDepthFloor, appearance.depthFloor);
    };
    applyAppearance();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform1f(uAspect, width / height);
    };
    resize();

    const draw = (seconds: number) => {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, seconds);
      gl.drawElements(gl.LINES, indices.length, indexType, 0);
    };

    // DAS ERSTE BILD WIRD SOFORT GEZEICHNET, nicht im ersten Animationsframe.
    //
    // Das ist keine Optimierung, sondern eine Ausfallsicherung. Browser setzen
    // `requestAnimationFrame` aus, solange ein Dokument nicht sichtbar ist —
    // in eingebetteten Ansichten, in Vorschaufenstern und in manchen
    // Automatisierungsumgebungen bleibt es dauerhaft ausgesetzt. Hinge das
    // erste Bild am ersten Frame, stünde dort für immer ein leeres Rechteck.
    //
    // So gilt: Bewegung ist optional, das Objekt nicht.
    draw(0);
    setIsDrawing(true);

    let onScreen = true;
    let tabVisible = !document.hidden;
    let frame = 0;
    let lastFrame = 0;
    const start = performance.now();

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!onScreen || !tabVisible) return;
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      draw((now - start) / 1000);
    };
    frame = requestAnimationFrame(render);

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreen = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    intersection.observe(canvas);

    const onVisibility = () => {
      tabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);


    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);

      // GPU-Ressourcen aufräumen, den Kontext selbst aber bewusst nicht per
      // WEBGL_lose_context zerstören. React führt Effects im Development unter
      // Strict Mode direkt zweimal aus; ein erzwungener Kontextverlust aus dem
      // ersten Cleanup träfe dann den zweiten Aufbau und erzeugte den
      // irreführenden `Shader-Fehler: null`.
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${isDrawing ? styles.canvasReady : ''}`}
      />
      <div className={styles.fallback} />
    </div>
  );
}
