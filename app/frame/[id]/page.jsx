
import { GridTileImage } from '@/components/grid/tile';
import Footer from '@/components/layout/footer';
import { NoResults } from '@/components/layout/navbar/NoResults';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import { ProductNav } from '@/components/product/ProductNav';
import LazyLoad from '@/lib/LazyLoad';
import {   getProductDetails, searchFrames } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function Page({params}) {

  const data = await getData(params.id)
  console.log('data', data);
  if (!data) {
      return (
          <NoResults/>
      );
  }
  return (
    <>
       <div className="mx-auto max-w-screen-2xl px-2 md:px-16">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white px-4 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
         <ProductNav FrameId={params.id}/>

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

          <div className="py-2">
            <ProductDescription product={data} />
          </div>
        </div>
        <LazyLoad>
        <RelatedProducts keyword={data.keywords[0]} relatedID={data.id} />
        </LazyLoad>
      </div>
      <Footer/>
    </>
  );
}


async function getData(productId) {
  const response = await getProductDetails(productId)
  return response
}


async function RelatedProducts({ keyword , relatedID}) {
  const relatedProducts = await searchFrames(keyword, true, relatedID);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto py-2">
        {relatedProducts.map((product) => (
          <li
            key={product.id}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link
              className="relative h-full w-full"
              href={`/frame/${product.id}`}
              prefetch={true}
            >
              <GridTileImage
                alt={product.name}
                label={{
                  title: product.name,
                  amount: product.price[0],
                  currencyCode: 'EGP'
                }}
                src={product.images[0]}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}