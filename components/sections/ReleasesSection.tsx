'use client';

import React from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './ReleasesSection.module.css';

interface Release {
  id: string;
  title: string;
  artist: string;
  catalog: string;
  color: string;
  cover: string;
}

const RELEASES: Release[] = [
  { id: '1', title: 'RISE AS ONE', artist: 'DEEPAK SHARMA', catalog: 'PT-001', color: '#E8550F', cover: '/images/albumCovers/0. Deepak Sharma - Rise as One Cover .jpg' },
  { id: '2', title: 'KRYPTONITA', artist: 'NEURAL DRIFT', catalog: 'PT-002', color: '#8B3A0F', cover: '/images/albumCovers/0. Kryptonita.jpg' },
  { id: '3', title: 'LANZAMIENTO', artist: 'AXIS CONTROL', catalog: 'PT-003', color: '#444', cover: '/images/albumCovers/0. Lanzamiento.jpg' },
  { id: '4', title: 'ONIRICO', artist: 'PHASE SHIFT', catalog: 'PT-004', color: '#E8550F', cover: '/images/albumCovers/0. Onirico.jpg' },
  { id: '5', title: 'RANDOM ILLUSIONS', artist: 'GRID ZERO', catalog: 'PT-005', color: '#666', cover: '/images/albumCovers/0. Random Illusions.jpg' },
  { id: '6', title: 'SINAPSIS', artist: 'MONO CULT', catalog: 'PT-006', color: '#8B3A0F', cover: '/images/albumCovers/0. Sinapsis.jpg' },
];

export default function ReleasesSection() {
  return (
    <section className={styles.releases} id="releases">
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="ui-label ui-label-md">CATALOG</span>
            <h2 className={styles.sectionTitle}>RELEASES</h2>
            <div className={styles.headerLine} />
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {RELEASES.map((release, i) => (
            <ScrollReveal key={release.id} delay={i * 100}>
              <div className={`${styles.card} glow-border`}>
                {/* Album artwork */}
                <div className={styles.artwork}>
                  <div className={styles.artworkInner}>
                    <Image
                      src={release.cover}
                      alt={`${release.title} Cover`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 900px) 50vw, (max-width: 500px) 100vw, 33vw"
                    />

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
