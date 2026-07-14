'use client';

import React, { useState, useEffect } from 'react';
import { audioManager } from '@/utils/audioManager';
import Image from 'next/image';
import DiagramLines from '@/components/svg/DiagramLines';
import dynamic from 'next/dynamic';
import FuturisticShape from '@/components/ui/FuturisticShape';
const ParticleSphere = dynamic(() => import('@/components/ui/ParticleSphere'), { ssr: false });
import CustomCursor from '@/components/ui/CustomCursor';
import styles from './HeroSection.module.css';

const TRANSMISSION_TRACKS = [
  encodeURI('/audio/previews/Benac - Destroy Conformism (Original Mix).mp3'),
  encodeURI('/audio/previews/Diofaro - Absolution (Original Mix).mp3'),
  encodeURI('/audio/previews/H-R-Z - Hypnagogic (Original Mix).mp3'),
  encodeURI('/audio/previews/Mauri Mastra - Monolith (Original Mix).mp3'),
  encodeURI('/audio/previews/Piero Ceraolo - 001 (Original Mix).mp3'),
  encodeURI('/audio/previews/SYNDRM - Airplane Security (Original Mix).mp3')
];

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRANSMISSION_TRACKS[0]);

  useEffect(() => {
    audioManager.subscribe((playing) => setIsPlaying(playing));
  }, []);

  const toggleTransmission = () => {
    if (!isPlaying) {
      const randomTrack = TRANSMISSION_TRACKS[Math.floor(Math.random() * TRANSMISSION_TRACKS.length)];
      setCurrentTrack(randomTrack);
      audioManager.togglePlay(randomTrack);
    } else {
      audioManager.togglePlay(currentTrack);
    }
  };

  return (
    <section className={styles.hero} id="hero">
      <CustomCursor targetId="hero" />
      <div className={styles.decorationContainer}>
        <FuturisticShape name="shape1" className={styles.shapeHero1} width={200} height={200} />
        <FuturisticShape name="shape4" className={styles.shapeHero3} width={300} height={80} />
        <FuturisticShape name="shape3" className={styles.shapeHero2} width={180} height={180} />
        <FuturisticShape name="shape5" className={styles.shapeHero4} width={120} height={120} />
        <FuturisticShape name="shape6" className={styles.shapeHero5} width={150} height={150} />
        <FuturisticShape name="shape8" className={styles.shapeHero6} width={80} height={80} />
        <FuturisticShape name="shape7" className={styles.shapeHero7} width={100} height={100} />
        <FuturisticShape name="shape9" className={styles.shapeHero8} width={140} height={140} />
        <FuturisticShape name="shapes2" className={styles.shapeHero9} width={110} height={110} />
      </div>

      <DiagramLines />

      {/* ── Top Bar ─────────────────────────────── */}
      <div className={styles.topBar}>
        <div className={styles.topBarRight}>
          <button 
            className={`${styles.transmissionBtnTop} ${isPlaying ? styles.playing : ''}`} 
            onClick={toggleTransmission}
          >
            {isPlaying ? (
              <svg className={styles.transmissionIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h12v12H6z" />
              </svg>
            ) : (
              <svg className={styles.transmissionIcon} viewBox="0 0 24 24" fill="var(--orange)">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            )}
            <span className={styles.btnText}>{isPlaying ? 'STOP TRANSMISSION' : 'INIT TRANSMISSION'}</span>
          </button>
        </div>
      </div>

      {/* Background Canvas */}
      <div className={styles.fullCanvasContainer}>
        <ParticleSphere />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        {/* Left: Typography */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            <Image
              src="/images/logos/private-rebranding-logo-no-bg.png"
              alt="Private Techno"
              width={1200}
              height={300}
              className={styles.logo}
              priority
            />
          </h1>
          {/* <div className={styles.subtitle}>
            <span className={styles.subtitleLine} />
            <span className="ui-label ui-label-md">UNDERGROUND FREQUENCY</span>
          </div> */}
          <div className={styles.codes}>
            <span className="ui-label ui-label-md">h y p n ø t i c   s ø u n d</span>
            <span className="ui-label ui-label-md">RΛW S1GNΛL</span>
          </div>
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
