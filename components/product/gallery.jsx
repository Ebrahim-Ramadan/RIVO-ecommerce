'use client';

import { GridTileImage } from '@/components/grid/tile';
import { createUrl } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LoadingDots from '../loading-dots';

export function Gallery({ images }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get('image');
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  nextSearchParams.set('image', nextImageIndex.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
  previousSearchParams.set('image', previousImageIndex.toString());
  const previousUrl = createUrl(pathname, previousSearchParams);

  const buttonClassName =
    'h-full px-2 md:px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';
    const [loading, setLoading] = useState(true);
  return (
    <>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center  rounded-lg">
          <LoadingDots/>
        </div>
      )}
      {images[imageIndex] && (
        <Image
        quality={50}
          className="h-full w-full object-contain rounded-lg"
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          alt={images[imageIndex]?.altText || 'Image'}
          src={`https://iili.io/${images[imageIndex]?.src.match(/\/([a-zA-Z0-9]+)$/)[1]}.jpg` || '/logo.png'}
          priority={true}
          onLoadingComplete={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            console.log('Error loading image');
          }}
        />
      )}

        {images.length > 1 ? (
          <div className="absolute bottom-2 md:bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <Link
                aria-label="Previous product image"
                href={previousUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowLeft className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <Link
                aria-label="Next product image"
                href={nextUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowRight className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <div className='flex justify-center items-center'>
      {images.length > 1 ? (
  <ul className="my-6 md:my-12 flex items-center justify-start gap-2 overflow-x-auto py-1 lg:mb-0 whitespace-nowrap max-w-xl">
    {images.map((image, index) => {
      const isActive = index === imageIndex;
      const imageSearchParams = new URLSearchParams(searchParams.toString());

      imageSearchParams.set('image', index.toString());
      return (
        <li key={image.src} className="h-10 md:h-16 w-10 md:w-16 flex-shrink-0">
          <Link
            aria-label="Enlarge product image"
            href={createUrl(pathname, imageSearchParams)}
            scroll={false}
            className="h-full w-full"
          >
            <GridTileImage
              alt={image.altText}
              // src={image.src}
              src={`https://iili.io/${image?.src.match(/\/([a-zA-Z0-9]+)$/)[1]}.jpg`}
              width={80}
              height={80}
              active={isActive}
            />
          </Link>
        </li>
      );
    })}
  </ul>
) : null}
      </div>
    </>
  );
}
