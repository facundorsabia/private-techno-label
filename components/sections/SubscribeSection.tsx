'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './SubscribeSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SubscribeSection() {
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
    <section className={styles.subscribeSection} ref={containerRef}>
      <div className="section-container">
        <div className={styles.contentWrapper}>

          {/* Email Row */}
          <div className={styles.emailRow}>
            <div className={`${styles.emailText} fade-up`}>
              <div className={styles.joinLabel}>JOIN <span className={styles.highlight}>THE NETWORK</span></div>
              <h3 className={styles.subTitle}>SUBSCRIBE TO THE FREQUENCY</h3>
              <p className={styles.subDesc}>EXCLUSIVE RELEASES. UNDERGROUND NEWS. NO SPAM.</p>
            </div>
            <div className={`${styles.emailInputContainer} fade-up`}>
              <div className={styles.inputStripe}></div>
              <form className={styles.emailForm} onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL"
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.submitBtn}>SUBMIT</button>
              </form>
            </div>
          </div>

          {/* Bottom Row */}
          <div className={styles.bottomRow}>
            <div className={`${styles.bottomLeft} fade-up`}>
              <div className={`${styles.cornerBracket} ${styles.bracketTL}`}></div>
              <div className={`${styles.cornerBracket} ${styles.bracketTR}`}></div>
              <div className={`${styles.cornerBracket} ${styles.bracketBL}`}></div>
              <div className={`${styles.cornerBracket} ${styles.bracketBR}`}></div>
              <Image
                src="/images/assets/subscribe assets/asset-s3.png"
                alt="Terrain Wireframe"
                fill
                className={styles.terrainImage}
              />
            </div>

            <div className={`${styles.bottomCenter} fade-up`}>
              <div className={styles.quoteIcon}>“</div>
              <p className={styles.quoteText}>
                THIS ISN&apos;T JUST A LABEL.<br />
                IT&apos;S A <span className={styles.highlight}>MOVEMENT</span>.
              </p>
              <p className={styles.quoteSubText}>
                BUILT BY ARTISTS.<br />
                DRIVEN BY FREQUENCY.<br />
                FUELED BY THE <span className={styles.highlight}>UNDERGROUND</span>.
              </p>
              <div className={styles.copyrightLabel}>/// PRIVATE TECHNO © XXXX</div>
            </div>

            <div className={`${styles.bottomRight} fade-up`}>
              <Image
                src="/images/assets/subscribe assets/asset-s4.png"
                alt="HUD Elements"
                width={168}
                height={362}
                className={styles.hudStack}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
