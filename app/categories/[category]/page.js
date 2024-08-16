import { CategoriesLayout } from "@/components/CategoriesLayout";


export default async function Page({ params }) {
    console.log(params.category);
 
    return (
       <CategoriesLayout category={params.category}  />
    );
}

