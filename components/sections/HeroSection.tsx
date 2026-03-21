'use client';

import React from 'react';
import WireframeBody from '@/components/svg/WireframeBody';
import DiagramLines from '@/components/svg/DiagramLines';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero} id="hero">
      <DiagramLines />

      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className="ui-label">SYS.001</span>
          <span className={styles.divider} />
          <span className="ui-label">FREQ.140BPM</span>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.globe}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" width="18" height="18">
              <circle cx="12" cy="12" r="10" />
              <ellipse cx="12" cy="12" rx="4" ry="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <span className="ui-label">48.8566° N, 2.3522° E</span>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        {/* Left: Typography */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>PRIVATE</span>
            <span className={styles.titleLine}>
              TECH<span className={styles.titleAccent}>N</span>O
            </span>
          </h1>
          <div className={styles.subtitle}>
            <span className={styles.subtitleLine} />
            <span className="ui-label">UNDERGROUND ELECTRONIC CULTURE</span>
          </div>
          <div className={styles.codes}>
            <span className="ui-label">CAT.NO: PT-2024-001</span>
            <span className="ui-label">FORMAT: DIGITAL / VINYL</span>
          </div>
        </div>

        {/* Right: Wireframe */}
        <div className={styles.wireframeContainer}>
          <div className={styles.wireframe}>
            <WireframeBody />
          </div>
          {/* Floating labels */}
          <span className={`${styles.floatingLabel} ${styles.fl1}`}>AXIS.Y</span>
          <span className={`${styles.floatingLabel} ${styles.fl2}`}>NODE.07</span>
          <span className={`${styles.floatingLabel} ${styles.fl3}`}>SIGNAL</span>
        </div>
      </div>

      {/* Geometric frame */}
      <div className={styles.geoCorner + ' ' + styles.geoTL} />
      <div className={styles.geoCorner + ' ' + styles.geoTR} />
      <div className={styles.geoCorner + ' ' + styles.geoBL} />
      <div className={styles.geoCorner + ' ' + styles.geoBR} />

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span className="ui-label">SCROLL</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
