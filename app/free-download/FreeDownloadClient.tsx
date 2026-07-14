'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import styles from './FreeDownload.module.css';
const ParticleSphere = dynamic(() => import('@/components/ui/ParticleSphere'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function FreeDownloadClient() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTrack, setCurrentTrack] = useState<{title: string, num: string, url: string} | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const TRACKS = [
    { num: 'TRK_01', title: 'Benac - Destroy Conformism (Original Mix)', url: encodeURI('/audio/previews/Benac - Destroy Conformism (Original Mix).mp3') },
    { num: 'TRK_02', title: 'Diofaro - Absolution (Original Mix)', url: encodeURI('/audio/previews/Diofaro - Absolution (Original Mix).mp3') },
    { num: 'TRK_03', title: 'H-R-Z - Hypnagogic (Original Mix)', url: encodeURI('/audio/previews/H-R-Z - Hypnagogic (Original Mix).mp3') },
    { num: 'TRK_04', title: 'Mauri Mastra - Monolith (Original Mix)', url: encodeURI('/audio/previews/Mauri Mastra - Monolith (Original Mix).mp3') },
    { num: 'TRK_05', title: 'Piero Ceraolo - 001 (Original Mix)', url: encodeURI('/audio/previews/Piero Ceraolo - 001 (Original Mix).mp3') },
    { num: 'TRK_06', title: 'SYNDRM - Airplane Security (Original Mix)', url: encodeURI('/audio/previews/SYNDRM - Airplane Security (Original Mix).mp3') }
  ];

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

  // Handle hidden audio playback
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.play().catch(e => console.log('Audio playback failed', e));
    } else if (!currentTrack && audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentTrack]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

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

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
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
              <span className={styles.label}>/// UPGRADE YOUR ARSENAL WITH RAW TECHNO</span>
              <h1 className={styles.title}>DOWNLOAD OUR UNDERGROUND SELECTION FOR FREE.</h1>
              <p className={styles.description}>
                Raw, hypnotic frequencies designed purely for the dancefloor. Stop sounding like the rest.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>

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
              We don&apos;t make background music. You are downloading 6 tracks mastered and ready to hit high-pressure club systems. WAV 24-bit / 44.1kHz format.
            </p>

            <div className={styles.tracklist}>
              {TRACKS.map((track) => (
                <div className={styles.trackItem} key={track.num}>
                  <div className={styles.trackNum}>[{track.num}]</div>
                  <div className={styles.trackContent}>
                    <span className={styles.trackTitle}>{track.title}</span>
                    <button 
                      className={styles.playTrackBtn} 
                      onClick={() => setCurrentTrack(currentTrack?.num === track.num ? null : track)}
                    >
                      {currentTrack?.num === track.num ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                            <path d="M6 6h12v12H6z" />
                          </svg>
                          <span>STOP</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span>PREVIEW</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.techImageWrapper}>
            <Image 
              src="/images/landing/free-download.jpg" 
              alt="Underground Selection [WAV]" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
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
        <button className={styles.ctaBtnLarge} onClick={scrollToTop}>
          GET FREE EP <span>&uarr;</span>
        </button>
        
        <div className={styles.minimalLegal}>
          <span>&copy; 2026 PRIVATE TECHNO. ALL RIGHTS RESERVED.</span>
        </div>
      </section>

      <audio 
        ref={audioRef} 
        onEnded={() => setCurrentTrack(null)} 
        style={{ display: 'none' }} 
      />
    </div>
  );
}
