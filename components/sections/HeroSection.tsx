'use client';

import React from 'react';
import Image from 'next/image';
import DiagramLines from '@/components/svg/DiagramLines';
import FuturisticShape from '@/components/ui/FuturisticShape';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero} id="hero">
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

      {/* Main content */}
      <div className={styles.content}>
        {/* Left: Typography */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            <Image
              src="/images/logos/Private Techno blanco.png"
              alt="Private Techno"
              width={1200}
              height={300}
              className={styles.logo}
              priority
            />
          </h1>
          <div className={styles.subtitle}>
            <span className={styles.subtitleLine} />
            <span className="ui-label ui-label-md">UNDERGROUND FREQUENCY</span>
          </div>
          <div className={styles.codes}>
            <span className="ui-label ui-label-md">h y p n ø t i c   s ø u n d</span>
            <span className="ui-label ui-label-md">RΛW S1GNΛL</span>
          </div>
        </div>

        {/* Right: Hero Video */}
        <div className={styles.wireframeContainer}>
          <div className={styles.wireframe}>
            <video
              src="/videos/SphereEditWebM.webm"
              autoPlay
              loop
              muted
              playsInline
              className={styles.heroVideo}
            />
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
