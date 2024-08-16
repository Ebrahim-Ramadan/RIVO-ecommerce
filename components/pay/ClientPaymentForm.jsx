'use client';

import { useState, useEffect, useCallback } from 'react';
import { Select } from '@headlessui/react';
import Image from 'next/image';
import PayOptionsComponent from './PayOptionsComponent';
import { saveAddressToLocalStorage, Shipping_costs } from '@/lib/orders';
import { ShippingCost } from './ShippingCost';
import location from '@/public/assets/location.svg';

const initialFormState = {
  email: '',
  fullname: '',
  phoneNumber: '',
  governorate: '',
  city: '',
  address: '',
  specialMessage: ''
};



export const ClientPaymentForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loadedFromStorage, setloadedFromStorage] = useState(false);

  useEffect(() => {
    const storedAddress = saveAddressToLocalStorage(null, false, true);
    if (storedAddress) {
      setFormData(prevData => ({ ...prevData, ...storedAddress }));
      setloadedFromStorage(true)
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    localStorage.setItem('userAddress', JSON.stringify(formData));
    // Add your form submission logic here (e.g., send data to an API)
  }, [formData]);

  useEffect(() => {
    const isValid = Object.entries(formData).every(([key, value]) => {
      if (key === 'specialMessage') return true;
      if (key === 'phoneNumber') return value.length === 11;
      return value.trim() !== '';
    });
    setIsFormValid(isValid);
  }, [formData]);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 py-8 rounded-lg shadow-md w-full md:w-[400px]">
        <div className='flex font-bold items-center self-start gap-2 flex-row'>
          <p className='w-6 h-6 p-2 flex flex-row items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm'>
            1
          </p>
          <label className='text-xl'>Fill In Your Details</label>
          <label className='text-xs self-end'>{loadedFromStorage ? 'Loaded From Last Time' : ''}</label>
        </div>

        {['email', 'fullname', 'phoneNumber', 'city', 'address'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium styled-text">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              className="mt-2 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-600 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            />
            {field === 'phoneNumber' && (
              <p className='text-xs text-end px-2 py-1 text-neutral-400'>Must be 11 digits (Ex: 01102191344)</p>
            )}
          </div>
        ))}

        <div>
          <div className='w-full flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center gap-2'>
              <label htmlFor="governorate" className="block text-sm font-medium styled-text">Governorate</label>
              <div className='h-6 w-6 flex items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm'>
                <ShippingCost trigger='?' className='self-center text-white py-2'/>
              </div>
            </div>
            <div className='text-xs flex text-white/40 font-medium items-center gap-1 flex-row justify-end'>
              <Image src={location} width={24} height={24} alt="location" />
              Egypt
            </div>
          </div>
          <Select
            className='mt-2 w-full rounded-lg border border-neutral-600 px-4 py-2 text-sm bg-black'
            id="governorate"
            name="governorate"
            value={formData.governorate}
            onChange={handleChange}
            required
          >
            <option value="">Select Governorate</option>
            {Shipping_costs.map((costObj, index) => {
              const governorate = Object.keys(costObj)[0];
              return (
                <option key={index} value={governorate}>
                  {governorate}
                </option>
              );
            })}
          </Select>
        </div>

        <div>
          <label htmlFor="specialMessage" className="block text-sm font-medium">Special Message (Optional)</label>
          <textarea
            id="specialMessage"
            name="specialMessage"
            value={formData.specialMessage}
            onChange={handleChange}
            rows="3"
            placeholder='If you have any message for us, write it here'
            className="mt-2 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-600 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
          />
        </div>

        {/* <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={!isFormValid}
        >
          Submit
        </button> */}
      </form>
      
      {isFormValid && <PayOptionsComponent formData={formData} />}
    </>
  );
};