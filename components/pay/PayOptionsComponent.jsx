'use client';

import { useState } from 'react';
import PaymentButton from './PaymentButton';

const paymentOptions = [
  {
    logo: '/assets/mobile.svg',
    id: '4619234',
    name: 'Mobile Wallet',
  },
  {
    logo: '/assets/visa.svg',
    id: '4619069',
    name: 'Credit Card',
  },
];

export const PayOptionsComponent = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    console.log(`${option} is selected`);
  };

  return (
    <div
      className="w-full md:w-[400px] p-2 aspect-square rounded-lg shadow flex flex-col items-center justify-center gap-2"
    >
      <p className="capitalize font-semibold self-start">Payment method</p>
      <p className="text-[10px] self-start text-wrap text-gray-500 pb-1 capitalize">
        Payment method is secure and safe
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
      <PaymentButton selectedOption={selectedOption}/>
    </div>
  );
};

export default PayOptionsComponent;
