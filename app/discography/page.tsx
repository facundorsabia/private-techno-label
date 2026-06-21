import { Metadata } from 'next';
import Image from 'next/image';
import ReleasesSection from '@/components/sections/ReleasesSection';
import styles from './Discography.module.css';

export const metadata: Metadata = {
  title: 'Discography | PRIVATE TECHNO',
  description: 'Explore the full discography of PRIVATE TECHNO label.',
};

export default function DiscographyPage() {
  return (
    <>
      <main className={styles.container}>
        {/* Minimal Funnel Header */}
        <header className={styles.minimalHeader}>
          <Image
            src="/images/logos/private-rebranding-logo-no-bg.png"
            alt="Private Techno Logo"
            width={180}
            height={40}
            className={styles.logo}
            priority
          />
        </header>

        <div className={styles.successBanner}>
          <div className={styles.systemStatus}>
            <span className={styles.statusBlink}></span> STATUS: TRANSMISSION SENT
          </div>
          <h1 className={styles.title}>ACCESS GRANTED</h1>
          <p className={styles.description}>
            Your free EP is currently being transmitted to your inbox. While you wait, explore our full discography and secure your high-quality tracks.
          </p>
        </div>

        <ReleasesSection />
      </main>
    </>
  );
}
