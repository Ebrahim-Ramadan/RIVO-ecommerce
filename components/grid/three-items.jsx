import { GridTileImage } from '@/components/grid/tile';


function ThreeItemGridItem({
  item,
  size,
  priority
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <a
        className="relative block aspect-square h-full w-full"
        href={`/frame/${item?.id}`}
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
 <div className='w-full gap-4 flex flex-col mt-2'>
  < div className="py-4 flex flex-row justify-center w-full  text-center" >
      <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent w-full  h-[2px] opacity-80"></div>
    </div >
   <p className='font-bold text-xl md:text-3xl px-4 '>Featuring</p>

<section className=" grid gap-4  pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
  <ThreeItemGridItem size="full" item={data[0]} priority={true} />
  <ThreeItemGridItem size="half" item={data[1]} priority={true} />
  <ThreeItemGridItem size="half" item={data[2]} />
</section>
 </div>
  );
}
