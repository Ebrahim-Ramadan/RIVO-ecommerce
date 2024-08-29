'use client';
import Price from '@/components/price';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';
import { useState, useEffect, Suspense } from 'react';
import LoadingDots from '../loading-dots';

export function VariantSelector({ sizes, colors, types, prices }) {
  console.log('ass', { sizes, colors, types, prices });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState(0);
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || types[0]);

  const options = [
    { id: 'type', name: 'Type', values: types },
    { id: 'size', name: 'Size', values: sizes },
    ...(selectedType !== 'Wooden Tableau' ? [{ id: 'color', name: 'Color', values: colors }] : []),
  ];

  // Simplified logic for combinations
  const combinations = sizes.flatMap((size, sizeIndex) =>
    (selectedType === 'Wooden Tableau' ? [''] : colors).flatMap(color =>
      types.map(type => ({
        id: `${size}-${color}-${type}`,
        availableForSale: true,
        size,
        color,
        type,
        price: calculatePrice(prices, sizeIndex, type)
      }))
    )
  );

  useEffect(() => {
    const selectedSize = searchParams.get('size');
    const selectedType = searchParams.get('type');

    if (selectedSize && selectedType) {
      const selectedCombination = combinations.find(
        combination =>
          combination.size === selectedSize &&
          combination.type === selectedType
      );

      if (selectedCombination) {
        setPrice(selectedCombination.price || 915);
      } else {
        const sizeIndex = sizes.indexOf(selectedSize);
        if (sizeIndex !== -1) {
          setPrice(calculatePrice(prices, sizeIndex, selectedType));
        }
      }
    }
  }, [searchParams, combinations, sizes, prices]);

  return (
    <div>
      <div className="flex justify-end font-medium text-sm text-white mb-4">
        <Suspense fallback={<LoadingDots/>}>
          <Price
            amount={Math.ceil(price)}
            currencyCode='EGP'
            className='bg-blue-600 rounded-full p-2'
          />
        </Suspense>
      </div>
      {options.map((option) => (
        <dl className="mb-4" key={option.id}>
          <dt className="mb-2 font-medium text-sm uppercase tracking-wide">{option.name}</dt>
          <dd className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const optionNameLowerCase = option.name.toLowerCase();
              const optionSearchParams = new URLSearchParams(searchParams.toString());
              optionSearchParams.set(optionNameLowerCase, value);
              const optionUrl = createUrl(pathname, optionSearchParams);

              const selectedSize = searchParams.get('size');
              const is60cmSize = selectedSize && selectedSize.startsWith('60');
              const isFrameOption = option.id === 'type' && value === 'FRAME';

              const isAvailableForSale = combinations.some(combination =>
                combination[optionNameLowerCase] === value && combination.availableForSale
              ) && !(is60cmSize && isFrameOption);

              const isActive = searchParams.get(optionNameLowerCase) === value;

              return (
                <button
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  onClick={() => {
                    if (option.id === 'type') {
                      setSelectedType(value);
                    }
                    router.replace(optionUrl, { scroll: false });
                  }}
                  title={`${option.name} ${value}${!isAvailableForSale ? ' (Not Available)' : ''}`}
                  className={clsx(
                    'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                    {
                      'cursor-default ring-2 ring-blue-600': isActive,
                      'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                        !isActive && isAvailableForSale,
                      'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                        !isAvailableForSale
                    }
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </dl>
      ))}
      
    </div>
  );
}

export function calculatePrice(prices, sizeIndex, type) {
  const basePrice = prices[sizeIndex];
  const ratios = [.761, .71, .826, .725, .671];
  let typeMultiplier = 1;

  if (type === 'Wooden Tableau') {
    typeMultiplier = ratios[sizeIndex];
    return basePrice / typeMultiplier;
  }
  return basePrice;
}