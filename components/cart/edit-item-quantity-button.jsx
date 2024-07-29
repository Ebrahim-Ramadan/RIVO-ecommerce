'use client';

import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';

function SubmitButton({ type, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'ml-auto': type === 'minus'
        }
      )}
    >
      {type === 'plus' ? (
        <Plus className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <Minus className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  updateQuantity
}) {
  const handleClick = () => {
    const newQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
    updateQuantity(newQuantity);
  };

  return (
    <SubmitButton type={type} onClick={handleClick} />
  );
}