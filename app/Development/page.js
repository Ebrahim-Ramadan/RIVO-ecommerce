
export default async function Page() {
    return (
        <div className="bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Dev.</h1>
      <p className="mb-4 font-medium text-lg">
        This platform is built with Next.js, by <a className="text-blue-500" href='https://ebrahim-ramadan.vercel.app/' target='_blank'>Ebrahim Ramadan</a>
      </p>
      <p className="mb-4">Support for real-world commerce features including:</p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Out of stocks</li>
        <li>Order history</li>
        <li>Order status</li>
        <li>Cross variant / option availability (aka Amazon style)</li>
        <li>Hidden products</li>
        <li>Dynamically driven content and features via Shopify (ie. collections, menus, pages, etc.)</li>
        <li>Seamless and secure checkout via Shopify Checkout</li>
        <li>And more!</li>
      </ul>
      <p className="mb-4">This template also allows us to highlight newer Next.js features including:</p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Next.js App Router</li>
        <li>Optimized for SEO using Next.js's Metadata</li>
        <li>React Server Components (RSCs) and Suspense</li>
        <li>Server Actions for mutations</li>
        <li>Edge runtime</li>
        <li>New Next.js 14 fetching and caching paradigms</li>
        <li>Dynamic OG images</li>
        <li>Styling with Tailwind CSS</li>
        <li>Automatic light/dark mode based on system settings</li>
        <li>And more!</li>
      </ul>
      <p className="text-sm text-gray-400">This document was last updated on August 18, 2024.</p>
    </div>
    );
}