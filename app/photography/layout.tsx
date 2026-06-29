import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Фотосеты | rewind production',
  description: 'Профессиональные фотосеты для артистов.',
  keywords: ['photography', 'brand photography', 'editorial', 'visual storytelling', 'product photography'],
  openGraph: {
    title: 'Фотосеты | rewind production',
    description: 'Профессиональные фотосеты для артистов',
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