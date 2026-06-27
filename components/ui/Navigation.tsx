'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './Navigation.module.css';
import BinaryScramble from './BinaryScramble';

const NAV_LINKS = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/#about' },
  { name: 'RELEASES', href: '/#releases' },
  { name: 'FREQUENCY', href: '/#frequency' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();



  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname]);

  useGSAP(() => {
    if (pathname === '/free-download' || pathname === '/catalog' || pathname === '/thank-you') {
      return;
    }

    // Setup GSAP Timeline
    tlRef.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        opacity: 1,
        duration: 0.8,
        ease: 'power4.inOut'
      })
      .to(`.${styles.navLink}`, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .to(`.${styles.meta}`, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.4');

  }, { scope: containerRef });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      tlRef.current?.play();
    } else {
      document.body.style.overflow = '';
      tlRef.current?.reverse();
    }
  }, [isOpen]);

  // Hide on funnel pages
  if (pathname === '/free-download' || pathname === '/catalog' || pathname === '/thank-you') {
    return null;
  }

  return (
    <div ref={containerRef}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className="ui-label">SYS.001</span>
          <span className={styles.divider} />
          <span className="ui-label">FREQ.140BPM</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.globe}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" width="18" height="18">
              <circle cx="12" cy="12" r="10" />
              <ellipse cx="12" cy="12" rx="4" ry="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <span className="ui-label">48.8566° N, 2.3522° E</span>
          <button 
            className={styles.toggle}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg viewBox="0 0 40 40" className={`${styles.menuIcon} ${isOpen ? styles.menuOpen : ''}`}>
              <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className={styles.iconCircle} />
              <circle cx="20" cy="20" r="12" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="14" y1="17" x2="26" y2="17" stroke="currentColor" strokeWidth="1.5" className={styles.line1} />
              <line x1="14" y1="23" x2="26" y2="23" stroke="currentColor" strokeWidth="1.5" className={styles.line2} />
            </svg>
          </button>
        </div>
      </header>

      <div 
        ref={overlayRef} 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
      >
        <div className={styles.scanlines} />
        
        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />

        <nav className={styles.navContent}>
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              {isOpen ? <BinaryScramble text={link.name} delay={500} /> : link.name}
            </Link>
          ))}
        </nav>

        <div className={styles.meta}>
          <span>SYS_NAV_ACTIVE</span>
          <span>EST. 2026</span>
          <span>LAT:-34.6037 LON:-58.3816</span>
        </div>
      </div>
    </div>
  );
}
