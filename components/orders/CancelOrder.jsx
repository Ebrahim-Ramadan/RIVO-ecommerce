'use client';
import { copyToClipboard } from '@/lib/utils';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { toast } from 'react-hot-toast';


export function CancelOrder({trigger, className}) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`bg-blue-500  border-2 border-white/20 text-white rounded-lg px-2 py-1 mb-4 font-bold text-sm ${className}`}
      >
        {trigger}
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-2 w-full">
          <DialogPanel className="max-w-lg space-y-4 border border-white/20 rounded-lg bg-black p-2 text-white">
            <DialogTitle className="text-xl font-bold">Cancel Order</DialogTitle>
            <Description className="text-white/70 text-sm">Our Strategy to Cancel Orders</Description>
            <div className="max-h-60 overflow-y-auto pr-2">
                
              call us on <span onClick={() =>{
                 copyToClipboard('+20 212 345 6789')
                 toast.success('Copied to clipboard')
              }} className="cursor-pointer text-blue-600 hover:underline px-2"
              >+20 212 345 6789</span> to cancel your order with the order ID (given in the call), you can find each here in this page.
            </div>
            thank you for using our service.
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-full"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}