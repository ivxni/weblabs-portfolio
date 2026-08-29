import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

// jsdom kennt matchMedia nicht. Das Theme-System und alle
// `prefers-reduced-motion`-Abfragen rufen es aber beim Mounten auf.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// IntersectionObserver treibt die Scroll-Einblendungen und den Systemschnitt.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);

// Der Systemschnitt misst mit ResizeObserver nach, wo die aktive Schicht endet.
class ResizeObserverStub implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub);

/**
 * Node 25 stellt ein eigenes globales `localStorage` bereit, das ohne
 * Ablagedatei keine funktionierende Storage-Schnittstelle hat und jsdoms
 * Variante überschattet. Ohne diesen Ersatz scheitern die Tests am
 * Theme-Umschalter an der Umgebung statt am Code.
 *
 * Die Implementierung ist absichtlich vollständig (inkl. `key` und `length`):
 * Ein Teil-Stub verschiebt den Fehler nur auf den ersten Test, der das
 * fehlende Stück braucht.
 */
class MemoryStorage implements Storage {
  #entries = new Map<string, string>();

  get length(): number {
    return this.#entries.size;
  }

  clear(): void {
    this.#entries.clear();
  }

  getItem(key: string): string | null {
    return this.#entries.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.#entries.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#entries.set(key, String(value));
  }
}

const memoryStorage = new MemoryStorage();
Object.defineProperty(window, 'localStorage', { value: memoryStorage, writable: true });
Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, writable: true });
