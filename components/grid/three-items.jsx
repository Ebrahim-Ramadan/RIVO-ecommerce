import { GridTileImage } from '@/components/grid/tile';
import Link from 'next/link';


function ThreeItemGridItem({
  item,
  size,
  priority
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/frame/${item?.id}?type=${item?.type[0]}&size=${item?.sizes[0]}&color=${item?.color[0]}`}
      >
        <GridTileImage
       
          src={item && item['images'][0]}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item['name']}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item['name'] ,
            amount: item.price,
            currencyCode: 'EGP'
          }}
        />
      </Link>
    </div>
  );
}

export  function ThreeItemGrid({data}) {
  
  return (
 <div className='w-full gap-2 flex flex-col mt-2'>
  
    <div className="flex items-center justify-between">
  <div className="h-0.5 bg-blue-400 w-1/5"></div>
  <h2 className="mx-2 text-xl font-bold">FEATURING</h2>
  <div className="h-0.5 bg-blue-400 w-1/5"></div>
</div>
    <div className='flex font-bold flex-row items-center justify-end w-full px-2'>
<p className='rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm'>
  NEW
</p>
    </div>

<section className=" grid gap-4  pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
  <ThreeItemGridItem size="full" item={data[0]} priority={true} />
  <ThreeItemGridItem size="half" item={data[1]} priority={true} />
  <ThreeItemGridItem size="half" item={data[2]} />
</section>
 </div>
  );
}
