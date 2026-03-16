import type {Metadata} from 'next';
import { Inter, Anton } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Rewind Production | Music Video Creators',
  description: 'Cinematic video production for musicians and artists.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} scroll-smooth`}>
      <body className="bg-black text-white font-sans antialiased selection:bg-orange-500 selection:text-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
