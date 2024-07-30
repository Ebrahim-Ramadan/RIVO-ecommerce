import { GridTileImage } from '@/components/grid/tile';


function ThreeItemGridItem({
  item,
  size,
  priority
}) {
  console.log('item', item);
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <a
        className="relative block aspect-square h-full w-full"
        href={`/frame/${item?.id}?type=${item?.types[0]}&size=${item?.sizes[0]}`}
        prefetch='true'
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
      </a>
    </div>
  );
}

export  function ThreeItemGrid({data}) {
  
  return (
 <div className='w-full gap-2 flex flex-col mt-2'>
  < div className="py-4 flex flex-row justify-center w-full  text-center" >
      <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent w-full  h-[2px] opacity-80"></div>
    </div >
    <div class="flex items-center justify-between">
  <div class="h-0.5 bg-blue-400 w-1/5"></div>
  <h2 class="mx-2 text-xl font-bold">FEATURING</h2>
  <div class="h-0.5 bg-blue-400 w-1/5"></div>
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
