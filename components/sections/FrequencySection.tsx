'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './FrequencySection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FrequencySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { contextSafe } = useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });

    tl.from('.fade-up', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  const triggerGlitch = contextSafe(() => {
    if (!videoRef.current) return;
    const tl = gsap.timeline();
    tl.set(videoRef.current, {
      x: -35,
      skewX: 40,
      scaleX: 1.4,
      filter: 'contrast(4) brightness(2.5) hue-rotate(120deg) saturate(3)',
      opacity: 0.3,
    })
    .to(videoRef.current, { duration: 0.04 })
    .set(videoRef.current, {
      x: 40,
      skewX: -45,
      scaleX: 0.6,
      filter: 'contrast(5) brightness(0.2) hue-rotate(240deg) invert(1)',
      opacity: 0.8,
    })
    .to(videoRef.current, { duration: 0.04 })
    .set(videoRef.current, {
      x: -20,
      skewX: 25,
      scaleX: 1.3,
      filter: 'contrast(3) brightness(2) hue-rotate(-90deg) saturate(4)',
      opacity: 0.4,
    })
    .to(videoRef.current, { duration: 0.04 })
    .set(videoRef.current, {
      x: 15,
      skewX: -15,
      scaleX: 0.8,
      filter: 'contrast(4) brightness(1.8) hue-rotate(45deg) saturate(2)',
      opacity: 0.6,
    })
    .to(videoRef.current, { duration: 0.04 })
    .set(videoRef.current, {
      x: 0,
      skewX: 0,
      scaleX: 1,
      filter: 'contrast(1.2) brightness(1) hue-rotate(0deg) saturate(1) invert(0)',
      opacity: 0.9,
    });
  });

  const handleVideoEnded = () => {
    triggerGlitch();
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Video playback was interrupted:', err);
      });
    }
  };

  return (
    <section className={styles.frequencySection} ref={containerRef}>
      <div className="section-container">
        <div className={styles.contentWrapper}>

          {/* Top Bar */}
          <div className={`${styles.topBar} fade-up`}>
            <div className={styles.topBarLeft}>END FREQUENCY /</div>
            <div className={styles.topBarRight}>SILENCE IS DATA /////</div>
          </div>

          {/* Main Title */}
          <div className={`${styles.titleContainer} fade-up`}>
            <h2 className={styles.mainTitle}>
              THE FREQUENCY<br />
              <span className={styles.titleOutline}>NEVER STOPS</span>
            </h2>
          </div>

          {/* Grid Row */}
          <div className={styles.gridRow}>
            <div className={`${styles.colLeft} fade-up`}>
              <p className={styles.description}>
                We are the signal underground.<br />
                No algorithms. No trends.<br />
                Only <span className={styles.highlight}>raw</span> sound, timeless energy<br />
                and a global network of creators.
              </p>
              <div className={styles.dividerStrip}>
                <Image
                  src="/images/assets/subscribe assets/asset-s1.png"
                  alt="Divider Strip"
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'left center' }}
                />
              </div>
              <p className={styles.stayText}>
                STAY UNDERGROUND.<br />
                <span className={styles.highlight}>STAY CONNECTED.</span>
              </p>
            </div>

            <div className={`${styles.colCenter} fade-up`}>
              <div className={styles.videoWrapper}>
                <video
                  ref={videoRef}
                  src="/images/assets/subscribe assets/world.webm"
                  className={styles.globeVideo}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={handleVideoEnded}
                />
              </div>
            </div>

            <div className={`${styles.colRight} fade-up`}>
              <Image
                src="/images/assets/subscribe assets/asset-s2-column2.png"
                alt="Wireframe Globe Part 2"
                width={383}
                height={426}
                className={styles.globeImage}
              />
            </div>
          </div>

          {/* Middle Divider */}
          <div className={`${styles.hDivider} fade-up`}></div>

        </div>
      </div>
    </section>
  );
}
