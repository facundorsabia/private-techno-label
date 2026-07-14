'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';
import styles from './CatalogBanner.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CatalogBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Lemon Squeezy Overlay
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).createLemonSqueezy) {
      (window as any).createLemonSqueezy();
    }
  }, []);

  // Subtle entry animation
  useGSAP(() => {
    const el = containerRef.current;
    if (el) {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    }
  }, { scope: containerRef });

  const checkoutLink = "https://private-techno-catalog.lemonsqueezy.com/checkout/buy/787ad184-0f95-4625-be73-15e25174bc07?embed=1";

  return (
    <div className={styles.bannerWrapper} ref={containerRef}>
      <Script 
        src="https://assets.lemonsqueezy.com/lemon.js" 
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).createLemonSqueezy) {
            (window as any).createLemonSqueezy();
          }
        }}
      />
      
      <div className={styles.bannerContent}>
        <div className={styles.textContent}>
          <h3 className={styles.title}>
            <span className={styles.statusBlink}></span>
            THE COMPLETE VAULT
          </h3>
          <span className={styles.subtitle}>37 RELEASES // 100+ WEAPONS // 12GB+ WAV</span>
        </div>
        
        <a 
          href={checkoutLink}
          className={`${styles.ctaBtn} lemonsqueezy-button`}
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
          SECURE BUNDLE [$49]
        </a>
      </div>
    </div>
  );
}
