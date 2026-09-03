'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Accordion from '@radix-ui/react-accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useReducedMotion } from 'motion/react';
import { MarketSignalDemo } from './MarketSignalDemo';
import { SecurityLabDemo } from './SecurityLabDemo';
import styles from './FocusTabs.module.scss';

const disciplines = [
  { id: 'web', number: '01', title: 'Software & Web', summary: 'Produkte von der Oberfläche bis zum stabilen Betrieb.' },
  { id: 'ai', number: '02', title: 'KI-Systeme', summary: 'Computer Vision, Agenten und ML-Pipelines mit kontrollierten Grenzen.' },
  { id: 'security', number: '03', title: 'Security Research', summary: 'Systemnahe Forschung an FPGA, PCIe und Windows.' },
] as const;

function CaseLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className={styles.caseLink} href={href}>
      {children}
      <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
    </Link>
  );
}

export function FocusTabs() {
  const reducedMotion = useReducedMotion();
  const scrollTimer = useRef<number | null>(null);
  const openDisciplines = useRef<string[]>(['web']);

  useEffect(() => {
    return () => {
      if (scrollTimer.current !== null) {
        window.clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  function handleValueChange(values: string[]) {
    const openedDiscipline = values.find((value) => !openDisciplines.current.includes(value));
    openDisciplines.current = values;

    if (!openedDiscipline) return;

    if (scrollTimer.current !== null) {
      window.clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = window.setTimeout(() => {
      document.getElementById(`focus-${openedDiscipline}`)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      scrollTimer.current = null;
    }, reducedMotion ? 0 : 120);
  }

  return (
    <section className={styles.section} id="focus" aria-labelledby="focus-heading">
      <header className={styles.header}>
        <p className={styles.kicker}>Fachbereiche</p>
        <h2 id="focus-heading">Drei Disziplinen.<br />Ein technischer Anspruch.</h2>
        <p className={styles.lead}>
          Kurze Einblicke statt einer langen Leistungsliste. Jeder Bereich öffnet seine eigenen
          Systeme und technischen Belege.
        </p>
      </header>

      <Accordion.Root
        className={styles.accordion}
        type="multiple"
        defaultValue={['web']}
        onValueChange={handleValueChange}
      >
        {disciplines.map((discipline) => (
          <Accordion.Item
            className={styles.item}
            value={discipline.id}
            id={`focus-${discipline.id}`}
            key={discipline.id}
          >
            <Accordion.Header>
              <Accordion.Trigger className={styles.trigger}>
                <span className={styles.number}>{discipline.number}</span>
                <strong>{discipline.title}</strong>
                <span className={styles.summary}>{discipline.summary}</span>
                <FontAwesomeIcon className={styles.plus} icon={faPlus} aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content className={styles.content}>
              <div className={styles.contentInner}>
                {discipline.id === 'web' && (
                  <div className={styles.webPanel}>
                    <Link href="/projekte/unitfly" className={styles.featuredVisual}>
                      <Image src="/images/work/unitfly.jpg" alt="Administrationsoberfläche der UnitFly Plattform" fill sizes="(max-width: 56rem) 100vw, 62vw" />
                      <span>Fullstack System</span>
                    </Link>
                    <div className={styles.webCopy}>
                      <p className={styles.panelLabel}>Software Engineering</p>
                      <h3>Frontend, Backend, Daten und Deployment als ein Produkt.</h3>
                      <p>Next.js und React im Frontend, Python oder Node im Backend, saubere Datenmodelle, Tests, Docker und ein reproduzierbarer Betrieb.</p>
                      <nav aria-label="Ausgewählte Softwareprojekte">
                        <CaseLink href="/projekte/unitfly">UnitFly</CaseLink>
                        <CaseLink href="/projekte/pa-it-services">PLP IT-Services</CaseLink>
                        <CaseLink href="/projekte/weblabs">WebLabs</CaseLink>
                      </nav>
                    </div>
                  </div>
                )}

                {discipline.id === 'ai' && (
                  <div className={styles.aiPanel}>
                    <article className={styles.visionStory}>
                      <div className={styles.videoFrame}>
                        <video autoPlay={!reducedMotion} muted loop playsInline preload="metadata" poster="/media/realtime-vision-demo-poster.jpg" aria-label="Debug-Viewport einer laufenden Echtzeit-Objekterkennung">
                          <source src="/media/realtime-vision-demo.webm" type="video/webm" />
                          <source src="/media/realtime-vision-demo.mp4" type="video/mp4" />
                        </video>
                        <span>Realtime inference</span>
                      </div>
                      <div className={styles.storyCopy}>
                        <p className={styles.panelLabel}>Computer Vision</p>
                        <h3>Realtime Vision Runtime</h3>
                        <p>YOLO-Inferenz über TensorRT, ONNX Runtime oder OpenVINO. Ein separater Arduino-Layer übernimmt Protokoll, Firmware und Hardware-Ausgabe.</p>
                        <CaseLink href="/projekte/realtime-vision-runtime">Case Study</CaseLink>
                      </div>
                    </article>

                    <article className={styles.marketStory}>
                      <div className={styles.storyCopy}>
                        <p className={styles.panelLabel}>Time Series ML</p>
                        <h3>ML Market Runtime</h3>
                        <p>Acht Forex-Zeitreihen, Walk-forward-Validierung, Multi-Source-Features und eine deterministische Risikoebene hinter der Modellprognose.</p>
                        <CaseLink href="/projekte/ml-market-runtime">Case Study</CaseLink>
                      </div>
                      <MarketSignalDemo />
                    </article>
                    <Link href="/projekte/unitfly" className={styles.agentLink}>
                      <span>Agent Systems</span>
                      <strong>Guardrails, Audit und kontrollierte Aktionen in UnitFly</strong>
                      <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                    </Link>
                  </div>
                )}

                {discipline.id === 'security' && (
                  <div className={styles.securityPanel}>
                    <div className={styles.securityIntro}>
                      <p className={styles.panelLabel}>Isolated Research</p>
                      <h3>Security an realen Systemgrenzen</h3>
                      <p>FPGA, PCIe, Kernel-Internals und Plattformidentität in kontrollierten Laborumgebungen, mit defensivem Fokus und dokumentierten Grenzen.</p>
                    </div>
                    <SecurityLabDemo />
                    <CaseLink href="/projekte/void">Privacy Engineering ansehen</CaseLink>
                  </div>
                )}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
