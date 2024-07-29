import React from 'react'
import { SearchX } from 'lucide-react'
export const NoResults = ({text, shopNow}) => {
  return (
    <div className='flex items-center justify-center flex-col gap-4 py-16 text-center'>
        <SearchX/>

{shopNow &&
<a href='/' className='text-center font-bold md:text-xl  px-4 py-2 bg-white/20 hover:bg-white/10 transition duration-200 backdrop-blur-[.5px] rounded-full '>Shop Now</a>
}
    </div>
  )
}
