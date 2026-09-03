import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VectorChat } from './VectorChat';

const nativeFetch = globalThis.fetch;

describe('Vector Portfolio Assistenz', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', nativeFetch);
    localStorage.clear();
  });

  it('öffnet als zugänglicher Dialog mit klaren Startfragen', async () => {
    render(<VectorChat />);

    await userEvent.click(screen.getByRole('button', { name: 'Vector öffnen' }));

    expect(screen.getByRole('dialog', { name: 'Vector' })).toBeInTheDocument();
    expect(screen.getByText('Portfoliowissen von Can Cadirci')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Welche Leistungen bietet Can an?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vector schließen' })).toBeInTheDocument();
  });

  it('sendet eine Startfrage und zeigt Antwort mit geprüfter Quelle', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: true,
            answer: 'Can entwickelt individuelle Webanwendungen und KI Funktionen.',
            sources: [
              { title: 'Individuelle Softwareentwicklung', section: 'Leistung', url: '/leistungen/individuelle-softwareentwicklung' },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
    render(<VectorChat />);
    await userEvent.click(screen.getByRole('button', { name: 'Vector öffnen' }));
    await userEvent.click(screen.getByRole('button', { name: 'Welche Leistungen bietet Can an?' }));

    expect(await screen.findByText(/individuelle Webanwendungen/)).toBeInTheDocument();
    expect(screen.getByText('Geprüfte Seiten')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Individuelle Softwareentwicklung/ })).toHaveAttribute(
      'href',
      '/leistungen/individuelle-softwareentwicklung',
    );
  });

  it('sendet mit Enter, aber nicht mit leerem Eingabefeld', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, answer: 'Antwort', sources: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    render(<VectorChat />);
    await userEvent.click(screen.getByRole('button', { name: 'Vector öffnen' }));

    const input = screen.getByLabelText('Frage an Vector');
    expect(screen.getByRole('button', { name: 'Frage senden' })).toBeDisabled();
    await userEvent.type(input, 'Arbeitet Can mit Docker?{enter}');

    expect(await screen.findByText('Antwort')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('zeigt Providerfehler ohne einen Erfolg vorzutäuschen', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: false, error: 'Vector ist noch nicht konfiguriert.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    render(<VectorChat />);
    await userEvent.click(screen.getByRole('button', { name: 'Vector öffnen' }));
    await userEvent.type(screen.getByLabelText('Frage an Vector'), 'Welche KI Leistungen gibt es?');
    await userEvent.click(screen.getByRole('button', { name: 'Frage senden' }));

    expect(await screen.findByRole('status')).toHaveTextContent('noch nicht konfiguriert');
    expect(screen.queryByText('Geprüfte Seiten')).not.toBeInTheDocument();
  });

  it('speichert den Gesprächsverlauf nicht im Browser', async () => {
    render(<VectorChat />);
    await userEvent.click(screen.getByRole('button', { name: 'Vector öffnen' }));
    await userEvent.type(screen.getByLabelText('Frage an Vector'), 'Testentwurf');

    expect(localStorage.length).toBe(0);
  });
});
