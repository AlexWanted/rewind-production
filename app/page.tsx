import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import VideoPortfolio from '@/components/VideoPortfolio';
import PhotoPortfolio from '@/components/PhotoPortfolio';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

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
