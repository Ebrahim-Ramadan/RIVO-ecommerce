'use client';
import { addId, checkIfOrderExists, deleteId, getDecryptedIds } from "@/lib/orders";
import { Copy, ExternalLink, ExternalLinkIcon, LucideExternalLink, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingDots from "../loading-dots";
import { NoOrders } from "./NoOrders";
import mobile from '@/public/assets/mobile.svg';
import visa from '@/public/assets/visa.svg';
import Image from "next/image";
import { copyToClipboard, getProductDetails } from "@/lib/utils";
import { CancelOrder } from "./CancelOrder";
export default function OrdersLayout({ newOrderID }) {
  const [ordersExist, setOrdersExist] = useState(false);
  const [loading, setloading] = useState(false);
  const [validOrderData, setValidOrderData] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  
  useEffect(() => {
    const fetchProductDetails = async (items) => {
      // Create an array of promises
      const promises = items.map(item => getProductDetails(item.id));

      try {
        // Resolve all promises concurrently
        const results = await Promise.all(promises);
        
        // Map results to the corresponding product IDs
        const details = results.reduce((acc, productDetail, index) => {
          acc[items[index].id] = productDetail;
          return acc;
        }, {});

        setProductDetails(details);
      } catch (error) {
        console.error('Error fetching product details:', error);
        // Handle error accordingly
      }
    };
    async function fetchOrders() {
      setloading(true);
      if (newOrderID && newOrderID.trim() !== '') {
        addId(newOrderID);
      }
      const ordersIDs = getDecryptedIds();
      console.log('getDecryptedIds', ordersIDs);

      if (!ordersIDs) {
        setOrdersExist(false);
      setloading(false);

        return;
      }

      const orders = [];
      for (const orderId of ordersIDs) {
        const ordersData = await checkIfOrderExists(orderId);
        console.log('ordersData', ordersData);
        if (!ordersData){
          deleteId(orderId);
        }
        if (ordersData) {
          orders.push(ordersData);
        fetchProductDetails(ordersData.items)

        }
      }

      if (orders.length > 0) {
        setOrdersExist(true);
        setValidOrderData(orders);
      } else {
        setOrdersExist(false);
      }
      setloading(false);
      console.log('orders', orders);
    }
    

    fetchOrders();
  }, []);

  if (!loading && !ordersExist) {
    return <NoOrders />;
  }

  const calculateTotalPrice = (items) => {
    if (!items || !Array.isArray(items)) {
      return 0;
    }
    return items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 ">
    <a href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Shopping</a>
    
    <h1 className="text-3xl font-bold  mb-2">My Orders</h1>
    <p className=" mb-6">Find order invoice, payment and shipping details here</p>
    <div className="flex justify-end items-center ">
    <CancelOrder trigger={'Cancel Order'} />
    </div>
    {loading && <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50">
          <LoadingDots />
        </div>}
    
    {validOrderData.map((orderWrapper) => {
      const orderId = Object.keys(orderWrapper)[0];
      const order = orderWrapper[orderId];
      console.log('order', order);
      return (
        <div key={orderId} className={`flex flex-col md:flex-row gap-6 border border-2 p-4 my-4 rounded-xl ${newOrderID == orderId  || newOrderID == orderWrapper.id ? 'border-green-600' : 'border-white/10'}`}>
          <div className=" rounded-lg  flex-grow">
            <p className="text-green-500 flex flex-col items-center   font-semibold  mb-1">Successful Order ID 
            <span >{orderWrapper.id} </span>
            </p>
            <p className="text-end mb-6">Placed on {formatCreatedAt(orderWrapper.createdAt)}</p>
            <h3 className="text-lg font-semibold  mb-2">Delivery Details</h3>
            {/* <p className="font-medium mb-1">Delivery by Add delivery date logic</p> */}
            <p className="text-green-600 mb-4">{orderWrapper.status} · Confirmed</p>
            
            {orderWrapper.items.map((item, index) => (
              <a key={index} className="bg-white/10 hover:bg-white/20 flex items-center p-4 mb-2 rounded-lg flex justify-between" href={`/frame/${item.id}?type=${item.type}&size=${item.size}&color=${item.color}`}>
              <div className="flex flex-row gap-2 items-center">
              <span className="leading-tight relative">{productDetails[item.id]?.images[0] ?
                            <Image
                            className='rounded-lg'
                            src={productDetails[item.id]?.images[0]}
                            alt={productDetails[item.id]?.id}
                            width={100}
                            height={150}
                            />
                            : <div className='h-20 flex flex-col items-center justify-center'><LoadingDots /></div>}
                            
<div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-medium text-white">
<div className="">x{item.quantity}</div>
  </div>                            </span>

              <div className=" text-xs">

                  <p className="font-medium text-base">
                  {productDetails[item.id]?.name}
                    </p>
                  <p className="">{item.type}</p>
                  <p className="">{item.color} - {item.size}</p>
                </div>

              </div>
                

              </a>
            ))}
            
          </div>
          
          <div className=" rounded-lg  w-full md:w-80">
            <h3 className="text-lg font-semibold  mb-4">Order invoice</h3>
            <div className="space-y-2 mb-4">
              {/* <div className="flex justify-between">
                <span>Subtotal</span>
                <span>EGP {(order.amount_cents / 100).toFixed(2)}</span>
              </div> */}
              {/* <div className="flex justify-between">
                <span>Shipping fee</span>
                <span>EGP {(order.shipping_data?.shipping_fees / 100 || 0).toFixed(2)}</span>
              </div> */}
              {/* {order.discount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-EGP {(order.discount / 100).toFixed(2)}</span>
                </div>
              )} */}
              <div className="flex justify-between font-bold">
                <span>Order total</span>
                <span>EGP {calculateTotalPrice(orderWrapper.items).toFixed(2)}</span>
              </div>
              {/* Add VAT calculation if available */}
            </div>
            
            <div className="flex justify-end items-center mb-4">
              {orderWrapper.shipping_data?.building == 'pay-on-delivery'?"-paying on delivery-":
               <div className="flex items-center gap-2">
               {order.source_data?.type == 'wallet' ? 
             <Image src={mobile} alt="card logo" className="w-6 h-6" width={40} height={40} />
             : 
             <Image src={visa} alt="card logo" className="w-6 h-6" width={40} height={40} />
             }
               <span>Ending in {order.source_data?.phone_number?.slice(-4)}</span>
             </div>
              }
             
            </div>
            
            <h3 className="text-xl font-semibold  mb-2">Delivery address (Home)</h3>
            <p className="mb-1 text-lg">{orderWrapper.shipping_data?.first_name} {orderWrapper.shipping_data?.email}</p>
            <p className="mb-1">{orderWrapper.shipping_data?.street}, {orderWrapper.shipping_data?.city}, {orderWrapper.shipping_data?.last_name}, {orderWrapper.shipping_data?.country}</p>
            <p className="flex items-center gap-2">
             <PhoneIcon size='16'/>
             {orderWrapper.shipping_data?.phone_number}

            </p>
          </div>
        </div>
      );
    })}
  </div>
  );
}

function formatCreatedAt(timestamp) {
  console.log('timestamp', timestamp);
  if (!timestamp || !timestamp.seconds) return 'N/A';
  
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}