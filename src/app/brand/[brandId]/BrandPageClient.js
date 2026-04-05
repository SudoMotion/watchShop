'use client';

import ProductCard2 from '@/component/ProductCard2';
import ProductFilter from '@/component/ProductFilter';
import { useBrandProducts } from '@/hooks/useBrandProducts';
import { useState } from 'react';

const SORT_OPTIONS = [
  { value: '', label: 'Default (newest / stock first)' },
  { value: 'priceLowtoHigh', label: 'Price: Low to High' },
  { value: 'priceHightoLow', label: 'Price: High to Low' },
  { value: 'nameAtoZ', label: 'Name: A → Z' },
  { value: 'nameZtoA', label: 'Name: Z → A' },
];

export default function BrandPageClient({ brandId }) {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const { products, isLoading, error } = useBrandProducts(brandId, filters, sortBy);

  return (
    <div>
      <div
        className="py-16 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/brand-banner.webp')" }}
      >
        <div className="text-5xl font-bold bg-gray-400/40 text-white rounded-2xl backdrop-blur-md p-5">
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
          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading products…</p>
          ) : (
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
