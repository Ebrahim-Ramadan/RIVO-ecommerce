import Grid from "@/components/grid";
import { NoResults } from "@/components/layout/navbar/NoResults";
import ProductGridItems from "@/components/layout/product-grid-items";
import { getFramesByCategory } from "@/lib/utils";

export default async function Page({ params }) {
    console.log(params.category);
    const data = await getData(params.category);
    console.log('data', data);
    if (!data) {
        return (
            <NoResults shopNow={true} />
        );
    }
    return (
        <div className="mx-auto max-w-7xl px-4">
            <h1 className="text-4xl font-bold mb-4 capitalize">{params.category}</h1>
            {data.length > 0 ? (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems frames={data} />
                </Grid>
            ) : 
                <NoResults text='No Results' shopNow={true} />
            }
        </div>
    );
}

async function getData(category) {
    const response = await getFramesByCategory(category);
    return response;
}
