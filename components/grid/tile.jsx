'use client'
import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  twoGRID,
  insideProfuct,
  ...props
}) {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center rounded-lg',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <Image
        priority={true}
        quality={10}
          className={clsx('relative h-full w-full object-contain rounded-lg ', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
        //   onError={(event) => {
        //     console.log('Image failed to load:', event);
        //     event.target.id = "/assets/image.fallback.svg";
        //     event.target.srcset = "/assets/image.fallback.svg";
        // }}
        loader={({ src }) => src}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
        insideProfuct={insideProfuct}
        twoGRID={twoGRID}
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
