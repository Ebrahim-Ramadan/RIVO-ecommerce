
import { X } from 'lucide-react';
import {removeFromCart} from './actions';
export function DeleteItemButton({ item}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        removeFromCart(item.id, item.size, item.color);
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="ease flex h-6 w-6 items-center justify-center rounded-full bg-neutral-500 transition-all duration-200"
      >
        <X color="white" size="16" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        Removing item...
      </p>
    </form>
  );
}
