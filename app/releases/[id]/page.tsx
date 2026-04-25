import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RELEASES } from '@/data/releases';
import ReleaseDetail from '../../../components/sections/ReleaseDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return RELEASES.map((release) => ({
    id: release.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const release = RELEASES.find((r) => r.id === id);

  if (!release) {
    return {
      title: 'Release Not Found | Private Techno',
    };
  }

  return {
    title: `${release.title} - ${release.artist} | Private Techno`,
    description: release.description,
    openGraph: {
      title: release.title,
      description: release.description,
      images: [
        {
          url: release.cover,
          width: 800,
          height: 800,
          alt: release.title,
        },
      ],
    },
  };
}

export default async function ReleasePage({ params }: PageProps) {
  const { id } = await params;
  const release = RELEASES.find((r) => r.id === id);

  if (!release) {
    notFound();
  }

  return (
    <main>
      <ReleaseDetail release={release} />
    </main>
  );
}
