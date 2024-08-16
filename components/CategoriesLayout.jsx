'use client';
import React, { useEffect, useState } from 'react';
import Grid from "@/components/grid";
import { NoResults } from "@/components/layout/navbar/NoResults";
import ProductGridItems from "@/components/layout/product-grid-items";
import { getFramesByCategory } from "@/lib/utils";
import LoadingDots from './loading-dots';

export const CategoriesLayout = ({category}) => {
      const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch categories data
    const fetchCategories = async () => {
      try {
        const cacheKey = `categories_${category}`;
        const cachedCategories = localStorage.getItem(cacheKey);
        if (cachedCategories) {
          // Use cached data if available
          setCategories(JSON.parse(cachedCategories));
          setLoading(false);
        } else {
          // Fetch data from API
          const response = await getFramesByCategory(category);
            if(response.length===0){
                return <NoResults shopNow={true} />
            }
          // Update state with fetched data
          setCategories(response);
          
         
          // Cache data in localStorage
          localStorage.setItem(cacheKey, JSON.stringify(response));
          setLoading(false);
        }
      } catch (err) {
        // Handle errors
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return <div className="flex items-center justify-center w-full h-full"><LoadingDots/></div>;
  }


  return (
    <div className="mx-auto max-w-7xl px-4">
            {/* remove the last s from musics bc that's how it is*/}
            <h1 className="text-4xl font-bold mb-4 capitalize">{category =='musics'?category.slice(0, -1):category }</h1>
            {categories.length > 0 ? (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems frames={categories} />
                </Grid>
            ) : 
                <NoResults text='No Results' shopNow={true} />
            }
        </div>
  )
}
