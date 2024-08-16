import clsx from 'clsx';

const Price = ({
  amount,
  className,
  insideProfuct,
  currencyCode = 'USD',
}) => (
  <p suppressHydrationWarning={true} className={className}>
  
    <span className={`ml-1 inline text-xs ${insideProfuct && 'text-sm'}`}>{`${currencyCode} ${parseFloat(amount)}`}</span>
  </p>
);

export default Price;
