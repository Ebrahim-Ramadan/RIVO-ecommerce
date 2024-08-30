import { AddToCart } from '@/components/cart/add-to-cart';
import Prose from '@/components/prose';
import {LazyLoad} from '@/lib/LazyLoad'
import dynamic from 'next/dynamic';
import { lazy, Suspense } from 'react';
import LoadingDots from '../loading-dots';
// import { Additionals } from './Additionals';
const Additionals = dynamic(() => import('./Additionals'), {
  loading: () => <LoadingDots/>,
})
const SizeGuide = lazy(() => import('./SizeGuide'));
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }) {
  return (
    <>
      <div className="mb-2 flex flex-col border-b gap-2 pb-2 md:pb-6 dark:border-neutral-700">
        <h1 className=" text-2xl md:text-5xl font-bold">{product['name']}</h1>
      </div>
      {product['sizes'] && product['color'] && product['type'] &&  product['price'] &&
        <Suspense fallback={<LoadingDots/>}>
          <VariantSelector sizes={product['sizes']} colors={product['color']} types={product['type']} prices={product['price']} categories={product.categories} />
        </Suspense>
      }

      <SizeGuide type={product.categories[0]}/>

      <Suspense fallback={<LoadingDots/>}>
        <AddToCart product={product} availableForSale={true} />
      </Suspense>
      {product.desc ? (
        <Prose
          className="mt-6 "
          html={product.desc}
        />
      ) : null}
      <Additionals/>

    </>
  );
}
