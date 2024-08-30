'use client'
import Image from 'next/image';
import React from 'react';

import { addToCart } from '../cart/actions';
import { toast } from 'react-hot-toast';
import eventEmitter from '@/lib/eventEmitter';
import { Plus } from 'lucide-react';
import LoadingDots from '../loading-dots';
const framesData = [
  {
    "id":"726GjxFlSzV2jLMtJ1mH",
    "name": "Tree Leaves",
    "keywords": "Tree Leaves",
    "desc": "High quality artificial tree branches, looks like real plants! Natural, widely used and durable. Ideal for decorating walls, home ceilings, etc. An essential corner of home decor",
    "type": ["Leaves"],
    "price": ["60"],
    "sizes": [
      "2 meters"
    ],
    "color": ["Green"],
    "images": [
      "https://freeimage.host/i/djXvktR",
      "https://freeimage.host/i/djXv8np"
    ],
    "categories": [
      "Decoration"
    ]
  },
  {
    "id":"OwOnnRkyUjCALgDgkieM",
    "name": "wall hanging hooks",
    "keywords": "wall hanging hooks",
    "desc": "1. Wipe the dust, grease on the wall with clean soft cloth and keep it fully dry.\n2. Uncover barrier film on bottom layer. Don't touch sticking face with hand.\n3. Position the position of sticking film, paste the patch affixed to the wall horizontally.\n4. Flatten with force to the patch from inside to outside, press each region tightly to evacuate the air in the sticking patch.\n5. Then install hanging rack and screw nut.\n6. Check that the installation is against the wall.\n7.After installation hanging any rack or other stuff after 1 hour.let it dry at 1 hour.\n\nNotice:\n\n1. Please pay attention that there are limits on painted walls, otherwise it might damaged your paint. Avoid using on uneven surface, the more smooth the wall, the better the results.\n2.This screw can hold up to 6kg. But we'd like to suggest no more than 6kg for holding a long time.\n3. Please clean the adhesive surface with water if it has dust covered before installation the hook.\n4. Do not use it at temperatures above 80 degrees.",
    "type": ["Hook"],
    "price": ["25"],
    "sizes": [
      "4x4 cm"
    ],
    "color": ["Transparent"],
    "images": [
      "https://freeimage.host/i/djXSCX4",
      "https://freeimage.host/i/djXSnLl"
    ],
    "categories": [
      "Decoration"
    ]
  },
  {
    "id":"okyhnzZvPO4v4UIHOqxG",
    "name": "Small vinyl",
    "keywords": "Small vinyl",
    "desc": "Small vinyl disc for decoration",
    "type": ["Vinyl"],
    "price": ["75"],
    "sizes": [
      "18 cm"
    ],
    "color": ["Black"],
    "images": [
      "https://freeimage.host/i/djXUzZv"
    ],
    "categories": [
      "Decoration"
    ]
  },
  {
    "id":"JaDJO9CeY4rovchCyvjm",
    "name": "Double face tape",
    "keywords": "Double face tape",
    "desc": "Double face tape is used for many things \nThe most important of them is to stick posters and frames on the wall without any damage to the wall and products",
    "type": ["Tape"],
    "price": ["50"],
    "sizes": [
      "3 meters"
    ],
    "color": ["Transparent"],
    "images": [
      "https://freeimage.host/i/dj8sSlS",
      "https://freeimage.host/i/dj8s4Re"
    ],
    "categories": [
      "Decoration"
    ]
  }
];

export const Additionals = () => {
  const buttonClasses = 'relative flex w-3/4 items-center justify-center rounded-full bg-blue-600 p-2 text-white';
  const [loadingStates, setLoadingStates] = React.useState({}); // Store loading states for each item

  const handleAddToCart = (item, index) => {
    setLoadingStates((prevState) => ({ ...prevState, [index]: true })); // Set loading for this specific item

    return new Promise((resolve) => {
      const price = item.price[0]; // Use item's price directly, or calculate if needed
      const selectedSize = item.sizes[0]; // For example, you can adjust this based on selection
      const selectedColor = item.color[0]; // Similarly, adjust color

      addToCart(item, selectedSize, selectedColor, item.type[0], Math.ceil(price)); // Modify as needed
      setTimeout(() => {
        toast.success(`${item.name} Added to Your Cart`);
        eventEmitter.emit('openCart'); // Emit event to open cart
        setLoadingStates((prevState) => ({ ...prevState, [index]: false })); // Stop loading for this specific item
        resolve();
      }, 1000); // Simulate a delay
    });
  };

  return (
    <div className="py-12">
      <h2 className="text-lg text-neutral-300 font-bold mb-4">Better Together</h2>
      <div className="w-full overflow-x-auto">
        <div className='flex gap-4'>
          {framesData.map((item, index) => (
            
            <a 
            href={`/frame/${item.id}?type=${item.type[0]}&color=${item.color[0]}&size=${item.sizes[0]}`}
            
            key={index} className="rounded-lg relative aspect-square h-[55vh] max-h-[80vh] w-3/4 max-w-[475px] flex-none md:w-[150px]">
              <Image 
                width={1000}
                height={1000}
                src={`https://iili.io/${item.images[0].match(/\/([a-zA-Z0-9]+)$/)[1]}.jpg`}
                alt={item.name} 
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <div className='w-full flex flex-row items-center gap-2 justify-between'>
                <h3 className="text-xl font-semibold truncate max-w-[70%]">{item.name}</h3>
                <p className="text-neutral-200 text-xs">{item.color}</p>
              </div>

              <div className='flex flex-row items-center justify-between'>
                <p className="text-neutral-200 text-sm font-semibold">{item.sizes.join(', ')}</p>
                <p className="bg-blue-500 font-medium text-white text-xs px-2 py-1 rounded-full">EGP {item.price[0]}</p>
              </div>
              
              <div className='mt-4 w-full flex justify-center'> 
                <button
                  onClick={() => handleAddToCart(item, index)} // Pass index to identify which item is being clicked
                  className={buttonClasses}
                >
                  <div className="absolute left-0 ml-2 md:hidden">
                    {loadingStates[index] ? (
                      <LoadingDots />
                    ) : (
                      <Plus className="h-5" />
                    )}
                  </div>
                  <span>Add To Cart</span>
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Additionals;
