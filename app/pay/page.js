import Footer from "@/components/layout/footer";
import { ClientPaymentForm } from "@/components/pay/ClientPaymentForm";


export const metadata = {
  title:"Payment",
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {

  return (
   <div className="h-full flex flex-col items-center justify-center w-full ">
    <p className="text-start text-3xl font-bold">
      Payment Page
    </p>
    <div class="py-4 flex flex-row justify-center w-full  text-center">
      <div class="bg-gradient-to-r from-transparent via-white/40 to-transparent w-full  h-[2px] opacity-80"></div>
    </div>
<ClientPaymentForm />
<Footer/>
   </div>
  );
}
