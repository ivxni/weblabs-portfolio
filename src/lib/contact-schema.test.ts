import { describe, expect, it } from 'vitest';
import { collectFieldErrors, contactSchema } from './contact-schema';

const valid = {
  name: 'Anna Beispiel',
  email: 'anna@example.com',
  company: 'Beispiel GmbH',
  topic: 'Fullstack Engineer, Festanstellung',
  message: 'Wir suchen Verstärkung im Produktteam und würden uns gern austauschen.',
  website: '',
  privacy: true as const,
};

describe('Kontaktschema', () => {
  it('akzeptiert eine vollständige Anfrage', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('akzeptiert eine Anfrage ohne Unternehmen', () => {
    const { company: _company, ...rest } = valid;
    expect(contactSchema.safeParse(rest).success).toBe(true);
  });

  it('entfernt umgebende Leerzeichen', () => {
    const result = contactSchema.safeParse({ ...valid, name: '  Anna Beispiel  ' });
    expect(result.success && result.data.name).toBe('Anna Beispiel');
  });

  it('lehnt eine ungültige E-Mail-Adresse ab', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'anna@' });
    expect(result.success).toBe(false);
  });

  it('lehnt eine zu kurze Nachricht ab', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'Hallo' });
    expect(result.success).toBe(false);
  });

  it('verlangt den Datenschutzhinweis aktiv — keine Vorauswahl', () => {
    const result = contactSchema.safeParse({ ...valid, privacy: false });
    expect(result.success).toBe(false);
  });

  it('lehnt ab, wenn der Honigtopf ausgefüllt ist', () => {
    const result = contactSchema.safeParse({ ...valid, website: 'http://spam.example' });
    expect(result.success).toBe(false);
  });

  it('begrenzt die Nachrichtenlänge', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'a'.repeat(5001) });
    expect(result.success).toBe(false);
  });

  it('liefert höchstens eine Meldung pro Feld', () => {
    const result = contactSchema.safeParse({ ...valid, name: '', email: 'kaputt', message: '' });
    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = collectFieldErrors(result.error);
    expect(errors.name).toBeTypeOf('string');
    expect(errors.email).toBeTypeOf('string');
    expect(errors.message).toBeTypeOf('string');
    // Drei Meldungen unter einem Feld liest niemand.
    expect(Object.values(errors).every((message) => typeof message === 'string')).toBe(true);
  });

  it('formuliert Meldungen auf Deutsch und in ganzen Sätzen', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'kaputt' });
    if (result.success) throw new Error('sollte fehlschlagen');
    const errors = collectFieldErrors(result.error);
    // Keine durchgereichten englischen Standardtexte von zod.
    expect(errors.email).not.toMatch(/^(Invalid|Required|Expected)/);
    expect(errors.email).toMatch(/\.$/);
  });
});
