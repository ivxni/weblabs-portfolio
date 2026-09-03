import Image from 'next/image';
import styles from './HeroBrandObject.module.scss';

const layers = Array.from({ length: 7 }, (_, index) => index + 1);

export function HeroBrandObject() {
  return (
    <figure className={styles.figure} aria-label="WebLabs Markenobjekt">
      <div className={styles.object} aria-hidden="true">
        <div className={styles.depthStack}>
          {layers.map((layer) => (
            <span
              className={styles.depthLayer}
              data-layer={layer}
              key={layer}
            />
          ))}
          <Image
            src="/brand/weblabs-mark-light.svg"
            alt=""
            width={309}
            height={189}
            className={styles.primaryMark}
            priority
          />
        </div>
        <span className={styles.light} />
      </div>

      <figcaption>
        <span>Independent engineering practice</span>
        <span>Ludwigsburg / Remote</span>
      </figcaption>
    </figure>
  );
}
