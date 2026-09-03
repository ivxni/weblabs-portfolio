'use client';

import { useReducedMotion } from 'motion/react';
import { MarketSignalDemo } from '@/components/home/MarketSignalDemo';
import styles from './ProjectLiveDemo.module.scss';

export type ProjectDemoType = 'vision' | 'market';

export function ProjectLiveDemo({ type }: { type: ProjectDemoType }) {
  const reducedMotion = useReducedMotion();

  if (type === 'market') {
    return (
      <div className={styles.demo}>
        <header className={styles.header}>
          <p>Interaktive Simulation</p>
          <h2>Marktfenster und Modellprognose.</h2>
          <span>Simulierte Daten, kein Handelssignal</span>
        </header>
        <MarketSignalDemo />
      </div>
    );
  }

  return (
    <div className={styles.demo}>
      <header className={styles.header}>
        <p>Realtime Demo</p>
        <h2>Inferenz direkt im Debug-Viewport.</h2>
        <span>Technischer Ausschnitt der privaten Runtime</span>
      </header>
      <div className={styles.visionLayout}>
        <div className={styles.videoFrame}>
          <video autoPlay={!reducedMotion} muted loop playsInline preload="metadata" poster="/media/realtime-vision-demo-poster.jpg" aria-label="Debug-Viewport einer laufenden Echtzeit-Objekterkennung">
            <source src="/media/realtime-vision-demo.webm" type="video/webm" />
            <source src="/media/realtime-vision-demo.mp4" type="video/mp4" />
          </video>
          <span>Realtime inference</span>
        </div>
        <div className={styles.visionNotes}>
          <article><span>01</span><div><h3>Host Inference</h3><p>Capture, Preprocessing, YOLO-Inferenz, Confidence-Filter und NMS laufen als getrennte Pipeline-Stufen.</p></div></article>
          <article><span>02</span><div><h3>Runtime Adapter</h3><p>TensorRT, ONNX Runtime und OpenVINO bleiben hinter derselben Schnittstelle austauschbar.</p></div></article>
          <article><span>03</span><div><h3>Arduino Layer</h3><p>Strukturierte Ergebnisse werden über ein versioniertes Protokoll an die getrennte Firmware übergeben.</p></div></article>
        </div>
      </div>
    </div>
  );
}
