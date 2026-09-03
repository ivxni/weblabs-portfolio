import { describe, expect, it } from 'vitest';
import { retrieveKnowledge } from './retrieval';

describe('Vector Retrieval', () => {
  it.each([
    ['Welche KI Lösungen entwickelt Can?', 'ai'],
    ['Kann er eine Website mit Next.js bauen?', 'web'],
    ['Wie kann ich ein Projekt anfragen?', 'contact'],
    ['Hat Can Erfahrung mit TensorRT und Arduino?', 'vision'],
    ['Welche Berufserfahrung hat Can?', 'experience'],
    ['Wie stellt er Qualität und Tests sicher?', 'process'],
    ['Arbeitet er mit FPGA und Kernel Security?', 'security'],
    ['Hat er einen Forex Trading Bot entwickelt?', 'market'],
  ])('ordnet %s der Quelle %s zu', (question, expectedId) => {
    expect(retrieveKnowledge(question)[0]?.id).toBe(expectedId);
  });

  it('liefert für themenfremde Fragen keinen Kontext', () => {
    expect(retrieveKnowledge('Wie wird morgen das Wetter in Tokio?')).toHaveLength(0);
  });

  it('gibt nie mehr als das gesetzte Limit zurück', () => {
    expect(retrieveKnowledge('Software AI Web Projekte Erfahrung', 2)).toHaveLength(2);
  });

  it.each([
    'Welche Leistungen bietet Can an?',
    'Wie arbeitet Can mit KI?',
    'Welches Projekt passt zu meinem Vorhaben?',
  ])('findet für die sichtbare Startfrage %s belastbaren Kontext', (question) => {
    expect(retrieveKnowledge(question).length).toBeGreaterThan(0);
  });
});
