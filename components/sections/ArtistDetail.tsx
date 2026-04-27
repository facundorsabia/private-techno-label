'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Artist } from '@/data/artists';
import { RELEASES } from '@/data/releases';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './ArtistDetail.module.css';
import BinaryScramble from '@/components/ui/BinaryScramble';

interface ArtistDetailProps {
  artist: Artist;
}

export default function ArtistDetail({ artist }: ArtistDetailProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  
  // Find artist's releases
  const artistReleases = RELEASES.filter(r => r.artist.toUpperCase().includes(artist.name.toUpperCase()));

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(`.${styles.backLink}`, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 })
      .fromTo(`.${styles.imageSection}`, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 }, "-=0.4")
      .fromTo(`.${styles.content} > *`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 }, "-=0.6");

    // Kinetic lines animation
    gsap.to(`.${styles.kineticLine}`, {
      scaleX: 1.5,
      opacity: 0.3,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 1
    });

    // Scanline sweep animation
    gsap.to(`.${styles.scanlineSweep}`, {
      top: "100%",
      duration: 8,
      repeat: -1,
      ease: "power1.inOut",
      delay: 2
    });
  }, { scope: containerRef, dependencies: [artist.id] });

  return (
    <section className={styles.artistDetail} ref={containerRef}>
      {/* Background Decorations */}
      <div className={styles.bgDots} />
      <div className={styles.scanlineSweep} />

      <div className={styles.kineticLine} style={{ top: '15%', left: '10%' }} />
      <div className={styles.kineticLine} style={{ top: '65%', right: '5%' }} />
      <div className={styles.techShape} />

      <div className="section-container">
        <Link href="/#roster" className={styles.backLink}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>BACK TO ROSTER</span>
        </Link>

        <div className={styles.mainGrid}>
          {/* Left: Artist Image & Meta */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className={styles.artistImg}
              />
              <div className={styles.scanlines} />
              <div className={styles.cornerTL} />
              <div className={styles.cornerTR} />
              <div className={styles.cornerBL} />
              <div className={styles.cornerBR} />
              
              {/* Technical tag */}
              <div className={styles.imgTag}>
                <span className={styles.pulseDot} />
                LIVE_FEED: ACTIVE
              </div>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className="ui-label">ID_CODE</span>
                <p>{artist.id.toUpperCase()}</p>
              </div>
              <div className={styles.metaItem}>
                <span className="ui-label">LOCATION</span>
                <p>{artist.location}</p>
              </div>
              <div className={styles.metaItem}>
                <span className="ui-label">SIGNAL</span>
                <p className={styles.orangeText}>ENCRYPTED</p>
              </div>
            </div>

            {/* Booking on the left column as requested */}
            <div className={styles.bookingSection}>
              <a href="mailto:booking@privatetechno.com" className={styles.bookingButton}>
                <span>REQUEST_TRANSMISSION // BOOKING</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Info, Bio & Releases */}
          <div className={styles.content}>
            <div className={styles.titleGroup}>
              <div className={styles.titlePre}>
                <span className="ui-label">ARTIST_PROFILE // {artist.id.toUpperCase()}</span>
                <div className={styles.headerLine} />
              </div>
              <h1 className={styles.name}>
                <BinaryScramble text={artist.name} duration={800} delay={400} />
              </h1>
              <p className={styles.role}>{artist.role}</p>
            </div>

            <div className={styles.bioSection}>
              <span className="ui-label">BIOGRAPHY</span>
              <p className={styles.bio}>{artist.bio}</p>
            </div>

            {artist.videoUrl && (
              <div className={styles.videoSection}>
                <div className={styles.videoHeader}>
                  <span className="ui-label">TRANSMISSION_VISUAL // LIVE_SET</span>
                  <span className={styles.videoStatus}>
                    {isVideoLoaded ? 'STREAMING' : 'CONNECTING...'}
                  </span>
                </div>
                
                <div className={styles.videoWrapper}>
                  {!isVideoLoaded && (
                    <div className={styles.videoLoader}>
                      <div className={styles.loaderContent}>
                        <div className={styles.spinner} />
                        <span className={styles.loaderText}>INITIALIZING_VIDEO_STREAM</span>
                        <div className={styles.loaderBar}>
                          <div className={styles.loaderBarFill} />
                        </div>
                      </div>
                    </div>
                  )}
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${artist.videoUrl}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.iframe}
                    onLoad={() => setIsVideoLoaded(true)}
                  ></iframe>
                </div>
              </div>
            )}

            {artistReleases.length > 0 && (
              <div className={styles.releasesSection}>
                <span className="ui-label">DISCOGRAPHY / ARTIFACTS</span>
                <div className={styles.releasesGrid}>
                  {artistReleases.map(release => (
                    <Link key={release.id} href={`/releases/${release.id}`} className={styles.releaseItem}>
                      <div className={styles.releaseCover}>
                        <Image src={release.cover} alt={release.title} fill sizes="50px" />
                      </div>
                      <div className={styles.releaseInfo}>
                        <p className={styles.releaseTitle}>{release.title}</p>
                        <p className={styles.releaseCatalog}>{release.catalog}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.linksSection}>
              <span className="ui-label">EXTERNAL_CHANNELS</span>
              <div className={styles.links}>
                {Object.entries(artist.links).map(([platform, url]) => (
                  <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {platform.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
