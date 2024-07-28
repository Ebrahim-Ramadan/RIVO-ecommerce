import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { searchFrames } from "@/lib/utils";

export default async function Home({ searchParams }) {
  const query = searchParams.q ?? '';
  const frames = await searchFrames(query);
console.log(`frames for ${query}`, frames, frames.length);
const resultsText = frames.length > 1 ? 'results' : 'result';
  return (
    <div className="mx-auto max-w-7xl px-2 md:px-4">
      {query ? (
        <p className="mb-4">
          {frames.length === 0
            ? 'There are no frames that match '
            : `Showing ${frames.length} ${resultsText} for `}
          <span className="font-bold">&quot;{query}&quot;</span>
        </p>
      ) : null}
      {frames.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems frames={frames} />
        </Grid>
      ) : null}
    </div>
  );
}