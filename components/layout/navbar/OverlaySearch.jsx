'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X , ArrowRight} from 'lucide-react';

export const OverlaySearch = () => {
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${searchTerm}`);
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
              <X size={24}  />
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
                  defaultValue={searchParams?.get('q') || ''}
                  className="w-full rounded-lg border px-4 py-2 text-sm text-black placeholder:text-neutral-500 border-neutral-800 bg-transparent text-white placeholder:text-neutral-400"
                />
                <button className="absolute right-0 top-0 mr-3 flex h-full items-center" onClick={() => setSearchTerm('')}>
                  <X size={24} />
                </button>
              </div>
              <button onClick={handleSearch} className="ml-2">
                <Search size={24} />
              </button>
            </div>
            {searchTerm.trim().length > 0 && 
              <button
                onClick={handleSearch}
                className="flex items-center text-lg font-semibold justify-between w-full bg-black mt-4"
              >
                <span>Search for &ldquo;{searchTerm}&rdquo;</span> 
                <ArrowRight size={20} className="ml-2" />
              </button>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default OverlaySearch;
