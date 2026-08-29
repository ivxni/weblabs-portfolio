import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Button, LinkButton } from './Button';

describe('Button', () => {
  it('ist standardmäßig type="button"', async () => {
    // Ohne das löst jeder Knopf innerhalb eines Formulars ein Absenden aus —
    // der klassische Fehler bei einem „Abbrechen"-Knopf.
    render(<Button>Aktion</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('reicht type="submit" durch', () => {
    render(<Button type="submit">Senden</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('meldet einen Klick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Aktion</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Aktion' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('blendet das Icon vor Screenreadern aus', () => {
    // Das Icon wiederholt nur, was die Beschriftung schon sagt. Angesagt zu
    // werden hätte für einen Screenreader-Nutzer keinen Wert.
    render(<Button icon={faArrowRight}>Weiter</Button>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Weiter');
  });

  it('kann deaktiviert werden', () => {
    render(<Button disabled>Wird gesendet</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('LinkButton', () => {
  it('rendert interne Links ohne target', () => {
    render(<LinkButton href="/projekte">Projekte</LinkButton>);
    const link = screen.getByRole('link', { name: 'Projekte' });
    expect(link).toHaveAttribute('href', '/projekte');
    expect(link).not.toHaveAttribute('target');
  });

  it('sichert externe Links mit rel="noopener noreferrer"', () => {
    // Ohne `noopener` bekommt die Zielseite über `window.opener` Zugriff auf
    // diesen Tab. Das ist kein Stil, sondern eine Sicherheitsanforderung.
    render(
      <LinkButton href="https://example.com" external>
        Extern
      </LinkButton>,
    );
    const link = screen.getByRole('link', { name: 'Extern' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(link.getAttribute('rel')).toContain('noreferrer');
  });
});
