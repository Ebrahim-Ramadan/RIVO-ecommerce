'use client';
import { useState } from 'react';

export default function SaveInfo({formData}) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    console.log('Checkbox is checked:', checked);
    if(checked){
      localStorage.setItem('UserDetails', JSON.stringify(formData));
    }
  };

  return (
    <div className="flex items-center justify-end w-full">
      <input 
        id="link-checkbox" 
        type="checkbox" 
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label 
        htmlFor="link-checkbox" 
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Save Info and Remember for next time
      </label>
    </div>
  );
}
