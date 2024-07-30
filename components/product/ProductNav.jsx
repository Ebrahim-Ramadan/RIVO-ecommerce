'use client';
import { copyToClipboard } from '@/lib/utils';
import { ArrowLeft, Share } from 'lucide-react'
import { toast } from 'react-hot-toast';


export const ProductNav = ({FrameId}) => {
  return (
    <div className='w-full flex flex-row justify-between py-4 items-center [&>*]:transition [&>*]:duration-200 '>
            <a href='/' className='rounded-full p-2 bg-blue-600 text-white  hover:bg-blue-700'>
            <ArrowLeft size='16'/>

            </a>
            <button href='/' className='hover:bg-blue-700 rounded-full p-2 bg-blue-600 text-white' onClick={()=>{
              copyToClipboard(`${process.env.NEXT_PUBLIC_API_URL}/frame/${FrameId}`)
              toast.success('Link Copied to clipboard')
            }}>
            <Share size='16'/>

            </button>
          </div>
  )
}
