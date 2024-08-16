'use client';

import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import LoadingDots from '../loading-dots';
import { NoResults } from './navbar/NoResults';
import ProductGridItems from './product-grid-items';


export const VinylsProducts = () => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch and set cached frames
    const fetchCachedFrames = () => {
      // Fetch data from localStorage
      const cachedFrames = localStorage.getItem('cachedFrames');
      if (cachedFrames) {
        // Use cached data if available
        setFrames(JSON.parse(cachedFrames));
      } else {
        // If no cached data, handle the case (e.g., show a loading spinner or message)
        setFrames([]);
      }
      setLoading(false);
    };

    fetchCachedFrames();
  }, []);

  if (loading) {
    return <LoadingDots/>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 px-2 capitalize">Vinyls</h1>
      {frames?.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems frames={frames.slice(10, 40)} />
        </Grid>
      ) : (
        <NoResults text='No Results' shopNow={true} />
      )}
    </div>
  );
};
