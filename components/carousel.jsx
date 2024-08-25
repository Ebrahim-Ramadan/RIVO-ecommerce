
import eventEmitter from "@/lib/eventEmitter";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { GridTileImage } from "./grid/tile";


export  function Carousel({data}) {

  
  console.log('data', data);
  return (
  <div className="flex flex-col w-full gap-4 scroll-smooth scroll-mt-4"  id="BEST-SELLERS">
   
   <div className="group flex items-center justify-between">

  <div className="flex flex-row items-center gap-2">
  <a className="mx-2 text-xl font-bold scroll-smooth" href="#BEST-SELLERS">BEST SELLERS</a>
 
  </div>
  <Link href='/categories/best-sellers' className="group-hover:text-neutral-200   text-neutral-400 flex flex-row items-center gap-2">Browse All <ArrowRightIcon size='16'/></Link>
</div>
<p className='font-medium rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm self-end w-fit'>
  RESTOCKED
</p>
    
      <div className=" w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex gap-2">
        {data.slice(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 28) + 1).map((frame) => (
          <li
            key={`${frame['id']}`}
            className="relative aspect-square h-[38vh] max-h-[275px] w-3/4 max-w-[475px] flex-none md:w-1/3 "
          >
            <Link href={`/frame/${frame['id']}?type=${frame.type[0]}&size=${frame.sizes[0]}&color=${frame.color[0]}`} className="relative h-full w-full">
              <GridTileImage
                alt={frame['name']}
                label={{
                  title: frame['name'],
                  amount: frame.price[0],
                  currencyCode: 'EGP',
                }}
                src={`https://iili.io/${frame && frame['images'][0].match(/\/([a-zA-Z0-9]+)$/)[1]}.jpg`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
}
