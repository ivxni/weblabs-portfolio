'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import {
  defaultSwitches,
  runAgent,
  stages,
  type DemoSwitches,
  type StageResult,
} from '@/content/guardrail-demo';
import styles from './GuardrailDemo.module.scss';

/**
 * Agentenlauf mit Guardrails — die eine interaktive Stelle der Seite.
 *
 * Warum sie existiert: Die Seite behauptet mehrfach, dass Modellaktionen hart
 * begrenzt sind. Ein Satz darüber ist eine Behauptung. Ein Schalter, der einen
 * Lauf nachweislich stoppt und den Grund nennt, ist ein Beleg — und zwar einer,
 * den ein technischer Leser in zehn Sekunden selbst prüfen kann.
 *
 * Die Entscheidungslogik liegt bewusst NICHT hier, sondern als reine Funktion
 * in `content/guardrail-demo.ts`. Dadurch ist sie ohne DOM testbar, und dieses
 * Bauteil enthält nur noch Darstellung und Zeitsteuerung.
 */

/** Abstand zwischen zwei Stationen beim Abspielen. */
const STEP_MS = 520;

const ROLES: readonly { value: DemoSwitches['role']; label: string }[] = [
  { value: 'betrachter', label: 'Betrachter' },
  { value: 'redakteur', label: 'Redakteur' },
  { value: 'admin', label: 'Admin' },
];

export function GuardrailDemo() {
  const [switches, setSwitches] = useState<DemoSwitches>(defaultSwitches);
  const [results, setResults] = useState<StageResult[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  // Ohne dieses Aufräumen laufen die Zeitgeber weiter, wenn jemand die Seite
  // mitten im Ablauf verlässt — und setzen dann Zustand auf einem Bauteil, das
  // es nicht mehr gibt.
  useEffect(() => clearTimers, [clearTimers]);

  const run = useCallback(() => {
    clearTimers();
    const outcome = runAgent(switches);
    setResults(outcome);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Ruhiger Zustand: das vollständige Ergebnis auf einmal. Die Aussage —
      // wo der Lauf endet und warum — ist dieselbe, nur ohne Ablauf.
      setVisibleCount(outcome.length);
      setIsRunning(false);
      return;
    }

    setVisibleCount(0);
    setIsRunning(true);
    outcome.forEach((_, index) => {
      timers.current.push(
        window.setTimeout(() => {
          setVisibleCount(index + 1);
          if (index === outcome.length - 1) setIsRunning(false);
        }, STEP_MS * (index + 1)),
      );
    });
  }, [switches, clearTimers]);

  /** Ein Schalterwechsel verwirft das alte Ergebnis — es gilt nicht mehr. */
  const change = useCallback(
    (patch: Partial<DemoSwitches>) => {
      clearTimers();
      setIsRunning(false);
      setResults([]);
      setVisibleCount(0);
      setSwitches((current) => ({ ...current, ...patch }));
    },
    [clearTimers],
  );

  const resultFor = (key: string): StageResult | undefined => {
    const index = results.findIndex((entry) => entry.key === key);
    if (index === -1 || index >= visibleCount) return undefined;
    return results[index];
  };

  const finished = results.length > 0 && visibleCount === results.length;
  const blocked = finished ? results.find((entry) => entry.verdict === 'block') : undefined;

  return (
    <section className={styles.section} aria-labelledby="demo-heading">
      <Container>
        <div className={styles.header}>
          <div>
            <h2 className={styles.heading} id="demo-heading">
              Guardrails sind keine Zusage. Probieren Sie sie aus.
            </h2>
          </div>
          <div>
            <p className={styles.intro}>
              Legen Sie die Schalter um und starten Sie einen Preis-Agentenlauf. Die Kette zeigt,
              an welcher Station er endet und aus welchem Grund. Die Reihenfolge ist die Aussage:
              Das Modell kommt nach dem Analyzer und vor der Rollenprüfung. Es sieht nie eine
              ungefilterte Menge und entscheidet nie, ob geschrieben wird.
            </p>
            <p className={styles.disclaimer}>
              Schematische Nachbildung der Entscheidungswege aus UnitFly · keine Verbindung zu
              einem laufenden System
            </p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.controls}>
            <label className={styles.control}>
              <span>
                <span className={styles.controlName}>Schreibschutz</span>
                <span className={styles.controlHint}>Standardmäßig aktiv</span>
              </span>
              {/*
                Das echte Bedienelement ist eine `checkbox`, nur visuell
                versteckt. Ein `div` mit Klickhandler wäre schneller gebaut und
                per Tastatur nicht bedienbar.
              */}
              <input
                type="checkbox"
                className="visually-hidden"
                checked={switches.writeProtection}
                onChange={(event) => change({ writeProtection: event.target.checked })}
              />
              <span
                className={`${styles.switch} ${switches.writeProtection ? styles.switchOn : ''}`}
                aria-hidden="true"
              />
            </label>

            <label className={styles.control}>
              <span>
                <span className={styles.controlName}>Modellanbieter erreichbar</span>
                <span className={styles.controlHint}>Ausfall zeigt den Fallback</span>
              </span>
              <input
                type="checkbox"
                className="visually-hidden"
                checked={switches.modelReachable}
                onChange={(event) => change({ modelReachable: event.target.checked })}
              />
              <span
                className={`${styles.switch} ${switches.modelReachable ? styles.switchOn : ''}`}
                aria-hidden="true"
              />
            </label>

            <label className={styles.control}>
              <span>
                <span className={styles.controlName}>Rate Limit erreicht</span>
                <span className={styles.controlHint}>Kontingent pro Mandant</span>
              </span>
              <input
                type="checkbox"
                className="visually-hidden"
                checked={switches.rateLimitReached}
                onChange={(event) => change({ rateLimitReached: event.target.checked })}
              />
              <span
                className={`${styles.switch} ${switches.rateLimitReached ? styles.switchOn : ''}`}
                aria-hidden="true"
              />
            </label>

            <div className={`${styles.control} ${styles.controlStacked}`}>
              <span>
                <span className={styles.controlName}>Rolle</span>
                <span className={styles.controlHint}>Kontext des Laufs</span>
              </span>
              <div className={styles.roleGroup} role="radiogroup" aria-label="Rolle">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    role="radio"
                    aria-checked={switches.role === role.value}
                    className={`${styles.roleOption} ${
                      switches.role === role.value ? styles.roleOptionActive : ''
                    }`}
                    onClick={() => change({ role: role.value })}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.run}>
              <Button variant="primary" icon={faPlay} iconPosition="start" onClick={run}>
                {isRunning ? 'Läuft …' : 'Agentenlauf starten'}
              </Button>
            </div>
          </div>

          <div>
            <ol className={styles.pipeline} role="list">
              {stages.map((stage, index) => {
                const result = resultFor(stage.key);
                const isNext = isRunning && index === visibleCount;
                return (
                  <li
                    key={stage.key}
                    className={[
                      styles.stage,
                      result && styles.reached,
                      result && styles[result.verdict],
                      isNext && styles.running,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className={styles.node} aria-hidden="true" />
                    <span className={styles.stageName}>{stage.name}</span>
                    <span className={styles.stageRole}>{stage.role}</span>
                    {result && <span className={styles.stageMessage}>{result.message}</span>}
                  </li>
                );
              })}
            </ol>

            {/*
              `role="status"` statt `alert`: Das Ergebnis folgt einer bewussten
              Handlung, es unterbricht nichts. Ohne diese Auszeichnung bliebe
              der Ausgang des Laufs für Screenreader stumm — die Farben der
              Knoten sagen dort nichts.
            */}
            {finished && (
              <p className={styles.verdict} role="status">
                <span className={styles.verdictKey}>
                  {blocked ? 'Lauf gestoppt' : 'Lauf vollständig durchgelaufen'}
                </span>
                {blocked
                  ? blocked.message
                  : 'Alle Prüfungen bestanden, Änderungen geschrieben und protokolliert. Genau dieser Zustand ist im echten System die Ausnahme und nicht der Normalfall. Der Schreibschutz ist dort standardmäßig aktiv.'}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
