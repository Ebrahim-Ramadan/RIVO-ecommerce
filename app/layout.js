import Navbar from '@/components/layout/navbar';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "react-hot-toast";
import TopLoadingIndicator from '@/components/layout/navbar/TopLoadingIndicator';
import { Suspense } from 'react';
import LoadingDots from '@/components/loading-dots';
import LazyLoad from '@/lib/LazyLoad';
import { Footer } from '@/components/layout/footer';
import { Analytics } from "@vercel/analytics/react"

export const revalidate = 360000;


  export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL),
    title: "RIVO Gallery",
    description: "RIVO e-commerce for your favorite posters and frames",
    openGraph: {
       images: ['https://e-commerce-myass.vercel.app/opengraph-image'],
      title: 'RIVO Gallery',
      description: 'RIVO e-commerce for your favorite posters and frames',
    },
    title: {
      default: 'RIVO Gallery',
      template: `%s - RIVO`,
    },
    keywords: [
      "RIVO",
      "entertainment",
      "friends",
      "Gallery",
      "poster", "gallery", "frames", "art prints", "custom posters", "personalized wall art", "decorative frames", "poster printing", "home decor", "modern art", "poster sale", "art framing", "frame collection", "trendy posters",
      "artwork", "limited edition prints", "vintage posters", "digital prints", "poster design", "custom framing", "wall decor", "poster bundles", "art collection", "fine art prints", "creative frames", "photo frames", "exclusive posters", "art exhibition", "framed posters", "interior design"
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
        <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
<link href="https://fonts.googleapis.com/css2?family=Sigmar+One&display=swap" rel="stylesheet"/>

        </head>
      <body className="bg-black text-black selection:bg-teal-300  dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
      <Toaster position="bottom-center" />
        <Navbar />
        <main>
          <Suspense fallback={<LoadingDots/>}>
          <TopLoadingIndicator/>
          </Suspense>
        {children}
        <LazyLoad>
     <Footer/>
     </LazyLoad>

     </main>
      </body>
      <Analytics/>
    </html>
   
  );
}
