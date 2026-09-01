'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import styles from './SecurityLabDemo.module.scss';

type Mode = 'fpga' | 'kernel' | 'integrity';

const modes: readonly { id: Mode; label: string }[] = [
  { id: 'fpga', label: 'PCIe / FPGA' },
  { id: 'kernel', label: 'Kernel' },
  { id: 'integrity', label: 'Integrity' },
];

const diagnostics: Record<Mode, {
  eyebrow: string;
  metric: string;
  unit: string;
  status: string;
  caption: string;
}> = {
  fpga: {
    eyebrow: 'TLP FLOW / 12 SAMPLES',
    metric: '4.8K',
    unit: 'TLP / SEC',
    status: 'BUS STABLE',
    caption: 'Rate-limited request flow with measured IOMMU event state.',
  },
  kernel: {
    eyebrow: 'VIRTUAL ADDRESS WALK',
    metric: '4 KB',
    unit: 'READ WINDOW',
    status: 'AUDITED',
    caption: 'Anonymized, read-only translation trace inside an isolated lab.',
  },
  integrity: {
    eyebrow: 'BASELINE COMPARISON',
    metric: '98%',
    unit: 'IDENTITY MATCH',
    status: '1 DRIFT',
    caption: 'Cross-layer comparison of firmware, SMBIOS, registry and network state.',
  },
};

const fpgaTrace = [42, 58, 36, 74, 54, 66, 49, 82, 63, 71, 56, 68];
const addressWalk = ['CR3', 'PML4', 'PDPT', 'PD', 'PT'];

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
  const diagnostic = diagnostics[mode];

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
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.titlebar}>
        <div className={styles.labIdentity}><span aria-hidden="true"><i /><i /></span><p>SECURITY LAB</p></div>
        <p>SIMULATED TELEMETRY</p>
        <b><i aria-hidden="true" /> SAFE / READ ONLY</b>
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
      <div className={styles.stage} role="tabpanel">
        <div className={styles.diagnostic}>
          <div className={styles.metricHeader}>
            <div><span>{diagnostic.eyebrow}</span><strong>{diagnostic.metric}</strong><small>{diagnostic.unit}</small></div>
            <p><i aria-hidden="true" /> {diagnostic.status}</p>
          </div>
          <div className={styles.visual} aria-hidden="true">
            {mode === 'fpga' && (
              <div className={styles.trace}>
                {fpgaTrace.map((level, index) => <i key={index} style={{ blockSize: `${level}%` }} />)}
                <span>REQUEST FLOW</span><span>IOMMU EVENTS / STABLE</span>
              </div>
            )}
            {mode === 'kernel' && (
              <div className={styles.pageWalk}>
                {addressWalk.map((item, index) => (
                  <div key={item}><span>{item}</span><b>{index === addressWalk.length - 1 ? '4 KB' : `0${index + 1}`}</b></div>
                ))}
              </div>
            )}
            {mode === 'integrity' && (
              <div className={styles.baseline}>
                <p><span>FIRMWARE</span><i><b style={{ inlineSize: '100%' }} /></i><em>MATCH</em></p>
                <p><span>SMBIOS</span><i><b style={{ inlineSize: '100%' }} /></i><em>MATCH</em></p>
                <p><span>REGISTRY</span><i><b style={{ inlineSize: '82%' }} /></i><em>DRIFT</em></p>
                <p><span>NETWORK</span><i><b style={{ inlineSize: '100%' }} /></i><em>MATCH</em></p>
              </div>
            )}
          </div>
          <p className={styles.caption}>{diagnostic.caption}</p>
        </div>

        <div className={styles.output}>
          <div className={styles.command}><span>$ inspect --scope {mode} --safe</span><b>TRACE</b></div>
          {output[mode].map((line, index) => (
            <p key={line.key} className={index < visible ? styles.visible : undefined}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <b>{line.key}</b>
              <em className={line.state === 'watch' ? styles.watch : styles.ok}>{line.value}</em>
            </p>
          ))}
          <p className={styles.prompt} aria-hidden="true">_</p>
        </div>
      </div>
      <div className={styles.footer}><span>ISOLATED LAB / NO LIVE TARGET</span><span>{mode.toUpperCase()}_TRACE.LOG</span></div>
    </div>
  );
}
