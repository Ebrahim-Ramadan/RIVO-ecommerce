'use client'

import { useState, useEffect } from 'react';
import { getAllFrames } from '@/lib/utils';

export const useFrames = () => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndCacheFrames = async ()=>{
    const cachedFrames = localStorage.getItem('cachedFrames');

    if (cachedFrames) {
      console.log('cached');
      setFrames(JSON.parse(cachedFrames));
    } else {
      setLoading(true);
      try {
        const fetchedFrames = await getAllFrames();
        console.log('fetchedFrames', fetchedFrames);
        if (fetchedFrames) {
          setFrames(fetchedFrames);
          localStorage.setItem('cachedFrames', JSON.stringify(fetchedFrames));
        }
      } catch (error) {
        console.error('Error fetching frames:', error);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAndCacheFrames();
  }, []);

  return { frames, loading };
};

