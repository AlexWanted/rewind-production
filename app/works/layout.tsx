import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Работы | rewind production',
  description: 'Портфолио с лучшими работами rewind production - клипы, сниппеты, концерты.',
  keywords: ['portfolio', 'music videos', 'commercials', 'documentaries', 'creative work', 'portfolio'],
  openGraph: {
    title: 'Работы | rewind production',
    description: 'Портфолио с лучшими работами',
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