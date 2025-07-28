import Link from 'next/link'
import React from 'react'
import { FaArrowDown } from "react-icons/fa6";

const Hero = () => {
   return (
      <div className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
         <div
            className="absolute inset-0 bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat"
         >
            <div className="absolute inset-0 bg-black/50" />
         </div>
         <div className='z-10 flex flex-col items-center gap-8'>
            <div className='flex flex-col gap-4 items-center text-center'>
               <h1 className='text-white font-bold text-3xl md:text-6xl'>Bridging Farms to Markets in Real Time</h1>
               <p className='text-white'>
                  Helping farmers sell smarter and buyer buy reliably
               </p>
            </div>
            <div className='flex flex-row items-center justify-center gap-4'>
               <Link href="/how-it-works" className='px-4 py-2 bg-green-900 text-white rounded-md hover:bg-green-800 transition-all duration-300'>
                  How it works
               </Link>
               <Link href="/" className='px-4 py-2 bg-green-50/50 text-white rounded-md hover:bg-green-50/40 transition-all duration-300'>
                  Get started
               </Link>
            </div>
         </div>
         <div className='animate-bounce absolute bottom-2 right-1/2 translate-x-1/2 text-white'>
            <FaArrowDown className='w-6 h-6' />
         </div>
      </div>
   )
}

export default Hero
