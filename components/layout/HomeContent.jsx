'use client'

import { useFrames } from '@/components/layout/useFrames';
import { Carousel } from '@/components/carousel';
import { ThreeItemGrid } from '@/components/grid/three-items';
import { Slider } from '@/components/layout/Slider';

export function HomeContent() {
  const { frames, loading } = useFrames()
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!frames) {
    return 'No frames available';
  }

  return (
    <>
      <Slider/>
      <ThreeItemGrid data={frames}/>
      <Carousel data={frames}/>
    </>
  );
}