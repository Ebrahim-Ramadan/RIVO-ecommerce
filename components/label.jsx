import clsx from 'clsx';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode,
  position = 'bottom'
}) => {
  return (
    <div
      className={clsx('absolute bottom-0 left-0 flex w-full px-2 md:px-4 pb-2 md:pb-4 @container/label', {
        'lg:px-20 ': position === 'center'
      })}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-[0.8rem] md:text-sm font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-2 line-clamp-2 flex-grow pl-2 leading-tight tracking-normal">{title}</h3>
        <Price
          className="flex-none rounded-full bg-blue-600 p-2 text-white"
          amount={amount}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
};

export default Label;
