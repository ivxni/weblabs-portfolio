'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { MarketSignalDemo } from './MarketSignalDemo';
import { SecurityLabDemo } from './SecurityLabDemo';
import styles from './FocusTabs.module.scss';

type Focus = 'web' | 'ai' | 'security';

const tabs: readonly { id: Focus; number: string; label: string }[] = [
  { id: 'web', number: '01', label: 'Web Development' },
  { id: 'ai', number: '02', label: 'KI & Agents' },
  { id: 'security', number: '03', label: 'IT Security / RE' },
];

function PanelHeader({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <header className={styles.panelHeader}>
      <p>{number} / Focus</p>
      <h3>{title}</h3>
      <p className={styles.panelLead}>{text}</p>
    </header>
  );
}

export function FocusTabs() {
  const [active, setActive] = useState<Focus>('web');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('focus');
    if (requested === 'web' || requested === 'ai' || requested === 'security') setActive(requested);
  }, []);

  const moveTab = (current: Focus, direction: -1 | 1) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === current);
    const next = tabs[(currentIndex + direction + tabs.length) % tabs.length];
    if (!next) return;
    setActive(next.id);
    window.requestAnimationFrame(() => document.getElementById(`tab-${next.id}`)?.focus());
  };

  return (
    <section className={styles.section} id="focus" aria-labelledby="focus-heading">
      <header className={styles.sectionHeader}>
        <p>Was ich entwickle</p>
        <div>
          <h2 id="focus-heading">Drei Felder.<br />Ein roter Faden.</h2>
          <p>Ich baue Systeme, in denen Oberfläche, Modell und technische Grenze zusammenpassen. Die Fachbereiche unterscheiden sich – die Arbeitsweise bleibt dieselbe.</p>
        </div>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Fachbereiche">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls="focus-panel"
            tabIndex={active === tab.id ? 0 : -1}
            className={active === tab.id ? styles.activeTab : undefined}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                moveTab(tab.id, -1);
              }
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                moveTab(tab.id, 1);
              }
            }}
          >
            <span>{tab.number}</span>{tab.label}
          </button>
        ))}
      </div>

      <div className={styles.panel} role="tabpanel" id="focus-panel" aria-labelledby={`tab-${active}`}>
        {active === 'web' && (
          <>
            <PanelHeader
              number="01"
              title="Produkte von der Oberfläche bis zum Betrieb."
              text="Next.js und React im Frontend, Python oder Node im Backend, relationale Datenmodelle, Tests und containerisierte Auslieferung."
            />
            <div className={styles.caseRow}>
              <Link href="/projekte/unitfly" className={styles.webVisual} aria-label="UnitFly Case Study öffnen">
                <Image src="/images/work/unitfly.jpg" alt="UnitFly Produktoberfläche" fill sizes="(max-width: 768px) 100vw, 58vw" />
                <span>Featured system / UnitFly</span>
              </Link>
              <div className={styles.caseIndex}>
                <p className={styles.indexLabel}>Ausgewählte Web-Systeme</p>
                <Link href="/projekte/unitfly"><span>01</span><strong>UnitFly</strong><small>Fullstack · AI</small></Link>
                <Link href="/projekte/pa-it-services"><span>02</span><strong>PLP IT-Services</strong><small>Platform</small></Link>
                <Link href="/projekte/weblabs"><span>03</span><strong>WebLabs</strong><small>Portfolio system</small></Link>
                <Link href="/projekte" className={styles.allLink}>Alle Projekte →</Link>
              </div>
            </div>
          </>
        )}

        {active === 'ai' && (
          <>
            <PanelHeader
              number="02"
              title="Modelle als kontrollierte Systemkomponenten."
              text="Computer Vision, Agenten und Zeitreihenmodelle – mit messbarer Pipeline, Fallbacks und deterministischen Grenzen außerhalb des Modells."
            />
            <article className={`${styles.caseRow} ${styles.visionCase}`}>
              <div className={styles.videoFrame}>
                <video
                  autoPlay={!prefersReducedMotion}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/media/realtime-vision-demo-poster.jpg"
                  aria-label="Anonymisierter Debug-Viewport einer laufenden Echtzeit-Objekterkennung"
                >
                  <source src="/media/realtime-vision-demo.mp4" type="video/mp4" />
                  <source src="/media/realtime-vision-demo.webm" type="video/webm" />
                </video>
                <span>Realtime inference</span>
              </div>
              <div className={styles.caseCopy}>
                <p>Computer Vision / Private Case</p>
                <h4>Realtime Vision Runtime</h4>
                <p>YOLO-Inferenz mit TensorRT, ONNX Runtime und OpenVINO, automatischer Provider-Auswahl, OpenCV-Pipeline und Arduino-Hardware-Layer.</p>
                <ul role="list"><li>TensorRT</li><li>ONNX</li><li>Arduino</li></ul>
                <Link href="/projekte/realtime-vision-runtime">Technische Case Study →</Link>
              </div>
            </article>
            <article className={`${styles.caseRow} ${styles.reverseCase} ${styles.marketCase}`}>
              <MarketSignalDemo />
              <div className={styles.caseCopy}>
                <p>ML Systems / Time Series</p>
                <h4>ML Market Runtime</h4>
                <p>XGBoost-Pipeline mit Feature Engineering, Walk-forward-Validierung, Backtesting und einer getrennten deterministischen Risikoebene.</p>
                <ul role="list"><li>XGBoost</li><li>FastAPI</li><li>Risk gates</li></ul>
                <Link href="/projekte/ml-market-runtime">Technische Case Study →</Link>
              </div>
            </article>
            <Link href="/projekte/unitfly" className={styles.crossLink}><span>Agent systems</span><strong>UnitFly — Guardrails, Audit und kontrollierte Aktionen</strong><i>Case Study →</i></Link>
          </>
        )}

        {active === 'security' && (
          <>
            <PanelHeader
              number="03"
              title="Security Research an realen Systemgrenzen."
              text="FPGA, PCIe, Windows Kernel und Geräteidentität – analysiert in isolierten Testumgebungen und öffentlich bewusst ohne operative Umgehungsanleitungen."
            />
            <div className={styles.securityLayout}>
              <SecurityLabDemo />
              <div className={styles.securityIndex}>
                <article><span>01</span><div><h4>PCIe Device Research</h4><p>SystemVerilog, Konfigurationsraum, BAR-Logik, TLP-Verarbeitung und IOMMU-Verhalten.</p><small>Vivado · Artix-7 · PCIe</small></div></article>
                <article><span>02</span><div><h4>Driver Security Research</h4><p>Defensive Analyse von BYOVD-Angriffsflächen, Speicherabbildung und x64-Seitentabellen.</p><small>C++ · WinDbg · Kernel internals</small></div></article>
                <article><span>03</span><div><h4>Platform Integrity</h4><p>Windows-Geräteidentitäten und die Vertrauensgrenzen von Registry, SMBIOS und Netzwerkmerkmalen.</p><small>C++ · C# · Windows internals</small></div></article>
              </div>
            </div>
            <Link href="/projekte/void" className={styles.crossLink}><span>Privacy engineering</span><strong>VOiD — Adversarial Computer Vision und verschlüsselte Verarbeitung</strong><i>Case Study →</i></Link>
          </>
        )}
      </div>
    </section>
  );
}
