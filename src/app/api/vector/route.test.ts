import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { resetRateLimit } from '@/lib/rate-limit';
import { VECTOR_MODEL } from '@/lib/vector/anthropic';
import { POST } from './route';

function request(messages: Array<{ role: 'user' | 'assistant'; content: string }>) {
  return new NextRequest('https://web-labs.io/api/vector', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.10' },
    body: JSON.stringify({ messages }),
  });
}

function oversizedRequest() {
  return new NextRequest('https://web-labs.io/api/vector', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'content-length': '12001',
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Test' }] }),
  });
}

describe('Vector API', () => {
  beforeEach(() => {
    resetRateLimit();
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('beantwortet themenfremde Fragen deterministisch ohne Cloud-Aufruf', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request([{ role: 'user', content: 'Wie wird morgen das Wetter in Tokio?' }]));
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.ok).toBe(true);
    expect(result.answer).toMatch(/öffentlichen Portfolio/);
    expect(result.sources[0].url).toBe('/kontakt');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sendet nur den kuratierten Kontext an das festgelegte Anthropic Modell', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: 'text', text: 'Can entwickelt Webanwendungen mit Next.js.' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request([{ role: 'user', content: 'Baut Can Websites mit Next.js?' }]));
    const result = await response.json();
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(options.body));

    expect(response.status).toBe(200);
    expect(result.answer).toContain('Next.js');
    expect(result.sources[0]).toMatchObject({ section: 'Leistung', url: '/leistungen/webentwicklung' });
    expect(options.headers).toMatchObject({ 'x-api-key': 'test-key' });
    expect(body.model).toBe(VECTOR_MODEL);
    expect(body.system).toContain('<portfolio_wissen>');
    expect(body.system).toContain('individuelle Unternehmenswebsites');
    expect(body.system).not.toContain('ANTHROPIC_API_KEY');
  });

  it('meldet eine fehlende Serverkonfiguration offen', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');
    const response = await POST(request([{ role: 'user', content: 'Welche KI Leistungen gibt es?' }]));
    const result = await response.json();

    expect(response.status).toBe(503);
    expect(result.error).toMatch(/nicht konfiguriert/);
  });

  it('weist zu lange Nachrichten vor dem Provider-Aufruf ab', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request([{ role: 'user', content: 'x'.repeat(1201) }]));

    expect(response.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('weist übergroße Requests vor Parsing und Provider-Aufruf ab', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(oversizedRequest());

    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('begrenzt automatisierte Serienanfragen', async () => {
    for (let index = 0; index < 12; index += 1) {
      const response = await POST(request([{ role: 'user', content: 'Wetter in Tokio?' }]));
      expect(response.status).toBe(200);
    }

    const blocked = await POST(request([{ role: 'user', content: 'Wetter in Tokio?' }]));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});
