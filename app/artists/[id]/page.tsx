import { ARTISTS } from '@/data/artists';
import { notFound } from 'next/navigation';
import ArtistDetail from '@/components/sections/ArtistDetail';
import NoiseBackground from '@/components/NoiseBackground';

export function generateStaticParams() {
  return ARTISTS.map((artist) => ({
    id: artist.id,
  }));
}

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = ARTISTS.find(a => a.id === id);
  
  if (!artist) {
    notFound();
  }

  return (
    <main>
      <NoiseBackground />
      <ArtistDetail artist={artist} />
    </main>
  );
}
