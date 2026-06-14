'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FeaturedReleaseSection.module.css';
import { RELEASES } from '@/data/releases';
import BinaryScramble from '@/components/ui/BinaryScramble';
import ScrollReveal from '@/components/ScrollReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedReleaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // We want to feature the first release, PRV037
  const featuredRelease = RELEASES[0];

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Banner entrance animation (scale up slightly and fade in)
    if (bannerRef.current) {
      gsap.from(bannerRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });
    }

    // Image Parallax & Entrance
    if (imageRef.current) {
      gsap.from(imageRef.current, {
        scale: 1.1,
        opacity: 0,
        filter: 'brightness(2) blur(20px)',
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 85%',
        }
      });
    }

    // Content elements stagger
    if (contentRef.current) {
      const elements = Array.from(contentRef.current.children);
      gsap.from(elements, {
        x: 40,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top 75%',
        }
      });
    }
  }, { scope: sectionRef });

  const marqueeText = `/// LATEST RELEASE /// OUT NOW /// ${featuredRelease.catalog} /// ${featuredRelease.artist} - ${featuredRelease.title} `;

  return (
    <section className={styles.featuredSection} id="featured-release-1" ref={sectionRef}>
      <ScrollReveal className={styles.fullWidth}>
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <div className={styles.titleWrapper}>
              <span className="ui-label text-orange" style={{ color: '#b74829' }}>SPOTLIGHT</span>
              <div className={styles.titleRow}>
                <h2 className={styles.sectionTitle}>
                  <span>
                    <span style={{ color: '#b74829' }}>FEΔTURΣD</span>
                  </span>{' '}
                  RELΞΔSE
                </h2>
                <div className={styles.headerAsset}>
                  <Image
                    src="/images/assets/ciberpunk-asset.png"
                    alt="Cyber HUD Element"
                    width={400}
                    height={50}
                    priority
                    className={styles.assetImage}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.headerLine} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '0.5rem' }}>
            <span className="ui-label opacity-60">CATALOG: {featuredRelease.catalog}</span>
            <span className="ui-label opacity-40">SYSTEM_UPDATE</span>
          </div>
        </div>
      </ScrollReveal>

      <div className={styles.bannerWrapper} ref={bannerRef}>
        <div className={styles.bannerBackground}>
          <Image 
            src={featuredRelease.cover} 
            alt="Background" 
            fill 
            className={styles.bgImage} 
            sizes="100vw"
          />
          <div className={styles.bgOverlay} />
          <div className={styles.bgTexture} />
        </div>

        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeContainer}>
            <div className={styles.marquee}>
              <span>{marqueeText.repeat(6)}</span>
              <span>{marqueeText.repeat(6)}</span>
            </div>
          </div>
        </div>

        <div className={styles.bannerBorder}>
          <div className={styles.cornerTl} />
          <div className={styles.cornerTr} />
          <div className={styles.cornerBl} />
          <div className={styles.cornerBr} />
        </div>

        <div className={styles.container}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', position: 'relative', zIndex: 10 }}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              LATEST RELEASE
            </div>
            <div className={styles.imageWrapper} ref={imageRef}>
              <Image
                src={featuredRelease.cover}
                alt={`${featuredRelease.title} by ${featuredRelease.artist}`}
                fill
                className={styles.image}
                sizes="(max-width: 992px) 100vw, 50vw"
                priority
              />
              <div className={styles.glitchOverlay} />
            </div>
          </div>

          <div className={styles.content} ref={contentRef}>
            <div className={styles.titleGroup}>
              <span className={styles.artist}>
                <BinaryScramble text={featuredRelease.artist} duration={800} />
              </span>
              <h2 className={styles.title}>
                <BinaryScramble text={featuredRelease.title} delay={200} duration={1000} />
              </h2>
              <span className={styles.catalog}>{featuredRelease.catalog}</span>
            </div>

            <div className={styles.description}>
              <p className={styles.paragraph}>
                003% marks the return of Private Techno after nearly a year of silence.
              </p>
              <p className={styles.paragraph}>
                Three tracks by Piero Ceraolo: 001%, 002%, 003% delivering hypnotic, groove-focused techno built for the floor.
              </p>
              <p className={styles.paragraph}>
                A functional release from one of the most consistent producers in Argentina and Latin America, reaffirming trust between artist and label.
              </p>
            </div>

            <div className={styles.playerContainer}>
              <iframe
                style={{ border: 0, width: '100%', height: '120px' }}
                src={`https://bandcamp.com/EmbeddedPlayer/album=${featuredRelease.bandcampId}/size=large/bgcol=111111/linkcol=b74829/tracklist=false/artwork=small/transparent=true/`}
                seamless
                title={`${featuredRelease.title} Bandcamp Player`}
              />
            </div>

            <div className={styles.actions}>
              <a
                href={`https://private-techno.bandcamp.com/album/${featuredRelease.bandcampSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buyButton}
              >
                <span>BUY ON BANDCAMP</span>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
