import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rewind Production | Video Production & Photography',
  description: 'Professional video production and photography services. Music videos, commercials, documentaries, and brand photography.',
  keywords: ['video production', 'photography', 'music videos', 'commercials', 'documentaries', 'brand photography'],
  authors: [{ name: 'Rewind Production' }],
  creator: 'Rewind Production',
  publisher: 'Rewind Production',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rewind-production.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rewind-production.com',
    title: 'Rewind Production | Video Production & Photography',
    description: 'Professional video production and photography services. Music videos, commercials, documentaries, and brand photography.',
    siteName: 'Rewind Production',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rewind Production | Video Production & Photography',
    description: 'Professional video production and photography services.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}