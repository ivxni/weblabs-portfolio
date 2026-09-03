import { describe, expect, it } from 'vitest';
import { vectorKnowledge } from './knowledge';

describe('öffentliche Vector Wissensbasis', () => {
  it('enthält keine internen Produktnamen oder operativen Security Details', () => {
    const serialized = JSON.stringify(vectorKnowledge).toLocaleLowerCase('de-DE');
    const excludedTerms = [
      'moonlight',
      'aimbot',
      'spooflight',
      'lnvmsrio',
      'pcileech',
      'kdmapper',
      'iommu bypass',
      'cve-2025-8061',
    ];

    for (const term of excludedTerms) expect(serialized).not.toContain(term);
  });

  it('verweist ausschließlich auf Seiten des Portfolios', () => {
    for (const document of vectorKnowledge) expect(document.url).toMatch(/^\//);
  });

  it('liefert für jedes Dokument Quellenmetadaten und Suchbegriffe', () => {
    for (const document of vectorKnowledge) {
      expect(document.title.length).toBeGreaterThan(3);
      expect(document.section.length).toBeGreaterThan(2);
      expect(document.text.length).toBeGreaterThan(80);
      expect(document.keywords.length).toBeGreaterThanOrEqual(5);
    }
  });
});
