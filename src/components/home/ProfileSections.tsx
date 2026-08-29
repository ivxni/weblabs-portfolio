import styles from './ProfileSections.module.scss';

const engineering = [
  ['01', 'Product interfaces', 'React · Next.js · TypeScript'],
  ['02', 'Systems & data', 'Python · FastAPI · PostgreSQL'],
  ['03', 'Reliable delivery', 'Tests · Docker · CI/CD'],
] as const;

const principles = [
  ['Problem zuerst', 'Bevor Code entsteht, stehen Systemgrenzen und Akzeptanzkriterien.'],
  ['AI unter Kontrolle', 'Modelle beraten. Kritische Entscheidungen bleiben deterministisch.'],
  ['Belege statt Claims', 'Tests, Fallbacks und nachvollziehbare Architektur statt Buzzwords.'],
] as const;

export function EngineeringSection() {
  return (
    <section className={styles.engineering} aria-labelledby="engineering-heading">
      <p className={styles.index}>01 / Engineering</p>
      <div className={styles.statement}>
        <h2 id="engineering-heading">Frontend bis Betrieb.<br /><em>Ein System.</em></h2>
        <p>Ich verbinde Oberfläche, API, Daten und Deployment — ohne an den Übergängen Verantwortung abzugeben.</p>
      </div>
      <ol className={styles.disciplines} role="list">
        {engineering.map(([number, title, stack]) => <li key={number}><span>{number}</span><strong>{title}</strong><small>{stack}</small></li>)}
      </ol>
    </section>
  );
}

export function WorkingPrinciples() {
  return (
    <section className={styles.principles} aria-labelledby="principles-heading">
      <p className={styles.index}>04 / Arbeitsweise</p>
      <h2 id="principles-heading">AI beschleunigt.<br /><em>Ich verantworte.</em></h2>
      <div className={styles.principleList}>
        {principles.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  );
}
