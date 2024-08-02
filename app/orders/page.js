import { OrderHighLevel } from "@/components/orders/OrderHighLevel";
import OrdersLayout from "@/components/orders/OrdersLayout";

export const metadata = {
  title: "My Orders",
  description: "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage({ searchParams }) {
  const orderId = searchParams?.id?.trim();

  console.log("id", orderId);

  return (
    <div className="h-full flex flex-col items-center justify-center w-full">
      <OrdersLayout newOrderID={orderId&&orderId}/>
    </div>
  );
}
