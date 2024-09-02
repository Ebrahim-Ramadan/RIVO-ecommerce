import axios from 'axios';
import { NextResponse } from 'next/server';
export const runtime = "edge";

export async function POST(req) {
  const requestBody = await req.json();

    console.log('Request body:', requestBody);
  try {
    const bearerToken = process.env.PAYMOB_SECRET_KEY;
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
