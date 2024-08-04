'use client';

import { Select } from '@headlessui/react';
import location from '@/public/assets/location.svg';
import Image from 'next/image';
import {  useState } from 'react';
import PayOptionsComponent from './PayOptionsComponent';
import { Shipping_costs } from '@/lib/orders';
import { ShippingCost } from './ShippingCost';


export const ClientPaymentForm = () => {

  
  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    phoneNumber: '',
    governorate: '',
    city: '',
    address: '',
    specialMessage: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add your form submission logic here (e.g., send data to an API)
  };
  const checkRequiredFields = (data) => {
    for (const key in data) {
      if (key !== 'specialMessage' && !data[key].trim()) {
        return false;
      }
      if (key === 'phoneNumber' && data[key].length !=11) {
        return false;
      }
    }
    return true;
  };
  return (
   
      <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 py-8 rounded-lg shadow-md w-full md:w-[400px] ">
    <div className='flex font-bold items-center self-start gap-2 flex-row'>
 <p className='w-6 h-6 p-2 flex flex-row items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm'>
    1
  </p >
    <label className='text-xl'>Fill In Your Details</label>
 </div>
  <div>
    <label htmlFor="email" className="block text-sm font-medium styled-text">Email 
    
    </label>
    <input
    placeholder='Enter your email'
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      className="mt-2 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-600 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
    />
  </div>
  
  <div>
    <label htmlFor="fullname" className="block text-sm font-medium styled-text">Full Name </label>
    <input
    placeholder='Enter your full name'
      type="text"
      id="fullname"
      name="fullname"
      value={formData.fullname}
      onChange={handleChange}
      required
      className="mt-2 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-600 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
    />
  </div>

  <div>
    <label htmlFor="phoneNumber" className="block text-sm font-medium styled-text">Phone Number </label>
    <input
    placeholder='Enter your phone number'
      type="number"
      id="phoneNumber"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={handleChange}
      required
      minLength="11"
      className="mt-2 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-600 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
    />
    <p className='text-xs text-end px-2 py-1 text-neutral-400'>Must be 11 digits (Ex: 01102191344)</p> 
  </div>
  
  <div>
   <div className='w-full flex flex-row items-center justify-between'>
<div className='flex flex-row items-center gap-2'>
<label htmlFor="governorate" className="block text-sm font-medium styled-text ">Governorate 

   
</label>
<div className='h-6 w-6 flex items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm'>
<ShippingCost trigger='?' className='self-center text-white  py-2'/>

</div>
</div>
    <div className='text-xs flex text-white/40 font-medium items-center gap-1 flex-row justify-end'>
<Image
src={location}
width={24}
height={24}
alt="location"
/>
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
    <label htmlFor="city" className="block text-sm font-medium styled-text">City </label>
    <input
    placeholder='Enter your city'
      type="text"
      id="city"
      name="city"
      value={formData.city}
      onChange={handleChange}
      required
      className="mt-2 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-600 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
    />
  </div>

  <div>
    <label htmlFor="address" className="block text-sm font-medium styled-text">Address </label>
    <input
    placeholder='Write Your Address In Details'
      type="text"
      id="address"
      name="address"
      value={formData.address}
      onChange={handleChange}
      required
      className="mt-2 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-600 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
    />
  </div>

  <div>
    <label htmlFor="specialMessage" className="block text-sm font-medium">Special Message (Optional)</label>
    <textarea
    placeholder='If you have any message for us, write it here'
      id="specialMessage"
      name="specialMessage"
      value={formData.specialMessage}
      onChange={handleChange}
      rows="3"
      className="mt-2 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-600 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
    />
  </div>
{/* 
{checkRequiredFields(formData)&&
  // <PayOptionsComponent amount={amount} formData={formData&&formData} />
<SaveInfo formData={formData&&formData} />
} */}
  {/* <button
    type="submit"
    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    Submit
  </button> */}
</form>  
    {checkRequiredFields(formData)&&
      <PayOptionsComponent  formData={formData&&formData} />
    } 
      </>
  );
};
