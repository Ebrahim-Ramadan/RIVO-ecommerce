import PayOptionsComponent from "@/components/pay/PayOptionsComponent";


export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  return (
   <div className="h-full flex flex-col items-center justify-center w-full ">
<PayOptionsComponent/>
   </div>
  );
}
