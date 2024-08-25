import { lazy, Suspense } from 'react';
import LoadingDots from '../loading-dots';

const CartModal = lazy(() => import('./modal'));

export default async function Cart() {

  // if (cartId) {
  //   cart = await getCart(cartId);
  // }

  return (
    <Suspense fallback={<LoadingDots/>}>
      <CartModal />
    </Suspense>
  );
}
