'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './InitialLoader.module.css';

export default function InitialLoader() {
  const pathname = usePathname();
  const isSalesPage = pathname === '/free-download' || pathname === '/discography' || pathname === '/thank-you';

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(!isSalesPage);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent scrolling while loader is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  useGSAP(() => {
    if (isSalesPage) return;

    // Check sessionStorage only on client to avoid hydration issues later
    // const hasLoaded = sessionStorage.getItem('hasLoaded');
    // if (hasLoaded) {
    //   setIsVisible(false);
    //   return;
    // }
    // sessionStorage.setItem('hasLoaded', 'true');

    let currentProgress = 0;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;

      // Brutalist, jumpy progress simulation with a guaranteed minimum duration
      if (currentProgress < 85) {
        currentProgress += Math.floor(Math.random() * 15) + 2;
      } else if (stepCount > 15) { // Force it to wait at least ~1.8s (15 * 120ms)
        currentProgress = 100;
      } else {
        // Hover around 85-99% while waiting
        currentProgress += Math.floor(Math.random() * 3);
        if (currentProgress > 99) currentProgress = 99;
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Outro sequence
        const tl = gsap.timeline();

        tl.to(`.${styles.centerBlock}`, {
          scale: 1.05,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        })
          .to(containerRef.current, {
            yPercent: -100,
            ease: "expo.inOut",
            duration: 1.2,
          }, "+=0.1")
          .call(() => setIsVisible(false));
      }

      setProgress(currentProgress);
    }, 120);

    return () => clearInterval(interval);
  }, { scope: containerRef });

  if (!isVisible) return null;

  return (
    <div className={styles.loaderContainer} ref={containerRef}>
      <div className={styles.glitchBg} />
      <div className={styles.scanlines} />

      <div className={styles.content}>
        <div className={styles.header}>
          <span>SYSTEM_INIT</span>
          <span>P2ø20-2øXX</span>
        </div>

        <div className={styles.centerBlock}>


          <div className={styles.progressBarContainer}>
            <div className={styles.percentageRow}>
              <span>LOADING_ASSETS...</span>
              <span className={styles.percentage}>
                {progress.toString().padStart(3, '0')}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <span>EST. MMXVIII</span>
          <span>AWAITING_INPUT</span>
        </div>
      </div>
    </div>
  );
}
