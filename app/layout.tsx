import type {Metadata} from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';

const roboto = Roboto_Condensed ({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto-condensed',
  display: 'swap',
});

/* const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
}); */

export const metadata: Metadata = {
  title: 'rewind production | видеопродакшн для музыкантов',
  description: 'Кинематографичные видео и фото для музыкантов.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru" className={`${roboto.variable} scroll-smooth`}>
      <body className="bg-black text-white font-sans antialiased selection:bg-orange-500 selection:text-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
