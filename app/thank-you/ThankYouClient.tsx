'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './ThankYou.module.css';

export default function ThankYouClient() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <Image 
          src="/images/logos/private-rebranding-logo-no-bg.png" 
          alt="Private Techno Logo" 
          width={320} 
          height={80} 
          className={styles.logo}
          priority
        />
      </div>

      <div className={styles.contentSection}>
        <div className={styles.systemStatus}>
          <span className={styles.statusBlink}></span> STATUS: TRANSMISSION SUCCESSFUL
        </div>
        
        <h1 className={styles.title}>THANK YOU</h1>
        <p className={styles.subTitle}>/// REGISTRATION COMPLETE</p>

        <div className={styles.messageBox}>
          <p className={styles.leadText}>
            Your raw techno weapon is ready.
          </p>
          <p className={styles.infoText}>
            The download link for <strong>Piero Ceraolo EP (WAV/MP3)</strong> has been successfully transmitted directly to your email inbox.
          </p>
          <div className={styles.spamAlert}>
            /// NOTE: If you do not see the transmission within a few minutes, please verify your spam/junk folder.
          </div>
        </div>

        <button 
          className={styles.ctaButton} 
          onClick={() => router.push('/discography')}
        >
          EXPLORE ENTIRE CATALOG (75% OFF)
        </button>
      </div>

      <div className={styles.minimalLegal}>
        <span>&copy; 2026 PRIVATE TECHNO. ALL RIGHTS RESERVED.</span>
      </div>
    </div>
  );
}
