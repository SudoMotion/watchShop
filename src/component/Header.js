"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  // Mock data - in real app, get from context/state
  const cartCount = 0;
  const wishlistCount = 0;

  const navigationItems = [
    { label: "MEN'S WATCH", href: "/category/men-watch" },
    { label: "LADIES WATCH", href: "/category/ladies-watch" },
    { label: "COUPLE WATCH", href: "/category/couple-watch" },
    { label: "WATCH ACCESSORIES", href: "/category/accessories" },
    { label: "MEN'S FASHION", href: "/category/men-fashion" },
    { label: "LADIES FASHION", href: "/category/ladies-fashion" },
    { label: "LIMITED EDITION", href: "/category/limited-edition" },
    { label: "BEST DEAL", href: "/category/best-deal", highlight: true },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white w-full z-50">
      {/* Top Bar */}
      <div className="bg-gray-100 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>01720392824</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span>Enjoy Year Ending Sale Flat 30% Discount!</span>
            <span>⌚</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <Image src={'/logo.png'} height={100} width={250} alt='watchshopbd' className='h-10 object-contain'/>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Mobile Search Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-gray-700 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User/Sign In */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden md:inline text-sm font-medium">Sign In</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link 
                    href="/login" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Register
                  </Link>
                  <Link 
                    href="/account" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Account
                  </Link>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative text-gray-700 hover:text-red-600 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-700 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {open && (
          <div className="mt-4 lg:hidden">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar - Sticky */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-3">
            {/* Home Icon */}
            <Link href="/" className="flex-shrink-0 text-gray-700 hover:text-red-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* Navigation Items */}
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex-shrink-0 text-sm font-medium whitespace-nowrap transition-colors ${
                  item.highlight
                    ? 'text-green-600 hover:text-green-700'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {item.label}
                {item.highlight && <span className="ml-1">🤝</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
