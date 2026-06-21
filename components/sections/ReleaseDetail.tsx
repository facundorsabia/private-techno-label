'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Release, RELEASES } from '@/data/releases';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './ReleaseDetail.module.css';
import BinaryScramble from '@/components/ui/BinaryScramble';

interface ReleaseDetailProps {
  release: Release;
}

export default function ReleaseDetail({ release }: ReleaseDetailProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState<string>('00:00:00');

  React.useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Find current index to calculate navigation
  const currentIndex = RELEASES.findIndex(r => r.id === release.id);
  const nextRelease = currentIndex > 0 ? RELEASES[currentIndex - 1] : null;
  const prevRelease = currentIndex < RELEASES.length - 1 ? RELEASES[currentIndex + 1] : null;

  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: release.title,
        content_type: 'product',
        content_ids: [release.catalog]
      });
    }
  }, [release.id, release.title, release.catalog]);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(`.${styles.backLink}`, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 })
      .fromTo(`.${styles.cover}`, { opacity: 0, scale: 0.9, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8 }, "-=0.4")
      .fromTo(`.${styles.info} > *`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 }, "-=0.6")
      .fromTo(`.${styles.player}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
      .fromTo(`.${styles.navigation}`, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.2");
  }, { scope: containerRef, dependencies: [release.id] });

  return (
    <section className={styles.releaseDetail} ref={containerRef}>
      <div className="section-container">
        <Link href="/#releases" className={styles.backLink}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>BACK TO CATALOG</span>
        </Link>

        <div className={styles.content}>
          {/* Background Decor */}
          <div className={styles.bgDecor}>
            <div className={styles.bgLine} />
            <div className={styles.bgLine} />
            <div className={styles.bgLine} />
            
            {/* Asset Shapes from Home */}
            <div className={styles.shape1}>
              <Image src="/images/assets/shape1.png" alt="" width={400} height={400} />
            </div>
            <div className={styles.shape2}>
              <Image src="/images/assets/shape3.png" alt="" width={300} height={300} />
            </div>
          </div>

          {/* Left Side: Artwork */}
          <div className={styles.artworkSection}>
            <div 
              className={`${styles.cover} glow-border`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePos({
                  x: Math.round(e.clientX - rect.left),
                  y: Math.round(e.clientY - rect.top)
                });
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Image
                src={release.cover}
                alt={release.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              {/* Scanline Overlay */}
              <div className={styles.scanlines} />
              <div className={styles.cornerAccent} />

              {/* Custom Crosshair Cursor - Moved inside cover to be relative to it */}
              {isHovering && (
                <div 
                  className={styles.crosshair}
                  style={{ 
                    left: `${mousePos.x}px`, 
                    top: `${mousePos.y}px` 
                  }}
                >
                  <div className={styles.chX} />
                  <div className={styles.chY} />
                  <div className={styles.chCoords}>
                    X:{mousePos.x} Y:{mousePos.y}
                  </div>
                </div>
              )}
            </div>
            
            {/* System Status Label - Decorative */}
            <div className={styles.systemStatus}>
              <div className={styles.statusDot} />
              <span>STREAMS_ACTIVE // {currentTime}</span>
            </div>

            {/* BUY CTA - Repositioned here */}
            <a 
              href={`https://private-techno.bandcamp.com/album/${release.bandcampSlug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.buyButton}
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).fbq) {
                  (window as any).fbq('track', 'InitiateCheckout', {
                    content_name: release.title,
                    content_ids: [release.catalog],
                    content_type: 'product',
                    value: 5.00,
                    currency: 'USD'
                  });
                }
              }}
            >
              <span>BUY ON BANDCAMP</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right Side: Info & Player */}
          <div className={styles.infoSection}>
            <div className={styles.info}>
              <span className={styles.catalogLabel}>{release.catalog}</span>
              <h1 className={styles.title}>
                <BinaryScramble text={release.title} duration={800} delay={400} />
              </h1>
              <h2 className={styles.artist}>
                <BinaryScramble text={release.artist} duration={800} delay={600} />
              </h2>
              
              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className="ui-label">RELEASE DATE</span>
                  <p>{release.releaseDate}</p>
                </div>
                <div className={styles.detailItem}>
                  <span className="ui-label">LABEL</span>
                  <p>PRIVATE TECHNO</p>
                </div>
              </div>

              <div className={styles.description}>
                <span className="ui-label">ABOUT THIS RELEASE</span>
                <p>{release.description}</p>
              </div>
            </div>

            <div className={styles.player}>
              <iframe
                style={{ border: 0, width: '100%', height: '241px' }}
                src={`https://bandcamp.com/EmbeddedPlayer/album=${release.bandcampId}/size=large/bgcol=333333/linkcol=b74829/artwork=small/transparent=true/`}
                seamless
                title={`Bandcamp player for ${release.title}`}
              >
                <a href="https://privatetechno.bandcamp.com">{release.title} by {release.artist}</a>
              </iframe>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className={styles.navigation}>
          {prevRelease ? (
            <Link href={`/releases/${prevRelease.id}`} className={styles.navLink}>
              <span className="ui-label">PREVIOUS</span>
              <div className={styles.navContent}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <div className={styles.navText}>
                  <p className={styles.navTitle}>{prevRelease.title}</p>
                  <p className={styles.navArtist}>{prevRelease.artist}</p>
                </div>
              </div>
            </Link>
          ) : <div className={styles.navSpacer} />}

          {nextRelease ? (
            <Link href={`/releases/${nextRelease.id}`} className={`${styles.navLink} ${styles.navLinkNext}`}>
              <span className="ui-label">NEXT RELEASE</span>
              <div className={styles.navContent}>
                <div className={styles.navText}>
                  <p className={styles.navTitle}>{nextRelease.title}</p>
                  <p className={styles.navArtist}>{nextRelease.artist}</p>
                </div>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ) : <div className={styles.navSpacer} />}
        </div>
      </div>
    </section>
  );
}
