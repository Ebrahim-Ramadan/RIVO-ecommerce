'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

import { CircleChevronRight } from 'lucide-react';

export const OverlaySearch = () => {
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const router = useRouter();
  const searchRef = useRef(null);

  const handleSearch = (term) => {
    const query = term || searchTerm;
    if (query.trim()) {
      // Add the search term to recent searches
      const currentSearches = JSON.parse(localStorage.getItem('recent-search-keywords')) || [];
      if (!currentSearches.includes(query) && query.length > 1) {
        const updatedSearches = [query, ...currentSearches.slice(0, 4)];
        localStorage.setItem('recent-search-keywords', JSON.stringify(updatedSearches));
        setRecentSearches(updatedSearches);
      }
      router.push(`/search?q=${query}`);
      setIsSearchOpen(false); // Close the search overlay after searching
    }
  };

  // Close the search overlay if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Fetch recent searches when the overlay is opened
  useEffect(() => {
    if (isSearchOpen) {
      const savedSearches = JSON.parse(localStorage.getItem('recent-search-keywords')) || [];
      setRecentSearches(savedSearches);
    }
  }, [isSearchOpen]);

  return (
    <>
      <button onClick={() => setIsSearchOpen(true)}
        className="flex items-center justify-center mr-4 md:hidden">
        <Search />
      </button>
      
      {isSearchOpen && (
        <div className={`fixed inset-0 z-50 bg-black/80 p-2 transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div ref={searchRef} className="flex flex-col items-center bg-black p-4 transition-opacity duration-300">

            <div className="flex flex-row items-center justify-between w-full py-4">
              <h1 className='text-2xl font-bold'>Search Products</h1>
              <button onClick={() => setIsSearchOpen(false)} className="p-2 rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white flex flex-row items-center justify-endbg-black ">
              <X size={28} />
            </button>
            </div>
            
            <div className="flex items-center bg-black w-full">
              <div className="w-max-[550px] relative w-full">
                <input
                autoFocus
                  key={searchParams?.get('q')}
                  type="text"
                  placeholder="Search For Products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  name="search"
                  className="w-full rounded-lg border px-4 py-2 text-sm text-black placeholder:text-neutral-500 border-neutral-800 bg-transparent text-white placeholder:text-neutral-400"
                />
                {searchTerm.trim().length > 0&&
                   <button className="absolute right-0 top-0 mr-3 flex h-full items-center" onClick={() => setSearchTerm('')}>
                   <X size={20} color='#BBBBBB' />
                 </button>
                }
             
              </div>
              <button onClick={() => handleSearch()} className="ml-2">
                <Search size={24} />
              </button>
            </div>
            {searchTerm.trim().length > 0 &&
              <button
                onClick={() => handleSearch()}
                className="flex items-center text-lg font-semibold justify-between w-full bg-black mt-4"
              >
                <span>Search for &ldquo;{searchTerm}&rdquo;</span>
                <ArrowRight size={20} className="ml-2" />
              </button>
            }
            {recentSearches.length > 0 && (
              <div className="w-full mt-4">
                <h3 className="text-white/80 mb-2">Recent</h3>
                <ul className="space-y-2">
                  {recentSearches.slice(0, 5).map((term, index) => (
                    <li key={index} className="w-full justify-between text-blue-500 group hover:underline cursor-pointer flex flex-row items-center" onClick={() => handleSearch(term)}>
                      {term}
                      {/* <CircleChevronRight size={20}  className='text-white/80 group-hover:text-white'/> */}
                      <ArrowRight size={20} className="ml-2 text-white/80 group-hover:text-white" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OverlaySearch;
