'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getCart } from '../cart/actions';
import LoadingDots from '../loading-dots';


export default function PaymentButton({ formData,selectedOption }) {
console.log('PaymentButton formData', formData);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const [strcutred_URL, setstrcutred_URL] = useState('');

  useEffect(() => {
    const handlePayment = async () => {

      const cart = getCart();
      console.log('cart', cart);
      const prices = cart.map(item => {
        // Convert price from string to number and multiply by quantity
        return Number(item.price) * item.quantity;
      });
      
      // Calculate the final price by summing up all the item totals
      const finalPrice = prices.reduce((total, itemPrice) => total + itemPrice, 0)*100;
      if (!selectedOption) return; // Avoid making a request if no option is selected
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getPaymentLink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseInt(finalPrice, 10),
            currency: 'EGP',
            payment_methods: [selectedOption],
            items: [
              {
                name: 'rivo purchase',
                amount: parseInt(finalPrice, 10),
                quantity: 1,
              },
            ],
            billing_data: {
              first_name: formData.fullname,
              last_name: formData.fullname,
              phone_number: formData.phoneNumber,
              country: 'EG',
              email: formData.email,
            },
            // formData,
            customer: {
              fulllname: formData.fullname,
              last_name: formData.fullname,
              phone_number: formData.phoneNumber,
              country: 'EG',
              email: formData.email,
              extras: {
                re: formData.specialMessage,
                cart, cart
              },
            },
          }),
          cache: 'no-store',
        });

        const res = await response.json();
        console.log('res', res);
        if (!res.error){
          const { client_secret } = res;
          setstrcutred_URL(`https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`)
        }
        else{
          toast.error(res.error);
          seterror(true);
        }
       
      } catch (error) {
        console.error('Error creating payment link:', error);
      } finally {
        setLoading(false);
      }
    };

    handlePayment();
  }, [selectedOption]); // Dependency array with selectedOption

  return (
    <div className='py-2 flex flex-col w-full items-center justify-center'>
      {loading ? (
        <LoadingDots/>
      ) : (
        <a  href={strcutred_URL} rel="noopener noreferrer" className='text-center rounded-full text-black py-1 font-bold w-full bg-white'>
        <button className='w-full' disabled={selectedOption === null}>
Pay Now
        </button>
        </a>
      )}
      {error&&<p className='text-center text-red-500 text-sm'>Payment Failed, try again later</p>}
    </div>
  );
}
