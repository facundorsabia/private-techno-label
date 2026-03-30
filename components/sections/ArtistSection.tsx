'use client';

import React from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import styles from './ArtistSection.module.css';

export default function ArtistSection() {
  const { ref } = useScrollAnimation();

  return (
    <section className={styles.artistSection} id="artist" ref={ref}>
      <div className={styles.mainTitleWrapper}>
        <h2 className={styles.weAreTheSignalOuter}>
          <span className={styles.weAre}>WE ARE THE</span>
          <span className={styles.signal}>SIGNAL</span>
        </h2>
        <h2 className={styles.undergroundOuter}>
          {"UNDERGROUND".split("").map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </h2>
      </div>

      <div className={styles.gridContainer}>


        {/* Rows 1/2 Right: Abstract Video (replacing Waveform) */}
        <div className={`${styles.gridItem} ${styles.boxWaveform}`}>
          <video
            src="/videos/abstract-background.webm"
            autoPlay
            loop
            muted
            playsInline
            className={styles.gridVideo}
          />
        </div>

        {/* Row 3/4 Left: Warehouse (Asset 2) */}
        <div className={`${styles.gridItem} ${styles.boxWarehouse}`}>
          <Image src="/images/assets/aboutAssets/2.png" alt="Warehouse" fill sizes="66vw" className={styles.grayTint} />
        </div>

        {/* Row 3 Right: Globe (Asset 6) + Phrase */}
        <div className={`${styles.gridItem} ${styles.boxGlobe}`}>
          <div className={styles.globeImageWrapper}>
            <Image src="/images/assets/aboutAssets/6.png" alt="Globe" fill sizes="33vw" className={`${styles.containImg}`} />
          </div>
          <div className={styles.globePhraseWrapper}>
            <p className={styles.bottomPhraseSmall}>WΞ DØN’T RΞLΞΛSΞ MɄSIC. WΞ RΞLΞΛSΞ STΛTΞS.</p>
          </div>
        </div>

        {/* Row 4 Right: Stripes (Asset 4) */}
        <div className={`${styles.gridItem} ${styles.boxStripesRight}`}>
          <Image src="/images/assets/aboutAssets/4.png" alt="Stripes" fill sizes="33vw" className={`${styles.orangeTint} ${styles.containImg}`} />
        </div>

        {/* Row 5 Left: Barcode + Text (Asset 3) */}
        <div className={`${styles.gridItem} ${styles.boxBarcode}`}>
          <div className={styles.barcodeTop}>
            <h3 className={styles.p2020}>P2020-20XX</h3>
            <div className={styles.barcodeImgWrapper}>
              <Image src="/images/assets/aboutAssets/3.png" alt="Barcode" fill sizes="33vw" className={`${styles.grayTint} ${styles.containImgLeft}`} />
            </div>
          </div>
          <div className={styles.manifestoRow}>
            <p>Private Techno is not just a record label - it is a collective<br />consciousness operating at the intersection of sound design,<br />depths of warehouses and coded into digital frequencies.</p>
            <p>Every release is an artifact. Every track, a transmission from<br />the future. We curate artists who push the boundaries of music into<br />unexplored territories.</p>
          </div>
        </div>

        {/* Row 5 Right: Grid & Stars (Asset 5) */}
        <div className={`${styles.gridItem} ${styles.boxGridStars}`}>
          <div className={styles.emptyGridSpace}></div>
          <div className={styles.starsWrapper}>
            <Image src="/images/assets/aboutAssets/5.png" alt="Stars" fill sizes="15vw" className={`${styles.orangeTint} ${styles.containImg}`} />
          </div>
        </div>

        {/* Row 6 Left: Stats */}
        <div className={`${styles.gridItem} ${styles.boxStats}`}>
          <div className={styles.statBox}>
            <div className={styles.statNumRow}>
              <span className={styles.statNumScale}>+35</span>
              <span className={styles.statLabel}>RELEASES</span>
            </div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statNumRow}>
              <span className={styles.statNumScale}>+50</span>
              <span className={styles.statLabel}>ARTISTS</span>
            </div>
          </div>
          <div className={styles.statBoxLast}>
            <div className={styles.statNumRow}>
              <span className={styles.statNumScaleLarge}>∞</span>
              <span className={styles.statLabel}>FREQUENCIES</span>
            </div>
          </div>
        </div>

        {/* Row 6 Right: Bottom Text */}
        <div className={`${styles.gridItem} ${styles.boxBottomText}`}>
          <p className={styles.bottomPhrase}>BɄILT FØR DΔRK RØØMS ΛND ΣNDLΞSS NIGHTS.</p>
        </div>

      </div>
    </section>
  );
}
