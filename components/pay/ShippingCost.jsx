'use client';
import { Shipping_costs } from '@/lib/orders';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XIcon } from 'lucide-react';
import { useState, useMemo } from 'react'
import shipping from '@/public/assets/shipping.svg'
import Image from 'next/image';

export function ShippingCost({ trigger, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCosts = useMemo(() => {
    return Shipping_costs.filter(cost => {
      const [governorate] = Object.keys(cost);
      return governorate.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`text-blue-500 w-full font-medium ${className}`}
      >
        {trigger}
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg space-y-4 border border-white/20 rounded-lg bg-black/20 p-4 text-white backdrop-blur-3xl">
            <DialogTitle className="text-xl font-bold flex flex-row items-center gap-2 justify-between">
              <span>Shipping Fees</span>
              <Image
                src={shipping}
                width={30}
                height={30}
                className='mr-2'
                alt="shipping"
              />
            </DialogTitle>
            <Description className="text-white/70 text-sm">Shipping costs vary for different regions.</Description>
            <input
              type="text"
              placeholder="Search governorate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm text-black placeholder:text-neutral-500 border-neutral-800 bg-transparent text-white placeholder:text-neutral-400"
            />
            <div className="h-60 overflow-y-auto pr-2">
              {filteredCosts.length > 0 ? (
                filteredCosts.map((cost, index) => {
                  const [governorate, fee] = Object.entries(cost)[0];
                  return (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                      <span>{governorate}</span>
                      <span>EGP {parseFloat(fee).toFixed(2)}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full text-white/50">
                  No results found
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2 rounded-full"
              >
                Got it
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}