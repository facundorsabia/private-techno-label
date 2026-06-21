import { Metadata } from 'next';
import ThankYouClient from './ThankYouClient';

export const metadata: Metadata = {
  title: 'THANK YOU | PRIVATE TECHNO',
  description: 'Thank you for joining the Private Techno frequency. Your download is ready.',
};

export default function ThankYouPage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
      <ThankYouClient />
    </main>
  );
}
