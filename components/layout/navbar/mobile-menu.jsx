'use client';

import { Dialog, Transition } from '@headlessui/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useEffect, useState } from 'react';
import {  X, ArrowLeft } from 'lucide-react';
import Search, { SearchSkeleton } from './search';
import Image from 'next/image';
import Eclipse from '@/public/assets/Eclipse.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OrdersAndCheckout } from './OrdersAndCheckout';
import eventEmitter from '@/lib/eventEmitter';
import { ArrowRight } from 'lucide-react';

const FramedCategories = [
  { name: 'Movies', slug: '/movies', icon: '/categories/movies.svg' },
  { name: 'Series', slug: '/series', icon: '/categories/series.svg' },
  { name: 'Music', slug: '/musics', icon: '/categories/music.svg' },
  { name: 'Ar Musics', slug: '/Ar-Musics', icon: '/categories/ar-music.svg' },
  { name: 'Superheroes', slug: '/superheroes', icon: '/categories/superheros.svg' },
  { name: 'Cars', slug: '/Cars', icon: '/categories/cars.svg' },
  { name: 'Art', slug: '/Art', icon: '/categories/art.svg' },
  { name: 'Sports', slug: '/Sports', icon: '/categories/sports.svg' },
];
const OutCategories = [
  { name: 'Best Sellers',  icon: '/categories/best-selling.png' , slug:'/#BEST-SELLERS'},
  { name: 'posters set',  icon: '/categories/posters-sets.png' , slug:'/categories/posters-set'},
  { name: 'Frames',  icon: '/categories/Vinyl Frames.svg' },
  { name: 'cairokee frames',  icon: '/categories/cairokee.png', slug: '/categories/cairokee-frames' },
  { name: 'Frame Sets',  icon: '/categories/collections.svg', slug: '/categories/frame-sets' },
  { name: 'Framed vinyls', slug: '/categories/Framed-vinyls', icon: '/categories/framed-vinyls.svg' },
  { name: 'Vinyls',  icon: '/categories/all.svg' , slug:'/categories/vinyls'},
];

export default function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (activeCategory) {
      setIsOpen(false); // Close the current mobile menu
    }
  }, [activeCategory]);

  const handleCategoryClick = (category) => {
    if (category.slug === '/categories/vinyls') {
      router.push('/categories/vinyls');
      return;
    }
    if (category.slug === '/categories/Framed-vinyls') {
      router.push('/categories/Framed-vinyls');
      return;
    }
    if (category.slug === '/#BEST-SELLERS') {
      router.push('/categories/best-sellers');
      return;
    }
    if (category.slug === '/categories/cairokee-frames') {
      router.push('/categories/cairokee-frames');
      return;
    }
    if (category.slug === '/categories/frame-sets') {
      router.push('/categories/frame-sets');
      return;
    }
    if (category.slug === '/categories/posters-set') {
      router.push('/categories/posters-set');
      return;
    }
    setActiveCategory(category.name);
    setIsOpen(false);   
  };

  const handleBackToMain = () => {
    setActiveCategory(null); // Close the child dialog
    setIsOpen(true);         // Reopen the parent dialog
  };

  useEffect(() => {
    setActiveCategory(false);
    setIsOpen(false); // Close the current mobile menu
  }, [pathname, searchParams]);

  useEffect(() => {
    eventEmitter.on('openLeftModal', openMobileMenu);

    return () => {
      eventEmitter.off('openLeftModal', openMobileMenu);
    };
  }, []);
  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
      >
        <Image src={Eclipse} width={24} height={24} alt="menu" />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 text-white flex h-full w-full flex-col  bg-black/80 p-4 text-black backdrop-blur-xl md:w-[390px]">
              <div className="w-full flex flex-col items-center justify-between h-full">
              <div class="absolute w-[150px] h-[150px] bg-white/85 z-[-1] blur-[150px] top-0 bottom-0 left-0 right-0 m-auto rounded-full"></div>

                <div className="p-4 w-full">
                  <div className='mb-4 flex items-center gap-4'>
                  <button
                    className=" flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                    onClick={closeMobileMenu}
                    aria-label="Close mobile menu"
                  >
                    <X className="h-6" />
                    
                  </button>
                  <span className="text-xl font-bold">Rivo Collections</span>
                  </div>
                  <div className="mb-4 w-full">
                    <Suspense fallback={<SearchSkeleton />}>
                      <Search />
                    </Suspense>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {OutCategories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category)}
                        className="text-lg flex items-center justify-between flex-row gap-4 font-medium bg-white/10 hover:bg-white/20 py-2 rounded-full px-4 cursor-pointer"
                      >
                        <div className='flex items-center gap-2'>
                        <Image src={category.icon} width={24} height={24} alt="category icon" />
                        {category.name}
                        </div>
                        <ArrowRight color='#c7c7c7' size={16}/>
                      </button>
                    ))}
                  </div>
                 
                </div>
                <OrdersAndCheckout/>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* New Category Dialog */}
      <Transition show={!!activeCategory}>
        <Dialog onClose={() => setActiveCategory(null)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 text-white flex h-full w-full flex-col bg-black/80 p-6 text-black backdrop-blur-xl md:w-[390px]">
              <div className="w-full flex flex-col items-center justify-between h-full">
              <div class="absolute w-[150px] h-[150px] bg-blue-500/85 z-[-1] blur-[150px] top-0 bottom-0 left-0 right-0 m-auto rounded-full"></div>
                <div className="p-4 w-full">
                  <button
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                    onClick={() => setActiveCategory(null)}
                    aria-label="Close category dialog"
                  >
                    <X className="h-6" />
                  </button>

                  <button
                    onClick={handleBackToMain}
                    className="mb-4 flex items-center justify-centertext-black transition-colors text-white"
                  >
                    <ArrowLeft className="h-6 mr-2" />
                   Back to All
                  </button>

                  {/* Render content specific to the active category */}
                  {activeCategory !== 'Vinyls' && (
                    <div className="flex flex-col gap-2">
                      {FramedCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          className="text-lg flex items-center justify-between flex-row gap-4 font-medium bg-white/10 hover:bg-white/20 py-2 rounded-full px-4 cursor-pointer"
                        >
                          <div className='flex flex-row items-center gap-2'>
                          <Image src={category.icon} width={24} height={24} alt="category icon" />
                          {category.name}
                          </div>
                        <ArrowRight color='#c7c7c7' size={16}/>

                        </Link>
                        
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
