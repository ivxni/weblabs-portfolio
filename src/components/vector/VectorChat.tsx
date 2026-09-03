'use client';

import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import styles from './VectorChat.module.scss';

interface VectorSource {
  title: string;
  section: string;
  url: string;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  sources?: VectorSource[];
}

interface VectorApiResponse {
  ok: boolean;
  answer?: string;
  error?: string;
  sources?: VectorSource[];
}

const suggestions = [
  'Welche Leistungen bietet Can an?',
  'Wie arbeitet Can mit KI?',
  'Welches Projekt passt zu meinem Vorhaben?',
] as const;

function VectorMark({ compact = false, working = false }: { compact?: boolean; working?: boolean }) {
  return (
    <span className={compact ? styles.markCompact : styles.mark} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M4 24C9 24 12 20 15 15.5S21 7 26 7"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.33"
        />
        <circle cx="5.2" cy="23.6" r="2.5" fill="currentColor" opacity="0.55" />
        <g className={working ? styles.markWorking : undefined}>
          <circle cx="24.6" cy="8.2" r="6.2" fill="currentColor" opacity="0.15" />
          <circle cx="24.6" cy="8.2" r="4" fill="currentColor" />
        </g>
      </svg>
    </span>
  );
}

export function VectorChat() {
  const textareaId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const nextId = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [messages, pending, error]);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  async function send(content: string) {
    const question = content.trim();
    if (!question || pending) return;

    const userMessage: ChatMessage = { id: nextId.current++, role: 'user', content: question };
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setDraft('');
    setError('');
    setPending(true);

    try {
      const response = await fetch('/api/vector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation.slice(-8).map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });
      const result = (await response.json()) as VectorApiResponse;

      if (!response.ok || !result.ok || !result.answer) {
        setError(result.error ?? 'Vector konnte die Frage gerade nicht beantworten.');
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: 'assistant',
          content: result.answer!,
          sources: result.sources,
        },
      ]);
    } catch {
      setError('Die Verbindung zu Vector ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void send(draft);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <Dialog.Trigger asChild>
        <button
          className={styles.trigger}
          type="button"
          aria-label={open ? 'Vector schließen' : 'Vector öffnen'}
          aria-expanded={open}
        >
          {open ? (
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          ) : (
            <>
              <VectorMark compact />
              <span className={styles.triggerLabel}>Fragen?</span>
            </>
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content className={styles.dialog} aria-describedby="vector-description">
          <header className={styles.header}>
            <div className={styles.identity}>
              <VectorMark working={pending} />
              <div>
                <Dialog.Title className={styles.title}>Vector</Dialog.Title>
                <Dialog.Description className={styles.description} id="vector-description">
                  Portfoliowissen von Can Cadirci
                </Dialog.Description>
              </div>
            </div>
          </header>

          <div className={styles.transcript} aria-live="polite" aria-busy={pending}>
            {messages.length === 0 ? (
              <div className={styles.intro}>
                <div className={`${styles.bubble} ${styles.assistantBubble}`}>
                  Ich kenne Cans Leistungen, Projekte und Arbeitsweise. Wobei kann ich Ihnen helfen?
                </div>
                <p className={styles.suggestionsLabel}>Häufige Fragen</p>
                <div className={styles.suggestions}>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      className={styles.suggestion}
                      type="button"
                      aria-label={suggestion}
                      onClick={() => void send(suggestion)}
                    >
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ol className={styles.messages}>
                {messages.map((message) => (
                  <li
                    className={`${styles.message}${message.role === 'user' ? ` ${styles.userMessage}` : ''}`}
                    key={message.id}
                  >
                    <span className={styles.role}>{message.role === 'user' ? 'Sie' : 'Vector'}</span>
                    <div className={`${styles.bubble} ${message.role === 'user' ? styles.userBubble : styles.assistantBubble}`}>
                      <p>{message.content}</p>
                      {message.sources && message.sources.length > 0 && (
                        <div className={styles.sources}>
                          <span className={styles.sourcesLabel}>Geprüfte Seiten</span>
                          <ul>
                            {message.sources.map((source) => (
                              <li key={`${source.url}-${source.title}`}>
                                <Link href={source.url} onClick={() => setOpen(false)}>
                                  <span>{source.title}</span>
                                  <span aria-hidden="true">↗</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {pending && (
              <div className={styles.searching} role="status">
                <span className={styles.srOnly}>Vector sucht im Portfolio</span>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </div>
            )}

            {error && <p className={styles.error} role="status">{error}</p>}
            <div ref={endRef} />
          </div>

          <form className={styles.composer} onSubmit={handleSubmit}>
            <label className={styles.srOnly} htmlFor={textareaId}>Frage an Vector</label>
            <textarea
              ref={textareaRef}
              id={textareaId}
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, 1200))}
              onKeyDown={handleKeyDown}
              placeholder="Frage zum Portfolio"
              rows={1}
              maxLength={1200}
              disabled={pending}
            />
            <button
              type="submit"
              disabled={pending || draft.trim().length === 0}
              aria-label="Frage senden"
            >
              Senden
            </button>
          </form>

          <footer className={styles.footerNote}>
            <span>Keine vertraulichen Daten eingeben.</span>
            <Link href="/datenschutz" onClick={() => setOpen(false)}>Datenschutz</Link>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
