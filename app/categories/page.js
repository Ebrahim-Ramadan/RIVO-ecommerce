"use client"

import { useState, useMemo } from "react"
import { Menu } from "@headlessui/react"
import Link from "next/link"
import Image from "next/image"
import { FilterIcon } from "lucide-react"

export const metadata = {
  description: 'RIVO e-commerce website ',
 title: 'RIVO Collecitons ',
};
export default function Page() {
  const categories = [
    {
      id: 1,
      title: "Movies",
      slug:"/categories/movies",
      image: "/categories/movies.svg",
    },
    {
      id: 2,
      title: "Music",
      slug:"/categories/musics",
      image: "/categories/music.svg",
    },
    {
      id: 3,
      title: "Series",
      slug:"/categories/series",
      image: "/categories/series.svg",
    },
    {
      id: 4,
      title: "Superheroes",
      slug:"/categories/superheroes",
      image: "/categories/superheros.svg",
    },
    {
      id: 5,
      title: "Framed vinyls",
      slug:"/categories/Framed-vinyls",
      image: "/categories/Vinyl Frames.svg",
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState([])

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => category.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((category) => selectedFilters.length === 0 || selectedFilters.includes(category.title))
  }, [searchTerm, selectedFilters])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter))
    } else {
      setSelectedFilters([...selectedFilters, filter])
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="relative">
          <Menu>
            <Menu.Button className="text-base font-semibold">
              <FilterIcon />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white/20 backdrop-blur-xl ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1 [&>*]:rounded-lg">
                {categories.map((category) => (
                 <Menu.Item key={category.id}>
                 {({ active }) => (
                   <div
                     onClick={(e) => e.stopPropagation()} // Prevent the menu from closing
                     className={`flex items-center gap-2 px-4 py-2 text-sm text-white ${
                       active ? "bg-white/20" : ""
                     }`}
                   >
                     <input
                       type="checkbox"
                       checked={selectedFilters.includes(category.title)}
                       onChange={() => handleFilterChange(category.title)}
                       onClick={(e) => e.stopPropagation()} // Ensure checkbox click doesn't close the menu
                       className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                     />
                     {category.title}
                   </div>
                 )}
               </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            href={category.slug}
            className="relative group overflow-hidden rounded-lg shadow-lg p-4 flex flex-col items-center justify-center"
            prefetch={false}
          >
           <Image
              alt="svg"
              src={category.image}
              width={20}
              height={20}
              className="object-cover w-12 h-12 aspect-square group-hover:opacity-50 transition-opacity"
            />
            <h3 className="md:text-xl font-bold text-center text-white mb-2">{category.title}</h3>
           
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  )
}
