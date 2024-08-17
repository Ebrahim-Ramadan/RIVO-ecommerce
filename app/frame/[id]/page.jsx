import { GridTileImage } from '@/components/grid/tile';
import Footer from '@/components/layout/footer';
import { NoResults } from '@/components/layout/navbar/NoResults';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import { ProductNav } from '@/components/product/ProductNav';
import LazyLoad from '@/lib/LazyLoad';
import { getProductDetails, searchFrames } from '@/lib/utils';
import { getFromCache, setInCache } from '@/lib/cacheUtil';
import Link from 'next/link';
import { Suspense } from 'react';

export const revalidate = 360000;

export default async function Page({params}) {
  const data = await getData(params.id);
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
        <div className="flex flex-row justify-center w-full text-center py-24">
          <div className="bg-gradient-to-r from-black via-[#B7B7B7] to-transparent w-full h-[2px] opacity-40"></div>
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
  const cacheKey = `product:${productId}`;
  let data = getFromCache(cacheKey);

  if (!data) {
    console.log(`Cache miss for product ${productId}. Fetching from database.`);
    data = await getProductDetails(productId);
    if (data) {
      setInCache(cacheKey, data);
    }
  } else {
    console.log(`Cache hit for product ${productId}.`);
  }

  return data;
}

async function getRelatedProducts(keyword, relatedID) {
  const cacheKey = `related:${keyword}:${relatedID}`;
  let relatedProducts = getFromCache(cacheKey);

  if (!relatedProducts) {
    console.log(`Cache miss for related products ${keyword}:${relatedID}. Fetching from database.`);
    relatedProducts = await searchFrames(keyword, true, relatedID);
    // if (relatedProducts && relatedProducts.length > 0) {
      setInCache(cacheKey, relatedProducts);
    // }
  } else {
    console.log(`Cache hit for related products ${keyword}:${relatedID}.`);
  }

  return relatedProducts;
}

async function RelatedProducts({ keyword, relatedID }) {
  const relatedProducts = await getRelatedProducts(keyword, relatedID);

  if (!relatedProducts || relatedProducts.length === 0) return null;

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