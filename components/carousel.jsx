
import { GridTileImage } from "./grid/tile";


export  function Carousel({data}) {
  
  return (
  <div className="flex flex-col w-full gap-4">
   < div className="py-4 flex flex-row justify-center w-full  text-center" >
      <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent w-full  h-[2px] opacity-80"></div>
    </div >
   <p className='font-bold text-xl md:text-3xl px-4 '>Best Sellers</p>
      <div className=" w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {data.slice(0, 10).map((frame) => (
          <li
            key={`${frame['id']}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <a href={`/frame/${frame['id']}`} className="relative h-full w-full">
              <GridTileImage
                alt={frame['name']}
                label={{
                  title: frame['name'],
                  amount: frame.price,
                  currencyCode: 'EGP',
                }}
                src={frame['images'][0]}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
}
