import { NextResponse } from 'next/server';

/**
 * Für den Healthcheck des Containers. Coolify und Docker fragen diesen Pfad
 * an, um zu entscheiden, ob eine neue Version übernommen wird — ohne ihn gilt
 * ein Container als gesund, sobald der Prozess läuft, auch wenn Next.js noch
 * gar nicht antwortet.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ status: 'ok', time: new Date().toISOString() });
}
