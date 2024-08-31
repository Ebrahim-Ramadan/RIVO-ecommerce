'use client'

import { useFrames } from '@/components/layout/useFrames';
import { Carousel } from '@/components/carousel';
import { ThreeItemGrid } from '@/components/grid/three-items';
import { Slider } from '@/components/layout/Slider';
import LoadingDots from '../loading-dots';
import { NoResults } from './navbar/NoResults';
import { MarqueeBanner } from './navbar/DMBanner';
import LazyLoad from '@/lib/LazyLoad';
import { Suspense } from 'react';


export function HomeContent() {
  const { frames, loading } = useFrames()
  if (loading) {
    return <div className="min-h-screen w-full flex-col flex justify-center items-center">
      <LoadingDots/>
    </div>;
  }

  if (!frames) {
    return <NoResults/>;
  }


 
  return (
    <>
      <Slider/>
      <ThreeItemGrid data={frames}/>
      <MarqueeBanner/>
      {/* <ThreeItemGrid data={frames}/> */}

      {/* <LazyLoad> */}
        <Suspense fallback={
            <LoadingDots/>
          }>
        <Carousel data={frames}/>

        </Suspense>

      {/* </LazyLoad> */}
    </>
  );
}