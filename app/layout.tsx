import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'rewind production | Видеопродакшен для музыкантов',
  description: 'Профессиональный видеопродакшен для музыкантов и артистов. Клипы, сниппеты, фотосеты и концертная съёмка.',
  keywords: ['video production', 'photography', 'music videos', 'commercials', 'documentaries', 'brand photography'],
  authors: [{ name: 'rewind production' }],
  creator: 'rewind production',
  publisher: 'rewind production',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rewind-production.com'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://rewind-production.com',
    title: 'rewind  | Видеопродакшен для музыкантов',
    description: 'Профессиональный видеопродакшен для музыкантов и артистов. Клипы, сниппеты, фотосеты и концертная съёмка.',
    siteName: 'rewind ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'rewind  | Видеопродакшен для музыкантов',
    description: 'Профессиональный видеопродакшен для музыкантов и артистов. Клипы, сниппеты, фотосеты и концертная съёмка.',
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