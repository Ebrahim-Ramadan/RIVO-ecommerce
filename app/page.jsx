import { Carousel } from '@/components/carousel';
import { ThreeItemGrid } from '@/components/grid/three-items';
import Footer from '@/components/layout/footer';
import { HomeContent } from '@/components/layout/HomeContent';
import { Slider } from '@/components/layout/Slider';
import { useFrames } from '@/components/layout/useFrames';

export const metadata = {
  description: 'RIVO e-commerce website ',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  
  return (
    <div className='px-2 md:px-16'>
    <HomeContent />
    <Footer />
  </div>
  );
}
