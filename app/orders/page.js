import Footer from "@/components/layout/footer";
import LoadingDots from "@/components/loading-dots";
import OrdersLayout from "@/components/orders/OrdersLayout";
import { Suspense } from "react";

export const metadata = {
  title: "My Orders",
  description: "High-performance ecommerce store built with Next.js, Vercel, and TailwindCSS.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage({ searchParams }) {
  const orderId = searchParams?.id?.trim();

  console.log("id", orderId);

  return (
    <div className="h-full flex flex-col items-center justify-center w-full">
      <Suspense fallback={<LoadingDots/>}>
      <OrdersLayout newOrderID={orderId&&orderId}/>
      </Suspense>
      <Footer/>
    </div>
  );
}
