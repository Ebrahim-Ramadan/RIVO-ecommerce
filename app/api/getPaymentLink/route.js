import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const requestBody = await req.json();

    console.log('Request body:', requestBody);
  try {
    const bearerToken = process.env.PAYMOB_SECRET_KEY;

    // Define the request body
    // const requestBody = {
    //   amount: 207,
    //   currency: 'EGP',
    //   payment_methods: ['4619234'],
    //   items: [
    //     {
    //       name: 'planName',
    //       amount: 207,
    //       quantity: 1,
    //     },
    //   ],
    //   billing_data: {
    //     first_name: 'Jhon',
    //     last_name: 'Jhon',
    //     phone_number: '2000000000000',
    //     country: 'EG',
    //     email: 'jhon@doe.com',
    //   },
    //   customer: {
    //     fulllname: 'Jhon',
    //     last_name: 'Jhon',
    //     phone_number: '2000000000000',
    //     country: 'EG',
    //     email: 'jhon@doe.com',
    //     extras: { //extras to be included in the callback
    //       re: '22',
    //     },
    //   },
    // };
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });
    // Make the POST request to Paymob
    const response = await axios.post('https://accept.paymob.com/v1/intention/', requestBody, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
      },
    });

    // Return the response data
    return NextResponse.json(response.data, { headers, status: response.status });
  } catch (error) {
    console.error('Error processing payment:', error.message || error);
    return NextResponse.json({ error: 'An error occurred while processing the payment' }, { status: 500 });
  }
}
