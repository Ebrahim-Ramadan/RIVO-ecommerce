import { AddToCart } from '@/components/cart/add-to-cart';
import Price from '@/components/price';
import Prose from '@/components/prose';

import { Suspense } from 'react';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-2 md:pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-2xl md:text-5xl font-medium">{product['name']}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product['price']}
            currencyCode='EGP'
          />
        </div>
      </div>
      {product['sizes'] && product['colors'] &&
        <Suspense fallback={null}>
          <VariantSelector sizes={product['sizes']} colors={product['colors']} />
        </Suspense>
      }

      {product.desc ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.desc}
        />
      ) : null}

      <Suspense fallback={null}>
        <AddToCart product={product} availableForSale={true} />
      </Suspense>
    </>
  );
}
