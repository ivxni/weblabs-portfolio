import { NextResponse, type NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateVectorAnswer, VectorProviderError } from '@/lib/vector/anthropic';
import { retrieveKnowledge } from '@/lib/vector/retrieval';
import { vectorRequestSchema } from '@/lib/vector/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LIMIT = 12;
const GLOBAL_LIMIT = 180;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 12_000;
const NO_STORE = { 'Cache-Control': 'no-store' };

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const address = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unbekannt';
  return `vector:${address}`;
}

function fallbackResponse() {
  return NextResponse.json(
    {
      ok: true,
      answer:
        'Dazu finde ich im öffentlichen Portfolio keine belastbare Information. Vector beantwortet nur Fragen zu Can Cadirci, WebLabs und den veröffentlichten Leistungen. Für eine konkrete Einschätzung können Sie Can direkt kontaktieren.',
      sources: [{ title: 'Projektanfrage und Zusammenarbeit', section: 'Kontakt', url: '/kontakt' }],
    },
    { headers: NO_STORE },
  );
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'Die Anfrage ist zu groß.' },
      { status: 413, headers: NO_STORE },
    );
  }

  // Das globale Fenster begrenzt die Providerkosten auch dann, wenn jemand
  // Absenderadressen oder Proxy Header wechselt. Das zweite Fenster schützt
  // normale Besucher davor, dass ein einzelner Absender das Kontingent nutzt.
  const globalLimit = checkRateLimit('vector:global', GLOBAL_LIMIT, WINDOW_MS);
  const clientLimit = checkRateLimit(clientKey(request), LIMIT, WINDOW_MS);
  if (!globalLimit.allowed || !clientLimit.allowed) {
    const retryAfter = Math.max(globalLimit.retryAfter, clientLimit.retryAfter);
    return NextResponse.json(
      {
        ok: false,
        error: 'Zu viele Fragen in kurzer Zeit. Bitte versuchen Sie es später erneut.',
      },
      { status: 429, headers: { ...NO_STORE, 'Retry-After': String(retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Ungültige Anfrage.' },
      { status: 400, headers: NO_STORE },
    );
  }

  const parsed = vectorRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Nachricht.' },
      { status: 422, headers: NO_STORE },
    );
  }

  const question = parsed.data.messages.at(-1)?.content ?? '';
  const context = retrieveKnowledge(question, 4);
  if (context.length === 0) return fallbackResponse();

  try {
    const answer = await generateVectorAnswer(parsed.data.messages, context);
    return NextResponse.json(
      {
        ok: true,
        answer,
        sources: context.map(({ title, section, url }) => ({ title, section, url })),
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    if (error instanceof VectorProviderError) {
      // Auch der erwartete Fehlerfall wird protokolliert. Vorher wurde er
      // still an den Browser durchgereicht — im Serverlog stand dann nichts,
      // und ein Ausfall liess sich nur durch Raten eingrenzen.
      console.error(
        `[vector] Anbieterfehler (${error.kind}${error.status ? ` ${error.status}` : ''}): ${error.detail ?? error.message}`,
      );
      const status = error.kind === 'configuration' ? 503 : error.kind === 'timeout' ? 504 : 502;
      return NextResponse.json(
        { ok: false, error: error.message },
        { status, headers: NO_STORE },
      );
    }

    console.error('[vector] Unerwarteter Fehler:', error);
    return NextResponse.json(
      { ok: false, error: 'Vector konnte die Anfrage nicht beantworten.' },
      { status: 500, headers: NO_STORE },
    );
  }
}
