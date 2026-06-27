import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import VideoPortfolio from '@/components/VideoPortfolio';
import PhotoPortfolio from '@/components/PhotoPortfolio';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const metadata = {
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

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black">
      <Navbar />
      <Hero />
      <VideoPortfolio />
      <PhotoPortfolio />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}