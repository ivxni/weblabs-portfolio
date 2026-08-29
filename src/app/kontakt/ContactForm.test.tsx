import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

/**
 * Der wichtigste Test der Seite.
 *
 * Ein Kontaktformular, das Erfolg meldet, ohne dass die Nachricht angekommen
 * ist, kostet eine Bewerbung — und man merkt es nie. Deshalb prüfen die Tests
 * hier vor allem, WANN „gesendet" angezeigt wird und wann eben nicht.
 */

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText('Name'), 'Anna Beispiel');
  await userEvent.type(screen.getByLabelText('E-Mail'), 'anna@example.com');
  await userEvent.type(screen.getByLabelText(/Rolle oder Thema/), 'Fullstack Engineer');
  await userEvent.type(
    screen.getByLabelText('Nachricht'),
    'Wir suchen Verstärkung im Produktteam und würden uns gern austauschen.',
  );
  await userEvent.click(screen.getByLabelText(/Datenschutzhinweis/));
}

describe('Kontaktformular', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('benennt jedes Feld mit einem verknüpften Label', () => {
    // Ein Formular ohne Labels ist per Screenreader nicht ausfüllbar.
    render(<ContactForm />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('E-Mail')).toBeInTheDocument();
    expect(screen.getByLabelText(/Unternehmen/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rolle oder Thema/)).toBeInTheDocument();
    expect(screen.getByLabelText('Nachricht')).toBeInTheDocument();
  });

  it('sendet nichts ab, wenn Pflichtfelder fehlen', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<ContactForm />);
    await userEvent.click(screen.getByRole('button', { name: /Nachricht senden/ }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(await screen.findByText(/Bitte geben Sie Ihren Namen an\./)).toBeInTheDocument();
  });

  it('verknüpft die Fehlermeldung mit dem Feld', async () => {
    vi.stubGlobal('fetch', vi.fn());
    render(<ContactForm />);
    await userEvent.click(screen.getByRole('button', { name: /Nachricht senden/ }));

    const nameField = screen.getByLabelText('Name');
    expect(nameField).toHaveAttribute('aria-invalid', 'true');
    // Ohne `aria-describedby` wird die Meldung beim Fokussieren nicht angesagt
    // und ist damit nur für Sehende vorhanden.
    const describedBy = nameField.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(/Namen/);
  });

  it('meldet Erfolg nur, wenn der Server ihn bestätigt', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }),
    );

    render(<ContactForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Nachricht senden/ }));

    expect(await screen.findByRole('status')).toHaveTextContent(/ist angekommen/);
  });

  it('meldet KEINEN Erfolg bei HTTP 200 mit ok:false', async () => {
    // Der heimtückischste Fall: Der Server antwortet mit 200, sagt im Rumpf
    // aber, dass nichts versendet wurde. Wer nur `response.ok` prüft, zeigt
    // hier eine grüne Bestätigung an.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: false, error: 'Versand nicht konfiguriert.' }),
      }),
    );

    render(<ContactForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Nachricht senden/ }));

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Versand nicht konfiguriert.');
    expect(status).not.toHaveTextContent(/ist angekommen/);
  });

  it('bietet den Mailto-Weg an, wenn der Versand nicht möglich ist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          ok: false,
          error: 'Der E-Mail-Versand ist auf diesem Server nicht konfiguriert.',
          mailtoFallback: true,
        }),
      }),
    );

    render(<ContactForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Nachricht senden/ }));

    const link = await screen.findByRole('link', { name: /can\.cadirci02@outlook\.com/ });
    expect(link).toHaveAttribute('href', 'mailto:can.cadirci02@outlook.com');
  });

  it('behandelt einen Netzwerkfehler als Fehlschlag, nicht als Erfolg', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    render(<ContactForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Nachricht senden/ }));

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent(/nicht gesendet/);
  });

  it('übernimmt feldbezogene Fehler des Servers', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ ok: false, fieldErrors: { email: 'Diese Domain wird blockiert.' } }),
      }),
    );

    render(<ContactForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Nachricht senden/ }));

    expect(await screen.findByText('Diese Domain wird blockiert.')).toBeInTheDocument();
  });

  it('sperrt den Knopf während des Sendens gegen Doppelklicks', async () => {
    let release: (value: unknown) => void = () => {};
    const pending = new Promise((resolve) => {
      release = resolve;
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        await pending;
        return { ok: true, json: async () => ({ ok: true }) };
      }),
    );

    render(<ContactForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Nachricht senden/ }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Wird gesendet/ })).toBeDisabled();
    });
    release(null);
  });

  it('hält den Honigtopf vor Screenreadern und der Tastatur verborgen', async () => {
    render(<ContactForm />);
    // Nicht im Zugänglichkeitsbaum: `queryByRole` folgt `aria-hidden`,
    // `queryByLabelText` täte das nicht und würde das Feld trotzdem finden.
    expect(screen.queryByRole('textbox', { name: /bitte leer lassen/i })).toBeNull();

    // Vorhanden im DOM — Bots sollen es ja ausfüllen —, aber per Tab nicht
    // erreichbar, damit niemand versehentlich hineinschreibt.
    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
