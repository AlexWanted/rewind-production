import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photography | Rewind Production',
  description: 'Professional photography portfolio featuring brand photography, editorial shoots, and visual storytelling.',
  keywords: ['photography', 'brand photography', 'editorial', 'visual storytelling', 'product photography'],
  openGraph: {
    title: 'Photography | Rewind Production',
    description: 'Professional photography portfolio',
    type: 'website',
    url: 'https://rewind-production.com/photography',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}