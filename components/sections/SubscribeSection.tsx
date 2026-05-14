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
                src="/images/assets/subscribe assets/asset-s2.png"
                alt="Wireframe Globe"
                width={766}
                height={426}
                className={styles.globeImage}
              />
            </div>

          </div>

          {/* Middle Divider */}
          <div className={`${styles.hDivider} fade-up`}></div>

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
