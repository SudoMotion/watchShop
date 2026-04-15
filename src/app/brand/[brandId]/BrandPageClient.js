'use client';

import ProductCard2 from '@/component/ProductCard2';
import ProductFilter from '@/component/ProductFilter';
import { ProductGridSkeleton } from '@/component/ProductGridSkeleton';
import { EmptyProducts } from '@/component/EmptyProducts';
import { useBrandProducts } from '@/hooks/useBrandProducts';
import { NEXT_PUBLIC_API_URL } from '@/config';
import { useEffect, useState } from 'react';

const SORT_OPTIONS = [
  { value: '', label: 'Default (newest / stock first)' },
  { value: 'priceLowtoHigh', label: 'Price: Low to High' },
  { value: 'priceHightoLow', label: 'Price: High to Low' },
  { value: 'nameAtoZ', label: 'Name: A → Z' },
  { value: 'nameZtoA', label: 'Name: Z → A' },
];
const FALLBACK_BANNER_URL = '/images/brand-banner.webp';

export default function BrandPageClient({ brandId }) {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [displayBannerUrl, setDisplayBannerUrl] = useState('');
  const { products, banner_img, isLoading, error } = useBrandProducts(
    brandId,
    filters,
    sortBy
  );
  const bannerUrl = banner_img
    ? banner_img.startsWith('http')
      ? banner_img
      : `${NEXT_PUBLIC_API_URL}/${String(banner_img).replace(/^\//, '')}`
    : '';

  useEffect(() => {
    let active = true;

    const preload = (url, allowFallback) => {
      if (!url) {
        setDisplayBannerUrl('');
        setBannerLoaded(true);
        return;
      }
      setDisplayBannerUrl(url);
      setBannerLoaded(false);

      const img = new window.Image();
      img.onload = () => {
        if (active) setBannerLoaded(true);
      };
      img.onerror = () => {
        if (!active) return;
        if (allowFallback) {
          preload(FALLBACK_BANNER_URL, false);
          return;
        }
        setBannerLoaded(true);
      };
      img.src = url;
    };

    if (bannerUrl) {
      preload(bannerUrl, true);
    } else if (!isLoading) {
      preload(FALLBACK_BANNER_URL, false);
    } else {
      setDisplayBannerUrl('');
      setBannerLoaded(true);
    }

    return () => {
      active = false;
    };
  }, [bannerUrl, isLoading]);

  return (
    <div>
      <div
        className="relative py-16 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: displayBannerUrl ? `url('${displayBannerUrl}')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!bannerLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <div className="relative z-10 text-5xl font-bold bg-gray-400/40 text-white rounded-2xl backdrop-blur-md p-5">
          <span className="capitalize">{brandId}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:mt-4 px-2 mt-2">
        <ProductFilter brandId={brandId} filters={filters} setFilters={setFilters} />
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4">
            <label htmlFor="brand-sort" className="text-sm font-medium text-gray-700 shrink-0">
              Sort by
            </label>
            <select
              id="brand-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value || 'default'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}
          {isLoading && <ProductGridSkeleton />}
          {!isLoading && !error && products.length === 0 && (
            <EmptyProducts
              title="No products found"
              description="Try adjusting filters or sort. You can also explore other brands from the home page."
              actionLabel="Continue shopping"
              actionHref="/"
            />
          )}
          {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((product, index) => (
                <ProductCard2 item={product} key={product?.id ?? index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
