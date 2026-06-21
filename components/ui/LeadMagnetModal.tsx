'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './LeadMagnetModal.module.css';

export default function LeadMagnetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // We need usePathname to hide this modal on funnel pages
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Auto-open after 5 seconds, or via custom event
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user already subscribed safely (some Incognito modes block localStorage)
      let hasSubscribed = false;
      try {
        hasSubscribed = !!localStorage.getItem('pt_lead_magnet_subscribed');
      } catch (err) {
        console.warn('localStorage not accessible in this browser mode');
      }
      
      if (!hasSubscribed) {
        setIsOpen(true);
      }
    }, 5000);

    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-lead-magnet', handleOpenEvent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-lead-magnet', handleOpenEvent);
    };
  }, []);

  const { contextSafe } = useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(contentRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: 'back.out(1.2)' }
      );
    }
  }, { dependencies: [isOpen] });

  const handleClose = contextSafe(() => {
    if (status === 'loading') return;
    
    gsap.to(contentRef.current, {
      y: 30, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in'
    });
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.3, delay: 0.1, ease: 'power2.in',
      onComplete: () => setIsOpen(false)
    });
  });

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
        throw new Error(data.error || 'Error de conexión.');
      }

      setStatus('success');
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }
      try {
        localStorage.setItem('pt_lead_magnet_subscribed', 'true');
      } catch (err) {
        // Ignorar error de guardado
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Ocurrió un error. Intenta nuevamente.');
    }
  };

  if (!isOpen && status === 'idle') return null;
  if (pathname === '/free-download' || pathname === '/discography') return null;

  return (
    <div 
      className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`} 
      ref={overlayRef}
    >
      <div className={styles.modalContent} ref={contentRef}>
        
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
          [ X ]
        </button>

        <div className={styles.imageSection}>
          <div className={styles.imageOverlay}></div>
          <Image 
            src="/images/albumCovers/37-003.jpg" 
            alt="Latest Release" 
            fill 
            className={styles.coverImage}
          />
        </div>

        <div className={styles.formSection}>
          <div className={styles.header}>
            <span className={styles.label}>/// EXCLUSIVE GIFT</span>
            <h2 className={styles.title}>FREE DOWNLOAD: PIERO CERAOLO EP</h2>
            {status !== 'success' && (
              <p className={styles.description}>
                ENTER YOUR EMAIL TO RECEIVE OUR LATEST RELEASE (WAV/MP3) FOR FREE, DIRECTLY IN YOUR INBOX.
              </p>
            )}
          </div>

          {status === 'success' ? (
            <div className={styles.successMessage}>
              <div className={styles.systemStatus}>
                <span className={styles.statusBlink}></span> STATUS: TRANSMISSION COMPLETE
              </div>
              <h3 className={styles.successTitle}>ACCESS GRANTED</h3>
              <div className={styles.successBody}>
                <p>The <strong>Piero Ceraolo EP (WAV/MP3)</strong> has been successfully transmitted to your email.</p>
                <div className={styles.spamAlert}>
                  /// NOTE: Please verify your spam/junk folder if the transmission is not visible within a few minutes.
                </div>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputWrapper}>
                <input
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
                  <span className={styles.loadingText}>[ PROCESANDO... ]</span>
                ) : (
                  'GET FREE DOWNLOAD'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
