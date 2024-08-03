import React from 'react'

export const NoOrders = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-4 h-screen'>
      You have not placed any orders yet.
      <a href='/' className='text-center font-bold md:text-xl w-full px-4 py-2 bg-white/20 hover:bg-white/10 transition duration-200 backdrop-blur-[.5px] rounded-full '>Back to Shop</a>

    </div>
  )
}
