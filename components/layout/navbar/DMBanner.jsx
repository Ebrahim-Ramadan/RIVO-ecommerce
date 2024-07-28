'use client'
import { X } from 'lucide-react'
import {useState} from 'react'

export const DMBanner = () => {
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const handleDismiss = () => {
      setIsBannerVisible(false);
    };
  return (
    <>
    {isBannerVisible &&
    <div id="sticky-banner" tabindex="-1" class="sticky top-0 start-0 z-50 flex justify-between w-full p-2 md:p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-200 dark:border-gray-600">
    
    <div class="flex items-center mx-auto">
        <p class="flex items-center text-xs font-medium text-black ">
            <span class="inline-flex p-1 me-3 bg-gray-200 rounded-full dark:bg-gray-600 w-6 h-6 items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 18 19">
                    <path d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z"/>
                </svg>
                <span class="sr-only">Light bulb</span>
            </span>
            <span href='https://www.instagram.com/rivoo_gallery?igsh=MThjOXNrY2pnemx3bw==' className='cursor-pointer underline'>DM us to customize Your posters, frames and polaroid however you like.
</span>
        </p>
    </div>
    <div class="flex items-center">
        <button onClick={handleDismiss} data-dismiss-target="#sticky-banner" type="button" class="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 rounded-lg text-sm p-1.5 dark:hover:bg-gray-400">
          <X color='black'/>
            <span class="sr-only">Close banner</span>
        </button>
    </div>
</div>
}
</>
   
  )
}
