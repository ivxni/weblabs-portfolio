/**
 * Daten für die Guardrail-Demo auf der Startseite.
 *
 * WICHTIG ZUR EHRLICHKEIT: Das ist eine schematische Nachbildung der
 * Entscheidungswege aus UnitFly, keine Verbindung zu einem laufenden System.
 * Genau so steht es auch sichtbar an der Demo. Eine Simulation als Live-System
 * auszugeben wäre die Sorte Behauptung, gegen die sich diese Seite richtet.
 *
 * Die Stationen und Gründe entsprechen den Entscheidungen, die in der
 * UnitFly-Case-Study beschrieben sind — sie sind hier nicht erfunden, sondern
 * dieselben Regeln in ausführbarer Form.
 */

export type Verdict = 'pass' | 'fallback' | 'block';

export interface DemoStage {
  key: string;
  name: string;
  /** Was diese Station tut, in einem Satz. */
  role: string;
}

export const stages: readonly DemoStage[] = [
  { key: 'analyzer', name: 'Analyzer', role: 'Wählt deterministisch die zulässigen Kandidaten aus.' },
  { key: 'limit', name: 'Rate Limit', role: 'Begrenzt Läufe pro Mandant und Zeitfenster.' },
  { key: 'model', name: 'Modell', role: 'Berät innerhalb hart begrenzter Werte und Aktionen.' },
  { key: 'role', name: 'Rollenprüfung', role: 'Prüft, ob der Kontext überhaupt schreiben darf.' },
  { key: 'writeback', name: 'Write-back', role: 'Der einzige schreibende Pfad. Hier greift der Schreibschutz.' },
  { key: 'audit', name: 'Audit', role: 'Hält fest, was warum passiert ist.' },
];

export interface DemoSwitches {
  /** Standardmäßig aktiv — so ist es im echten System auch. */
  writeProtection: boolean;
  role: 'betrachter' | 'redakteur' | 'admin';
  rateLimitReached: boolean;
  modelReachable: boolean;
}

export const defaultSwitches: DemoSwitches = {
  writeProtection: true,
  role: 'redakteur',
  rateLimitReached: false,
  modelReachable: true,
};

export interface StageResult {
  key: string;
  verdict: Verdict;
  message: string;
}

/**
 * Der Lauf. Reine Funktion ohne Zeitbezug — deshalb vollständig testbar, und
 * die Anzeige kann sie in beliebigem Tempo abspielen.
 *
 * Die Reihenfolge ist die Aussage: Das Modell kommt NACH dem Analyzer und dem
 * Rate Limit und VOR der Rollenprüfung. Es sieht nie eine ungefilterte Menge
 * und entscheidet nie, ob geschrieben wird.
 */
export function runAgent(switches: DemoSwitches): StageResult[] {
  const results: StageResult[] = [];

  results.push({
    key: 'analyzer',
    verdict: 'pass',
    message: '3 Produkte mit Marge unter Zielwert. Kandidatenmenge steht fest.',
  });

  if (switches.rateLimitReached) {
    results.push({
      key: 'limit',
      verdict: 'block',
      message: 'Kontingent erschöpft. Lauf abgebrochen, bevor Kosten entstehen.',
    });
    return results;
  }
  results.push({ key: 'limit', verdict: 'pass', message: '4 von 20 Läufen in dieser Stunde.' });

  if (switches.modelReachable) {
    results.push({
      key: 'model',
      verdict: 'pass',
      message: 'Vorschlag: −4,0 % auf 2 Produkte. Innerhalb der erlaubten Spanne von ±8 %.',
    });
  } else {
    // Der wichtigste Zustand der ganzen Demo: Ausfall heißt nicht Stillstand.
    results.push({
      key: 'model',
      verdict: 'fallback',
      message: 'Anbieter nicht erreichbar. Regelbasierter Fallback greift, Ergebnis wird als solches gekennzeichnet.',
    });
  }

  if (switches.role === 'betrachter') {
    results.push({
      key: 'role',
      verdict: 'block',
      message: 'Rolle „Betrachter" hat kein Schreibrecht. Vorschlag bleibt sichtbar, wird nicht angewendet.',
    });
    return results;
  }
  results.push({
    key: 'role',
    verdict: 'pass',
    message: `Rolle „${switches.role === 'admin' ? 'Admin' : 'Redakteur'}" darf Preise ändern.`,
  });

  if (switches.writeProtection) {
    results.push({
      key: 'writeback',
      verdict: 'block',
      message: 'Schreibschutz aktiv. Vorschlag wird zur Freigabe abgelegt, nichts wird geschrieben.',
    });
    results.push({
      key: 'audit',
      verdict: 'pass',
      message: 'Lauf, Vorschlag und Grund der Blockade protokolliert.',
    });
    return results;
  }

  results.push({
    key: 'writeback',
    verdict: 'pass',
    message: '2 Preise geschrieben. Rückweg zu Shopware bestätigt.',
  });
  results.push({
    key: 'audit',
    verdict: 'pass',
    message: 'Feldbezogene Änderungen protokolliert: alter Wert, neuer Wert, Auslöser.',
  });
  return results;
}
