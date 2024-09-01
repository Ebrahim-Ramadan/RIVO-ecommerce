'use client';
import Price from '@/components/price';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';
import { useState, useEffect, Suspense } from 'react';
import LoadingDots from '../loading-dots';
import { Check } from 'lucide-react';

export function VariantSelector({ sizes, colors, types, prices, categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || types[0]);

  const options = [
    { id: 'type', name: 'Type', values: types },
    { id: 'size', name: 'Size', values: sizes },
    ...(selectedType !== 'Wooden Tableau' ? [{ id: 'color', name: 'Color', values: colors }] : []),
  ];

  const combinations = sizes.flatMap((size, sizeIndex) =>
    (selectedType === 'Wooden Tableau' ? [''] : colors).flatMap(color =>
      types.map(type => {
        const { price, discountApplied } = calculatePrice(prices, sizeIndex, type, categories);
        return {
          id: `${size}-${color}-${type}`,
          availableForSale: true,
          size,
          color,
          type,
          price,
          discountApplied
        };
      })
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
        setDiscountApplied(selectedCombination.discountApplied);
      } else {
        const sizeIndex = sizes.indexOf(selectedSize);
        if (sizeIndex !== -1) {
          const { price, discountApplied } = calculatePrice(prices, sizeIndex, selectedType, categories);
          setPrice(price);
          setDiscountApplied(discountApplied);
        }
      }
    }
  }, [searchParams, combinations, sizes, prices, categories]);

  return (
    <div>
      <div className="flex justify-end font-medium text-sm text-white mb-4">
        <Suspense fallback={<LoadingDots/>}>
          <div className="flex gap-2 items-center">
          {discountApplied && (
            <span className="flex flex-row items-center text-green-400 text-sm">
              <Check size='18'/>
              15% off
            </span>
          )}
            <Price
              amount={Math.ceil(price)}
              currencyCode='EGP'
              className='bg-blue-600 rounded-full p-2'
            />
          </div>
        </Suspense>
      </div>
      {options.map((option) => (
        <dl className="mb-4" key={option.id}>
          <dt className="mb-2 font-medium text-sm uppercase tracking-wide">{option.name}</dt>
          <dd className="flex flex-wrap gap-3">
            {option.values.map((value, index) => {
              const optionNameLowerCase = option.name.toLowerCase();
              const optionSearchParams = new URLSearchParams(searchParams.toString());
              optionSearchParams.set(optionNameLowerCase, value);
              const optionUrl = createUrl(pathname, optionSearchParams);

              const selectedSize = searchParams.get('size');
              const selectedType = searchParams.get('type');
              const isLastSize = option.id === 'size' && index === sizes.length - 1;
              const isFrameSelected = selectedType === 'FRAME';

              const isAvailableForSale = combinations.some(combination =>
                combination[optionNameLowerCase] === value && combination.availableForSale
              ) && !(isLastSize && isFrameSelected);

              const isActive = searchParams.get(optionNameLowerCase) === value;

              return (
                <button
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  onClick={() => {
                    if (option.id === 'type') {
                      setSelectedType(value);
                      if (value === 'FRAME' && selectedSize === sizes[sizes.length - 1]) {
                        optionSearchParams.set('size', sizes[sizes.length - 2]);
                      }
                    }
                    router.replace(createUrl(pathname, optionSearchParams), { scroll: false });
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

export function calculatePrice(prices, sizeIndex, type, categories) {
  const basePrice = prices[sizeIndex];
  const ratios = [.761, .71, .826, .725, .671];
  let typeMultiplier = 1;
  let discountApplied = false;

  if (type === 'Wooden Tableau') {
    typeMultiplier = ratios[sizeIndex];
    return { price: basePrice / typeMultiplier, discountApplied };
  }

  if (categories && categories.includes('Frame sets')) {
    discountApplied = true;
    return { price: basePrice * 0.85, discountApplied };
  }

  return { price: basePrice, discountApplied };
}