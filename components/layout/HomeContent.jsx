'use client'

import { useFrames } from '@/components/layout/useFrames';
import { Carousel } from '@/components/carousel';
import { ThreeItemGrid } from '@/components/grid/three-items';
import { Slider } from '@/components/layout/Slider';
import LoadingDots from '../loading-dots';
import { NoResults } from './navbar/NoResults';

export function HomeContent() {
  const { frames, loading } = useFrames()
  
  if (loading) {
    return <LoadingDots/>;
  }

  if (!frames) {
    return <NoResults/>;
  }

  return (
    <>
      <Slider/>
      <ThreeItemGrid data={frames}/>
      <Carousel data={frames}/>
    </>
  );
}