'use client';
import { Carousel } from '@/components/carousel';
import { ThreeItemGrid } from '@/components/grid/three-items';
import Footer from '@/components/layout/footer';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import {  getProductDetails } from '@/lib/utils';

import { usePathname } from 'next/navigation'
import { Suspense } from 'react';

export default async function HomePage() {
  
  const pathname = usePathname();
  const productId = pathname.split('/frame/')[1];


  const data = await getData(productId)
  console.log('Data:', data);
  if (!data) {
      return (
          'ass'
      );
  }
  return (
    <>
       <div className="mx-auto max-w-screen-2xl px-2 md:px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={data['images'].map((image) => ({
                  src: image,
                  altText: 'frame alt'
                }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={data} />
          </div>
        </div>
        {/* <RelatedProducts id={product.id} /> */}
      </div>
      {/* <Footet /> */}
    </>
  );
}


async function getData(productId) {
  const response = await getProductDetails(productId)
  return response
}
