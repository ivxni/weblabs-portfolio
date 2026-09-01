import { NextResponse, type NextRequest } from 'next/server';
import { collectFieldErrors, contactSchema } from '@/lib/contact-schema';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Fünf Nachrichten pro Stunde und Absender. Mehr ist kein Kontakt mehr. */
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

/**
 * Hinter einem Reverse Proxy (hier: Traefik in Coolify) ist `request.ip` immer
 * die Adresse des Proxys. Ohne diese Auswertung teilten sich alle Besucher
 * einen einzigen Zähler — die Begrenzung würde nach fünf Nachrichten
 * insgesamt greifen statt nach fünf pro Absender.
 *
 * Der erste Eintrag in `x-forwarded-for` ist der ursprüngliche Client. Er ist
 * fälschbar; für eine Höflichkeitsgrenze wie diese reicht das, für eine
 * Sicherheitsentscheidung würde es nicht reichen.
 */
function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') ?? 'unbekannt';
}

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  to: string;
}

function readSmtpConfig(): SmtpConfig | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !CONTACT_TO) return null;
  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    user: SMTP_USER,
    password: SMTP_PASSWORD,
    from: SMTP_FROM,
    to: CONTACT_TO,
  };
}

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(clientKey(request), LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Zu viele Anfragen. Bitte versuchen Sie es in ${Math.ceil(limit.retryAfter / 60)} Minuten erneut oder schreiben Sie direkt eine E-Mail.`,
      },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, fieldErrors: collectFieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Der Honigtopf war ausgefüllt. Antwort ist 200 mit `ok: true`, damit ein Bot
  // nicht lernt, welches Feld ihn verraten hat — versendet wird nichts.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const smtp = readSmtpConfig();
  if (!smtp) {
    /*
     * KEIN vorgetäuschter Erfolg.
     *
     * Das ist die wichtigste Entscheidung an dieser Datei. Ohne
     * SMTP-Konfiguration gibt es keinen Weg, die Nachricht zuzustellen. Eine
     * grüne Bestätigung anzuzeigen würde bedeuten, dass jemand auf eine
     * Antwort wartet, die nie kommen kann. Stattdessen: klarer Fehler, und das
     * Formular bietet den direkten Mailto-Weg an.
     */
    return NextResponse.json(
      {
        ok: false,
        error: 'Der E-Mail-Versand ist auf diesem Server nicht konfiguriert. Die Nachricht wurde NICHT gesendet.',
        mailtoFallback: true,
      },
      { status: 503 },
    );
  }

  try {
    // Erst hier laden: Ohne SMTP-Konfiguration wird nodemailer nie geladen und
    // belastet den Kaltstart nicht.
    const { createTransport } = await import('nodemailer');
    const transport = createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.password },
    });

    await transport.sendMail({
      from: smtp.from,
      to: smtp.to,
      // Antworten geht direkt an den Absender, nicht an den Postfachbetreiber.
      replyTo: `${data.name} <${data.email}>`,
      subject: `Kontaktanfrage: ${data.topic}`,
      text: [
        `Name:       ${data.name}`,
        `E-Mail:     ${data.email}`,
        `Unternehmen:${data.company ? ` ${data.company}` : ' nicht angegeben'}`,
        `Thema:      ${data.topic}`,
        '',
        data.message,
      ].join('\n'),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Der genaue Fehler gehört ins Serverlog, nicht in die Antwort: Er kann
    // Hostnamen und Benutzernamen des Postfachs enthalten.
    console.error('[kontakt] Versand fehlgeschlagen:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Die Nachricht konnte nicht versendet werden. Bitte schreiben Sie mir direkt per E-Mail.',
        mailtoFallback: true,
      },
      { status: 502 },
    );
  }
}
