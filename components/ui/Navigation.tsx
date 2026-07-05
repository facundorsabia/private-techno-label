'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const NAV_LINKS = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/#about' },
  { name: 'RELEASES', href: '/#releases' },
  { name: 'ACCESS', href: '/#subscribe' }
];

export default function Navigation() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const isNavigatingRef = useRef(false);

  // Scroll spy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(link => {
        const id = link.href === '/' ? 'hero' : link.href.split('#')[1];
        return document.getElementById(id);
      });

      let currentIdx = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          // If the top of the section is above the middle of the screen
          if (rect.top <= window.innerHeight / 2) {
            currentIdx = i;
            break;
          }
        }
      }

      // Hide timeline navigation when on the Hero section (index 0)
      setIsVisible(currentIdx > 0);
      const currentScrollY = window.scrollY;
      lastScrollYRef.current = currentScrollY;

      // Check if user is at the very bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        currentIdx = sections.length - 1;
      }

      // Only update active index based on scroll if the user is NOT clicking a nav link
      if (!isNavigatingRef.current) {
        setActiveIndex(currentIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    setTimeout(handleScroll, 100); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show navigation on the home page
  if (pathname !== '/') {
    return null;
  }

  return (
    <>
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
        </div>
      </header>

      <div className={`${styles.timelineContainer} ${!isVisible ? styles.hidden : ''}`}>
        <div className={styles.timelineAxis} />
        <nav className={styles.timelineNav}>
          {NAV_LINKS.map((link, index) => {
            const isActive = index === activeIndex;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => {
                  setActiveIndex(index);
                  isNavigatingRef.current = true;
                  setTimeout(() => {
                    isNavigatingRef.current = false;
                  }, 1200);
                }}
              >
                <div className={styles.labelContainer}>
                  <span className={styles.itemNumber}>0{index + 1}</span>
                  <span className={styles.itemText}>{link.name}</span>
                </div>
                <div className={styles.node}>
                  {isActive && <div className={styles.activeGlow} />}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
