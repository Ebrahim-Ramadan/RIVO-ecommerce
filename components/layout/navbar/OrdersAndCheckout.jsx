import Image from 'next/image'
import React from 'react'
import alreadyInCart from '@/public/assets/already-in-cart.svg';
import { DollarSign } from 'lucide-react';

export const OrdersAndCheckout = () => {
  return (
    <div className="flex items-center justify-center w-full flex-row gap-2 ">
                  <div className="flex flex-row">
                    <a href='/orders' preload='true' className="flex items-center justify-center flex-row gap-2 font-medium bg-white/20 hover:bg-white/40 py-2 rounded-full px-4 cursor-pointer backdrop-blur-3xl">
                      <Image src={alreadyInCart} width={16} height={16} alt="cart icon" />
                      Orders
                    </a>
                  </div>
                  <div className="flex flex-row">
                    <a href='/pay' preload='true' className="flex items-center justify-center flex-row gap-2 font-medium bg-white/20 hover:bg-white/40 py-2 rounded-full px-4 cursor-pointer backdrop-blur-3xl">
                      <DollarSign size='16'/>
                      Checkout
                    </a>
                  </div>
                </div>
  )
}
