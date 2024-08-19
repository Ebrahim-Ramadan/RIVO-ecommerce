import Navbar from '@/components/layout/navbar';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "react-hot-toast";
import TopLoadingIndicator from '@/components/layout/navbar/TopLoadingIndicator';
import { Suspense } from 'react';
import LoadingDots from '@/components/loading-dots';
import { FixedBottoms } from '@/components/layout/FixedBottoms';

export const revalidate = 360000;


  export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL),
    title: "RIVO",
    description: "RIVO e-commerce for your favorite posters and frames",
    openGraph: {
       images: ['https://e-commerce-myass.vercel.app/opengraph-image'],
      title: 'RIVO',
      description: 'RIVO e-commerce for your favorite posters and frames',
    },
    title: {
      default: 'RIVO',
      template: `%s - RIVO`,
    },
    keywords: [
      "RIVO",
      "quiz online",
      "entertainment",
      "play",
      "friends",
    ],
    description: 'RIVO',
    creator: "Ebrahim Ramadan",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: 'https://e-commerce-myass.vercel.app',
      title: 'RIVO',
      description: ' RIVO',
      siteName: 'RIVO',
      images: [
        {
          url: 'https://e-commerce-myass.vercel.app/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'RIVO',
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: 'RIVO',
      description: 'RIVO',
      images: 'https://e-commerce-myass.vercel.app/opengraph-image',
      creator: "@scoopsahoykid",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  
  };
export default async function RootLayout({ children }) {

  return (
       <html lang="en" className={GeistSans.variable}>
      <body className="bg-black text-black selection:bg-teal-300  dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
      <Toaster position="top-center" />
    <FixedBottoms/>
        <Navbar />
        <main>
          <Suspense fallback={<LoadingDots/>}>
          <TopLoadingIndicator/>
          </Suspense>
        {children}</main>
      </body>
    </html>
   
  );
}
