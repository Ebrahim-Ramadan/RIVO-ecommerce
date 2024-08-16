'use client';
import { copyToClipboard } from '@/lib/utils';
import { ArrowLeft, Share } from 'lucide-react'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';


export const ProductNav = () => {
  const [CurrentURL, setCurrentURL] = useState('')
  useEffect(() => {
    const currentUrl = window.location.href;
    setCurrentURL(currentUrl)
  }, []);
  return (
    <div className='w-full flex flex-row justify-between py-4 items-center [&>*]:transition [&>*]:duration-200 '>
            <Link href='/' className='rounded-full p-2 bg-blue-600 text-white  hover:bg-blue-700'>
            <ArrowLeft size='16'/>

            </Link>
            <button href='/' className='hover:bg-blue-700 rounded-full p-2 bg-blue-600 text-white' onClick={()=>{
              copyToClipboard(CurrentURL)
              toast.success('Link Copied to clipboard')
            }}>
            <Share size='16'/>

            </button>
          </div>
  )
}
