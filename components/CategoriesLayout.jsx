import React from 'react';
import Grid from "@/components/grid";
import { NoResults } from "@/components/layout/navbar/NoResults";
import ProductGridItems from "@/components/layout/product-grid-items";

export const CategoriesLayout = ({ category, categories }) => {

  return (
    <div className="w-full p-2">
      <div className="absolute w-[150px] h-[150px] bg-white/85 blur-[150px] top-0 bottom-0 left-0 right-0 m-auto rounded-full"></div>

      <h1 className="flex flex-row items-center w-full justify-between mb-4 px-2 capitalize">
        <p className='text-2xl font-bold'>
          {category === 'musics' ? category.slice(0, -1) : category.replace(/-/g, ' ')}
        </p>
        <span>
          {categories.length > 0 
            ? ` (${(category !== "Framed-vinyls" && category !== "vinyls") ? categories.length * 2 : categories.length} products)` 
            : ''}
        </span>
      </h1>
      {categories.length > 0 ? (
        <Grid className="grid-cols-1">
          <ProductGridItems frames={categories} />
        </Grid>
      ) : (
        <NoResults text='No Results' shopNow={true} />
      )}
    </div>
  );
}