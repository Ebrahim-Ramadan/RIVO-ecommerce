'use client';

import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';
export function VariantSelector({ sizes, colors }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const options = [
    { id: 'size', name: 'Size', values: sizes },
    { id: 'color', name: 'Color', values: colors }
  ];

  // Simplified logic for combinations
  const combinations = sizes.flatMap(size => 
    colors.map(color => ({
      id: `${size}-${color}`,
      availableForSale: true, // You may want to adjust this based on your actual inventory
      size,
      color
    }))
  );

  return options.map((option) => (
    <dl className="mb-8" key={option.id}>
      <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
      <dd className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const optionNameLowerCase = option.name.toLowerCase();
          const optionSearchParams = new URLSearchParams(searchParams.toString());
          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          const isAvailableForSale = combinations.some(combination => 
            combination[optionNameLowerCase] === value && combination.availableForSale
          );

          const isActive = searchParams.get(optionNameLowerCase) === value;

          return (
            <button
              key={value}
              aria-disabled={!isAvailableForSale}
              disabled={!isAvailableForSale}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
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
  ));
}