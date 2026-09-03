import { vectorKnowledge, type VectorKnowledgeDocument } from './knowledge';

const STOP_WORDS = new Set([
  'aber', 'auch', 'am', 'an', 'auf', 'aus', 'bei', 'das', 'dem', 'den', 'der', 'die', 'ein', 'eine', 'einer',
  'eines', 'für', 'hat', 'ich', 'ist', 'kann', 'machen', 'man', 'mit', 'nach', 'oder', 'sich',
  'er', 'im', 'in', 'sie', 'sind', 'und', 'von', 'vor', 'was', 'welche', 'wie', 'wird', 'zu', 'zum', 'zur',
  'about', 'and', 'can', 'does', 'for', 'from', 'how', 'is', 'of', 'the', 'to', 'what', 'with',
]);

const SYNONYM_GROUPS = [
  ['ai', 'ki', 'künstliche', 'intelligenz', 'llm'],
  ['webseite', 'website', 'web', 'homepage'],
  ['leistung', 'leistungen', 'service', 'services'],
  ['kosten', 'preis', 'budget', 'angebot'],
  ['dauer', 'zeitplan', 'zeit', 'deadline'],
  ['arbeit', 'arbeitsweise', 'prozess', 'vorgehen'],
  ['erfahrung', 'praxis', 'berufserfahrung', 'laufbahn'],
  ['security', 'sicherheit', 'reverse', 'kernel'],
  ['kontakt', 'anfrage', 'anfragen', 'zusammenarbeit', 'beauftragen'],
] as const;

export interface VectorSearchResult extends VectorKnowledgeDocument {
  score: number;
}

export function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(value: string): string[] {
  return normalizeText(value)
    .split(/[\s/.,+-]+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function concepts(queryTokens: string[]): Array<Set<string>> {
  return queryTokens.map((token) => {
    const group = SYNONYM_GROUPS.find((candidate) => candidate.includes(token as never));
    return new Set(group ?? [token]);
  });
}

function trigrams(value: string): Set<string> {
  const compact = normalizeText(value).replace(/\s+/g, ' ');
  const result = new Set<string>();
  for (let index = 0; index < compact.length - 2; index += 1) result.add(compact.slice(index, index + 3));
  return result;
}

function dice(left: Set<string>, right: Set<string>): number {
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  for (const item of left) if (right.has(item)) overlap += 1;
  return (2 * overlap) / (left.size + right.size);
}

export function retrieveKnowledge(query: string, limit = 4): VectorSearchResult[] {
  const normalizedQuery = normalizeText(query);
  const queryTokens = tokens(query);
  const queryConcepts = concepts(queryTokens);
  if (normalizedQuery.length < 2 || queryConcepts.length === 0) return [];
  const queryTrigrams = trigrams(normalizedQuery);

  return vectorKnowledge
    .map((document) => {
      const title = normalizeText(`${document.title} ${document.section}`);
      const keywordText = normalizeText(document.keywords.join(' '));
      const body = normalizeText(document.text);
      const documentTokens = new Set(tokens(`${title} ${keywordText} ${body}`));
      let matches = 0;
      let titleMatches = 0;
      for (const concept of queryConcepts) {
        if ([...concept].some((term) => documentTokens.has(term))) matches += 1;
        if ([...concept].some((term) => title.includes(term) || keywordText.includes(term))) {
          titleMatches += 1;
        }
      }
      const lexical = matches / Math.max(2, Math.min(queryConcepts.length, 8));
      const titleBoost = titleMatches / Math.max(2, queryConcepts.length);
      const phraseBoost = body.includes(normalizedQuery) || keywordText.includes(normalizedQuery) ? 0.35 : 0;
      const fuzzy = dice(queryTrigrams, trigrams(`${title} ${keywordText}`));
      const score = (lexical * 0.58 + titleBoost * 0.23 + fuzzy * 0.12 + phraseBoost) * (document.priority ?? 1);
      return { ...document, score };
    })
    .filter((document) => document.score >= 0.16)
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.max(1, Math.min(limit, 6)));
}
