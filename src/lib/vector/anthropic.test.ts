import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateVectorAnswer, VECTOR_MODEL, VectorProviderError } from './anthropic';
import type { VectorSearchResult } from './retrieval';

const context: VectorSearchResult[] = [
  {
    id: 'test',
    title: 'Web <Entwicklung>',
    section: 'Leistung',
    url: '/leistungen/webentwicklung',
    text: 'Can entwickelt Next.js Anwendungen & APIs.',
    keywords: ['Next.js'],
    score: 1,
  },
];

describe('Anthropic Client für Vector', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('hält Schlüssel und Modell serverseitig und maskiert Kontext als XML', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'secret-test-key');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: 'text', text: '  Klare Antwort.  ' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      generateVectorAnswer([{ role: 'user', content: 'Arbeitet Can mit Next.js?' }], context),
    ).resolves.toBe('Klare Antwort.');

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(options.body));
    expect(body.model).toBe(VECTOR_MODEL);
    expect(body.system).toContain('Web &lt;Entwicklung&gt;');
    expect(body.system).toContain('Anwendungen &amp; APIs');
    expect(JSON.stringify(body)).not.toContain('secret-test-key');
  });

  it('wiederholt vorübergehende Providerfehler genau einmal', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ content: [{ type: 'text', text: 'Erholt.' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      generateVectorAnswer([{ role: 'user', content: 'Next.js?' }], context),
    ).resolves.toBe('Erholt.');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('liefert ohne API Schlüssel einen klar typisierten Konfigurationsfehler', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');

    await expect(
      generateVectorAnswer([{ role: 'user', content: 'Next.js?' }], context),
    ).rejects.toMatchObject({
      name: VectorProviderError.name,
      kind: 'configuration',
    });
  });
});
