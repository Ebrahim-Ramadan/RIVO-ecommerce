import FilteredCategoriesLayout from "@/components/FilteredCategoriesLayout ";


export default async function Page({ params }) {
    console.log(params.category);
 
    return (
    //    <CategoriesLayout category={params.category}  />
    <FilteredCategoriesLayout category={params.category}/>
    );
}

