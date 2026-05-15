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

  useGSAP(() => {
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
              <Image
                src="/images/assets/subscribe assets/asset-s2-column1.png"
                alt="Wireframe Globe Part 1"
                width={383}
                height={426}
                className={styles.globeImage}
              />
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
