// import Cart from '@/components/cart';
import OpenCart from '@/components/cart/open-cart';
import LoadingDots from '@/components/loading-dots';
import logo from '@/public/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import {  Suspense } from 'react';
import { DMBanner } from './DMBanner';
// import MobileMenu from './mobile-menu';
// import OverlaySearch from './OverlaySearch';
import Search, { SearchSkeleton } from './search';
import Eclipse from '@/public/assets/Eclipse.svg';
import dynamic from 'next/dynamic';
const LazyOverlaySearch = dynamic(() => import('./OverlaySearch'), {
  loading: () => <SearchSkeleton />,
  ssr: false
});
const MobileMenu = dynamic(() => import('./mobile-menu'), {
  loading: () => <SearchSkeleton />,
  ssr: false
});
const Cart = dynamic(() => import('@/components/cart'), {
  loading: () => <SearchSkeleton />,
  ssr: false
});
export default  function Navbar() {

  return (
    

<div className='flex flex-col'>

<DMBanner/>

    <nav className="relative flex items-center justify-between p-4 md:px-16">
      <div className="block flex-none mr-4">
        <Suspense fallback={ <Image src={Eclipse} width={24} height={24} alt="menu" />}>
          <MobileMenu />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            {/* <LogoSquare /> */}
            <Image
            className='w-20'
            src={logo}
            alt="logo"
            width={500}
            height={500}
            />
           
          </Link>
         
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
       <Suspense fallback={<SearchSkeleton />}>
       <LazyOverlaySearch/>
       </Suspense>

          <Suspense fallback={<OpenCart />}>
            <Cart />
          </Suspense>
        </div>
      </div>
    </nav>
</div>
  );
}