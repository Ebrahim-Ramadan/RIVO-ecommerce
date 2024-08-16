'use client';
import React, { useEffect, useState } from 'react';
import Grid from "@/components/grid";
import { NoResults } from "@/components/layout/navbar/NoResults";
import ProductGridItems from "@/components/layout/product-grid-items";
import LoadingDots from './loading-dots';

export const CategoriesLayout = ({ category }) => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const cachedFrames = localStorage.getItem('cachedFrames');

        if (cachedFrames) {
          const dataArray = JSON.parse(cachedFrames);
          console.log('dataArray', dataArray);
          if (Array.isArray(dataArray)) {
            const filteredData = dataArray.filter(item => 
              item.categories && item.categories.some(cat => 
                cat.toLowerCase().replace(/-/g, ' ') === category.toLowerCase().replace(/-/g, ' ')
              )
            );
            console.log('filteredData', filteredData);
            setCategories(filteredData);
          } else {
            console.error('Cached data is not an array');
          }
        } else {
          console.error('No data found in localStorage');
        }
      } catch (error) {
        console.error('Failed to parse cached data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [category]); // Add `category` to the dependency array if you expect it to change

  if (loading) {
    return <div className="flex items-center justify-center w-full h-full"><LoadingDots/></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-2">
      <h1 className="text-4xl font-bold mb-4 capitalize">
        {category === 'musics' ? category.slice(0, -1) : category.replace(/-/g, ' ')}
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
