import Grid from "@/components/grid";
import { NoResults } from "@/components/layout/navbar/NoResults";
import ProductGridItems from "@/components/layout/product-grid-items";
import { searchFrames } from "@/lib/utils";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export const runtime = "edge";

export default async function Home({ searchParams }) {
  const query = searchParams.q ?? '';
  
  const cacheKey = `search:${query}`;
 
    const frames = await searchFrames(query);
    

  return (
    <div className="mx-auto max-w-7xl md:px-4">
      {query ? (
        <div className="flex flex-row items-center justify-between w-full py-4">
           <div className='flex flex-row items-center gap-2'>
           <Link href='/' className='rounded-full p-2 bg-blue-600 text-white  hover:bg-blue-700'>
            <ArrowLeft size='16'/>

            </Link>
          <p className=" text-lg whitespace-nowrap overflow-hidden text-ellipsis">
          {frames.length === 0
            ? `No Products for `
            : `Results for `}
          <span className="font-medium">&quot;{query}&quot;</span>
        </p>
           </div>
           {frames.length != 0 && 
        <p className="text-neutral-400 text-xs">
        ({frames.length})
      </p>}
          </div>
      ) : null}
      {frames.length > 0 ? (
        <Grid className="grid-cols-1 ">
          <ProductGridItems frames={frames} />
        </Grid>
      ) : 
      <NoResults text='No Results' shopNow={true}/>}
    </div>
  );
}