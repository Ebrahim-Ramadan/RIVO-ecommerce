import Grid from "@/components/grid";
import { NoResults } from "@/components/layout/navbar/NoResults";
import ProductGridItems from "@/components/layout/product-grid-items";
import { searchFrames } from "@/lib/utils";
import { getFromCache, setInCache } from "@/lib/cacheUtil";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Home({ searchParams }) {
  const query = searchParams.q ?? '';
  
  // Try to get frames from cache first
  const cacheKey = `search:${query}`;
  let frames = getFromCache(cacheKey);

  if (!frames) {
    // If not in cache, fetch from searchFrames function
    frames = await searchFrames(query);
    
    // Store the results in cache for future requests
    setInCache(cacheKey, frames);
    console.log(`Cache miss for "${query}". Fetched and cached ${frames.length} frames.`);
  } else {
    console.log(`Cache hit for "${query}". Retrieved ${frames.length} frames from cache.`);
  }

  const resultsText = frames.length > 1 ? 'results' : 'result';

  return (
    <div className="mx-auto max-w-7xl md:px-4">
      {query ? (
        <div className="flex flex-row items-center justify-between w-full py-4">
           <div className='flex flex-row items-center gap-2'>
           <Link href='/' className='rounded-full p-2 bg-blue-600 text-white  hover:bg-blue-700'>
            <ArrowLeft size='16'/>

            </Link>
          <p className="font-medium text-lg">
          {frames.length === 0
            ? `No Products matching  ${resultsText}`
            : `Products Results  for `}
          <span className="font-bold">&quot;{query}&quot;</span>
        </p>
           </div>
        <p>
          ({frames.length})
        </p>
          </div>
      ) : null}
      {frames.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems frames={frames} />
        </Grid>
      ) : 
      <NoResults text='No Results' shopNow={true}/>}
    </div>
  );
}