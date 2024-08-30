'use client';

import { Dialog, Transition } from '@headlessui/react';
import LoadingDots from '@/components/loading-dots';
import Price from '@/components/price';
import { Fragment, useState, useEffect } from 'react';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';
import { clearAllCookies, getCart, updateCart } from './actions';
import { getProductDetails } from '@/lib/utils';
import Image from 'next/image';
import { ShippingCost } from '../pay/ShippingCost';
import eventEmitter from '@/lib/eventEmitter';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon } from 'lucide-react';

export default function CartModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  useEffect(() => {
    eventEmitter.on('openCart', openCart);

    return () => {
      eventEmitter.off('openCart', openCart);
    };
  }, []);

  const [productDetails, setProductDetails] = useState({});
  useEffect(() => {
    setCart(getCart());
  }, [isOpen]); // Refresh cart when modal opens
  useEffect(() => {
    const fetchProductDetails = async () => {
      // Create an array of promises
      const promises = cart.map(item => getProductDetails(item.id));
      try {
        // Resolve all promises concurrently
        const results = await Promise.all(promises);
        console.log('results', results);
        if(!results){
          clearAllCookies()
          router.refresh()
        }
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

  const updateCartItem = (itemId, size, color,type, newQuantity) => {
    const updatedCart = cart.map(item => 
      item.id === itemId && item.size === size && item.color === color&& item.type === type
        ? { ...item, quantity: newQuantity }
        : item
    ).filter(item => item.quantity > 0);

    setCart(updatedCart);
    updateCart(itemId, size, color,type, newQuantity);
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
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 text-white flex h-full w-full flex-col  bg-black/90 p-6 text-black backdrop-blur-xl md:w-[390px]">
            {/* <div class="absolute w-[150px] h-[150px] bg-white/85 z-[-1] blur-[150px] top-0 bottom-0 left-0 right-0 m-auto rounded-full"></div> */}

              <div className="flex items-center mb-4 justify-between">
                <p className="text-xl font-medium">My Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {cart.length === 0 ? (
                // <div className="mt-20  gap-4 flex w-full flex-col items-center justify-center overflow-hidden">
                //   <ShoppingBag className="h-16" />
                //   <p className="mt-6 text-center text-xl font-medium">Your cart is empty.</p>
                //   <button onClick={closeCart} className='text-center font-bold md:text-xl w-full px-4 py-2 bg-white/20 hover:bg-white/10 transition duration-200 backdrop-blur-[.5px] rounded-full '>Back to Shop</button>
                // </div>
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                <ShoppingCartIcon size='44' />
                <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
              </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden px-2">
                  <ul className="flex-grow overflow-y-auto p-2">
                    {cart.map((item, i) => (
                      <li key={i} className="flex w-full flex-col border-b border-neutral-400 px-1 py-4">
                        <div className="relative flex w-full flex-row justify-between ">
                          <button className="absolute z-40 -mt-2 -ml-2">
                            <DeleteItemButton  item={item} setCart={setCart}/>
                          </button>
                          <div className="flex flex-1 flex-col gap-2">
                            <span className="leading-tight">{productDetails[item.id]?.images[0] ?
                            <Image
                            blurDataURL="data:image/webp;base64,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"
                            placeholder="blur"
                            className='rounded-lg'
                            src={`https://iili.io/${productDetails[item.id]?.images[0].match(/\/([a-zA-Z0-9]+)$/)[1]}.jpg`}
                            alt={productDetails[item.id]?.id}
                            width={100}
                            height={150}
                            />
                            : <div className='h-8 flex flex-col items-center justify-center'><LoadingDots /></div>}</span>
                           
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
                                updateQuantity={(newQuantity) => updateCartItem(item.id, item.size, item.color,item.type, newQuantity)}
                              />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">{item.quantity}</span>
                              </p>
                              <EditItemQuantityButton
                                item={item}
                                type="plus"
                                updateQuantity={(newQuantity) => updateCartItem(item.id, item.size, item.color,item.type, newQuantity)}
                              />
                            </div>
                          </div>
                        </div>
                        <a href={`/frame/${item.id}?type=${item.type}&size=${item.size}${item.type !== 'Wooden Tableau' ? `&color=${item.color}` : ''}`} className="font-bold text-neutral-200 mt-4">
                        {productDetails[item.id]?.name}
                      </a>
                      <p className="text-xs font-medium text-neutral-400">
                        Size: {item.size || 'normal'}
                        {item.type !== 'Wooden Tableau' && `, Color: ${item.color || 'normal'}`}
                        , Type: {item.type || 'normal'}
                      </p>
                      </li>
                    ))}
                  </ul>
                  <div className="py-4 text-sm text-neutral-200">
                    
                   
                    <div className=" flex font-bold items-center justify-between border-b border-neutral-400 pb-1 pt-1">
                      <p>Total</p>
                      <Price
                        className="text-right text-base"
                        amount={totalAmount}
                        currencyCode="EGP"
                      />
                    </div>
                    <ShippingCost trigger='Shipping Fees Are Calculated at Checkout' className='text-xs flex items-center justify-end py-2'/>

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
