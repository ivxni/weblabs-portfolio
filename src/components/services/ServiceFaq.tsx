'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './ServiceFaq.module.scss';

interface FaqEntry {
  question: string;
  answer: string;
}

export function ServiceFaq({ entries }: { entries: readonly FaqEntry[] }) {
  return (
    <Accordion.Root className={styles.faq} type="single" collapsible>
      {entries.map((entry, index) => (
        <Accordion.Item className={styles.item} value={`faq-${index}`} key={entry.question}>
          <Accordion.Header>
            <Accordion.Trigger className={styles.trigger}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{entry.question}</strong>
              <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            <div><p>{entry.answer}</p></div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
