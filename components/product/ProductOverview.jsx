'use client'
import { GridTileImage } from '@/components/grid/tile';
import { NoResults } from '@/components/layout/navbar/NoResults';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import { ProductNav } from '@/components/product/ProductNav';
import LazyLoad from '@/lib/LazyLoad';
import { getFramesByCategory, getProductDetails, searchFrames } from '@/lib/utils';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import LoadingDots from '../loading-dots';
export const ProductOverview = ({ frameID }) => {
    const [data, setData] = useState(null);
    const [loading, setloading] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        setloading(true)
        const result = await getData(frameID);
        console.log('product', result);
        setData(result);
        setloading(false)
      };
  
      fetchData();
    }, [frameID]);
  
    if (!data && !loading) {
      return <NoResults shopNow={true} />;
    }
    if (loading) return(
      <div className="min-h-screen w-full flex-col flex justify-center items-center">
      <LoadingDots/>
    </div>
    )

  
    return (
      <div className="mx-auto max-w-screen-2xl px-2 md:px-16 bg-black">
        <div className="flex flex-col rounded-lg border border-neutral-200 px-4 md:p-12 lg:flex-row lg:gap-16 border-neutral-800 bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <ProductNav FrameId={frameID} category={data['categories'][0]}/>
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
        <div className="flex flex-row justify-center w-full text-center py-16">
          <div className="bg-gradient-to-r from-black via-[#B7B7B7] to-transparent w-full h-[2px] opacity-40"></div>
        </div>
        
        <Suspense fallback={<div className='flex flex-row w-full items-center justify-center'>
          <LoadingDots/>  </div>}>
        <LazyLoad>
          <RelatedProducts keyword={data.keywords.slice(-1)[0]} relatedID={data.id} category={data.categories[0]} />
        </LazyLoad>
</Suspense>
      </div>
    );
  };
async function getData(productId) {
    
    // Search through all arrays in localStorage
    let data = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const value = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(value)) {
          const foundProduct = value.find(item => item.id === productId);
          if (foundProduct) {
            data = foundProduct;
            break;
          }
        }
      } catch (error) {
        console.error('Error parsing localStorage item:', error);
      }
    }
  
    if (data) {
      console.log('found on cACHE');
      return data;
    }
  
    if (!data) {
      data = await getProductDetails(productId);
      
    } 
    return data;
  }
  
  async function getRelatedProducts(keyword, relatedID, category) {
    let relatedProducts = null;

    // Check if related products are cached by category
    const cachedKey = `cached-${category}`;
    const cachedData = localStorage.getItem(cachedKey);
    
    if (cachedData) {
      try {
        console.log('related cache');
        const parsedData = JSON.parse(cachedData);
        relatedProducts = parsedData.filter(item => item.id !== relatedID);
        if (relatedProducts.length > 0) {
          console.log('Found related products in cache');
          return relatedProducts;
        }
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    }

    // If no cached data, fetch related products from Firestore
    if (!relatedProducts || relatedProducts.length === 0) {
      relatedProducts = await getFramesByCategory(category);
      if (relatedProducts && relatedProducts.length > 0) {
        // Cache the new related products
        localStorage.setItem(cachedKey, JSON.stringify(relatedProducts));
      }
    }

    return relatedProducts;
}

  
  
  async function RelatedProducts({ keyword, relatedID , category}) {
    const relatedProducts = await getRelatedProducts(keyword, relatedID, category);
    console.log('relatedProducts', relatedProducts);
  
    if (!relatedProducts || relatedProducts.length === 0) return null;
    return (
      <div className="px-4 w-full">
        <h2 className="mb-2 text-2xl font-bold">Customers Also Viewed</h2>
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
                categories={product?.categories}
                  insideProfuct={true}
                  alt={product.name}
                  label={{
                    title: product.name,
                    amount: product.price[0],
                    currencyCode: 'EGP'
                  }}
                  src={`https://iili.io/${product.images[0].match(/\/([a-zA-Z0-9]+)$/)[1]}.jpg` || '/logo.png'}
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