'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

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
        currentSearches.push(query);
        localStorage.setItem('recent-search-keywords', JSON.stringify(currentSearches));
        setRecentSearches(currentSearches);
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
        className="flex items-center justify-center px-2 md:hidden">
        <Search />
      </button>
      
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 p-2">
          <div ref={searchRef} className="flex flex-col items-center bg-black p-4">
            <button onClick={() => setIsSearchOpen(false)} className="flex flex-row items-center justify-end w-full bg-black py-4">
              <X size={24} />
            </button>
            <div className="flex items-center bg-black w-full">
              <div className="w-max-[550px] relative w-full">
                <input
                  key={searchParams?.get('q')}
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  name="search"
                  className="w-full rounded-lg border px-4 py-2 text-sm text-black placeholder:text-neutral-500 border-neutral-800 bg-transparent text-white placeholder:text-neutral-400"
                />
                <button className="absolute right-0 top-0 mr-3 flex h-full items-center" onClick={() => setSearchTerm('')}>
                  <X size={24} />
                </button>
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
                <h3 className="text-white mb-2">Recent Searches</h3>
                <ul className="space-y-2">
                  {recentSearches.map((term, index) => (
                    <li key={index} className="text-blue-400 hover:underline cursor-pointer" onClick={() => handleSearch(term)}>
                      {term}
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
