'use client';

import React from 'react';
import WireframeHand from '@/components/svg/WireframeHand';
import ScrollReveal from '@/components/ScrollReveal';
import FuturisticShape from '@/components/ui/FuturisticShape';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import styles from './ArtistSection.module.css';

export default function ArtistSection() {
  const { ref, parallaxOffset } = useScrollAnimation();

  return (
    <section className={styles.artist} id="artist" ref={ref}>
      <div className="section-container">
        <div className={styles.layout}>
          {/* Left: wireframe with parallax */}
          <div
            className={styles.wireframeCol}
            style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
          >
            <div className={styles.wireframeWrapper}>
              <WireframeHand />
            </div>
          </div>

          {/* Right: text editorial */}
          <div className={styles.textCol}>
            <FuturisticShape type={5} className={styles.decorationShape} />
            <ScrollReveal>
              <span className="ui-label ui-label-md">ABOUT THE LABEL</span>
              <h2 className={styles.heading}>
                WE ARE THE<br />
                <span className={styles.headingAccent}>SIGNAL</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className={styles.paragraph}>
                Private Techno is not just a record label — it is a collective consciousness operating
                at the intersection of sound design, visual experimentation, and underground culture.
                Born in the depths of warehouses and coded into digital frequencies.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className={styles.paragraph}>
                Every release is an artifact. Every track, a transmission from the future. We curate
                artists who push the boundaries of hypnotic, industrial, and experimental electronic
                music into uncharted territories.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>37</span>
                  <span className="ui-label">RELEASES</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>+50</span>
                  <span className="ui-label">ARTISTS</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>∞</span>
                  <span className="ui-label">FREQUENCIES</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Background moving SVG element */}
      <svg
        className={styles.bgElement}
        viewBox="0 0 200 200"
        fill="none"
        style={{ transform: `translateY(${parallaxOffset}px) rotate(${parallaxOffset * 0.5}deg)` }}
      >
        <circle cx="100" cy="100" r="90" stroke="#E8550F" strokeWidth="0.3" opacity="0.06" />
        <circle cx="100" cy="100" r="60" stroke="#e8e8e8" strokeWidth="0.2" opacity="0.04" />
        <circle cx="100" cy="100" r="30" stroke="#E8550F" strokeWidth="0.3" opacity="0.08" />
      </svg>
    </section>
  );
}
