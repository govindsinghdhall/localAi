import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
