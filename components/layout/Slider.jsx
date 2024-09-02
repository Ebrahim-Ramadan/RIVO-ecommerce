'use client';

import eventEmitter from '@/lib/eventEmitter';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useDeferredValue, useEffect } from 'react';

const slides = [
  {
    id: 1,
    bg: '/landing-carousel/1.webp',
    text: 'Our New Collection is Here',
  },
  {
    id: 2,
    bg: '/landing-carousel/2.webp',
    text: 'Get Your Frames Done',
  },
  {
    id: 3,
    bg: '/landing-carousel/3.webp',
    text: 'Customized Posters',
  },
];

export  function Slider() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const deferredIndex = useDeferredValue(currentIndex);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      goToNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      goToPrevious();
    }
  };

  const handleSlideAction = (text) => {
    if (text === 'Customized Posters') {
      router.push('https://www.instagram.com/rivoo_gallery?igsh=MThjOXNrY2pnemx3bw==');
    } else if (text === 'Our New Collection is Here') {
      eventEmitter.emit('openLeftModal');
    }
  };

  return (
    <div className="w-full max-w-[2000px] mx-auto mb-8">
      <div
        className="relative h-[70vh] md:h-[90vh] lg:h-[100vh] xl:h-[110vh] w-full overflow-hidden rounded-lg shadow-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${deferredIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full h-full relative flex justify-center items-center"
            >
              <Image
              blurDataURL="data:image/webp;base64,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" placeholder="blur"
                alt={slide.text}
                src={slide.bg}
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white p-8">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-4 shadow-text">
                  {slide.text}
                </h2>
                <button
                  onClick={() => handleSlideAction(slide.text)}
                  className="md:px-6 md:py-3 px-3 py-1.5 bg-white text-black font-semibold rounded-full hover:bg-opacity-90 transition duration-300  md:text-xl"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute backdrop-blur-md top-1/2 transform -translate-y-1/2 left-2 md:left-4 bg-white/60 text-black p-2 md:p-4 rounded-full transition-all duration-300 hover:bg-white"
          onClick={goToPrevious}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          className="absolute backdrop-blur-md top-1/2 transform -translate-y-1/2 right-2 md:right-4 bg-white/60 text-black p-2 md:p-4 rounded-full transition-all duration-300 hover:bg-white"
          onClick={goToNext}
        >
          <ArrowRight size={20} />
        </button>
      </div>
      <div className="flex justify-center mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-2 transition-all duration-300 ${
              index === currentIndex ? 'bg-neutral-300 scale-125' : 'bg-neutral-600'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
export default Slider;
