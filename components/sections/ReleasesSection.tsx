'use client';

import React from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './ReleasesSection.module.css';

import { RELEASES } from '@/data/releases';
import ReleaseCard from '@/components/ui/ReleaseCard';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const INITIAL_COUNT = 6;
const INCREMENT = 6;

export default function ReleasesSection() {
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_COUNT);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const visibleReleases = RELEASES.slice(0, visibleCount);
  const hasMore = visibleCount < RELEASES.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + INCREMENT, RELEASES.length));
  };

  // Animation for newly added items
  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll('.release-card-entry');
    if (cards && cards.length > 0) {
      // Only animate the newly added cards (the last INCREMENT items)
      const newCards = Array.from(cards).slice(visibleCount - INCREMENT);

      gsap.fromTo(newCards,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
          filter: 'brightness(2) blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'brightness(1) blur(0px)',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out'
        }
      );
    }
  }, { dependencies: [visibleCount], scope: containerRef });

  return (
    <section className={styles.releases} id="releases" ref={containerRef}>
      <div className="section-container">
        <ScrollReveal>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <span className="ui-label ui-label-md">CATALOG</span>
              <span className={styles.count}>[{RELEASES.length} UNITS]</span>
            </div>
            <h2 className={styles.sectionTitle}>RΣLEΔSΞS</h2>
            <div className={styles.headerLine} />
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {visibleReleases.map((release, i) => (
            <ReleaseCard key={release.id} release={release} index={i} />
          ))}
        </div>

        {hasMore && (
          <div className={styles.actions}>
            <button
              className={styles.loadMoreBtn}
              onClick={handleLoadMore}
            >
              <span className={styles.btnLabel}>LOAD MORE</span>
              <div className={styles.btnLine} />
              <div className={styles.btnGlitch} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
