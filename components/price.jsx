import clsx from 'clsx';

const Price = ({
  amount,
  className,
  currencyCode = 'USD',
}) => (
  <p suppressHydrationWarning={true} className={className}>
  
    <span className={clsx('ml-1 inline text-xs', )}>{`${currencyCode} ${parseFloat(amount)}`}</span>
  </p>
);

export default Price;
