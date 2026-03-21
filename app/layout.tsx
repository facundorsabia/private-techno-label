import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PRIVATE TECHNO — Underground Electronic Culture',
  description: 'PRIVATE TECHNO is an experimental techno record label exploring the boundaries of hypnotic sound, industrial aesthetics, and underground electronic culture.',
  keywords: ['techno', 'electronic music', 'record label', 'underground', 'experimental'],
  openGraph: {
    title: 'PRIVATE TECHNO',
    description: 'Underground Electronic Culture — Hypnotic Sound Exploration',
    type: 'website',
  },
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
