import { aiPractice } from '@/content/home';
import { AIWorkflow } from './AIWorkflow';
import styles from './ProfileSections.module.scss';

export function WorkingPrinciples() {
  return (
    <section className={styles.principles} aria-labelledby="principles-heading">
      <header className={styles.principlesHeader}>
        <p className={styles.index}>Arbeitsweise</p>
        <h2 id="principles-heading">AI beschleunigt.<br />Verantwortung bleibt menschlich.</h2>
        <p className={styles.practiceLead}>
          {aiPractice.body}
        </p>
      </header>

      <div className={styles.practiceLayout}>
        <div className={styles.principleList}>
          {aiPractice.principles.map((principle, index) => (
            <article key={principle.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{principle.title}</h3><p>{principle.text}</p></div>
            </article>
          ))}
        </div>
        <AIWorkflow />
      </div>
    </section>
  );
}
