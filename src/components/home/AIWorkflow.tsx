'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { siClaude, siDocker, siGit, siOpenai } from 'simple-icons';
import { aiPractice } from '@/content/home';
import styles from './AIWorkflow.module.scss';

function BrandIcon({ icon }: { icon: { path: string; title: string } }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export function AIWorkflow() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % aiPractice.gates.length);
    }, 1700);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div className={styles.workflow} aria-label="Beispiel eines kontrollierten KI-gestützten Entwicklungsablaufs">
      <div className={styles.brief}>
        <p>Arbeitskontext</p>
        <dl>
          <div><dt>Ziel</dt><dd>Produktionsreife Funktion</dd></div>
          <div><dt>Grenzen</dt><dd>Scope, Daten und Berechtigungen</dd></div>
          <div><dt>Fertig</dt><dd>Getestet, responsiv, deploybar</dd></div>
        </dl>
      </div>

      <ol className={styles.steps} role="list">
        {aiPractice.gates.map((gate, index) => (
          <li key={gate.label} className={index === active ? styles.active : index < active ? styles.complete : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><strong>{gate.label}</strong><small>{gate.detail}</small></div>
            <i aria-hidden="true">{index < active ? '✓' : index === active ? '●' : ''}</i>
          </li>
        ))}
      </ol>

      <footer>
        <span>Werkzeuge</span>
        <div className={styles.toolLine} aria-label="Eingesetzte Entwicklungswerkzeuge">
          <span className={styles.toolMark}>
            <BrandIcon icon={siOpenai} />
            <b>Codex</b>
          </span>
          <span className={styles.toolMark}>
            <BrandIcon icon={siClaude} />
            <b>Claude</b>
          </span>
          <span className={styles.toolMark}>
            <BrandIcon icon={siGit} />
            <b>Git</b>
          </span>
          <span className={styles.toolMark}>
            <BrandIcon icon={siDocker} />
            <b>Docker</b>
          </span>
        </div>
        <strong>Review vor Merge</strong>
      </footer>
    </div>
  );
}
