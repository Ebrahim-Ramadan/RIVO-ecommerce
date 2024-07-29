import Navbar from '@/components/layout/navbar';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';



  export const metadata = {
    metadataBase: new URL('https://localhost:3000'),
    title: "RIVO",
    description: "tell us how swiftie you are",
    openGraph: {
       images: ['https://lastfm.freetls.fastly.net/i/u/770x0/279c8c2263d174a662c6c29b89e93573.jpg#279c8c2263d174a662c6c29b89e93573'],
      title: 'RIVO',
      description: 'tell us how swiftie you are',
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
    creator: "Sharmo, Eldisha",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: 'https://taylor-swift-quiz.vercel.app/',
      title: 'RIVO',
      description: ' RIVO',
      siteName: 'RIVO',
      images: [
        {
          url: 'https://taylor-swift-quiz.vercel.app/og',
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
      images: 'https://taylor-swift-quiz.vercel.app/og',
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
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
   
  );
}
