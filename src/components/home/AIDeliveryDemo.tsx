'use client';

import { type CSSProperties, useEffect, useState } from 'react';
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
    }, 1800);

    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const progressStyle = {
    '--workflow-progress': `${(progress / aiPractice.gates.length) * 100}%`,
  } as CSSProperties;

  return (
    <div className={styles.process} aria-label="Simulierter AI-assisted-Engineering-Workflow">
      <div className={styles.sequence} aria-hidden="true">
        {['Context', 'Plan', 'Build', 'Verify', 'Ship'].map((label, index) => (
          <span key={label} className={index === progress ? styles.currentPhase : undefined}>
            {label}
          </span>
        ))}
      </div>

      <div className={styles.progressTrack} style={progressStyle} aria-hidden="true"><i /></div>

      <div className={styles.body}>
        <div className={styles.brief}>
          <p className={styles.kicker}>Prompt structure / 01</p>
          <h3>Context is part of the code.</h3>
          <dl>
            <div><dt>Objective</dt><dd>Production-ready feature</dd></div>
            <div><dt>Constraints</dt><dd>Typed boundaries · minimal diff</dd></div>
            <div><dt>Definition of done</dt><dd>Tested · responsive · deployable</dd></div>
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
                <i aria-hidden="true">{complete ? '✓' : active ? '…' : ''}</i>
              </li>
            );
          })}
        </ol>
      </div>

      <footer className={styles.footer}>
        <span>Tools, not authors</span>
        <p>{aiPractice.tools.join(' · ')}</p>
        <b>Review before merge</b>
      </footer>
    </div>
  );
}
