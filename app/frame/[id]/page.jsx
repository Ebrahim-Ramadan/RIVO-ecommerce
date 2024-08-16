
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
          <NoResults shopNow={true}/>
      );
  }
  return (
    <>
       <div className="mx-auto max-w-screen-2xl px-2 md:px-16 bg-black">
        <div className="flex flex-col rounded-lg border border-neutral-200 px-4 md:p-12 lg:flex-row lg:gap-16 border-neutral-800 bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
         <ProductNav FrameId={params.id}/>

            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={data['images']?.map((image) => ({
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
    <div className="p-4 w-full">
      <h2 className="mb-2 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto py-2">
        {relatedProducts.map((product) => (
          <li
            key={product.id}
            className="relative aspect-square h-[38vh] max-h-[275px] w-3/4 max-w-[475px] flex-none md:w-1/3 "
          >
            <Link
              className="relative h-full w-full"
              href={`/frame/${product.id}?type=${product.type[0]}&color=${product.color[0]}&size=${product.sizes[0]}`}
              prefetch={true}
            >
              <GridTileImage
              insideProfuct={true}
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
