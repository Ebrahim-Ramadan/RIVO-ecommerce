'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingBag } from 'lucide-react';
import LoadingDots from '@/components/loading-dots';
import Price from '@/components/price';
import { Fragment, useState, useEffect } from 'react';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';
import { getCart, removeFromCart, setCookie, updateCart } from './actions'; // Assuming you have these functions
import { getProductDetails } from '@/lib/utils';
import Image from 'next/image';

export default function CartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const [productDetails, setProductDetails] = useState({});
  useEffect(() => {
    if (isOpen) {
      setCart(getCart());
    }
  }, [isOpen]); // Refresh cart when modal opens
  useEffect(() => {
    const fetchProductDetails = async () => {
      // Create an array of promises
      const promises = cart.map(item => getProductDetails(item.id));

      try {
        // Resolve all promises concurrently
        const results = await Promise.all(promises);
        
        // Map results to the corresponding product IDs
        const details = results.reduce((acc, productDetail, index) => {
          acc[cart[index].id] = productDetail;
          return acc;
        }, {});

        setProductDetails(details);
      } catch (error) {
        console.error('Error fetching product details:', error);
        // Handle error accordingly
      }
    };

    if (cart.length > 0) {
      fetchProductDetails();
    }
  }, [cart]);

  const updateCartItem = (itemId, size, color, newQuantity) => {
    const updatedCart = cart.map(item => 
      item.id === itemId && item.size === size && item.color === color
        ? { ...item, quantity: newQuantity }
        : item
    ).filter(item => item.quantity > 0);

    setCart(updatedCart);
    updateCart(itemId, size, color, newQuantity);
  };

  

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          {/* Cart panel */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 text-white flex h-full w-full flex-col  bg-black/80 p-6 text-black backdrop-blur-xl md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="mt-20  gap-4 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingBag className="h-16" />
                  <p className="mt-6 text-center text-xl font-medium">Your cart is empty.</p>
                  <a href='/' className='text-center font-bold md:text-xl w-full px-4 py-2 bg-white/20 hover:bg-white/10 transition duration-200 backdrop-blur-[.5px] rounded-full '>Back to Shop</a>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden px-2">
                  <ul className="flex-grow overflow-y-auto p-2">
                    {cart.map((item, i) => (
                      <li key={i} className="flex w-full flex-col border-b border-neutral-400 px-1 py-4">
                        <div className="relative flex w-full flex-row justify-between ">
                          <button className="absolute z-40 -mt-2 -ml-2" onClick={closeCart}>
                            <DeleteItemButton  item={item} />
                          </button>
                          <div className="flex flex-1 flex-col gap-2">
                            <span className="leading-tight">{productDetails[item.id]?.images[0] ?
                            <Image
                            className='rounded-lg'
                            src={productDetails[item.id]?.images[0]}
                            alt={productDetails[item.id]?.id}
                            width={100}
                            height={150}
                            />
                            : <div className='h-20 flex flex-col items-center justify-center'><LoadingDots /></div>}</span>
                           
                          </div>
                          <div className="flex h-16 flex-col justify-between">
                            <Price
                              className="flex justify-end space-y-2 text-right text-sm"
                              amount={item.price * item.quantity}
                              currencyCode="EGP"
                            />
                            <div className="ml-auto flex h-9 flex-row items-center rounded-full hover:border-neutral-300 border border-neutral-400">
                              <EditItemQuantityButton
                                item={item}
                                type="minus"
                                updateQuantity={(newQuantity) => updateCartItem(item.id, item.size, item.color, newQuantity)}
                              />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">{item.quantity}</span>
                              </p>
                              <EditItemQuantityButton
                                item={item}
                                type="plus"
                                updateQuantity={(newQuantity) => updateCartItem(item.id, item.size, item.color, newQuantity)}
                              />
                            </div>
                          </div>
                        </div>
                        <a href={`/frame/${item.id}`} className=" font-bold text-neutral-200 mt-4">
                             {productDetails[item.id]?.name}
                            </a>
                        <p className="text-xs font-medium text-neutral-400">
                              Size: {item.size || 'normal'}, Color: {item.color || 'normal'}, Type: {item.type || 'normal'}
                            </p>
                      </li>
                    ))}
                  </ul>
                  <div className="py-4 text-sm text-neutral-200">
                    
                   
                    <div className="mb-3 flex font-bold items-center justify-between border-b border-neutral-400 pb-1 pt-1">
                      <p>Total</p>
                      <Price
                        className="text-right text-base"
                        amount={totalAmount}
                        currencyCode="EGP"
                      />
                    </div>
                    <div className="text-xs flex items-center justify-end ">
                      <p>Shipping Fees Are Calculated at Checkout</p>
                    </div>
                  </div>
                  <a
                    className="cursor-pointer text-center block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
                    href='/pay'
                  >
                    Place Order
                  </a>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
