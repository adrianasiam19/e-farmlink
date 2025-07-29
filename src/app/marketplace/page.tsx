'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { useState } from "react";

const Marketplace = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("all");
   const categories = ["Fruits", "Vegetables", "Dairy", "Grains"];

   return (
      <div>
         <Navbar />
         <div className='flex flex-col items-start py-16 px-4 max-w-7xl mx-auto'>
            <h1 className='text-4xl font-bold py-4 text-green-900'>Marketplace</h1>
            <p className='text-gray-600'>Shop fresh produce directly from farmers</p>

            <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
               <input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
               />
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md sm:text-sm px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
               >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                     <option key={category} value={category}>
                        {category}
                     </option>
                  ))}
               </select>
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">

         </div>
         <Footer />
      </div>
   )
}

export default Marketplace
