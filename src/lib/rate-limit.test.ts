import { beforeEach, describe, expect, it } from 'vitest';
import { checkRateLimit, resetRateLimit } from './rate-limit';

describe('Ratenbegrenzung', () => {
  beforeEach(resetRateLimit);

  const LIMIT = 3;
  const WINDOW = 60_000;

  it('lässt Anfragen bis zur Grenze durch', () => {
    for (let i = 0; i < LIMIT; i += 1) {
      expect(checkRateLimit('1.2.3.4', LIMIT, WINDOW).allowed, `Versuch ${i + 1}`).toBe(true);
    }
  });

  it('blockt die Anfrage nach der Grenze', () => {
    for (let i = 0; i < LIMIT; i += 1) checkRateLimit('1.2.3.4', LIMIT, WINDOW);
    const result = checkRateLimit('1.2.3.4', LIMIT, WINDOW);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('zählt getrennt pro Absender', () => {
    for (let i = 0; i < LIMIT; i += 1) checkRateLimit('1.1.1.1', LIMIT, WINDOW);
    expect(checkRateLimit('1.1.1.1', LIMIT, WINDOW).allowed).toBe(false);
    // Ein anderer Absender darf davon nichts merken — sonst sperrt ein
    // einzelner Bot das Formular für alle.
    expect(checkRateLimit('2.2.2.2', LIMIT, WINDOW).allowed).toBe(true);
  });

  it('gibt nach Ablauf des Fensters wieder frei', () => {
    const start = 1_000_000;
    for (let i = 0; i < LIMIT; i += 1) checkRateLimit('1.2.3.4', LIMIT, WINDOW, start);
    expect(checkRateLimit('1.2.3.4', LIMIT, WINDOW, start).allowed).toBe(false);
    expect(checkRateLimit('1.2.3.4', LIMIT, WINDOW, start + WINDOW + 1).allowed).toBe(true);
  });

  it('gleitet, statt an einer festen Fenstergrenze zurückzusetzen', () => {
    const start = 1_000_000;
    // Drei Anfragen, über das Fenster verteilt.
    checkRateLimit('x', LIMIT, WINDOW, start);
    checkRateLimit('x', LIMIT, WINDOW, start + 30_000);
    checkRateLimit('x', LIMIT, WINDOW, start + 50_000);
    expect(checkRateLimit('x', LIMIT, WINDOW, start + 55_000).allowed).toBe(false);

    // Nach 61 s ist nur die ERSTE verfallen — bei einem festen Fenster wären
    // hier wieder drei Anfragen auf einmal möglich.
    expect(checkRateLimit('x', LIMIT, WINDOW, start + 61_000).allowed).toBe(true);
    expect(checkRateLimit('x', LIMIT, WINDOW, start + 61_100).allowed).toBe(false);
  });

  it('meldet eine plausible Wartezeit', () => {
    const start = 1_000_000;
    for (let i = 0; i < LIMIT; i += 1) checkRateLimit('y', LIMIT, WINDOW, start);
    const result = checkRateLimit('y', LIMIT, WINDOW, start + 20_000);
    expect(result.retryAfter).toBeGreaterThan(30);
    expect(result.retryAfter).toBeLessThanOrEqual(40);
  });
});
