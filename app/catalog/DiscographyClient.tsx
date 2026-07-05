'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RELEASES } from '@/data/releases';
import styles from './Discography.module.css';
import ParticleSphere from '@/components/ui/ParticleSphere';
import CustomCursor from '@/components/ui/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export default function DiscographyClient() {
  const containerRef = useRef<HTMLDivElement>(null);



  // Animation for scrolling elements
  useGSAP(() => {
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


  }, { scope: containerRef });

  const checkoutLink = "https://private-techno-catalog.lemonsqueezy.com/checkout/buy/72c67918-0003-40b7-bc72-9e4ffe132051";

  return (
    <div className={styles.container} ref={containerRef}>
      
      {/* BLOQUE 1: Hero & Checkout Area */}
      <div className={styles.heroWrapper}>
        <section className={styles.heroBlock} id="catalog-hero">
          <CustomCursor targetId="catalog-hero" />
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
                <span className={styles.discountTag}>[ SAVE 73% ]</span>
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
                Secure checkout via Lemon Squeezy. Instant WAV download.
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
                <div className={styles.trackInfo}>
                  <span className={styles.trackNum}>[ ITEM_01 ]</span>
                  <span className={styles.trackTitle}>37 High-Impact Releases</span>
                </div>
                <p className={styles.trackDesc}>The complete Private Techno catalog, from PRV001 to PRV037.</p>
              </div>
              <div className={styles.trackItem}>
                <div className={styles.trackInfo}>
                  <span className={styles.trackNum}>[ ITEM_02 ]</span>
                  <span className={styles.trackTitle}>100+ Dancefloor Weapons</span>
                </div>
                <p className={styles.trackDesc}>Original mixes and underground remixes crafted by global artists.</p>
              </div>
              <div className={styles.trackItem}>
                <div className={styles.trackInfo}>
                  <span className={styles.trackNum}>[ ITEM_03 ]</span>
                  <span className={styles.trackTitle}>Lossless Quality</span>
                </div>
                <p className={styles.trackDesc}>WAV 24-bit / 44.1kHz format ready for massive club systems.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.techImageWrapper}>
            <Image 
              src="/images/landing/catalog-complete.jpg" 
              alt="Complete Private Techno Catalog Bundle" 
              fill 
              className={styles.epCoverImage}
            />
            <div className={styles.epCoverGlow}></div>
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
