'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import styles from './MarketSignalDemo.module.scss';

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

const COUNT = 30;

function initialCandles(): Candle[] {
  const candles: Candle[] = [];
  let previous = 1.0842;
  for (let index = 0; index < COUNT; index += 1) {
    const movement = Math.sin(index * 0.78) * 0.00042 + Math.cos(index * 0.31) * 0.00024;
    const close = previous + movement;
    const spread = 0.00025 + Math.abs(Math.sin(index * 1.13)) * 0.00023;
    candles.push({
      open: previous,
      close,
      high: Math.max(previous, close) + spread,
      low: Math.min(previous, close) - spread * 0.82,
    });
    previous = close;
  }
  return candles;
}

function movingAverage(candles: readonly Candle[], period: number): number[] {
  return candles.map((_, index) => {
    const start = Math.max(0, index - period + 1);
    const slice = candles.slice(start, index + 1);
    return slice.reduce((sum, candle) => sum + candle.close, 0) / slice.length;
  });
}

export function MarketSignalDemo() {
  const [candles, setCandles] = useState(initialCandles);
  const phase = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      phase.current += 1;
      setCandles((current) => {
        const previous = current.at(-1)?.close ?? 1.0842;
        const movement = Math.sin(phase.current * 1.08) * 0.0005 + Math.cos(phase.current * 0.37) * 0.00022;
        const close = previous + movement;
        const spread = 0.00024 + Math.abs(Math.cos(phase.current * 0.81)) * 0.00026;
        return [
          ...current.slice(1),
          {
            open: previous,
            close,
            high: Math.max(previous, close) + spread,
            low: Math.min(previous, close) - spread * 0.78,
          },
        ];
      });
    }, 920);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const chart = useMemo(() => {
    const ema = movingAverage(candles, 7);
    const low = Math.min(...candles.map((candle) => candle.low));
    const high = Math.max(...candles.map((candle) => candle.high));
    const range = high - low || 1;
    const y = (value: number) => 340 - ((value - low) / range) * 270;
    const x = (index: number) => 36 + index * 22.8;
    const emaPath = ema.map((value, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(value)}`).join(' ');
    const latest = candles.at(-1)?.close ?? 1.0842;
    const slope = (ema.at(-1) ?? latest) - (ema.at(-6) ?? latest);
    const forecast = Array.from({ length: 6 }, (_, index) => ({
      x: x(COUNT - 1) + index * 19,
      value: latest + slope * (index / 4) + Math.sin(index * 1.2) * 0.00012,
    }));
    const forecastPath = forecast.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${y(point.value)}`).join(' ');
    const direction = slope >= 0 ? 1 : -1;
    const confidence = Math.min(84, Math.round(58 + Math.abs(slope) * 24000));
    return { y, x, emaPath, forecastPath, latest, direction, confidence, low, high };
  }, [candles]);

  const up = chart.direction > 0 ? chart.confidence : Math.round((100 - chart.confidence) * 0.55);
  const down = chart.direction < 0 ? chart.confidence : Math.round((100 - chart.confidence) * 0.55);
  const neutral = Math.max(4, 100 - up - down);

  return (
    <div className={styles.terminal} aria-label="Simulierte Forex- und ML-Prognose-Demo">
      <header className={styles.header}>
        <div><span>EUR / USD</span><strong>{chart.latest.toFixed(5)}</strong></div>
        <div className={styles.feed}><i aria-hidden="true" /> SIMULATED FEED</div>
        <div className={styles.interval}>M5 · ML RUNTIME</div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.chartWrap}>
          <svg viewBox="0 0 800 390" preserveAspectRatio="none" aria-hidden="true">
            {[70, 137, 204, 271, 338].map((position) => <line key={`h-${position}`} x1="24" x2="780" y1={position} y2={position} className={styles.gridLine} />)}
            {[36, 150, 264, 378, 492, 606, 720].map((position) => <line key={`v-${position}`} y1="42" y2="350" x1={position} x2={position} className={styles.gridLine} />)}
            {candles.map((candle, index) => {
              const candleX = chart.x(index);
              const rising = candle.close >= candle.open;
              const top = Math.min(chart.y(candle.open), chart.y(candle.close));
              const height = Math.max(2, Math.abs(chart.y(candle.open) - chart.y(candle.close)));
              return (
                <g key={`${index}-${candle.open}`} className={rising ? styles.rising : styles.falling}>
                  <line x1={candleX} x2={candleX} y1={chart.y(candle.high)} y2={chart.y(candle.low)} />
                  <rect x={candleX - 5.2} y={top} width="10.4" height={height} />
                </g>
              );
            })}
            <path d={chart.emaPath} className={styles.ema} />
            <path d={chart.forecastPath} className={styles.forecast} />
            <line x1="697" x2="697" y1="44" y2="350" className={styles.forecastBoundary} />
            <text x="706" y="60" className={styles.svgLabel}>AI FORECAST</text>
            <text x="30" y="374" className={styles.svgLabel}>EMA 7</text>
            <text x="680" y="374" className={styles.svgLabel}>NEXT 5 CANDLES</text>
          </svg>
        </div>

        <aside className={styles.modelPanel}>
          <p className={styles.panelLabel}>MODEL OUTLOOK</p>
          <div className={styles.direction}>
            <span>{chart.direction > 0 ? 'UPWARD BIAS' : 'DOWNWARD BIAS'}</span>
            <strong>{chart.direction > 0 ? '↗' : '↘'} {chart.confidence}%</strong>
          </div>
          <div className={styles.probabilities}>
            <p><span>UP</span><i><b style={{ inlineSize: `${up}%` }} /></i><em>{up}%</em></p>
            <p><span>NEUTRAL</span><i><b style={{ inlineSize: `${neutral}%` }} /></i><em>{neutral}%</em></p>
            <p><span>DOWN</span><i><b style={{ inlineSize: `${down}%` }} /></i><em>{down}%</em></p>
          </div>
          <dl>
            <div><dt>RSI 14</dt><dd>58.4</dd></div>
            <div><dt>ATR</dt><dd>0.00082</dd></div>
            <div><dt>REGIME</dt><dd>Trend</dd></div>
            <div><dt>RISK GATE</dt><dd className={styles.active}>Active</dd></div>
          </dl>
        </aside>
      </div>

      <footer className={styles.footer}>
        <span>Walk-forward model · XGBoost ensemble · 60+ features</span>
        <span>Simulation only · no market data · no trading signal</span>
      </footer>
    </div>
  );
}
