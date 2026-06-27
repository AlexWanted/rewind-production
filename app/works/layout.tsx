import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Works | Rewind Production',
  description: 'Portfolio showcasing Rewind Production\'s best work - music videos, commercials, documentaries, and creative projects.',
  keywords: ['portfolio', 'music videos', 'commercials', 'documentaries', 'creative work', 'portfolio'],
  openGraph: {
    title: 'Works | Rewind Production',
    description: 'Portfolio showcasing best work',
    type: 'website',
    url: 'https://rewind-production.com/works',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}