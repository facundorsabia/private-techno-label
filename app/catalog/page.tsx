import { Metadata } from 'next';
import DiscographyClient from './DiscographyClient';

export const metadata: Metadata = {
  title: 'Complete Catalog | PRIVATE TECHNO',
  description: 'Upgrade your arsenal with the complete PRIVATE TECHNO discography.',
};

export default function DiscographyPage() {
  return (
    <main>
      <DiscographyClient />
    </main>
  );
}
