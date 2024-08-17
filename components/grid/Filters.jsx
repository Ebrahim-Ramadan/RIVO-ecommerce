'use client';

import { useState, useMemo } from "react";
import { Menu } from "@headlessui/react";
import { ListFilter } from "lucide-react";


export default function Filters() {
  const [sortBy, setSortBy] = useState("price-asc");
  


  const sortedProducts = useMemo(() => {
    switch (sortBy) {
      case "price-asc":
        return filteredProducts.sort((a, b) => a.price - b.price);
      case "price-desc":
        return filteredProducts.sort((a, b) => b.price - a.price);
      case "name-asc":
        return filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filteredProducts;
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="p-6 bg-background">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
       
        <div className="flex items-center gap-4">
          <Menu as="div" className="relative">
            <Menu.Button as={Button} variant="outline" className="flex items-center gap-2">
              <ListFilter className="w-4 h-4" />
              <span>Sort by</span>
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-[200px] bg-white shadow-lg rounded-lg">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full px-4 py-2 text-left`}
                    onClick={() => setSortBy("price-asc")}
                  >
                    Price: Low to High
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full px-4 py-2 text-left`}
                    onClick={() => setSortBy("price-desc")}
                  >
                    Price: High to Low
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full px-4 py-2 text-left`}
                    onClick={() => setSortBy("name-asc")}
                  >
                    Name: A to Z
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full px-4 py-2 text-left`}
                    onClick={() => setSortBy("name-desc")}
                  >
                    Name: Z to A
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      
    </div>
  );
}

