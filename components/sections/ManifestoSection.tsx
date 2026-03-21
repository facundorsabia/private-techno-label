'use client';

import React, { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './ManifestoSection.module.css';

const MANIFESTO_LINES = [
  'PRIVATE TECHNO',
  'UNDERGROUND ELECTRONIC CULTURE',
  'HYPNOTIC SOUND EXPLORATION',
  'DEEP INTO THE MACHINE',
  'BEYOND THE FREQUENCY',
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const raw = 1 - (rect.top / winH);
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.manifesto} id="manifesto" ref={sectionRef}>
      {/* Horizontal diagram lines */}
      <div className={styles.bgLines}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={styles.bgLine}
            style={{ top: `${20 + i * 15}%`, opacity: 0.04 + i * 0.01 }}
          />
        ))}
      </div>

      <div className="section-container">
        <div className={styles.textBlock}>
          {MANIFESTO_LINES.map((line, i) => {
            const lineProgress = Math.max(0, Math.min(1, (progress - i * 0.12) * 2.5));
            return (
              <ScrollReveal key={i} delay={i * 150}>
                <div
                  className={styles.line}
                  style={{
                    opacity: 0.15 + lineProgress * 0.85,
                    transform: `translateX(${(1 - lineProgress) * 30}px)`,
                  }}
                >
                  {i === 0 ? (
                    <span className={styles.lineMain}>{line}</span>
                  ) : (
                    <span className={styles.lineSecondary}>{line}</span>
                  )}
                  <span className={styles.lineMarker}>{String(i + 1).padStart(2, '0')}</span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Scattered small markers */}
        <div className={styles.markers}>
          <span className={`ui-label ${styles.marker}`} style={{ left: '5%', top: '20%' }}>
            ◇ NODE
          </span>
          <span className={`ui-label ${styles.marker}`} style={{ right: '8%', top: '40%' }}>
            ◆ SYNC
          </span>
          <span className={`ui-label ${styles.marker}`} style={{ left: '15%', bottom: '15%' }}>
            ○ FREQ.HZ
          </span>
        </div>
      </div>
    </section>
  );
}
