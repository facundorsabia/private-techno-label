import { Metadata } from 'next';
import FreeDownloadClient from './FreeDownloadClient';

export const metadata: Metadata = {
  title: 'FREE DOWNLOAD: Underground Selection [WAV] | PRIVATE TECHNO',
  description: 'Download the exclusive compilation "Private Techno - Underground Selection [WAV]" for free.',
};

export default function FreeDownloadPage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <FreeDownloadClient />
    </main>
  );
}
