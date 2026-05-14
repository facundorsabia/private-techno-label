'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FeaturedReleaseSection.module.css';
import { RELEASES } from '@/data/releases';
import BinaryScramble from '@/components/ui/BinaryScramble';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedReleaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // We want to feature the first release, PRV037
  const featuredRelease = RELEASES[0];

  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. DataBox Parallax
    const dataBox = containerRef.current.querySelector(`.${styles.dataBox}`);
    if (dataBox) {
      gsap.to(dataBox, {
        yPercent: -150, // Move it up heavily during scroll
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // 2. Image Container Parallax & Entrance
    if (imageRef.current) {
      // Parallax
      gsap.to(imageRef.current, {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Heavy blur to clear entrance
      gsap.from(imageRef.current, {
        scale: 1.05,
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

    // 3. Header animations
    if (headerRef.current) {
      const headerElements = Array.from(headerRef.current.children);
      const headerLine = headerElements.find(el => el.classList.contains(styles.headerLine));
      const otherHeaders = headerElements.filter(el => !el.classList.contains(styles.headerLine));

      // Fade up and unblur text
      gsap.from(otherHeaders, {
        y: 20,
        opacity: 0,
        filter: 'blur(5px)',
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        }
      });

      // Draw line from left
      if (headerLine) {
        gsap.from(headerLine, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          }
        });
      }
    }

    // 4. Badge flickering (Terminal boot up style)
    const badge = containerRef.current.querySelector(`.${styles.badge}`);
    if (badge) {
      gsap.fromTo(badge,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.05,
          repeat: 6,
          yoyo: true,
          ease: 'steps(1)',
          scrollTrigger: {
            trigger: badge,
            start: 'top 90%',
          }
        }
      );
    }

    // 5. Content elements stagger (Text, paragraph, player, button)
    if (contentRef.current) {
      const elements = Array.from(contentRef.current.children);
      gsap.from(elements, {
        y: 40,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        }
      });
    }
  }, { scope: containerRef });

  return (
    <section className={styles.featuredSection} id="featured-release" ref={containerRef}>
      <div className={styles.dataBox}>
        SYS.REQ // FEATURED_TRANSMISSION // {featuredRelease.catalog}
      </div>

      <div className={styles.header} ref={headerRef}>
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
        <div className="flex justify-between items-center w-full mt-2">
          <span className="ui-label opacity-60">CATALOG: {featuredRelease.catalog}</span>
          <span className="ui-label opacity-40">SYSTEM_UPDATE</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className="flex flex-col gap-6 w-full">
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            LAST RELEASE
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
    </section>
  );
}
