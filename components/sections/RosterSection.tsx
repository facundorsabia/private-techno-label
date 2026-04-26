'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ARTISTS } from '@/data/artists';
import styles from './RosterSection.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function RosterSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const artists = gsap.utils.toArray(`.${styles.artistCard}`);
    
    artists.forEach((artist: any) => {
      gsap.from(artist, {
        scrollTrigger: {
          trigger: artist,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }, { scope: containerRef });

  return (
    <section className={styles.rosterSection} id="roster" ref={containerRef}>
      <div className="section-container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleDim}>LABEL</span> ROSTER
          </h2>
          <div className={styles.headerLine} />
          <div className="flex justify-between items-center w-full">
            <span className="ui-label">TRANSMISSION_CONNECTED</span>
            <span className="ui-label opacity-40">ACTIVE_ROSTER.v1</span>
          </div>
        </div>

        <div className={styles.grid}>
          {ARTISTS.map((artist) => (
            <Link 
              key={artist.id} 
              href={`/artists/${artist.id}`}
              className={styles.artistCard}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={artist.image} 
                  alt={artist.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.artistImage}
                />
                <div className={styles.overlay} />
                <div className={styles.cornerTL} />
                <div className={styles.cornerBR} />
              </div>
              
              <div className={styles.info}>
                <div className={styles.infoTop}>
                  <span className="ui-label">{artist.id.toUpperCase()}</span>
                  <span className={styles.location}>{artist.location}</span>
                </div>
                <h3 className={styles.name}>{artist.name}</h3>
                <p className={styles.role}>{artist.role}</p>
                <div className={styles.viewPresskit}>
                  <span>VIEW_PRESSKIT</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
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
