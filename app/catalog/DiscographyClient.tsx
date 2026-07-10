'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RELEASES } from '@/data/releases';
import dynamic from 'next/dynamic';
import styles from './Discography.module.css';
const ParticleSphere = dynamic(() => import('@/components/ui/ParticleSphere'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function DiscographyClient() {
  const containerRef = useRef<HTMLDivElement>(null);



  // Animation for scrolling elements
  const { contextSafe } = useGSAP(() => {
    const blocks = gsap.utils.toArray('.gsap-block');
    
    blocks.forEach((block: any) => {
      gsap.fromTo(block, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Continuous Flipping Animation
    const cards = gsap.utils.toArray('.flip-card-item');
    
    const flipRandomCard = () => {
      if (cards.length === 0) return;
      // Pick a random card
      const cardToFlip = gsap.utils.random(cards) as Element;
      if (!cardToFlip) return;
      
      // Get current rotation and snap to nearest 180 degrees to prevent sideways stuck state
      let currentRot = gsap.getProperty(cardToFlip, "rotationY") as number || 0;
      currentRot = Math.round(currentRot / 180) * 180;
      
      gsap.to(cardToFlip, {
        rotationY: currentRot + 180,
        duration: 1.2,
        ease: "back.out(1.2)",
        overwrite: "auto",
        onComplete: () => {
          // Update the hidden face with a new random cover from the entire catalog
          const index = parseInt(cardToFlip.getAttribute('data-index') || '0', 10);
          const isShowingBack = ((currentRot + 180) / 180) % 2 !== 0;
          const randomRelease = sortedReleases[Math.floor(Math.random() * sortedReleases.length)];
          
          setGridCards(prev => {
            const newCards = [...prev];
            if (isShowingBack) {
              newCards[index] = { ...newCards[index], front: randomRelease };
            } else {
              newCards[index] = { ...newCards[index], back: randomRelease };
            }
            return newCards;
          });
        }
      });

      // Schedule next flip between 1 and 3 seconds
      gsap.delayedCall(gsap.utils.random(1, 3), flipRandomCard);
    };

    if (cards.length > 0) {
      // Start two concurrent flip loops for more activity
      gsap.delayedCall(1, flipRandomCard);
      gsap.delayedCall(2.5, flipRandomCard);
    }

  }, { scope: containerRef });

  const handleMouseEnter = contextSafe((e: React.MouseEvent) => {
    const card = e.currentTarget;
    let currentRot = (gsap.getProperty(card, "rotationY") as number) || 0;
    // Snap to nearest 180 degrees
    currentRot = Math.round(currentRot / 180) * 180;
    
    gsap.to(card, {
      rotationY: currentRot + 180,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        const index = parseInt(card.getAttribute('data-index') || '0', 10);
        const isShowingBack = ((currentRot + 180) / 180) % 2 !== 0;
        const randomRelease = sortedReleases[Math.floor(Math.random() * sortedReleases.length)];
        
        setGridCards(prev => {
          const newCards = [...prev];
          if (isShowingBack) {
            newCards[index] = { ...newCards[index], front: randomRelease };
          } else {
            newCards[index] = { ...newCards[index], back: randomRelease };
          }
          return newCards;
        });
      }
    });
  });

  const checkoutLink = "https://private-techno-catalog.lemonsqueezy.com/checkout/buy/72c67918-0003-40b7-bc72-9e4ffe132051";

  // Prepare covers for the 3x3 grid (9 flip cards)
  const sortedReleases = [...RELEASES].sort((a, b) => b.id.localeCompare(a.id));
  
  const [gridCards, setGridCards] = useState(() => {
    return Array.from({ length: 9 }).map((_, i) => ({
      front: sortedReleases[i],
      back: sortedReleases[i + 9] || sortedReleases[i]
    }));
  });

  return (
    <div className={styles.container} ref={containerRef}>
      
      {/* BLOQUE 1: Hero & Checkout Area */}
      <div className={styles.heroWrapper}>
        <section className={styles.heroBlock}>
          <div className={styles.imageSection}>
            <div className={styles.imageOverlay}></div>
            <div className={styles.particleContainer}>
              <ParticleSphere />
            </div>
            {/* Logo overlay */}
            <div className={styles.heroLogoWrapper}>
              <Image 
                src="/images/logos/private-rebranding-logo-no-bg.png" 
                alt="Private Techno Logo" 
                width={350} 
                height={100} 
                className={styles.heroLogo}
                priority
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.header}>
              <div className={styles.statusBlink} style={{ display: 'inline-block', marginRight: '10px', marginBottom: '2px' }}></div>
              <span className={styles.label} style={{ display: 'inline' }}>TRANSMISSION SENT</span>
              <h1 className={styles.title} style={{ marginTop: '20px' }}>UPGRADE YOUR ARSENAL.</h1>
              <p className={styles.description}>
                Your free EP is on the way. While you wait, secure the complete Private Techno discography at an exclusive underground price.
              </p>
            </div>

            <div className={styles.form} style={{ marginTop: '20px' }}>
              <div className={styles.pricing}>
                <span className={styles.oldPrice}>$185.00</span>
                <span className={styles.newPrice}>$49.00</span>
                <span className={styles.discountTag}>[SAVE 73%]</span>
              </div>
              
              <a 
                href={checkoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.submitBtn}
                style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).fbq) {
                    (window as any).fbq('track', 'InitiateCheckout', {
                      content_name: 'Private Techno Full Catalog Bundle',
                      content_category: 'bundle',
                      value: 49.00,
                      currency: 'USD'
                    });
                  }
                }}
              >
                SECURE FULL BUNDLE
              </a>
              <p className={styles.microCopy}>
                Secure checkout via Lemon Squeezy. You will instantly receive a secure Access Key to our private vault to download the massive 12GB+ WAV catalog.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* BLOQUE 2: Especificaciones Técnicas (Qué Incluye) */}
      <section className={`${styles.techSpecsBlock} gsap-block`}>
        <div className={styles.techGrid}>
          <div className={styles.techInfo}>
            <div className={styles.blockHeader}>
              <span className={styles.statusBlink}></span>
              <h2>&gt; AUDIO_VAULT // BUNDLE CONTENT</h2>
            </div>
            <p className={styles.blockText}>
              You are acquiring 4 years of uncompromising sonic warfare. 37 EPs filled with raw, hypnotic frequencies designed strictly for the dancefloor.
            </p>

            <div className={styles.tracklist}>
              <div className={styles.trackItem}>
                <div className={styles.trackNum}>[ ITEM_01 ]</div>
                <div className={styles.trackContent}>
                  <span className={styles.trackTitle}>37 High-Impact Releases</span>
                  <p className={styles.trackDesc}>The complete Private Techno catalog, from PRV001 to PRV037.</p>
                </div>
              </div>
              <div className={styles.trackItem}>
                <div className={styles.trackNum}>[ ITEM_02 ]</div>
                <div className={styles.trackContent}>
                  <span className={styles.trackTitle}>100+ Dancefloor Weapons</span>
                  <p className={styles.trackDesc}>Original mixes and underground remixes crafted by global artists.</p>
                </div>
              </div>
              <div className={styles.trackItem}>
                <div className={styles.trackNum}>[ ITEM_03 ]</div>
                <div className={styles.trackContent}>
                  <span className={styles.trackTitle}>Lossless Quality</span>
                  <p className={styles.trackDesc}>WAV 24-bit / 44.1kHz format ready for massive club systems.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.techImageWrapper}>
            <div className={styles.epCoverGlow}></div>
            <div className={styles.catalogGrid}>
              {gridCards.map((card, i) => {
                return (
                  <div 
                    key={`flip-slot-${i}`} 
                    data-index={i}
                    className={`${styles.flipCard} flip-card-item`}
                    onMouseEnter={handleMouseEnter}
                  >
                    <div className={styles.flipCardFace}>
                      <Image src={card.front.cover} alt={card.front.title} fill className={styles.epCoverImage} sizes="(max-width: 768px) 100px, 150px" />
                    </div>
                    <div className={`${styles.flipCardFace} ${styles.flipCardBack}`}>
                      <Image src={card.back.cover} alt={card.back.title} fill className={styles.epCoverImage} sizes="(max-width: 768px) 100px, 150px" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 3: El Manifiesto */}
      <div className={styles.manifestoWrapper}>
        <section className={styles.manifestoBlock}>
          <div className={styles.manifestoContent}>
            <div className={styles.blockHeader}>
              <span className={styles.statusBlink}></span>
              <h2>&gt; ORIGIN // PRIVATE TECHNO</h2>
            </div>
            <p className={styles.manifestoText}>
              We are the signal underground. Operating from the end of the world: Buenos Aires, Argentina.
              <br/><br/>
              No algorithms. No trends. Only raw sound, timeless energy, and the hypnotic techno we want to play in our own sets.
              <br/><br/>
              We build our own dancefloor tools. Now, we are opening the doors to our library for you.<br/>
              <span style={{ color: 'var(--orange)', letterSpacing: '0.1em' }}>STAY UNDERGROUND. STAY CONNECTED.</span>
            </p>
          </div>
          <div className={styles.manifestoImage}>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className={styles.grittyVideo}
            >
              <source src="/videos/new-mundo.webm" type="video/webm" />
            </video>
          </div>
        </section>
      </div>

      {/* BLOQUE 4: Cierre CTA */}
      <section className={`${styles.closingBlock} gsap-block`}>
        <h2 className={styles.closingTitle}>THE DANCEFLOOR WON&apos;T WAIT.</h2>
        <a 
          href={checkoutLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtnLarge}
          style={{ textDecoration: 'none' }}
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).fbq) {
              (window as any).fbq('track', 'InitiateCheckout', {
                content_name: 'Private Techno Full Catalog Bundle',
                content_category: 'bundle',
                value: 49.00,
                currency: 'USD'
              });
            }
          }}
        >
          DOWNLOAD THE CATALOG
        </a>
        
        <div className={styles.minimalLegal}>
          <span>&copy; 2026 PRIVATE TECHNO. ALL RIGHTS RESERVED.</span>
        </div>
      </section>

    </div>
  );
}
