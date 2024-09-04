import { NextResponse } from 'next/server';

export async function POST(req) {
  const requestBody = await req.json();

  try {
    const bearerToken = process.env.PAYMOB_SECRET_KEY;

    // Define headers for the request
    const headers = new Headers({
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });

    // Make the POST request to Paymob using fetch
    const response = await fetch('https://accept.paymob.com/v1/intention/', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // Return the response data
    return NextResponse.json(data, { headers, status: response.status });
  } catch (error) {
    console.error('Error processing payment:', error.message || error);
    return NextResponse.json({ error: 'An error occurred while processing the payment' }, { status: 500 });
  }
}
