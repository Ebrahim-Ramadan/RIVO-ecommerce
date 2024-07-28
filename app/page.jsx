import { Carousel } from '@/components/carousel';
import { ThreeItemGrid } from '@/components/grid/three-items';
import Footer from '@/components/layout/footer';
import { getAllFrames } from '@/lib/utils';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
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
    <>
      <ThreeItemGrid data={data}/>
      <Carousel data={data}/>
      <Footer />
    </>
  );
}


async function getData() {
  const response = await getAllFrames()
  return response
}

export const revalidate = 900 // revalidate at most every hour