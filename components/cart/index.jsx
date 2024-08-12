import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  let cart;

  // if (cartId) {
  //   cart = await getCart(cartId);
  // }

  return <CartModal cart={cart} />;
}
