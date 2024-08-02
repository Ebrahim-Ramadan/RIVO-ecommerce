'use client'
import { addId } from '@/lib/orders';
import OrdersLayout from './OrdersLayout';
import React, { useEffect } from 'react';

export const OrderHighLevel = ({newOrderID}) => {

   useEffect(() => {
     if (newOrderID) {
       addId(newOrderID);
     }
   }, [newOrderID]);
  return (
 <div>
  ass
 </div>
  )
}
