'use client';

import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './ReleasesSection.module.css';

interface Release {
  id: string;
  title: string;
  artist: string;
  catalog: string;
  color: string;
}

const RELEASES: Release[] = [
  { id: '1', title: 'DARK MATTER', artist: 'NEXUS-7', catalog: 'PT-001', color: '#E8550F' },
  { id: '2', title: 'SYNAPTIC VOID', artist: 'NEURAL DRIFT', catalog: 'PT-002', color: '#8B3A0F' },
  { id: '3', title: 'FREQUENCY COLLAPSE', artist: 'AXIS CONTROL', catalog: 'PT-003', color: '#444' },
  { id: '4', title: 'HYPNOTIC STATE', artist: 'PHASE SHIFT', catalog: 'PT-004', color: '#E8550F' },
  { id: '5', title: 'INDUSTRIAL ECHO', artist: 'GRID ZERO', catalog: 'PT-005', color: '#666' },
  { id: '6', title: 'SIGNAL DECAY', artist: 'MONO CULT', catalog: 'PT-006', color: '#8B3A0F' },
];

export default function ReleasesSection() {
  return (
    <section className={styles.releases} id="releases">
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="ui-label">CATALOG</span>
            <h2 className={styles.sectionTitle}>RELEASES</h2>
            <div className={styles.headerLine} />
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {RELEASES.map((release, i) => (
            <ScrollReveal key={release.id} delay={i * 100}>
              <div className={`${styles.card} glow-border`}>
                {/* Album artwork placeholder with generated pattern */}
                <div className={styles.artwork}>
                  <div
                    className={styles.artworkInner}
                    style={{
                      background: `
                        radial-gradient(ellipse at ${30 + i * 10}% ${40 + i * 8}%, ${release.color}22 0%, transparent 60%),
                        linear-gradient(${i * 60}deg, #0a0a0a 0%, #1a1a1a 100%)
                      `,
                    }}
                  >
                    {/* Grid pattern lines */}
                    <svg className={styles.artworkSvg} viewBox="0 0 200 200" fill="none">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <line
                          key={j}
                          x1={j * 28}
                          y1="0"
                          x2={100 + j * 14}
                          y2="200"
                          stroke={release.color}
                          strokeWidth="0.3"
                          opacity="0.2"
                        />
                      ))}
                      <circle
                        cx={100}
                        cy={100}
                        r={40 + i * 5}
                        stroke={release.color}
                        strokeWidth="0.5"
                        opacity="0.15"
                        fill="none"
                      />
                      <text
                        x="100"
                        y="105"
                        textAnchor="middle"
                        fill={release.color}
                        fontSize="8"
                        fontFamily="Space Mono, monospace"
                        opacity="0.3"
                      >
                        {release.catalog}
                      </text>
                    </svg>

                    {/* Play icon on hover */}
                    <div className={styles.playIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{release.title}</span>
                  <span className={styles.cardArtist}>{release.artist}</span>
                  <span className={`ui-label ${styles.cardCatalog}`}>{release.catalog}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
