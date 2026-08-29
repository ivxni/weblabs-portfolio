'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import styles from './SecurityLabDemo.module.scss';

type Mode = 'fpga' | 'kernel' | 'integrity';

const modes: readonly { id: Mode; label: string }[] = [
  { id: 'fpga', label: 'FPGA' },
  { id: 'kernel', label: 'Kernel' },
  { id: 'integrity', label: 'Integrity' },
];

const output: Record<Mode, readonly { key: string; value: string; state?: 'ok' | 'watch' }[]> = {
  fpga: [
    { key: 'DEVICE', value: 'ARTIX-7 / GEN1 x1', state: 'ok' },
    { key: 'CFG_SPACE', value: 'SHADOW ONLINE', state: 'ok' },
    { key: 'BAR0', value: 'BRAM 64 KB / SYNC', state: 'ok' },
    { key: 'TLP_STREAM', value: '4.8 K/s / RATE LIMITED', state: 'watch' },
    { key: 'IOMMU_EVENTS', value: 'STABLE', state: 'ok' },
    { key: 'MSI', value: 'VECTOR 0 / READY', state: 'ok' },
  ],
  kernel: [
    { key: 'LAB_MODE', value: 'READ-ONLY / ISOLATED', state: 'ok' },
    { key: 'CR3', value: '0xFFFF••••A000', state: 'ok' },
    { key: 'PML4', value: 'INDEX 1F4 / PRESENT', state: 'ok' },
    { key: 'PDPT → PD', value: 'TRANSLATION OK', state: 'ok' },
    { key: 'PAGE', value: '0x0000••••7000 / 4 KB', state: 'watch' },
    { key: 'ACCESS', value: 'AUDITED / NO WRITE', state: 'ok' },
  ],
  integrity: [
    { key: 'SMBIOS', value: 'BASELINE 8C:4F:••:91', state: 'ok' },
    { key: 'NETWORK', value: 'INTEL NIC / VERIFIED', state: 'ok' },
    { key: 'REGISTRY', value: '12 IDENTIFIERS TRACKED', state: 'ok' },
    { key: 'FIRMWARE', value: 'UEFI STATE MEASURED', state: 'ok' },
    { key: 'DRIFT', value: '1 CHANGE DETECTED', state: 'watch' },
    { key: 'REPORT', value: 'BASELINE DIFF READY', state: 'ok' },
  ],
};

export function SecurityLabDemo() {
  const [mode, setMode] = useState<Mode>('fpga');
  const [visible, setVisible] = useState(output.fpga.length);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(output[mode].length);
      return;
    }
    setVisible(0);
    const timer = window.setInterval(() => {
      setVisible((current) => {
        if (current >= output[mode].length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 160);
    return () => window.clearInterval(timer);
  }, [mode, reducedMotion]);

  return (
    <div className={styles.window} aria-label="Simulierte Security-Lab-Diagnostik">
      <div className={styles.titlebar}>
        <span><i /><i /><i /></span>
        <p>security-lab / simulated telemetry</p>
        <b>READ ONLY</b>
      </div>
      <div className={styles.modes} role="tablist" aria-label="Security-Lab-Modus">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            className={mode === item.id ? styles.active : undefined}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.output} role="tabpanel">
        <p className={styles.command}>$ inspect --scope {mode} --safe</p>
        {output[mode].map((line, index) => (
          <p key={line.key} className={index < visible ? styles.visible : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{line.key}</b>
            <em className={line.state === 'watch' ? styles.watch : styles.ok}>{line.value}</em>
          </p>
        ))}
        <p className={styles.prompt} aria-hidden="true">_</p>
      </div>
      <div className={styles.footer}><span>SIMULATION / NO LIVE TARGET</span><span>{mode.toUpperCase()}_TRACE.LOG</span></div>
    </div>
  );
}
