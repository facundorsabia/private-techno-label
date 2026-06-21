'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FreeDownload.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FreeDownloadClient() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Connection error.');
      }

      try {
        localStorage.setItem('pt_lead_magnet_subscribed', 'true');
      } catch (err) {
        // Ignorar
      }

      router.push('/thank-you');
      
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus the name input after scrolling
    setTimeout(() => {
      document.getElementById('name-input')?.focus();
    }, 800);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      
      {/* BLOQUE 1: Hero & Captura */}
      <div className={styles.heroWrapper}>
        <section className={styles.heroBlock}>
          <div className={styles.imageSection}>
            <div className={styles.imageOverlay}></div>
            <video 
              src="/videos/SphereEditWebM.webm" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className={styles.coverVideo}
            />
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
              <span className={styles.label}>/// UPGRADE YOUR ARSENAL WITH RAW TECHNO</span>
              <h1 className={styles.title}>DOWNLOAD OUR LATEST EP FOR FREE.</h1>
              <p className={styles.description}>
                Raw, hypnotic frequencies designed purely for the dancefloor. Stop sounding like the rest.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputWrapper}>
                <input
                  id="name-input"
                  type="text"
                  placeholder="YOUR NAME"
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={status === 'loading'}
                  required
                />
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="email-input"
                  type="email"
                  placeholder="YOUR EMAIL"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  required
                />
              </div>
              {status === 'error' && <p className={styles.errorMessage}>{errorMessage}</p>}
              
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className={styles.loadingText}>[ PROCESSING... ]</span>
                ) : (
                  'START DOWNLOAD (WAV)'
                )}
              </button>
              <p className={styles.microCopy}>
                Direct to your inbox. 0% Spam. 100% Underground.
              </p>
            </form>
          </div>
        </section>
      </div>

      {/* BLOQUE 2: Especificaciones Técnicas (Producto) */}
      <section className={`${styles.techSpecsBlock} gsap-block`}>
        <div className={styles.techGrid}>
          <div className={styles.techInfo}>
            <div className={styles.blockHeader}>
              <span className={styles.statusBlink}></span>
              <h2>&gt; AUDIO_FILE // TECH SPECS</h2>
            </div>
            <p className={styles.blockText}>
              We don&apos;t make background music. You are downloading 3 tracks mastered and ready to hit high-pressure club systems. WAV 24-bit / 44.1kHz format.
            </p>

            <div className={styles.tracklist}>
              <div className={styles.trackItem}>
                <div className={styles.trackInfo}>
                  <span className={styles.trackNum}>[ TRK_01 ]</span>
                  <span className={styles.trackTitle}>003% (Original Mix)</span>
                </div>
                <p className={styles.trackDesc}>Heavy bassline and industrial percussion designed for peak time.</p>
              </div>
              <div className={styles.trackItem}>
                <div className={styles.trackInfo}>
                  <span className={styles.trackNum}>[ TRK_02 ]</span>
                  <span className={styles.trackTitle}>003% (Diofaro Remix)</span>
                </div>
                <p className={styles.trackDesc}>Dark atmospheres, broken rhythms and raw kicks.</p>
              </div>
              <div className={styles.trackItem}>
                <div className={styles.trackInfo}>
                  <span className={styles.trackNum}>[ TRK_03 ]</span>
                  <span className={styles.trackTitle}>003% (Benac Remix)</span>
                </div>
                <p className={styles.trackDesc}>Deep hypnotism and mental sequences for closing sets.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.techImageWrapper}>
            <Image 
              src="/images/albumCovers/37-003.jpg" 
              alt="Piero Ceraolo EP" 
              fill 
              className={styles.epCoverImage}
            />
            <div className={styles.epCoverGlow}></div>
          </div>
        </div>
      </section>

      {/* BLOQUE 3: El Manifiesto */}
      <div className={styles.manifestoWrapper}>
        <section className={`${styles.manifestoBlock} gsap-block`}>
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
        <button className={styles.ctaBtnLarge} onClick={scrollToTop}>
          GET FREE EP <span>&uarr;</span>
        </button>
        
        <div className={styles.minimalLegal}>
          <span>&copy; 2026 PRIVATE TECHNO. ALL RIGHTS RESERVED.</span>
        </div>
      </section>

    </div>
  );
}
