import Grid from '@/components/grid';
import { GridTileImage } from '@/components/grid/tile';

import Link from 'next/link';

export default function ProductGridItems({ frames }) {
  return (
    <>
      {frames.map((frame) => (
        <Grid.Item key={frame.id} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/frame/${frame.id}`}
            prefetch={true}
          >
            <GridTileImage
              alt={frame.name}
              label={{
                title: frame.name,
                amount: frame.price,
                currencyCode: 'EGP'
              }}
              src={frame.images[0]}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}