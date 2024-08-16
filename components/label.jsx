import clsx from 'clsx';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode,
  position = 'bottom',
  twoGRID,
  insideProfuct
}) => {
  return (
    <div
      className={clsx('absolute left-0 flex bottom-0 w-full px-1 md:px-4 pb-1 md:pb-2 @container/label', {
        'lg:px-20 ': position === 'center',
        'bottom-4': !twoGRID
      })}
    >
      <div className="flex items-center rounded-3xl  p-1 text-[0.8rem] md:text-sm font-semibold text-black backdrop-blur-md dark:bg-black/70 dark:text-white">
        <h3 className={`${twoGRID && 'text-xs'} line-clamp-2 flex-grow pl-2 leading-tight tracking-normal`}>{title}</h3>
        <Price
          className="flex-none rounded-3xl bg-blue-600 px-1 ml-2 text-white"
          amount={amount}
          insideProfuct={insideProfuct}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
};

export default Label;
