'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ARTISTS } from '@/data/artists';
import styles from './RosterSection.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BinaryScramble from '@/components/ui/BinaryScramble';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function RosterSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(`.${styles.artistCard}`);

    cards.forEach((card: any) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power4.out'
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section className={styles.rosterSection} id="roster" ref={containerRef}>
      <div className="section-container">
        <div className={styles.header}>
          <div className="flex flex-col gap-1 mb-4">
            <span className="ui-label text-orange">CORE_ASSETS</span>
            <h2 className={styles.title}>
              <span className={styles.titleDim}>LABEL</span> ROSTER
            </h2>
          </div>
          <div className={styles.headerLine} />
          <div className="flex justify-between items-center w-full mt-2">
            <span className="ui-label opacity-60">SIGNAL: STABLE</span>
            <span className="ui-label opacity-40">DATABASE_v2.0</span>
          </div>
        </div>

        <div className={styles.grid}>
          {ARTISTS.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.id}`}
              className={styles.artistCard}
            >
              <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.artistImage}
                  />
                  {/* CRT Scanline Overlay */}
                  <div className={styles.scanlines} />

                  {/* Technical Corners */}
                  <div className={styles.cornerTL} />
                  <div className={styles.cornerTR} />
                  <div className={styles.cornerBL} />
                  <div className={styles.cornerBR} />

                  {/* Status Tag */}
                  <div className={styles.statusTag}>
                    <span className={styles.pulseDot} />
                    ONLINE
                  </div>
                </div>
              </div>

              <div className={styles.info}>
                <div className={styles.infoTop}>
                  <span className={styles.artistId}>ID: {artist.id.toUpperCase()}</span>
                  <span className={styles.location}>{artist.location}</span>
                </div>
                <h3 className={styles.name}>
                  <BinaryScramble text={artist.name} />
                </h3>
                <p className={styles.role}>{artist.role}</p>

                <div className={styles.viewPresskit}>
                  <span className={styles.pkText}>ACCESS_PRESSKIT</span>
                  <div className={styles.pkLine} />
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
