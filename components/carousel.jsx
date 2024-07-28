import { get3Frames } from "@/lib/utils";
import { GridTileImage } from "./grid/tile";

export async function Carousel() {
  const data = await get3Frames()

  return (
    <div className=" w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {data?.map((frame) => (
          <li
            key={`${frame['id']}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <a href={`/frame/${frame['id']}`} className="relative h-full w-full">
              <GridTileImage
                alt={frame['title']}
                label={{
                  title: frame['title'],
                  amount: '46',
                  currencyCode: 'egp'
                }}
                src={frame['thumbnailUrl']}
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
