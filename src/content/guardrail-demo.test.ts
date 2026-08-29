import { describe, expect, it } from 'vitest';
import { defaultSwitches, runAgent, stages, type DemoSwitches } from './guardrail-demo';

/**
 * Die Guardrail-Demo ist der einzige Beleg auf der Seite, den ein Besucher
 * selbst ausführen kann. Wenn sie das Falsche zeigt, ist sie schlimmer als
 * keine Demo — sie widerlegt dann genau die Aussage, die sie belegen soll.
 *
 * Deshalb liegt die Entscheidungslogik als reine Funktion vor und wird hier
 * gegen die Regeln geprüft, die in der UnitFly-Case-Study beschrieben sind.
 */

const withSwitches = (patch: Partial<DemoSwitches>): DemoSwitches => ({
  ...defaultSwitches,
  ...patch,
});

const keys = (switches: DemoSwitches) => runAgent(switches).map((r) => r.key);
const verdictOf = (switches: DemoSwitches, key: string) =>
  runAgent(switches).find((r) => r.key === key)?.verdict;

describe('Agentenlauf', () => {
  it('hat den Schreibschutz standardmäßig aktiv', () => {
    // So ist es im echten System auch. Eine Demo, die mit ausgeschaltetem
    // Schutz startet, würde den umgekehrten Eindruck erzeugen.
    expect(defaultSwitches.writeProtection).toBe(true);
  });

  it('beginnt immer mit dem deterministischen Analyzer', () => {
    expect(keys(defaultSwitches)[0]).toBe('analyzer');
  });

  it('befragt das Modell NIE vor dem Analyzer', () => {
    // Die zentrale Architekturaussage: Das Modell sieht nur eine bereits
    // gefilterte Menge. Wäre die Reihenfolge vertauscht, zeigte die Demo das
    // Gegenteil dessen, was die Case-Study beschreibt.
    for (const switches of [
      defaultSwitches,
      withSwitches({ modelReachable: false }),
      withSwitches({ role: 'admin', writeProtection: false }),
    ]) {
      const order = keys(switches);
      const analyzer = order.indexOf('analyzer');
      const model = order.indexOf('model');
      if (model === -1) continue;
      expect(analyzer).toBeLessThan(model);
    }
  });

  it('lässt das Modell nie über das Schreiben entscheiden', () => {
    // Rollenprüfung und Write-back kommen NACH dem Modell.
    const order = keys(withSwitches({ writeProtection: false, role: 'admin' }));
    expect(order.indexOf('model')).toBeLessThan(order.indexOf('role'));
    expect(order.indexOf('role')).toBeLessThan(order.indexOf('writeback'));
  });

  it('stoppt bei aktivem Schreibschutz vor dem Schreiben', () => {
    expect(verdictOf(withSwitches({ role: 'admin' }), 'writeback')).toBe('block');
  });

  it('protokolliert auch einen blockierten Lauf', () => {
    // Audit ist kein Erfolgsprotokoll. Ein blockierter Lauf muss nachvollziehbar
    // bleiben, sonst weiß nach einem Fehler niemand, was das System getan hat.
    const order = keys(withSwitches({ role: 'admin' }));
    expect(order).toContain('audit');
  });

  it('bricht bei erreichtem Rate Limit ab, BEVOR das Modell befragt wird', () => {
    // Sonst entstünden Kosten für einen Lauf, der ohnehin nicht durchgeht.
    const order = keys(withSwitches({ rateLimitReached: true }));
    expect(order).not.toContain('model');
    expect(verdictOf(withSwitches({ rateLimitReached: true }), 'limit')).toBe('block');
  });

  it('fällt bei nicht erreichbarem Modell zurück, statt abzubrechen', () => {
    // Der wichtigste Zustand der Demo: Ausfall heißt nicht Stillstand.
    const switches = withSwitches({ modelReachable: false });
    expect(verdictOf(switches, 'model')).toBe('fallback');
    expect(keys(switches)).toContain('role');
  });

  it('verweigert der Rolle „Betrachter" das Schreiben', () => {
    const switches = withSwitches({ role: 'betrachter', writeProtection: false });
    expect(verdictOf(switches, 'role')).toBe('block');
    expect(keys(switches)).not.toContain('writeback');
  });

  it('schreibt nur, wenn Schutz aus UND Rolle berechtigt ist', () => {
    const allowed = withSwitches({ writeProtection: false, role: 'admin' });
    expect(verdictOf(allowed, 'writeback')).toBe('pass');

    // Jede einzelne Bedingung allein reicht nicht.
    expect(verdictOf(withSwitches({ writeProtection: false, role: 'betrachter' }), 'writeback')).toBeUndefined();
    expect(verdictOf(withSwitches({ writeProtection: true, role: 'admin' }), 'writeback')).toBe('block');
  });

  it('nennt zu jeder Station einen Grund', () => {
    // Ein Knoten ohne Begründung wäre eine Ampel, kein Beleg.
    for (const result of runAgent(defaultSwitches)) {
      expect(result.message.length, `${result.key} ohne Begründung`).toBeGreaterThan(20);
    }
  });

  it('verwendet nur Stationen, die auch angezeigt werden', () => {
    // Ein Ergebnis für eine Station, die es in der Kette nicht gibt, würde
    // stillschweigend verschluckt.
    const known = new Set(stages.map((s) => s.key));
    for (const switches of [
      defaultSwitches,
      withSwitches({ rateLimitReached: true }),
      withSwitches({ modelReachable: false }),
      withSwitches({ role: 'betrachter' }),
      withSwitches({ writeProtection: false, role: 'admin' }),
    ]) {
      for (const key of keys(switches)) expect(known.has(key), `${key} unbekannt`).toBe(true);
    }
  });
});
