'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './SubscribeSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function SubscribeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al suscribirse.');
      }

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Ocurrió un error. Intenta de nuevo.');
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });

    tl.from('.fade-up', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });

    tl.from('.fade-up-hud', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.4');
  }, { scope: containerRef });

  return (
    <section className={styles.subscribeSection} ref={containerRef}>
      <div className="section-container">
        <div className={styles.contentWrapper}>

          {/* Email Row */}
          <div className={styles.emailRow}>
            <div className={`${styles.emailText} fade-up`}>
              <div className={styles.joinLabel}>JOIN <span className={styles.highlight}>THE NETWORK</span></div>
              <h3 className={styles.subTitle}>SUBSCRIBE TO THE FREQUENCY</h3>
              <p className={styles.subDesc}>EXCLUSIVE RELEASES. UNDERGROUND NEWS. NO SPAM.</p>
            </div>
            <div className={`${styles.emailInputContainer} fade-up`}>
              <div className={styles.inputStripe}></div>
              <form className={styles.emailForm} onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder={status === 'loading' ? 'TRANSMITTING...' : 'ENTER YOUR EMAIL'}
                  className={styles.emailInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  required
                />
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={status === 'loading' || status === 'success'}
                >
                  {status === 'loading' ? '...' : status === 'success' ? 'DONE' : 'SUBMIT'}
                </button>
              </form>
              {status === 'error' && (
                <p style={{ color: '#ff4444', fontSize: '11px', fontFamily: 'var(--font-mono)', marginTop: '5px', alignSelf: 'flex-start' }}>
                  {errorMessage}
                </p>
              )}
              {status === 'success' && (
                <p style={{ color: 'var(--orange)', fontSize: '11px', fontFamily: 'var(--font-mono)', marginTop: '5px', alignSelf: 'flex-start' }}>
                  /// TRANSMISSION SUCCESSFUL. WELCOME TO THE FREQUENCY.
                </p>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className={styles.bottomRow}>
            <div className={`${styles.bottomLeft} fade-up`}>
              <div className={`${styles.cornerBracket} ${styles.bracketTL}`}></div>
              <div className={`${styles.cornerBracket} ${styles.bracketTR}`}></div>
              <div className={`${styles.cornerBracket} ${styles.bracketBL}`}></div>
              <div className={`${styles.cornerBracket} ${styles.bracketBR}`}></div>
              <Image
                src="/images/assets/subscribe assets/asset-s3.png"
                alt="Terrain Wireframe"
                fill
                className={styles.terrainImage}
              />
            </div>

            <div className={`${styles.bottomCenter} fade-up`}>
              <div className={styles.quoteIcon}>“</div>
              <p className={styles.quoteText}>
                THIS ISN&apos;T JUST A LABEL.<br />
                IT&apos;S A <span className={styles.highlight}>MOVEMENT</span>.
              </p>
              <p className={styles.quoteSubText}>
                BUILT BY ARTISTS.<br />
                DRIVEN BY FREQUENCY.<br />
                FUELED BY THE <span className={styles.highlight}>UNDERGROUND</span>.
              </p>
              <div className={styles.copyrightLabel}>/// PRIVATE TECHNO © XXXX</div>
            </div>

            <div className={styles.bottomRight}>
              <div className={`${styles.hudImageWrapper} fade-up-hud`}>
                <Image
                  src="/images/assets/subscribe assets/asset-s4-1.png"
                  alt="HUD Element 1"
                  width={168}
                  height={100}
                  className={styles.hudPart}
                />
              </div>
              <div className={`${styles.hudImageWrapper} fade-up-hud`}>
                <Image
                  src="/images/assets/subscribe assets/asset-s4-2.png"
                  alt="HUD Element 2"
                  width={168}
                  height={107}
                  className={styles.hudPart}
                />
              </div>
              <div className={`${styles.hudImageWrapper} fade-up-hud`}>
                <Image
                  src="/images/assets/subscribe assets/asset-s4-3.png"
                  alt="HUD Element 3"
                  width={168}
                  height={133}
                  className={styles.hudPart}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
