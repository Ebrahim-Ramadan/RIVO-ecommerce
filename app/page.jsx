import { Carousel } from '@/components/carousel';
import { ThreeItemGrid } from '@/components/grid/three-items';
import Footer from '@/components/layout/footer';
import { Slider } from '@/components/layout/Slider';
import { getAllFrames } from '@/lib/utils';

export const metadata = {
  description: 'RIVO e-commerce website ',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const data = await getData()
  console.log('data', data)
  if (!data) {
      return (
          'ass'
      );
  }
  return (
    <div className='px-2 md:px-8'>
    <Slider/>
      <ThreeItemGrid data={data}/>
      <Carousel data={data}/>
      <Footer />
    </div>
  );
}


async function getData() {
  const response = await getAllFrames()
  return response
}

export const revalidate = 900 // revalidate at most every hour