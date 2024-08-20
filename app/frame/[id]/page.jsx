import { ProductOverview } from '@/components/product/ProductOverview';

export const revalidate = 360000;

export default async function Page({params}) {
  
  return (
    <>
     <ProductOverview frameID = {params.id}/>
    
    </>
  );
}

