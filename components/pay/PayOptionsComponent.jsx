'use client';

import { useState } from 'react';
import PaymentButton from './PaymentButton';

const paymentOptions = [
  {
    logo: '/assets/mobile.svg',
    id: 4619234,
    name: 'Mobile Wallet',
  },
  {
    logo: '/assets/visa.svg',
    id: 4619069,
    name: 'Credit Card',
  },
];

export const PayOptionsComponent = ({amount}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    console.log(`${option} is selected`);
  };

  return (
    <div
      className="w-full md:w-[400px] p-2 aspect-square rounded-lg shadow flex flex-col items-center justify-center gap-2"
    >
      <p className="capitalize font-semibold self-start">Choose Payment method</p>
      <p className="text-xs self-start text-wrap text-slate-400 pb-1 capitalize">
      secured and provided by Paymob
      </p>
      {paymentOptions.map(({ id, logo, name }) => (
        <label
          key={id}
          className="inline-flex justify-between w-full items-center rounded-lg p-2 border border-transparent hover:bg-white/10 transition-all cursor-pointer relative"
        >
          <div className="inline-flex items-center justify-center gap-2 relative z-10">
            <img src={logo} alt={name} className="w-8 h-8" width={32} height={32} />
            <p
              className="font-medium text-sm"
            >
              {name}
            </p>
          </div>
          <input
            className="checked:text-indigo-500 checked:ring-0 checked:ring-current focus:ring-0 focus:ring-current"
            value={id}
            name="payment"
            type="radio"
            checked={selectedOption === id}
            onChange={() => handleCheckboxChange(id)}
          />
        </label>
      ))}
      <PaymentButton selectedOption={selectedOption} amountInt={amount}/>
    </div>
  );
};

export default PayOptionsComponent;
