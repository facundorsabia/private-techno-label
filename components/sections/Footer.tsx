'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

const SOCIAL_CHANNELS = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/private.techno/',
    label: 'CH_01',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
    )
  },
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/private-techno',
    label: 'CH_02',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.1-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.282c.013.06.044.094.104.094.057 0 .09-.037.102-.094l.2-1.282-.2-1.332c-.012-.057-.045-.094-.102-.094zm1.83-1.229c-.063 0-.109.051-.116.11l-.209 2.545.209 2.449c.007.064.053.111.116.111.059 0 .108-.047.116-.111l.24-2.449-.24-2.545c-.008-.059-.057-.11-.116-.11zm.89-.271c-.07 0-.127.057-.127.127l-.2 2.689.2 2.564c0 .07.057.127.127.127.068 0 .12-.057.127-.127l.221-2.564-.221-2.689c-.007-.07-.059-.127-.127-.127zm.947-.149c-.079 0-.139.063-.139.14l-.176 2.711.176 2.598c0 .078.06.139.139.139.076 0 .138-.061.139-.139l.199-2.598-.199-2.711c-.001-.077-.063-.14-.139-.14zm.969-.229c-.088 0-.152.07-.152.154l-.16 2.786.16 2.594c0 .088.064.154.152.154.084 0 .15-.066.152-.154l.18-2.594-.18-2.786c-.002-.084-.068-.154-.152-.154zm.99-.32c-.094 0-.166.076-.168.166l-.148 2.959.148 2.553c.002.094.074.166.168.166.09 0 .164-.072.166-.166l.168-2.553-.168-2.959c-.002-.09-.076-.166-.166-.166zm1.04-.449c-.102 0-.18.082-.182.18l-.136 3.208.136 2.494c.002.102.08.18.182.18.098 0 .178-.078.18-.18l.152-2.494-.152-3.208c-.002-.098-.082-.18-.18-.18zm1.014-.362c-.111 0-.197.09-.197.197l-.12 3.373.12 2.441c0 .111.086.197.197.197.107 0 .193-.086.197-.197l.137-2.441-.137-3.373c-.004-.107-.09-.197-.197-.197zm1.064-.479c-.117 0-.211.096-.211.211l-.107 3.654.107 2.395c0 .119.094.211.211.211.113 0 .207-.092.211-.211l.119-2.395-.119-3.654c-.004-.115-.098-.211-.211-.211zm1.063-.553c-.121 0-.221.1-.225.221l-.1 4.008.1 2.346c.004.121.104.221.225.221.119 0 .217-.1.221-.221l.109-2.346-.109-4.008c-.004-.121-.102-.221-.221-.221zm1.08-.58c-.131 0-.236.109-.236.236l-.082 4.391.082 2.297c0 .131.105.236.236.236.127 0 .232-.105.236-.236l.09-2.297-.09-4.391c-.004-.127-.109-.236-.236-.236zm1.143-.282c-.139 0-.252.115-.252.252l-.074 4.473.074 2.25c0 .139.113.252.252.252.133 0 .246-.113.252-.252l.082-2.25-.082-4.473c-.006-.137-.119-.252-.252-.252zM21.615 7.701c-.197 0-.382.039-.555.109C20.693 5.035 18.236 3 15.289 3c-.781 0-1.541.158-2.229.424-.258.1-.326.203-.33.4v10.963c.004.203.164.371.371.387h8.514A2.385 2.385 0 0024 12.789a2.385 2.385 0 00-2.385-2.388z" /></svg>
    )
  },
  {
    name: 'Bandcamp',
    url: 'https://private-techno.bandcamp.com/',
    label: 'CH_03',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 18.75l7.437-13.5H24l-7.438 13.5z" /></svg>
    )
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/intl-es/album/5tFLnSdeVnUx6TH751AA5J',
    label: 'CH_04',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
    )
  },
  {
    name: 'Beatport',
    url: 'https://www.beatport.com/es/label/private-techno/85546',
    label: 'CH_05',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.016 0A12 12 0 000 12.016 12.016 12.016 0 0012.016 24 12 12 0 0024 11.984 12.016 12.016 0 0012.016 0zm4.595 16.582h-2.146v-9.1h2.146v9.1zm-3.332-6.223v6.223h-2.146V6.14h3.428c1.365 0 2.05.685 2.05 2.05 0 .61-.22.955-.54 1.22-.44.385-.685.55-1.045.71v.24c.36.16.605.325 1.045.71.32.265.54.61.54 1.22 0 1.365-.685 2.05-2.05 2.05H8.689v-9.1h2.146v2.887h2.443z" /></svg>
    )
  },
];

export default function Footer() {
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
                <a href="mailto:privatebuenosaires.techno@gmail.com" className={styles.cmdAction}>
                  <span className={styles.cmdPrompt}>&gt;</span>
                  privatebuenosaires.techno@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className={styles.vDivider} />

          {/* Center: Transmission Channels */}
          <div className={styles.channels}>
            <span className="ui-label">TRANSMISSION_CHANNELS</span>
            <div className={styles.linksList}>
              {SOCIAL_CHANNELS.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channelItem}
                >
                  <span className={styles.chLabel}>{channel.label}</span>
                  <span className={styles.chName}>{channel.name.toUpperCase()}</span>
                  <div className={styles.chLine} />
                  <div className={styles.chIcon}>{channel.icon}</div>
                </a>
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
                src="/images/logos/private-rebranding-logo-no-bg.png"
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
          <div className={styles.copyright}>
            <span className="ui-label">© {new Date().getFullYear()} PRIVATE TECHNO // ALL_RIGHTS_RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
