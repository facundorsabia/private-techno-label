'use client';

import HeroSection from '@/components/sections/HeroSection';
import ReleasesSection from '@/components/sections/ReleasesSection';
import ArtistSection from '@/components/sections/ArtistSection';
import ManifestoSection from '@/components/sections/ManifestoSection';
import Footer from '@/components/sections/Footer';
import WireframeGrid from '@/components/svg/WireframeGrid';

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* Grid surface between hero and releases */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', opacity: 0.4 }}>
        <WireframeGrid />
      </div>

      <ReleasesSection />
      <ArtistSection />
      <ManifestoSection />
      <Footer />
    </main>
  );
}
