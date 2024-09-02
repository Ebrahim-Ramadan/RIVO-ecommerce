import { CategoriesLayout } from "@/components/CategoriesLayout";
import FilteredCategoriesLayout from "@/components/FilteredCategoriesLayout ";
export const runtime = "edge";


export default async function Page({ params }) {
    console.log(params.category);
 
    return (
    //    <CategoriesLayout category={params.category}  />
    <FilteredCategoriesLayout category={params.category}/>
    );
}

