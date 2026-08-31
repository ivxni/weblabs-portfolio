'use client';

import { useId, useState, type FormEvent } from 'react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';
import {
  collectFieldErrors,
  contactSchema,
  type ContactFieldErrors,
} from '@/lib/contact-schema';
import { contact } from '@/content/site';
import styles from './ContactForm.module.scss';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'failed'; message: string; showMailto: boolean };

interface ApiResponse {
  ok: boolean;
  error?: string;
  mailtoFallback?: boolean;
  fieldErrors?: ContactFieldErrors;
}

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<ContactFieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form));

    // Clientseitige Prüfung ist Komfort — sie spart einen Rundlauf und zeigt
    // Fehler sofort am Feld. Verlassen kann man sich nur auf die Prüfung im
    // Route Handler, die dasselbe Schema verwendet.
    const candidate = { ...raw, privacy: raw.privacy === 'on' };
    const parsed = contactSchema.safeParse(candidate);
    if (!parsed.success) {
      setErrors(collectFieldErrors(parsed.error));
      setStatus({ kind: 'idle' });
      return;
    }

    setErrors({});
    setStatus({ kind: 'sending' });

    try {
      const response = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as ApiResponse;

      // Erfolg gilt NUR, wenn der Server ihn bestätigt hat. Ein `response.ok`
      // ohne Prüfung des Rumpfes würde auch einen 200 mit `ok: false` als
      // gesendet anzeigen.
      if (response.ok && result.ok) {
        setStatus({ kind: 'sent' });
        form.reset();
        return;
      }

      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        setStatus({ kind: 'idle' });
        return;
      }

      setStatus({
        kind: 'failed',
        message: result.error ?? 'Die Nachricht konnte nicht gesendet werden.',
        showMailto: result.mailtoFallback === true,
      });
    } catch {
      setStatus({
        kind: 'failed',
        message: 'Die Verbindung zum Server ist fehlgeschlagen. Die Nachricht wurde nicht gesendet.',
        showMailto: true,
      });
    }
  }

  const fieldProps = (name: keyof ContactFieldErrors) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
    className: `${styles.input} ${errors[name] ? styles.inputInvalid : ''}`,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-name`}>
            Name
          </label>
          <input {...fieldProps('name')} type="text" autoComplete="name" required />
          {errors.name && (
            <p className={styles.error} id={`${id}-name-error`}>
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-email`}>
            E-Mail
          </label>
          <input {...fieldProps('email')} type="email" autoComplete="email" required />
          {errors.email && (
            <p className={styles.error} id={`${id}-email-error`}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-company`}>
            Unternehmen <span className={styles.optional}>(optional)</span>
          </label>
          <input {...fieldProps('company')} type="text" autoComplete="organization" />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-topic`}>
            Projekt oder Thema
          </label>
          <input {...fieldProps('topic')} type="text" required />
          {errors.topic && (
            <p className={styles.error} id={`${id}-topic-error`}>
              {errors.topic}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${id}-message`}>
          Nachricht
        </label>
        <textarea
          {...fieldProps('message')}
          className={`${styles.textarea} ${errors.message ? styles.inputInvalid : ''}`}
          rows={7}
          required
        />
        {errors.message && (
          <p className={styles.error} id={`${id}-message-error`}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Honigtopf: unsichtbar, nicht fokussierbar, für Screenreader nicht vorhanden. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website (bitte leer lassen)</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.consent}>
        <input
          className={styles.checkbox}
          type="checkbox"
          id={`${id}-privacy`}
          name="privacy"
          required
        />
        <label htmlFor={`${id}-privacy`}>
          Ich habe den{' '}
          <a href="/datenschutz" className={styles.consentLink}>
            Datenschutzhinweis
          </a>{' '}
          gelesen. Meine Angaben werden ausschließlich zur Beantwortung dieser Anfrage
          verwendet.
        </label>
      </div>
      {errors.privacy && <p className={styles.error}>{errors.privacy}</p>}

      {/*
        `role="status"` statt `role="alert"`: Die Meldung erscheint als Folge
        einer bewussten Handlung, sie unterbricht nichts. `aria-live="polite"`
        sorgt dafür, dass sie angesagt wird, sobald der Screenreader Luft hat.
      */}
      {status.kind === 'sent' && (
        <p className={`${styles.feedback} ${styles.feedbackSuccess}`} role="status">
          Ihre Nachricht ist angekommen. Ich antworte in der Regel innerhalb eines Werktags.
        </p>
      )}

      {status.kind === 'failed' && (
        <div className={`${styles.feedback} ${styles.feedbackError}`} role="status">
          <p>{status.message}</p>
          {status.showMailto && (
            <p>
              Direkter Weg:{' '}
              <a href={`mailto:${contact.email}`} className={styles.feedbackLink}>
                {contact.email}
              </a>
            </p>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          icon={faPaperPlane}
          iconPosition="start"
          disabled={status.kind === 'sending'}
        >
          {status.kind === 'sending' ? 'Wird gesendet …' : 'Nachricht senden'}
        </Button>
      </div>
    </form>
  );
}
