import Grid from "@/components/grid";
import { NoResults } from "@/components/layout/navbar/NoResults";
import ProductGridItems from "@/components/layout/product-grid-items";
import { searchFrames } from "@/lib/utils";
import { getFromCache, setInCache } from "@/lib/cacheUtil";

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
        <p className="mb-4">
          {frames.length === 0
            ? 'No Products matching '
            : `Showing ${frames.length} ${resultsText} for `}
          <span className="font-bold">&quot;{query}&quot;</span>
        </p>
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