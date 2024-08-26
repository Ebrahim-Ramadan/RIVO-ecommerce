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
                            className='rounded-lg'
                            src={productDetails[item.id]?.images[0]}
                            alt={productDetails[item.id]?.id}
                            width={100}
                            height={150}
                            />
                            : <div className='h-16 flex flex-col items-center justify-center'><LoadingDots /></div>}</span>
                           
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
