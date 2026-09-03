import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateVectorAnswer, VECTOR_MODEL, VectorProviderError, conversationWindow, buildHeaders } from './anthropic';
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

describe('conversationWindow', () => {
  const user = (content: string) => ({ role: 'user' as const, content });
  const assistant = (content: string) => ({ role: 'assistant' as const, content });

  it('beginnt nie mit einer Assistenzantwort', () => {
    // Der Auslöser des Fehlers: Bei sieben Nachrichten schnitt `slice(-6)`
    // mitten in einen Assistenz-Turn, und die Messages-API antwortete mit 400.
    const history = [
      user('1'), assistant('2'), user('3'), assistant('4'),
      user('5'), assistant('6'), user('7'),
    ];
    expect(conversationWindow(history)[0]?.role).toBe('user');
  });

  it('lässt ein bereits gültiges Fenster unverändert', () => {
    const history = [user('1'), assistant('2'), user('3')];
    expect(conversationWindow(history)).toEqual(history);
  });

  it('behält höchstens sechs Nachrichten', () => {
    const history = Array.from({ length: 8 }, (_, i) =>
      i % 2 === 0 ? user(String(i)) : assistant(String(i)),
    );
    expect(conversationWindow(history).length).toBeLessThanOrEqual(6);
  });

  it('endet immer auf der Nutzerfrage', () => {
    const history = [user('1'), assistant('2'), user('3'), assistant('4'), user('5')];
    expect(conversationWindow(history).at(-1)?.role).toBe('user');
  });
});

describe('Kopfzeilen', () => {
  const originalWorkspace = process.env.ANTHROPIC_WORKSPACE_ID;

  afterEach(() => {
    if (originalWorkspace === undefined) delete process.env.ANTHROPIC_WORKSPACE_ID;
    else process.env.ANTHROPIC_WORKSPACE_ID = originalWorkspace;
  });

  it('sendet anthropic-workspace-id, wenn die Variable gesetzt ist', () => {
    process.env.ANTHROPIC_WORKSPACE_ID = 'wrkspc_test';
    expect(buildHeaders('sk-ant-test')['anthropic-workspace-id']).toBe('wrkspc_test');
  });

  it('lässt die Kopfzeile weg, wenn die Variable fehlt', () => {
    // Wichtig: Ein LEERER Header wäre bei einem gewöhnlichen, auf einen
    // Workspace ausgestellten Schlüssel selbst wieder ein Fehler. Deshalb darf
    // er nicht einfach mit leerem Wert mitgeschickt werden.
    delete process.env.ANTHROPIC_WORKSPACE_ID;
    expect(buildHeaders('sk-ant-test')).not.toHaveProperty('anthropic-workspace-id');
  });

  it('ignoriert eine Variable, die nur aus Leerzeichen besteht', () => {
    process.env.ANTHROPIC_WORKSPACE_ID = '   ';
    expect(buildHeaders('sk-ant-test')).not.toHaveProperty('anthropic-workspace-id');
  });

  it('schickt Schlüssel und API-Version immer mit', () => {
    delete process.env.ANTHROPIC_WORKSPACE_ID;
    const headers = buildHeaders('sk-ant-test');
    expect(headers['x-api-key']).toBe('sk-ant-test');
    expect(headers['anthropic-version']).toBeTruthy();
  });
});
