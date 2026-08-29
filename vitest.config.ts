import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      // jsdom stellt `localStorage` nur bereit, wenn das Dokument einen echten
      // Ursprung hat. Ohne diese URL ist der Ursprung „opaque" und der
      // Speicher fehlt — Tests am Theme-Umschalter scheitern dann an der
      // Umgebung statt am Code.
      jsdom: { url: 'https://web-labs.io/' },
    },
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // SCSS-Module werden im Test nicht kompiliert; Vitest liefert für
    // `styles.foo` einen Proxy, der den Schlüsselnamen zurückgibt. Damit
    // lassen sich Klassen in Tests prüfen, ohne Sass laufen zu lassen.
    css: false,
  },
});
