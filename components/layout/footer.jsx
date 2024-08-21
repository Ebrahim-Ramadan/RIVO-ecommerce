import Link from 'next/link';

import logo from '@/public/logo.png';
import footerPay from '@/public/assets/footer-payments.png';
import { Suspense } from 'react';
import FooterMenu from './footer-menu';
import Image from 'next/image';
import LoadingDots from '../loading-dots';
import { ShippingCost } from '../pay/ShippingCost';

const { COMPANY_NAME, SITE_NAME } = process.env;

export  function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2024 + (currentYear > 2024 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  const menu = [
    {
      title: 'Home',
      path: '/'
    },
    {
      title: 'Orders',
      path: '/orders'
    },
    {
      title: 'Payment',
      path: '/pay'
    },
    {
      title: 'Privacy and Policy',
      path: '/privacy-and-policy'
    },
    {
      title: 'Development',
      path: '/Development'
    },
  ];
  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-4 py-6 text-sm md:flex-row-reverse md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
      <div className=" text-slate-400 py-4 text-center leading-tight w-full">
      <p >For any issues, please contact </p>
      <Link href="https://mail.google.com/mail/u/0/?fs=1&to=Rivogalllery@gmail.com&tf=cm" className="text-blue-500" >Rivogalllery@gmail.com</Link>
      </div>
      <div className="flex flex-col items-center justify-center">
      <Image
      alt='footer-pay'
      className='w-full'
      width={400}
      height={400}
      src={footerPay}
      />
      <p>
        Gauranteed Safe & Secure Checkout
      </p>
    <ShippingCost trigger='Shipping Fees' className='my-2 self-center bg-blue-500 text-white py-2 px-4 rounded-full'/>

      </div>
      
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            {/* <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span> */}
             <Image
            src={logo}
            alt="logo"
            className='w-16'
            width={500}
            height={500}
            />
          </Link>
        </div>
        <Suspense
          fallback={
            <LoadingDots/>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
        
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy;{copyrightDate} <a target='_blank' href='https://www.instagram.com/rivoo_gallery?igsh=MThjOXNrY2pnemx3bw=='>{copyrightName}</a>
           . All rights reserved.
          </p>
          <p className="md:ml-auto">
            <a href="https://ebrahim-ramadan.vercel.app" className="text-neutral-300 font-medium text-xs">
              Crafted by Ebrahim Ramadan ⪩⪨︎
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer


const footerAccepts = ()=>{
  const accepts = [
    ''
  ]
}