'use client';

import React, { useEffect } from 'react';

import HeroSection from '@/components/sections/HeroSection';
import ReleasesSection from '@/components/sections/ReleasesSection';
import FeaturedReleaseSection from '@/components/sections/FeaturedReleaseSection';
import AboutSection from '@/components/sections/AboutSection';
import RosterSection from '@/components/sections/RosterSection';
import ManifestoSection from '@/components/sections/ManifestoSection';
import FrequencySection from '@/components/sections/FrequencySection';
import SubscribeSection from '@/components/sections/SubscribeSection';
import Footer from '@/components/sections/Footer';
import WireframeGrid from '@/components/svg/WireframeGrid';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main>
      <HeroSection />

      {/* Grid surface between hero and releases */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', opacity: 0.4 }}>
        <WireframeGrid />
      </div>

      <AboutSection />
      <ManifestoSection />
      <FeaturedReleaseSection />
      <ReleasesSection />
      <FrequencySection />
      {/* <RosterSection /> */}
      <SubscribeSection />
      <Footer />
    </main>
  );
}
