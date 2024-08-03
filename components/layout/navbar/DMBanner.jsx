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
    <div id="sticky-banner" tabIndex="-1" className="sticky top-0 start-0 z-50 flex justify-between w-full py-4 px-2 md:px-4 bg-gray-50 dark:bg-black/80 dark:border-gray-600">
    
    <div className="flex items-center mx-auto">
        <p className="flex items-center text-xs md:text-sm font-medium text-white ">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35" height="35" viewBox="0 0 48 48">
<radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fd5"></stop><stop offset=".328" stopColor="#ff543f"></stop><stop offset=".348" stopColor="#fc5245"></stop><stop offset=".504" stopColor="#e64771"></stop><stop offset=".643" stopColor="#d53e91"></stop><stop offset=".761" stopColor="#cc39a4"></stop><stop offset=".841" stopColor="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4168c9"></stop><stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
</svg>
            <a href='https://www.instagram.com/rivoo_gallery?igsh=MThjOXNrY2pnemx3bw==' className='text-center px-2 cursor-pointer underline' target="_blank">DM us to customize Your posters, frames and polaroid however you like.
</a>
        </p>
    </div>
    <div className="flex items-center">
    <a className='hidden md:block bg-white/20 px-4 py-2 rounded-full hover:underline' target="_blank" href='https://www.instagram.com/rivoo_gallery?igsh=MThjOXNrY2pnemx3bw=='>
      contact us
    </a>
        <button onClick={handleDismiss} data-dismiss-target="#sticky-banner" type="button" className="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 rounded-lg text-sm p-1.5 dark:hover:bg-white/20">
          <X color='white'/>
            <span className="sr-only">Close banner</span>
        </button>
    </div>
</div>
}
</>
   
  )
}


export const MarqueeBanner = () => {
return( <>
<div className="overflow-x-hidden bg-gradient-to-b from-transparent to-blue-500/20 py-4">
    <div className="marquee-rtl whitespace-nowrap [&>*]:text-lg [&>*]:mx-4 font-bold">
	    <span >
        
      🚚 1-2 Delivery Days</span> 
	    <span >💳 Online Payment Available</span>
	    <span >💵 Cash On Delivery</span>
	    <span >💸 30% Off</span>
	    <span >
      All Over Egypt 
      </span>
    </div>
    
</div>
< div className=" flex flex-row justify-center w-full  text-center mb-6" >
      <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent w-full  h-[2px] opacity-80"></div>
    </div >
   

    </>
)

}