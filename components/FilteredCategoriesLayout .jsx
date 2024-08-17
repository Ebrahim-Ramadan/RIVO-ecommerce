'use client';
import { getFramesByCategory } from '@/lib/utils';
import React, { useState, useEffect, Fragment } from 'react';
import { CategoriesLayout } from './CategoriesLayout';
import LoadingDots from './loading-dots';
import { Menu, Transition } from '@headlessui/react';
import { ListFilter } from 'lucide-react';

export const FilteredCategoriesLayout = ({ category }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortOption, setSortOption] = useState('alphabeticalAZ');
  const [loading, setLoading] = useState(true);
  
  // State for the input fields
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  const applyFilters = (categoriesToFilter) => {
    let result = categoriesToFilter.filter(item => {
      const itemPrice = parseInt(item.price[0]);
      return itemPrice >= priceRange.min && (priceRange.max === Infinity || itemPrice <= priceRange.max);
    });

    switch(sortOption) {
      case 'priceLowToHigh':
        result.sort((a, b) => parseInt(a.price[0]) - parseInt(b.price[0]));
        break;
      case 'priceHighToLow':
        result.sort((a, b) => parseInt(b.price[0]) - parseInt(a.price[0]));
        break;
      case 'alphabeticalAZ':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphabeticalZA':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // No sorting
    }

    setFilteredCategories(result);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const categoryKey = `cached-${category.toLowerCase().replace(/-/g, ' ')}`;
      
      try {
        const cachedData = localStorage.getItem(categoryKey);

        let dataArray;
        if (cachedData) {
          dataArray = JSON.parse(cachedData);
        } else {
          dataArray = await getFramesByCategory(category.replace(/-/g, ' '));
          localStorage.setItem(categoryKey, JSON.stringify(dataArray));
        }
        setCategories(dataArray);
        applyFilters(dataArray);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [category]);

  useEffect(() => {
    if (categories.length > 0) {
      applyFilters(categories);
    }
  }, [categories, priceRange, sortOption]);

  if (loading) {
    return <div className="flex items-center justify-center w-full h-full"><LoadingDots/></div>;
  }

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min: min || 0, max: max || Infinity });
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div className='w-full'>
    <Menu as="div" className="relative inline-block text-right flex w-full justify-start z-50">
      <Menu.Button className="inline-flex w-full justify-end rounded-xl bg-black bg-opacity-20 px-4 text-sm font-medium text-white hover:bg-opacity-30">
        Filters
        <ListFilter
          className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-black/40 backdrop-blur-3xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
          <div 
                onClick={(e) => e.stopPropagation()} 
                  className={`justify-start group flex flex-col rounded-xl px-2 py-2 gap-2 text-sm`}
                >
                  <label className='self-start font-medium'>Price Range:</label>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPriceInput}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setMinPriceInput(e.target.value);
                      handlePriceRangeChange(value, priceRange.max);
                    }}
                    className="w-full rounded-lg border px-4 py-2 text-sm text-black border-neutral-800 bg-neutral-600 text-white placeholder:text-neutral-200 "
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPriceInput}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || Infinity;
                      setMaxPriceInput(e.target.value);
                      handlePriceRangeChange(priceRange.min, value);
                    }}
                    className="w-full rounded-lg border px-4 py-2 text-sm text-black border-neutral-800 bg-neutral-600 text-white placeholder:text-neutral-200 "
                  />
                </div>
          </div>
          <div className="px-1 py-1">
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="group flex flex-col rounded-xl px-2 py-2 text-sm "
            >
              <label className='self-start font-medium py-2'>Sort by:</label>
              <select 
                value={sortOption} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 text-sm text-black placeholder:text-neutral-500 border-neutral-800 bg-neutral-600 text-white placeholder:text-neutral-400"
              >
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="alphabeticalAZ">Name: A to Z</option>
                <option value="alphabeticalZA">Name: Z to A</option>
              </select>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
    <CategoriesLayout category={category} categories={filteredCategories} />
  </div>
  );
};

export default FilteredCategoriesLayout;
