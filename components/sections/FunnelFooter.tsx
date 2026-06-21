'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

const FAKE_CHANNELS = [
  {
    name: '140BPM',
    label: 'CH_01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    )
  },
  {
    name: '1411 kbps',
    label: 'CH_02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    )
  },
  {
    name: 'SECURE_ENC',
    label: 'CH_03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    )
  }
];

export default function FunnelFooter() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour12: false
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className={styles.footer} id="footer">
      <div className="section-container">
        <div className={styles.topDivider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerSquare} />
        </div>

        <div className={styles.mainGrid}>
          {/* Left: Technical Node & Commands */}
          <div className={styles.technicalColumn}>
            <div className={styles.systemStats}>
              <div className={styles.statItem}>
                <span className="ui-label">SYSTEM_CLOCK [BUE]</span>
                <p className={styles.timeValue}>{time || '00:00:00'}</p>
              </div>
            </div>

            <div className={styles.commands}>
              <div className={styles.commandBox}>
                <div className={styles.cmdTitle}>SUBMIT_DEMO</div>
                <div className={styles.cmdAction} style={{ cursor: 'default' }}>
                  <span className={styles.cmdPrompt}>&gt;</span>
                  privatebuenosaires.techno@gmail.com
                </div>
              </div>
            </div>
          </div>

          <div className={styles.vDivider} />

          {/* Center: Fake Transmission Channels */}
          <div className={styles.channels}>
            <span className="ui-label">TRANSMISSION_CHANNELS</span>
            <div className={styles.linksList}>
              {FAKE_CHANNELS.map((channel) => (
                <div key={channel.name} className={styles.channelItem} style={{ cursor: 'default' }}>
                  <span className={styles.chLabel} style={{ animation: 'pulse 2s infinite' }}>{channel.label}</span>
                  <span className={styles.chName}>{channel.name}</span>
                  <div className={styles.chLine} />
                  <div className={styles.chIcon}>{channel.icon}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.vDivider} />

          {/* Right: Brand Identity */}
          <div className={styles.brandColumn}>
            <p className={styles.brandDescription}>
              EXTRACTING RHYTHMS FROM THE VOID.<br />
              BUENOS AIRES // EST. 2024
            </p>

            <div className={styles.logoWrapper}>
              <Image
                src="/images/logos/Private Techno blanco.png"
                alt="Private Techno"
                width={360}
                height={100}
                className={styles.logo}
                priority
              />
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.metadata}>
            <span className={styles.metaItem}>VER: 2.0.4</span>
            <span className={styles.metaItem}>ENC: RSA_4096</span>
            <span className={styles.metaItem}>LOC: 34.6037° S, 58.3816° W</span>
          </div>
          <div className={styles.copyright} style={{ display: 'flex', gap: '20px' }}>
            <span className="ui-label">© {new Date().getFullYear()} PRIVATE TECHNO</span>
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="ui-label" style={{ color: 'var(--orange)' }}>[ PRIVACY_POLICY ]</Link>
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="ui-label" style={{ color: 'var(--orange)' }}>[ TERMS ]</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
