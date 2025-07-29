'use client'

import { useState } from 'react';
import Link from 'next/link'
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from "react-icons/io";
import { assets, HomeIcon } from '@/assets/assets';
import Image from 'next/image';

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   return (
      <header className="border-b border-gray-300 text-black z-20 fixed top-0 left-0 right-0 bg-green-50/80 backdrop-blur-sm">
         <div className="container relative mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
            <div className='flex items-center justify-center gap-6'>
               <Link href="/" className='font-bold text-green-900 text-xl'>
                  {/*<Image src="/logo.svg" alt="Yakubu Logo" width={100} height={100} className='w-10 h-10' />*/}
                  E-Farmlink
               </Link>
            </div>
            <div className='flex items-center gap-4'>
               <div className='hidden md:flex items-center gap-4'>
                  <nav className="flex items-center gap-4 lg:gap-8">
                     <Link href="/" className='hover:translate-y-[-2px] transition duration-300'>
                        Home
                     </Link>
                     <Link href="/about" className='hover:translate-y-[-2px] transition duration-300'>
                        About
                     </Link>
                     <Link href="/marketplace" className='hover:translate-y-[-2px] transition duration-300'>
                        Marketplace
                     </Link>
                     <Link href="/contact" className='hover:translate-y-[-2px] transition duration-300'>
                        Contact
                     </Link>
                  </nav>
                  <button className="px-4 py-2 font-bold rounded-md bg-green-900 text-white hover:scale-105 transition-all duration-300">
                     Sign In / Sign Up
                  </button>
               </div>
               <div className="md:hidden">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                     {isMenuOpen ? <IoMdClose className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                  </button>
               </div>
            </div>
         </div>

         {isMenuOpen && (
            <div className="md:hidden bg-background border-b border-gray-300">
               <div className="container px-4 py-4 flex flex-col items-center gap-4">
                  <Link href="/" className='hover:translate-y-[-2px] transition duration-300'>Home</Link>
                  <Link href="/about" className='hover:translate-y-[-2px] transition duration-300'>About</Link>
                  <Link href="/marketplace" className='hover:translate-y-[-2px] transition duration-300'>Marketplace</Link>
                  <Link href="/contact" className='hover:translate-y-[-2px] transition duration-300'>Contact</Link>
                  <button className="px-4 py-2 font-bold rounded-md bg-green-900 text-white hover:scale-105 transition-all duration-300">
                     Sign In / Sign Up
                  </button>
               </div>
            </div>
         )}
      </header>
   )
}

export default Navbar
