import Footer from "@/components/layout/footer";
import { ClientPaymentForm } from "@/components/pay/ClientPaymentForm";


export const metadata = {
  title:"Payment",
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage({searchParams}) {
  const amount = searchParams.amount?? '';
console.log('amount', amount);
  return (
   <div className="h-full flex flex-col items-center justify-center w-full ">
<ClientPaymentForm amount={amount}/>
<Footer/>
   </div>
  );
}
