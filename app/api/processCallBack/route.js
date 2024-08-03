import { appendOrderDataToFirestore } from '@/lib/appendDataToOrder';
import { createHmac } from 'crypto';
import { writeFile } from 'fs';

import { NextResponse } from "next/server";
const SECRET_KEY = process.env.ACCEPT_HMAC_SECRET;

const expectedKeys = [
  'amount_cents',
  'created_at',
  'currency',
  'error_occured',
  'has_parent_transaction',
  'id',
  'integration_id',
  'is_3d_secure',
  'is_auth',
  'is_capture',
  'is_refunded',
  'is_standalone_payment',
  'is_voided',
  'order.id',
  'owner',
  'pending',
  'source_data.pan',
  'source_data.sub_type',
  'source_data.type',
  'success',
];

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  const hmacReceived = url.searchParams.get('hmac');
  console.log('hmacReceived', hmacReceived);
  if (!hmacReceived) {
    return NextResponse.json({ error: 'HMAC not provided' }, { status: 400 });
  }

  const data = await req.json();

 
  // Function to safely get nested properties
  const getNestedProperty = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Extract values from the 'obj' property of the data
  const objData = data.obj || {};

  const concatenatedString = expectedKeys
    .map(key => {
      let value;
      if (key.includes('.')) {
        value = getNestedProperty(objData, key);
      } else {
        value = objData[key];
      }
      value = value !== undefined ? value.toString() : '';
      console.log(`Key: ${key}, Value: ${value}`); // Log each key and value
      return value;
    })
    .join('');

  console.log('concatenatedString', concatenatedString);

  const hmac = createHmac('sha512', SECRET_KEY)
    .update(concatenatedString)
    .digest('hex');

  console.log('hmac calculated', hmac);

  if (hmac === hmacReceived) {
    console.log('HMACs match');
    const extractedData = extractTransactionInfo(data);
    console.log('extractedData', extractedData);
    const dataAppended = await appendOrderDataToFirestore(extractedData.shipping_data.building, extractedData);
    console.log('dataAppended', dataAppended);
    if(dataAppended){
      return NextResponse.json({ message: 'HMAC validation succeeded, order details appended to firestore', data }, { status: 200 });
    }
  } else {
    console.log('HMAC validation failed');
    return NextResponse.json({ error: 'HMAC validation failed' }, { status: 401 });
  }
}

function extractTransactionInfo(data) {
  const { obj } = data;
  
  // Extract shipping data
  const validShippingFields = [
    'first_name', 'last_name', 'street', 'building', 'city', 
    'country', 'email', 'phone_number', 'extra_description'
  ];
  
  const shippingData = Object.fromEntries(
    Object.entries(obj.order.shipping_data)
      .filter(([key]) => validShippingFields.includes(key))
  );

  return {
    shipping_data: shippingData,
    obj_id: obj.id,
    source_data: obj.source_data
  };
}