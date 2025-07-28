import Link from "next/link";
import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
   return (
      <footer className="bg-green-50">
         <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start justify-center border-b border-gray-500/30 text-black py-8 md:py-14">
            <div className="w-full md:w-4/5">
               <Link href="/" className="font-bold text-green-900 text-xl">
                  {/*<Image src="/logo.svg" alt="Yakubu Logo" width={100} height={100} className='w-10 h-10' />*/}
                  E-Farmlink
               </Link>
               <p className="mt-4 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
               </p>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-start md:justify-center mt-8 md:mt-0">
               <div>
                  <h2 className="font-medium text-gray-900 mb-5">Company</h2>
                  <ul className="text-sm space-y-2 text-gray-500">
                     <li>
                        <a className="hover:underline transition" href="/">Home</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="/about">About us</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="/contact">Contact us</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="#">Privacy policy</a>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="w-full md:w-1/2 flex items-start justify-start md:justify-center mt-8 md:mt-0">
               <div>
                  <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
                  <div className="text-sm space-y-2 text-gray-500">
                     <p>+1-234-567-890</p>
                     <p>contact@efarmlink.com</p>
                  </div>
                  <div className="flex items-center gap-4 mt-5 text-2xl text-gray-600">
                     <Link href="/">
                        <FaInstagram />
                     </Link>
                     <Link href="/">
                        <FaXTwitter />
                     </Link>
                     <Link href="/">
                        <FaFacebook />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
         <p className="py-3 md:py-4 text-center text-xs sm:text-sm">
            Copyright 2025 © All Right Reserved.
         </p>
      </footer>
   );
};

export default Footer;