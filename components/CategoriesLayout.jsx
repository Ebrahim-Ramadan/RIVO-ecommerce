import React from 'react';
import Grid from "@/components/grid";
import { NoResults } from "@/components/layout/navbar/NoResults";
import ProductGridItems from "@/components/layout/product-grid-items";

export const CategoriesLayout = ({ category, categories, fadingClass }) => {

  return (
    <div className="w-full p-2">
      <div className="absolute w-[150px] h-[150px] bg-white/85 blur-[150px] top-0 bottom-0 left-0 right-0 m-auto rounded-full"></div>

      <h1 className="flex flex-row items-center w-full justify-between mb-4 px-2 capitalize">
        <p className='text-2xl font-bold'>
          {category === 'musics' ||category === 'Ar-Musics'? category.slice(0, -1).replace(/-/g, ' ') : category.replace(/-/g, ' ')}
        </p>
        <span className='text-sm text-neutral-300'>
          ({categories.length+15})
        </span>
      </h1>
      {categories.length > 0 ? (
        <Grid className={`grid-cols-1 ${fadingClass}`}>
          <ProductGridItems frames={categories} />
        </Grid>
      ) : (
        <NoResults text='No Results' shopNow={true} />
      )}
    </div>
  );
}