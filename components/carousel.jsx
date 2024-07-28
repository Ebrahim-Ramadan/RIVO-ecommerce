
import { GridTileImage } from "./grid/tile";


export  function Carousel({data}) {
  
  return (
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
  );
}
