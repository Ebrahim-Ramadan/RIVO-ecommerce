'use client';

import { getFramesByCategory } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import LoadingDots from '../loading-dots';
import { NoResults } from './navbar/NoResults';
import ProductGridItems from './product-grid-items';

export const VinylsProducts = () => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const fetchFrames = async () => {
     
      const cachedFramesVinyls = localStorage.getItem('cachedVinyls');
      if (cachedFramesVinyls) {
       
        setFrames(JSON.parse(cachedFramesVinyls));
        setLoading(false);
      } else {
       
        try {
          const response = await getFramesByCategory('vinyls');
         
          localStorage.setItem('cachedVinyls', JSON.stringify(response));
         
          setFrames(response);
        } catch (error) {
          console.error('Failed to fetch frames:', error);
         
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFrames();
  }, []);

  if (loading) {
    return <div className="flex w-full justify-center"><LoadingDots/></div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 px-2 capitalize">Vinyls</h1>
      {frames?.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems frames={frames} />
        </Grid>
      ) : (
        <NoResults text='No Results' shopNow={true} />
      )}
    </div>
  );
};
