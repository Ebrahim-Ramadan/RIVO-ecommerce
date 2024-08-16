import { AddToCart } from '@/components/cart/add-to-cart';
import Price from '@/components/price';
import Prose from '@/components/prose';

import { Suspense } from 'react';
import LoadingDots from '../loading-dots';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }) {
  console.log('product', product);
  return (
    <>
      <div className="mb-2 flex flex-col border-b gap-2 pb-2 md:pb-6 dark:border-neutral-700">
        <h1 className=" text-2xl md:text-5xl font-bold">{product['name']}</h1>
      </div>
      {product['sizes'] && product['color'] && product['type'] &&  product['price'] &&
        <Suspense fallback={<LoadingDots/>}>
          <VariantSelector sizes={product['sizes']} colors={product['color']} types={product['type']} prices={product['price']}/>
        </Suspense>
      }

      {product.desc ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.desc}
        />
      ) : null}

      <Suspense fallback={<LoadingDots/>}>
        <AddToCart product={product} availableForSale={true} />
      </Suspense>
    </>
  );
}
