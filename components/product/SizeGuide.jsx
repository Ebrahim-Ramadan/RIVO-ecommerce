'use client'

import properSizeGuide from '@/public/assets/posters-set-size-guide.jpg'
import remaingingsizeguide from '@/public/assets/remainging-size-guide.jpg'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import Image from 'next/image';
export const SizeGuide = ({type}) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <>
        <div className='w-full flex justify-end'>
        <button
          onClick={() => setIsOpen(true)}
          className={`text-blue-500 underline text-sm font-medium py-2`}
        >
        Size Guide
        </button>
        </div>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg space-y-4 border border-white/20 rounded-lg bg-black/80 backdrop-blur-2xl p-2 text-white">
              <DialogTitle className="px-2 text-xl font-bold flex flex-row items-center gap-2 justify-between">
                <span>Size Guide</span>
               
              </DialogTitle>
              {/* <Description className="text-white/70 text-sm">Shipping costs vary for different governorates</Description> */}
             <Image
             src={type =='posters set' ? properSizeGuide : remaingingsizeguide}
             alt="size guide"
              width={1000}
              height={1000}
className='rounded-lg bg-neutral-600'
             />
            </DialogPanel>
          </div>
        </Dialog>
      </>
    );
  }
  export default SizeGuide;