'use client';

import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { addToCart } from '@/components/cart/actions';
import LoadingDots from '@/components/loading-dots';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import eventEmitter from '@/lib/eventEmitter';

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

  if ((product.sizes && product.colors) && (!selectedSize || !selectedColor)) {
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

export function AddToCart({ product, availableForSale }) {
  const searchParams = useSearchParams();
  const selectedSize = searchParams.get('size');
  const selectedColor = searchParams.get('color');
  const selectedType = searchParams.get('type');

  // Calculate price based on selected size and type
  const calculatePrice = (sizes, types, selectedSize, selectedType, categories) => {
    const basePrices = product.price; // Base prices array corresponding to sizes
    const sizeIndex = sizes.indexOf(selectedSize);
    const ratios = [.761, .71, .826, .725, .671];
    let price = 0;

    if (sizeIndex !== -1) {
      const basePrice = basePrices[sizeIndex];
      if (selectedType === 'wood') {
        price = basePrice / (ratios[sizeIndex] || 1);
      } else {
        price = basePrice;
      }
    }

    // Apply 15% discount if categories include 'posters set'
    if (categories && categories.includes('Frame sets')) {
      price *= 0.85; // Apply 15% discount
    }

    return price;
  };

  const handleAddToCart = () => {
    return new Promise((resolve) => {
      const price = calculatePrice(product.sizes, product.types, selectedSize, selectedType, product.categories);
      addToCart(product, selectedSize, selectedColor, selectedType, Math.ceil(price));
      setTimeout(() => {
        toast.success("Product Added to Your Cart");
        eventEmitter.emit('openCart'); // Emit event to open cart
        resolve();
      }, 1000); // Simulate a delay
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SubmitButton 
        product={product}
        availableForSale={availableForSale} 
        selectedSize={selectedSize} 
        selectedColor={selectedColor} 
        selectedType={selectedType} 
        onClick={handleAddToCart}
      />
    </form>
  );
}
