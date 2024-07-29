'use client';

import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { addToCart } from '@/components/cart/actions';
import LoadingDots from '@/components/loading-dots';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';


function SubmitButton({
  availableForSale,
  selectedSize,
  selectedColor,
  onClick, 
  product
}) {
  const [pending, setPending] = useState(false);
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if ((product.sizes && product.colors) &&(!selectedSize || !selectedColor)) {
    return (
      <button
        aria-label="Please select size and color"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <Plus className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        if (pending) e.preventDefault();
        else {
          setPending(true);
          onClick().then(() => setPending(false));
        }
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        [disabledClasses]: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <Plus className="h-5" />}
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({product, availableForSale} ) {
  const searchParams = useSearchParams();
  const selectedSize = searchParams.get('size');
  const selectedColor = searchParams.get('color');

  const handleAddToCart = () => {
    return new Promise((resolve) => {
      addToCart(product.id, selectedSize && selectedSize, selectedColor && selectedColor, product.price); 
      setTimeout(resolve, 1000); // Simulate a delay
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SubmitButton 
      product={product}
        availableForSale={availableForSale} 
        selectedSize={selectedSize} 
        selectedColor={selectedColor} 
        onClick={handleAddToCart}
      />
    </form>
  );
}