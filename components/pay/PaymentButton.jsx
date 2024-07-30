'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import LoadingDots from '../loading-dots';
import { getCart } from '@/components/cart/actions';
export default function PaymentButton({ selectedOption, amountInt }) {
  const [loading, setLoading] = useState(false);
  const [strcutred_URL, setstrcutred_URL] = useState('');
  const amount = parseInt(amountInt, 10);
  useEffect(() => {
    const handlePayment = async () => {
      if (!selectedOption) return; // Avoid making a request if no option is selected
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getPaymentLink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: 'EGP',
            payment_methods: [selectedOption],
            items: [
              {
                name: 'planName',
                amount,
                quantity: 1,
              },
            ],
            billing_data: {
              first_name: 'Jhon',
              last_name: 'Jhon',
              phone_number: '2000000000000',
              country: 'EG',
              email: 'jhon@doe.com',
            },
            customer: {
              fulllname: 'Jhon',
              last_name: 'Jhon',
              phone_number: '2000000000000',
              country: 'EG',
              email: 'jhon@doe.com',
              extras: {
                re: '22',
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
        <a target="_blank" href={strcutred_URL} rel="noopener noreferrer" className='text-center rounded-full text-black py-1 font-bold w-full bg-white'>
        <button className='w-full' disabled={selectedOption === null}>
Pay Now
        </button>
        </a>
      )}
    </div>
  );
}
