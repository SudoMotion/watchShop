"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { isLoggedIn } from '@/lib/auth';
import { getWishlist } from '@/lib/wishlistStorage';
import { getCart } from '@/lib/cartStorage';
import { getCategories, postSearchProducts } from '@/stores/ProductAPI';
import { Backend_Base_Url } from '@/config';
import DesktopSearch from './DesktopSearch';

export default function Header() {
  
  const [open, setOpen] = useState(false); // search modal
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const onTransparent = isHome && !isScrolled;
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const headerRef = useRef(null);

  // Sync login state (client-only to avoid hydration mismatch)
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [pathname]);

  // Change header style on scroll (for transparent-on-hero effect)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu, dropdowns, and search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }

      if (open && searchRef.current && !searchRef.current.contains(event.target)) {
        setOpen(false);
      }
      
      // Close dropdowns when clicking outside - check if click is not within any dropdown
      if (activeDropdown !== null) {
        const dropdownElement = document.querySelector(`[data-dropdown-index="${activeDropdown}"]`);
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setActiveDropdown(null);
        }
      }

      // Close mobile search when clicking completely outside header
      if (mobileSearchOpen && headerRef.current && !headerRef.current.contains(event.target)) {
        setMobileSearchOpen(false);
      }
    };

    if (showUserMenu || activeDropdown !== null || open || mobileSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, activeDropdown, open, mobileSearchOpen]);
  
  // Mock data - in real app, get from context/state
  useEffect(() => {
    const syncWishlistCount = (event) => {
      if (event?.detail?.count != null) {
        setWishlistCount(Number(event.detail.count) || 0);
        return;
      }
      setWishlistCount(getWishlist().length);
    };
    syncWishlistCount();
    window.addEventListener("focus", syncWishlistCount);
    document.addEventListener("visibilitychange", syncWishlistCount);
    window.addEventListener("watchshop:wishlist-updated", syncWishlistCount);
    return () => {
      window.removeEventListener("focus", syncWishlistCount);
      document.removeEventListener("visibilitychange", syncWishlistCount);
      window.removeEventListener("watchshop:wishlist-updated", syncWishlistCount);
    };
  }, [pathname]);

  useEffect(() => {
    const syncCartCount = (event) => {
      if (event?.detail?.count != null) {
        setCartCount(Number(event.detail.count) || 0);
        return;
      }
      setCartCount(getCart().length);
    };
    syncCartCount();
    window.addEventListener("focus", syncCartCount);
    document.addEventListener("visibilitychange", syncCartCount);
    window.addEventListener("watchshop:cart-updated", syncCartCount);
    return () => {
      window.removeEventListener("focus", syncCartCount);
      document.removeEventListener("visibilitychange", syncCartCount);
      window.removeEventListener("watchshop:cart-updated", syncCartCount);
    };
  }, [pathname]);

  const [categories, setCategories] = useState([]);
  const [navigationItems, setNavigationItems] = useState([]);

  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const searchProductImage = (item) => {
    const candidates = [item?.thumb_image, item?.image, item?.otherimage].filter(Boolean);
    const raw =
      candidates.find((value) => {
        const s = String(value || "").trim();
        if (!s) return false;
        // Ignore unresolved template placeholders from API like "${image}".
        return !s.includes("${") && !s.includes("%7B") && !s.includes("%7D");
      }) || "";
    if (!raw) return "";
    if (String(raw).startsWith("http")) return raw;
    const normalized = raw.includes("/") ? raw : `uploads/product/${raw}`;
    return `${Backend_Base_Url}/${normalized}`;
  };

  const searchPriceMeta = (item) => {
    const original = toNum(item?.price);
    const discounted = toNum(
      item?.discount_price ?? item?.selling_price ?? item?.after_discount_price ?? item?.price
    );
    const rawDiscount = toNum(item?.discount);
    const discountPercent =
      rawDiscount > 0
        ? rawDiscount
        : original > discounted && original > 0
          ? ((original - discounted) / original) * 100
          : 0;
    return { original, discounted, discountPercent };
  };

  const handleKeywordClick = (keyword) => {
    const selectedKeyword = String(keyword || "").trim();
    if (!selectedKeyword) return;
    setSearchQuery(selectedKeyword);
    setOpen(false);
    setMobileSearchOpen(false);
    router.push(`/search?keyword=${encodeURIComponent(selectedKeyword)}`);
  };

  const handleSearchSubmit = () => {
    const keyword = String(searchQuery || "").trim();
    if (!keyword) return;
    setOpen(false);
    setMobileSearchOpen(false);
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  // Fetch categories once (for debugging / future use)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);

        // Build navigation items from real category data
        if (Array.isArray(data)) {
          const navItems = data
            .filter((cat) => cat && cat.parent_id === 0)
            .map((cat) => {
              const slug = String(cat.slug || '').toLowerCase();
              const name = String(cat.name || '').toLowerCase().trim();
              const isLimitedEditionBrand =
                slug === 'limited-edition' || name === 'limited edition';

              const categoryHref =
                cat.id != null && cat.id !== ''
                  ? `/category/${cat.slug}?category_id=${encodeURIComponent(String(cat.id))}`
                  : `/category/${cat.slug}`;

              return {
                label: cat.name || '',
                href: isLimitedEditionBrand ? `/brand/${cat.slug}` : categoryHref,
                submenu:
                  isLimitedEditionBrand || !Array.isArray(cat.brands)
                    ? []
                    : cat.brands.map((brand) => ({
                        label: brand.name || '',
                        href: `/brand/${brand.slug}`,
                      })),
              };
            });

          setNavigationItems([
            ...navItems,
            { label: 'Best Deal', href: '/best-deal', submenu: [] },
            { label: 'Outlets', href: '/outlets', submenu: [] },
          ]);
        }
      } catch (error) {
        console.error('Error loading categories in Header:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const search = String(searchQuery || '').trim();
    if (!search) {
      setSearchResults([]);
      setRelatedKeywords([]);
      return;
    }
    let cancelled = false;
    const fetchSearch = async () => {
      try {
        const response = await postSearchProducts({ search });
        const payload = response?.data ?? response ?? {};
        const products = Array.isArray(payload?.products)
          ? payload.products
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response)
                ? response
                : [];
        const keywords = Array.isArray(payload?.related_keywords)
          ? payload.related_keywords
          : [];
        if (!cancelled) {
          setSearchResults(products);
          setRelatedKeywords(keywords);
        }
      } catch (error) {
        if (!cancelled) {
          setSearchResults([]);
          setRelatedKeywords([]);
        }
      }
    };
    fetchSearch();
    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  return (
  <header ref={headerRef} className={`sticky top-0 ${isHome ? 'md:fixed md:top-0 md:left-0 md:right-0' : ''} w-full z-50`}>

      {/* Main Header: single row */}
      <div
        className={`border-b px-4 bg-black/20 backdrop-blur-md transition-colors duration-300 ${
          onTransparent ? 'border-transparent' : 'border-white/15 pb-1.5 md:pb-0'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo + main menu (desktop) */}
          <div className="flex gap-6">

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center text-white transition-colors hover:text-white/80"
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
            {/* Logo */}
            <Link href="/" className="block shrink-0 w-[140px] md:w-[150px] 2xl:w-[250px]">
              <Image
                src={'/logo.png'}
                height={100}
                width={250}
                alt="watchshopbd"
                className="h-10 w-full object-contain"
              />
            </Link>

            {/* Main navigation - desktop */}
            <div className="hidden lg:flex items-center gap-4 md:gap-2 2xl:gap-6">
              {navigationItems.map((item, index) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isDropdownOpen = activeDropdown === index;
                const isBestDealNav = item.href === '/best-deal';

                return (
                  <div
                    key={index}
                    data-dropdown-index={index}
                    className="relative h-full flex items-center py-3 lg:py-4"
                    onMouseEnter={() => hasSubmenu && setActiveDropdown(index)}
                    onMouseLeave={() => hasSubmenu && setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      onClick={() => !hasSubmenu && setActiveDropdown(null)}
                      className={`flex items-center gap-1.5 font-semibold text-sm md:text-sm whitespace-nowrap transition-colors ${
                        isBestDealNav
                          ? 'text-red-500 hover:text-red-400'
                          : item.highlight
                            ? 'text-green-300 hover:text-green-200'
                            : 'text-white hover:text-red-400'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isBestDealNav && (
                        <Image
                          src="/images/handshake.gif"
                          alt=""
                          width={22}
                          height={22}
                          className="h-5 w-5 shrink-0 object-contain"
                          unoptimized
                        />
                      )}
                      {item.highlight && !isBestDealNav && <span className="ml-1">🤝</span>}
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
                    {hasSubmenu && isDropdownOpen && (() => {
                      const len = item.submenu.length;
                      const isCol1 = len <= 7;
                      const isCol2 = len <= 16;
                      const isCol3 = len <= 26;
                      const rowsClass = len > 28 ? 'grid-rows-10' : 'grid-rows-8';
                      const widthClass = isCol1
                        ? 'w-52 min-w-[13rem] max-w-[18rem]'
                        : isCol2
                          ? 'w-80 md:w-96 min-w-[20rem] max-w-[32rem]'
                          : isCol3
                            ? 'w-64 md:w-[28rem] lg:w-[650px] min-w-[36rem] max-w-[650px]'
                          : 'w-64 md:w-[28rem] min-w-[36rem] lg:min-w-[55rem] max-w-[650px]';

                          // if(isCol1 || isCol2){
                          // }
                          return (
                            <div className={`absolute grid grid-flow-col z-50 top-full left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 ${rowsClass} ${widthClass}`}>
                              {item.submenu.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap min-w-0"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          );
                      // return (
                      //   <div className='fixed top-[72px] bg-white shadow-lg border border-gray-200 w-screen left-0 flex justify-center items-center'>
                      //     <div className={`grid z-50 top-full left-0 py-2 ${gridCols} w-64 md:w-[28rem] lg:w-[850px] min-w-[36rem] max-w-[850px]`}>
                      //       {item.submenu.map((subItem, subIndex) => (
                      //         <Link
                      //           key={subIndex}
                      //           href={subItem.href}
                      //           className="block px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap min-w-0"
                      //           onClick={() => setActiveDropdown(null)}
                      //         >
                      //           {subItem.label}
                      //         </Link>
                      //       ))}
                      //     </div>
                      //   </div>
                      // );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: search + shortcuts */}
          <div className="flex items-center gap-2 md:gap-3 2xl:gap-6 flex-1 justify-end py-3 lg:py-4">
            {/* Desktop search icon */}
            <DesktopSearch
              open={open}
              setOpen={setOpen}
              searchRef={searchRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              relatedKeywords={relatedKeywords}
              onKeywordClick={handleKeywordClick}
              onSearchSubmit={handleSearchSubmit}
              onResultClick={() => setOpen(false)}
            />

            {/* Mobile search toggle (first icon on mobile) */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className="flex md:hidden items-center justify-center text-white transition-colors hover:text-white/80"
              aria-label="Toggle search"
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

            {/* User/Sign In */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 text-xs md:text-sm font-medium text-white transition-colors hover:text-white/80"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {/* <span className="hidden md:inline text-sm font-medium">
                  Sign In
                </span> */}
                <svg
                  className="w-4 h-4 hidden md:block"
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
                  {loggedIn ? (
                    <>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Account
                      </Link>
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setShowUserMenu(false);
                          try {
                            localStorage.removeItem('watchshop_auth');
                            document.cookie = 'watchshop_logged_in=; path=/; max-age=0';
                          } catch (_) {}
                          router.push('/login');
                        }}
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist (desktop only) */}
            <Link
              href="/wishlist"
              className="relative inline-flex text-white transition-colors hover:text-red-400"
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
              className="relative text-white transition-colors hover:text-white/80"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>
        {mobileSearchOpen && (
          <div className="md:hidden mt-2 rounded-md border border-gray-200 bg-white p-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
              />
              <svg
                className="h-5 w-5 shrink-0 text-gray-500"
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
            </div>
            {String(searchQuery || "").trim().length > 0 && (
              <div className="mt-2 max-h-72 overflow-y-auto rounded border border-gray-100">
                {relatedKeywords.length > 0 && (
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                      Related keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relatedKeywords.map((keyword, keywordIndex) => (
                        <button
                          key={`${keyword}-${keywordIndex}`}
                          type="button"
                              onClick={() => handleKeywordClick(keyword)}
                          className="rounded bg-gray-100 hover:bg-gray-200 px-2 py-1 text-xs text-gray-700 transition-colors"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.length > 0 ? (
                  searchResults.map((item) => {
                    const { original, discounted, discountPercent } = searchPriceMeta(item);
                    return (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={() => {
                          setMobileSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                      >
                        {searchProductImage(item) ? (
                          <img
                            src={searchProductImage(item)}
                            alt={item?.name || "Product"}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-100" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {item?.name || item?.meta_title || "Product"}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="font-semibold text-gray-800">
                              BDT {discounted.toLocaleString("en-BD")}
                            </span>
                            {discountPercent > 0 && (
                              <>
                                <span className="rounded bg-green-100 px-1 py-0.5 text-[10px] font-semibold text-green-700">
                                  {Math.round(discountPercent)}% OFF
                                </span>
                                <span className="text-gray-400 line-through">
                                  BDT {original.toLocaleString("en-BD")}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-500">No products found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Mobile Menu Dropdown (below main header) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/15 bg-black/50 backdrop-blur-md px-4 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-1 pt-2">
              {navigationItems.map((item, index) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isDropdownOpen = mobileActiveDropdown === index;
                const isBestDealNav = item.href === '/best-deal';

                return (
                  <div
                    key={index}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    {hasSubmenu ? (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileActiveDropdown(
                            isDropdownOpen ? null : index
                          )
                        }
                        className={`flex w-full items-center justify-between py-3 px-2 text-left text-sm font-medium transition-colors ${
                          isBestDealNav
                            ? 'text-red-500 hover:text-red-400'
                            : item.highlight
                              ? 'text-green-300 hover:text-green-200'
                              : 'text-white hover:text-red-400'
                        }`}
                        aria-label={`Toggle ${item.label} submenu`}
                        aria-expanded={isDropdownOpen}
                      >
                        <span className="flex items-center gap-2">
                          {item.label}
                          {isBestDealNav && (
                            <Image
                              src="/images/handshake.gif"
                              alt=""
                              width={22}
                              height={22}
                              className="h-5 w-5 shrink-0 object-contain"
                              unoptimized
                            />
                          )}
                          {item.highlight && !isBestDealNav && <span className="ml-1">🤝</span>}
                        </span>
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
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 py-3 px-2 text-sm font-medium transition-colors ${
                          isBestDealNav
                            ? 'text-red-500 hover:text-red-400'
                            : item.highlight
                              ? 'text-green-300 hover:text-green-200'
                              : 'text-white hover:text-red-400'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isBestDealNav && (
                          <Image
                            src="/images/handshake.gif"
                            alt=""
                            width={22}
                            height={22}
                            className="h-5 w-5 shrink-0 object-contain"
                            unoptimized
                          />
                        )}
                        {item.highlight && !isBestDealNav && <span className="ml-1">🤝</span>}
                      </Link>
                    )}

                    {/* Mobile Submenu */}
                    {hasSubmenu && isDropdownOpen && (
                      <div className="bg-white/5 pb-2">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            onClick={() => {
                              setMobileActiveDropdown(null);
                              setMobileMenuOpen(false);
                            }}
                            className="block py-2 px-6 text-sm text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
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
      {/* {open && (
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
      )} */}
    </header>
  );
}
