'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Auto-open after 5 seconds, or via custom event
  useEffect(() => {
    if (!isHomePage) return;

    const timer = setTimeout(() => {
      // Check if user already subscribed safely (some Incognito modes block localStorage)
      let hasSubscribed = false;
      let shouldShow = true;
      try {
        hasSubscribed = !!localStorage.getItem('pt_lead_magnet_subscribed');
        const lastSeen = localStorage.getItem('pt_lead_magnet_last_seen');
        if (lastSeen) {
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - parseInt(lastSeen) < thirtyDays) {
            shouldShow = false;
          }
        }
      } catch (err) {
        console.warn('localStorage not accessible in this browser mode');
      }
      
      if (!hasSubscribed && shouldShow) {
        setIsOpen(true);
      }
    }, 5000);

    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-lead-magnet', handleOpenEvent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-lead-magnet', handleOpenEvent);
    };
  }, [isHomePage]);

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
    
    // Save last seen time so it doesn't bother them for 30 days
    try {
      localStorage.setItem('pt_lead_magnet_last_seen', Date.now().toString());
    } catch(err) {}
  });

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

  if (!isHomePage) return null;
  if (!isOpen && status === 'idle') return null;

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
          <Image 
            src="/images/landing/free-download.jpg" 
            alt="Underground Selection [WAV]" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.coverImage}
          />
        </div>

        <div className={styles.formSection}>
          <div className={styles.header}>
            <span className={styles.label}>/// EXCLUSIVE GIFT</span>
            <h2 className={styles.title}>FREE DOWNLOAD: UNDERGROUND SELECTION [WAV]</h2>
            {status !== 'success' && (
              <p className={styles.description}>
                ENTER YOUR EMAIL TO RECEIVE OUR EXCLUSIVE SELECTION FOR FREE, DIRECTLY IN YOUR INBOX.
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
                <p>The <strong>Underground Selection [WAV]</strong> has been successfully transmitted to your email.</p>
                <div className={styles.spamAlert}>
                  /// NOTE: The transmission may take 1-2 minutes to arrive. Please be patient and verify your spam folder.
                </div>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
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
