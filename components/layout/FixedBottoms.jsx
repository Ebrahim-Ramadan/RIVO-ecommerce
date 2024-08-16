import React from 'react';
import { OrdersAndCheckout } from './navbar/OrdersAndCheckout';

export const FixedBottoms = () => {
  return (
    <div className="md:block fixed hidden bottom-2 left-1/2 transform -translate-x-1/2 z-50 w-fit max-w-screen-sm bg-black p-2 rounded-full">
      <OrdersAndCheckout />
    </div>
  );
};

export default FixedBottoms;
