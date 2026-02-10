"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false); // search modal
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const onTransparent = isHome && !isScrolled;
  const userMenuRef = useRef(null);

  // Helper function to convert brand name to brandId format
  const brandToSlug = (brandName) => {
    return brandName.toLowerCase().replace(/\s+/g, '-');
  };

  // Change header style on scroll (for transparent-on-hero effect)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      
      // Close dropdowns when clicking outside - check if click is not within any dropdown
      if (activeDropdown !== null) {
        const dropdownElement = document.querySelector(`[data-dropdown-index="${activeDropdown}"]`);
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setActiveDropdown(null);
        }
      }
    };

    if (showUserMenu || activeDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, activeDropdown]);
  
  // Mock data - in real app, get from context/state
  const cartCount = 0;
  const wishlistCount = 0;

  // Men's Watch Brands
  const mensWatchBrands = [
    "Seiko", "Tissot", "Citizen", "Rado", "Fossil", "Emporio Armani", "Orient", "Omega",
    "Pagani Design", "Titan", "Casio", "Casio Edifice", "Casio G-Shock", "Longines", "Oris",
    "TAG Heuer", "Tommy Hilfiger", "Daniel Klein (DK)", "Hamilton", "Victorinox",
    "West End Watch", "Swatch", "Mido", "Michael Kors (MK)", "Hugo Boss", "Guess", "Fastrack",
    "Certina", "Frederique Constant", "Mathey Tissot", "Police", "Curren", "Naviforce", "Timex",
    "Olevs", "Tudor", "Omax", "Casio Pro Trek", "Q&Q", "Santa Barbara PRC", "Movado", "Invicta"
  ];

  // Ladies Watch Brands
  const ladiesWatchBrands = [
    "Seiko", "Tissot", "Rado", "Fossil", "Emporio Armani", "Omega", "Pagani Design", "Titan",
    "Casio", "Casio G-Shock", "Tommy Hilfiger", "Daniel Klein (DK)", "Michael Kors (MK)",
    "Hugo Boss", "Guess", "Fastrack", "Mathey Tissot", "Naviforce", "Olevs", "Q&Q",
    "Santa Barbara PRC"
  ];

  // Couple Watch Brands
  const coupleWatchBrands = [
    "Rado", "Fossil", "Emporio Armani", "Titan", "Casio", "Daniel Klein (DK)", "Louis Cardin",
    "Guess", "Mathey Tissot", "Naviforce", "Timex", "Olevs", "Oliya"
  ];

  // Watch Accessories
  const watchAccessories = [
    "Watch Organizer Box", "Fossil Watch Strap", "Watch Winder", "Watch Strap"
  ];

  // Men's Fashion
  const mensFashion = [
    "Perfume", "Wallet", "Sunglass", "Ties", "Cufflinks"
  ];

  // Ladies Fashion
  const ladiesFashion = [
    "Perfume", "Wallet", "Sunglass", "Sholder Bag"
  ];

  const navigationItems = [
    { 
      label: "MEN'S WATCH", 
      href: "/category/men-watch",
      submenu: mensWatchBrands.map(brand => ({
        label: brand,
        href: `/brand/${brandToSlug(brand)}`
      }))
    },
    { 
      label: "LADIES WATCH", 
      href: "/category/ladies-watch",
      submenu: ladiesWatchBrands.map(brand => ({
        label: brand,
        href: `/brand/${brandToSlug(brand)}`
      }))
    },
    { 
      label: "COUPLE WATCH", 
      href: "/category/couple-watch",
      submenu: coupleWatchBrands.map(brand => ({
        label: brand,
        href: `/brand/${brandToSlug(brand)}`
      }))
    },
    { 
      label: "WATCH ACCESSORIES", 
      href: "/category/accessories",
      submenu: watchAccessories.map(accessory => ({
        label: accessory,
        href: `/category/accessories?filter=${brandToSlug(accessory)}`
      }))
    },
    { label: "LIMITED EDITION", href: "/category/limited-edition", submenu: [] },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
  <header className={`${isHome ? 'fixed top-0 left-0 right-0' : 'relative'} w-full z-50`}>

      {/* Main Header: single row */}
      <div
        className={`border-b py-3 lg:py-4 px-4 transition-colors duration-300 ${
          onTransparent ? 'bg-transparent border-transparent' : 'bg-white border-gray-200'
        }`}
      >
        <div className=" flex items-center justify-between gap-4">
          {/* Left: Logo + main menu (desktop) */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/">
              <Image
                src={'/logo.png'}
                height={100}
                width={250}
                alt="watchshopbd"
                className="h-10 object-contain"
              />
            </Link>

            {/* Main navigation - desktop */}
            <div className="hidden lg:flex items-center gap-4 md:gap-6">
              {navigationItems.map((item, index) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isDropdownOpen = activeDropdown === index;

                return (
                  <div
                    key={index}
                    data-dropdown-index={index}
                    className="relative"
                    onMouseEnter={() => hasSubmenu && setActiveDropdown(index)}
                    onMouseLeave={() => hasSubmenu && setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      onClick={() => !hasSubmenu && setActiveDropdown(null)}
                      className={`flex items-center gap-1 text-[10px] md:text-xs font-medium whitespace-nowrap transition-colors ${
                        item.highlight
                          ? onTransparent
                            ? 'text-green-300 hover:text-green-200'
                            : 'text-green-600 hover:text-green-700'
                          : onTransparent
                            ? 'text-white hover:text-white/80'
                            : 'text-gray-700 hover:text-red-600'
                      }`}
                    >
                      {item.label}
                      {item.highlight && <span className="ml-1">🤝</span>}
                      {hasSubmenu && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {hasSubmenu && isDropdownOpen && (
                      <div className="absolute z-50 top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: search + shortcuts */}
          <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">
            {/* Search icon (all viewports) */}
            <button
              onClick={() => setOpen(true)}
              className={`flex items-center justify-center p-2 ${
                onTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* User/Sign In */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-1 text-xs md:text-sm font-medium transition-colors ${
                  onTransparent
                    ? 'text-white hover:text-white/80'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden md:inline text-sm font-medium">
                  Sign In
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
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
            <Link
              href="/wishlist"
              className={`relative transition-colors ${
                onTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-red-600'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative transition-colors ${
                onTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden flex items-center justify-center p-2 transition-colors ${
                onTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-red-600'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Menu Dropdown (below main header) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white/95 backdrop-blur px-4 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-1 pt-2">
              {navigationItems.map((item, index) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isDropdownOpen = mobileActiveDropdown === index;

                return (
                  <div
                    key={index}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={() => !hasSubmenu && setMobileMenuOpen(false)}
                        className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
                          item.highlight
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-700 hover:text-red-600'
                        }`}
                      >
                        {item.label}
                        {item.highlight && <span className="ml-1">🤝</span>}
                      </Link>
                      {hasSubmenu && (
                        <button
                          onClick={() =>
                            setMobileActiveDropdown(
                              isDropdownOpen ? null : index
                            )
                          }
                          className="p-3 text-gray-700 hover:text-red-600 transition-colors"
                          aria-label="Toggle submenu"
                        >
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              isDropdownOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Mobile Submenu */}
                    {hasSubmenu && isDropdownOpen && (
                      <div className="bg-gray-50 pb-2">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            onClick={() => {
                              setMobileActiveDropdown(null);
                              setMobileMenuOpen(false);
                            }}
                            className="block py-2 px-6 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Search products
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setOpen(false);
              }}
              className="flex items-stretch gap-2"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products"
                autoFocus
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
