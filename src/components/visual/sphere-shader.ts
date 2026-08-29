/**
 * Shader für die Systemkugel.
 *
 * Gezeichnet werden Breitenringe auf einer Kugel, die von einem Rauschfeld
 * radial verformt werden. Aus vielen dünnen Linien entsteht dabei ein Körper
 * — dieselbe Wirkung wie bei einer Höhenlinienkarte: Masse aus Dichte, nicht
 * aus Strichstärke.
 *
 * Die gesamte Verformung passiert im VERTEX-Shader. Auf der CPU liegt nur ein
 * statischer Puffer mit den Punkten der unverformten Einheitskugel; pro Bild
 * ändert sich dort nichts. Würde man die Punkte in JavaScript bewegen, wären
 * es rund zwanzigtausend Vektoroperationen pro Bild — das bricht auf jedem
 * schwächeren Gerät sofort ein.
 */

export const VERTEX_SHADER = /* glsl */ `
attribute vec3 aPosition;

uniform float uTime;
uniform float uAspect;
uniform float uAmplitude;
uniform float uDistance;

varying float vDepth;

// Eigenes Wertrauschen statt einer eingebundenen Simplex-Implementierung.
// Für eine weiche, fließende Verformung reicht es vollständig, und es sind
// zwölf Zeilen statt sechzig.
float hash31(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.11, 0.27, 0.43));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float valueNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  // Glättung mit waagerechten Tangenten an beiden Enden — ohne sie sieht man
  // die Gitterzellen des Rauschens als Kanten.
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(hash31(i + vec3(0.0, 0.0, 0.0)), hash31(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y),
    mix(
      mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y),
    f.z);
}

// Drei Oktaven. Bei einer wird die Kugel eine glatte Beule, bei fünf wird sie
// unruhig und das Bild rauscht bei jeder Drehung.
float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * valueNoise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  // Das Rauschfeld wird durch die Kugel geschoben, statt die Kugel zu drehen.
  // Dadurch wandert die Verformung ÜBER die Oberfläche — die Form lebt, statt
  // starr mitzurotieren.
  // Niedrige Frequenz. Bei 1.55 entstanden viele kleine Kräusel, die aus der
  // Entfernung zu einem Moiré verschwimmen; bei 0.85 entstehen wenige große
  // Falten, die die Kugel als Körper lesbar machen. Masse aus Dichte, Form aus
  // wenigen großen Zügen — nicht umgekehrt.
  float n = fbm(aPosition * 0.85 + vec3(0.0, 0.0, uTime * 0.09));
  vec3 p = aPosition * (1.0 + (n - 0.5) * uAmplitude);

  // Leichte Neigung, damit man die Ringe als Breitenkreise erkennt und nicht
  // als konzentrische Kreise von vorn.
  // Flache Neigung: Die Kugel wird von fast genau der Seite gesehen, damit die
  // Breitenkreise als umlaufende Konturen lesbar sind. Bei stärkerer Neigung
  // schaut man auf den Pol, und die Ringe projizieren zu konzentrischen
  // Kreisen — dann sieht es aus wie eine Zielscheibe, nicht wie ein Körper.
  float tilt = 0.16;
  p = mat3(
    1.0, 0.0, 0.0,
    0.0, cos(tilt), sin(tilt),
    0.0, -sin(tilt), cos(tilt)
  ) * p;

  // Drehung um die eigene Achse.
  float a = uTime * 0.075;
  p = mat3(
    cos(a), 0.0, -sin(a),
    0.0, 1.0, 0.0,
    sin(a), 0.0, cos(a)
  ) * p;

  // Tiefe für die Abstufung im Fragment-Shader: 0 hinten, 1 vorn.
  vDepth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);

  // Perspektive von Hand. Eine Projektionsmatrix aus einer Bibliothek wäre
  // hier acht Zeilen Ersparnis und eine ganze Abhängigkeit Kosten.
  vec3 eye = p - vec3(0.0, 0.0, uDistance);
  float f = 2.4;                       // entspricht etwa 45° Öffnungswinkel
  float near = 0.1;
  float far = 12.0;
  gl_Position = vec4(
    f / uAspect * eye.x,
    f * eye.y,
    (far + near) / (near - far) * eye.z + 2.0 * far * near / (near - far),
    -eye.z
  );
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
precision mediump float;

varying float vDepth;

uniform vec3 uColor;
uniform float uOpacity;
uniform float uDepthFloor;

void main() {
  // Linien auf der Rückseite laufen fast auf null. Genau das erzeugt den
  // Eindruck eines Körpers: Ohne die Abstufung sieht man ein flaches
  // Drahtgeflecht, mit ihr eine Kugel.
  // Der Exponent steuert, wie schnell die Rückseite wegfällt. Bei 2.2 lag
  // fast die gesamte sichtbare Fläche im dunklen Teil der Kurve und das Objekt
  // verschwand; bei 1.5 bleibt die Vorderseite präsent und die Rückseite
  // trotzdem deutlich zurück.
  float depthFade = mix(uDepthFloor, 1.0, pow(vDepth, 1.5));
  gl_FragColor = vec4(uColor, uOpacity * depthFade);
}
`;
