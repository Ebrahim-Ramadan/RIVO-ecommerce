import Grid from '@/components/grid';
import { GridTileImage } from '@/components/grid/tile';

import Link from 'next/link';

export default function ProductGridItems({ frames }) {
  console.log('frames', frames);
  return (
    <div className='grid grid-cols-2 gap-2 sm:gap-6 md:grid-cols-2 '>
      {frames.map((frame) => (
        <Grid.Item key={frame.id} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/frame/${frame.id}?type=${frame.type[0]}&size=${frame.sizes[0]}&color=${frame.color[0]}`}
            prefetch={true}
          >
            <GridTileImage
            categories ={frame.categories}
             twoGRID={true}
              alt={frame.name}
              label={{
                title: frame.name,
                amount: frame.price,
                currencyCode: 'EG'
              }}
              src={`https://iili.io/${frame.images[0].match(/\/([a-zA-Z0-9]+)$/)[1]}.jpg`}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </div>
  );
}
