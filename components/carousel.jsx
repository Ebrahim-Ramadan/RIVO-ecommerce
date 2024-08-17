
import Link from "next/link";
import { GridTileImage } from "./grid/tile";


export  function Carousel({data}) {
  console.log('data', data);
  return (
  <div className="flex flex-col w-full gap-4">
   
   <div class="flex items-center justify-between">
  <div class="h-0.5 bg-blue-400 w-1/5"></div>
  <h2 class="mx-2 text-xl font-bold">BEST SELLERS</h2>
  <div class="h-0.5 bg-blue-400 w-1/5"></div>
</div>
    <div className='flex font-bold flex-row items-center justify-end w-full px-2'>
<p className='rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm'>
  RESTOCKED
</p>
    </div>
      <div className=" w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-2">
        {data.slice(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 18) + 1).map((frame) => (
          <li
            key={`${frame['id']}`}
            className="relative aspect-square h-[38vh] max-h-[275px] w-3/4 max-w-[475px] flex-none md:w-1/3 "
          >
            <Link href={`/frame/${frame['id']}?type=${frame.type[0]}&size=${frame.sizes[0]}&color=${frame.color&&frame.color[0]}`} className="relative h-full w-full">
              <GridTileImage
                alt={frame['name']}
                label={{
                  title: frame['name'],
                  amount: frame.price[0],
                  currencyCode: 'EGP',
                }}
                src={frame['images'][0]}
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
