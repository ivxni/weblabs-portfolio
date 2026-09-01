'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { aiPractice } from '@/content/home';
import styles from './AIDeliveryDemo.module.scss';

export function AIDeliveryDemo() {
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setProgress(aiPractice.gates.length);
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((current) => (current >= aiPractice.gates.length ? 0 : current + 1));
    }, 1100);

    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div className={styles.demo} aria-label="Simulierter AI-assisted-Engineering-Workflow">
      <div className={styles.ambient} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.identity}><span aria-hidden="true">AI</span><p>CONTROLLED DELIVERY</p></div>
        <div className={styles.runtime}><i aria-hidden="true" /> HUMAN IN THE LOOP</div>
      </header>

      <div className={styles.contract}>
        <div className={styles.contractHead}><span>PROMPT CONTRACT</span><b>SPEC / 01</b></div>
        <dl>
          <div><dt>OBJECTIVE</dt><dd>Production-ready feature</dd></div>
          <div><dt>CONSTRAINTS</dt><dd>Typed boundaries · minimal diff</dd></div>
          <div><dt>DONE WHEN</dt><dd>Tested · responsive · deployable</dd></div>
        </dl>
      </div>

      <ol className={styles.gates} role="list">
        {aiPractice.gates.map((gate, index) => {
          const complete = index < progress;
          const active = index === progress;

          return (
            <li
              key={gate.label}
              className={complete ? styles.complete : active ? styles.active : undefined}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><strong>{gate.label}</strong><small>{gate.detail}</small></div>
              <i>{complete ? 'PASS' : active ? 'RUN' : 'WAIT'}</i>
            </li>
          );
        })}
      </ol>

      <footer className={styles.footer}>
        <span>TOOLCHAIN</span>
        <div>{aiPractice.tools.map((tool) => <i key={tool}>{tool}</i>)}</div>
        <b>NO AUTO-MERGE</b>
      </footer>
    </div>
  );
}
