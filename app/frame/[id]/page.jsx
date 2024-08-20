import Footer from '@/components/layout/footer';
import { ProductOverview } from '@/components/product/ProductOverview';
import LazyLoad from '@/lib/LazyLoad';

export const revalidate = 360000;

export default async function Page({params}) {
  
  return (
    <>
     <ProductOverview frameID = {params.id}/>
     <LazyLoad>
     <Footer/>
     </LazyLoad>
    </>
  );
}

