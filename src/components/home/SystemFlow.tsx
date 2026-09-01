import styles from './SystemFlow.module.scss';

const layers = [
  {
    number: '01',
    title: 'Interface',
    stack: 'Next.js / React / SCSS',
    result: 'Product',
  },
  {
    number: '02',
    title: 'Application',
    stack: 'TypeScript / APIs / PostgreSQL',
    result: 'Logic',
  },
  {
    number: '03',
    title: 'Intelligence',
    stack: 'Python / Vision / Agents',
    result: 'Models',
  },
  {
    number: '04',
    title: 'Delivery',
    stack: 'Docker / CI/CD / Monitoring',
    result: 'Ship',
  },
] as const;

export function SystemFlow() {
  return (
    <aside className={styles.system} aria-label="End-to-End-Systemarchitektur">
      <header className={styles.header}>
        <span>Production path / 04</span>
        <b>End to end</b>
      </header>

      <ol className={styles.layers}>
        {layers.map((layer) => (
          <li key={layer.number} className={styles.layer}>
            <span>{layer.number}</span>
            <div>
              <strong>{layer.title}</strong>
              <small>{layer.stack}</small>
            </div>
            <em>{layer.result}</em>
          </li>
        ))}
      </ol>

      <footer className={styles.footer}>
        <span>One owner</span>
        <p>Architecture / Build / Delivery</p>
      </footer>

      <i className={styles.signal} aria-hidden="true" />
    </aside>
  );
}
