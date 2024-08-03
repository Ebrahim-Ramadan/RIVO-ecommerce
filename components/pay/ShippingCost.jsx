'use client';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

export const ShippingDetails = [
    {'goverment':'Aswan', 'cost':0.5},
    {'goverment':'Cairo', 'cost':0.5},
    {'goverment':'Alexandria', 'cost':0.5},
    {'goverment':'Giza', 'cost':0.5},
]

export function ShippingCost({trigger, className}) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`text-blue-500  w-full  ${className}`}
      >
        {trigger}
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
          <DialogPanel className="max-w-lg space-y-4 border border-white/20 rounded-lg bg-black p-2 text-white">
            <DialogTitle className="text-xl font-bold">Shipping Fees</DialogTitle>
            <Description className="text-white/70 text-sm">Shipping costs vary for different governorates</Description>
            <div className="max-h-60 overflow-y-auto pr-2">
                
              {ShippingDetails.map((detail, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                  <span>{detail.goverment}</span>
                  <span>EGP {detail.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
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