'use client';
import { useEffect, useRef, useState } from 'react';

export const LazyLoad = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '10px' } //the root margin
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return <div
  className='h-full w-full flex flex-col items-center justify-center'
    ref={ref}>{isVisible ? children : null}</div>;
};

export default LazyLoad;