'use client'

import { useFrames } from '@/components/layout/useFrames';
import { Carousel } from '@/components/carousel';
import { Slider } from '@/components/layout/Slider';
import LoadingDots from '../loading-dots';
import { NoResults } from './navbar/NoResults';
import { MarqueeBanner } from './navbar/DMBanner';
import { Suspense } from 'react';
import ProductGridItems from './product-grid-items';


export function HomeContent() {
  const { frames, loading } = useFrames()
  if (loading) {
    return <div className="min-h-screen w-full flex-col flex justify-center items-center">
      <LoadingDots/>
    </div>;
  }

  if (!frames && !loading) {
    return <NoResults/>;
  }

 
  return (
    <>
      <Slider/>
      <ProductGridItems frames={frames.sort(() => 0.5 - Math.random()).slice(0, 8)}/>
      <MarqueeBanner/>
        <Suspense fallback={
            <LoadingDots/>
          }>
        <Carousel data={frames}/>

        </Suspense>

    </>
  );
}