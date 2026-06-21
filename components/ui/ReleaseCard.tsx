'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ReleaseCard.module.css';
import { Release } from '@/data/releases';

interface ReleaseCardProps {
  release: Release;
  index: number;
}

export default function ReleaseCard({ release, index }: ReleaseCardProps) {
  return (
    <Link href={`/releases/${release.id}`} className={styles.cardWrapper}>
      <div className={`${styles.card} glow-border release-card-entry`}>
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
          <div className={styles.titleRow}>
            <span className={styles.cardTitle}>{release.title}</span>
            <span className={`ui-label ${styles.cardCatalog}`}>{release.catalog}</span>
          </div>
          <div className={styles.artistRow}>
            <span className={styles.cardArtist}>{release.artist}</span>
            <button 
              className={styles.buyBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://private-techno.bandcamp.com/album/${release.bandcampSlug}`, '_blank');
              }}
            >
              BUY
            </button>
          </div>
        </div>
        
        {/* Corner accents for futuristic feel */}
        <div className={styles.cornerTL} />
        <div className={styles.cornerBR} />
      </div>
    </Link>
  );
}
