'use client';
import { addId, checkIfOrderExists, deleteId, getDecryptedIds } from "@/lib/orders";
import { ExternalLink, ExternalLinkIcon, LucideExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingDots from "../loading-dots";
import { NoOrders } from "./NoOrders";

export default function OrdersLayout({ newOrderID }) {
  const [ordersExist, setOrdersExist] = useState(false);
  const [loading, setloading] = useState(false);
  const [validOrderData, setValidOrderData] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      setloading(true);
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

  useEffect(() => {
    if (newOrderID && newOrderID.trim() !== '') {
      addId(newOrderID);
    }
  }, [newOrderID]);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {loading&&<LoadingDots/>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validOrderData.map((orderWrapper) => {
         
          const orderId = Object.keys(orderWrapper)[0];
          const order = orderWrapper[orderId];

     
          return(
            <div key={orderId} className="border px-4 py-4 border-white/10 shadow-md rounded-xl overflow-hidden">
            <div className="bg-muted ">
              <div className="flex items-center justify-between items-center">
              <div className="text-2xl font-medium ">Info</div>

                <div
                  className="bg-blue-500 rounded-full p-2 text-xs font-medium"
                >
                  {orderWrapper.status}
                </div>
              </div>
            </div>
            <div className=" py-4">
              <div className="mb-4">
                <div className="text-xl font-medium">{order.shipping_data?.first_name || 'N/A'}</div>
                <div className="text-lg text-gray-200">{order.shipping_data?.email || 'N/A'}</div>
                <div className="text-sm text-gray-300">{order.shipping_data?.phone_number || 'N/A'}</div>
              </div>
              <div className="py-4 text-sm border border-b-2 border-t-0 border-l-0 border-r-0 border-b-white/10">
                <div className="flex justify-between items-center">
                <div className="text-xl font-medium ">Payment</div>
                <div className="font-medium ">EGP {calculateTotalPrice(orderWrapper.items).toFixed(2)}</div>

                </div>
                <div className="flex justify-between text-gray-200 items-center px-4">
                <div>{order.source_data?.type || 'N/A'}</div>
                <div>{order.source_data?.phone_number || 'N/A'}</div>
                </div>
              
              </div>
              <div className="py-2">
                <div className="text-lg font-medium ">Items</div>
                <ul className="space-y-2">
                  {orderWrapper.items.map((item, index) => (
                    <a key={index} className="text-xs flex justify-between w-full bg-white/10 hover:bg-white/20 py-2 rounded-full px-2 md:px-4" href={`/frame/${item.id}?type=${item.type}&size=${item.size}&color=${item.color}`}>
                      <div className="flex items-center justify-between w-full">
                      <div className="bg-blue-500 rounded-full flex justify-center w-4 h-4 mx-2  font-medium ">x{item.quantity}</div>

                      <div className="font-medium underline">{item.size} {item.color} {item.type} for EGP {item.price} each</div>
<LucideExternalLink size='16'/>
                      </div>
                    </a>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  );
}
