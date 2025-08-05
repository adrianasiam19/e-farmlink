'use client'

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import Image from 'next/image';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserFirstName(user.first_name || null);
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh');
    const accessToken = localStorage.getItem('access');

    try {
      const res = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUserFirstName(null);
        toast.success("Logged out successfully");
        setShowDropdown(false);
        setIsMenuOpen(false);
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Error during logout");
    }
  };

  return (
    <header className="border-b border-gray-300 text-black z-20 fixed top-0 left-0 right-0 bg-green-50/80 backdrop-blur-sm">
      <div className="container relative mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <div className='flex items-center justify-center gap-6'>
          <Link href="/" className='font-bold text-green-900 text-xl'>
            E-Farmlink
          </Link>
        </div>

        <div className='flex items-center gap-4'>
          <div className='hidden md:flex items-center gap-4 relative'>
            <nav className="flex items-center gap-4 lg:gap-8">
              <Link href="/" className='hover:translate-y-[-2px] transition duration-300'>Home</Link>
              <Link href="/about" className='hover:translate-y-[-2px] transition duration-300'>About</Link>
              <Link href="/marketplace" className='hover:translate-y-[-2px] transition duration-300'>Marketplace</Link>
              <Link href="/contact" className='hover:translate-y-[-2px] transition duration-300'>Contact</Link>
            </nav>

            {!userFirstName ? (
              <Link href="/auth" className="px-4 py-2 font-bold rounded-md bg-green-900 text-white hover:scale-105 transition-all duration-300">
                Sign In / Sign Up
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-green-900 font-semibold"
                >
                  <FaUserCircle className="w-6 h-6" />
                  {userFirstName}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-30">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
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
            {!userFirstName ? (
              <Link href="/auth" className="px-4 py-2 font-bold rounded-md bg-green-900 text-white hover:scale-105 transition-all duration-300">
                Sign In / Sign Up
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-2 text-green-900 font-semibold">
                  <FaUserCircle className="w-6 h-6" />
                  {userFirstName}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 w-full text-center font-bold rounded-md bg-red-500 text-white hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
