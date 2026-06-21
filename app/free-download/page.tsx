import { Metadata } from 'next';
import FreeDownloadClient from './FreeDownloadClient';

export const metadata: Metadata = {
  title: 'FREE DOWNLOAD: Piero Ceraolo EP | PRIVATE TECHNO',
  description: 'Download the latest exclusive underground techno release from Piero Ceraolo for free.',
};

export default function FreeDownloadPage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <FreeDownloadClient />
    </main>
  );
}
