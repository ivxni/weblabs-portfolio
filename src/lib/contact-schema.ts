import { z } from 'zod';

/**
 * EIN Schema für Client und Server.
 *
 * Die clientseitige Prüfung ist reiner Komfort — sie spart einen Rundlauf. Die
 * serverseitige ist die einzige, die etwas garantiert. Beide teilen sich diese
 * Datei, damit die Regeln und die Fehlermeldungen nicht auseinanderlaufen: Der
 * häufigste Fehler an dieser Stelle ist ein Formular, das clientseitig etwas
 * durchlässt, was der Server dann mit einer anderen Begründung ablehnt.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Bitte geben Sie Ihren Namen an.')
    .max(120, 'Der Name ist zu lang.'),

  email: z
    .string()
    .trim()
    .min(1, 'Ohne E-Mail-Adresse kann ich nicht antworten.')
    .email('Diese E-Mail-Adresse sieht nicht gültig aus.')
    .max(200, 'Die E-Mail-Adresse ist zu lang.'),

  company: z.string().trim().max(160, 'Der Eintrag ist zu lang.').optional().or(z.literal('')),

  topic: z
    .string()
    .trim()
    .min(2, 'Bitte nennen Sie kurz Rolle oder Thema.')
    .max(160, 'Der Eintrag ist zu lang.'),

  message: z
    .string()
    .trim()
    .min(20, 'Ein paar Sätze mehr helfen mir, konkret zu antworten (mindestens 20 Zeichen).')
    .max(5000, 'Die Nachricht ist zu lang. Bitte kürzen Sie auf 5000 Zeichen.'),

  /**
   * Honigtopf. Für Menschen unsichtbar und nicht fokussierbar; Bots füllen ihn
   * aus, weil sie das DOM lesen und nicht das CSS. Bewusst statt eines CAPTCHA:
   * Ein CAPTCHA belastet jeden echten Nutzer und bringt ein Tracking-Problem
   * mit, das auf einer Seite mit dieser Angriffsfläche nicht zu rechtfertigen
   * ist.
   */
  website: z.string().max(0, 'Ungültige Anfrage.').optional().or(z.literal('')),

  /** Muss aktiv gesetzt sein — keine Vorauswahl. */
  privacy: z.literal(true, {
    errorMap: () => ({ message: 'Bitte bestätigen Sie den Datenschutzhinweis.' }),
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Feldbezogene Fehlermeldungen, wie sie das Formular anzeigt. */
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export function collectFieldErrors(error: z.ZodError<ContactInput>): ContactFieldErrors {
  const result: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== 'string') continue;
    // Nur die erste Meldung pro Feld: Drei Fehler unter einem Eingabefeld
    // liest niemand, und der erste ist fast immer der, der zählt.
    if (!(field in result)) result[field as keyof ContactInput] = issue.message;
  }
  return result;
}
