'use client';

import ProductCard2 from '@/component/ProductCard2';
import ProductFilter from '@/component/ProductFilter';
import { useBrandProducts } from '@/hooks/useBrandProducts';
import { useState } from 'react';

export default function BrandPageClient({ brandId }) {
  const [filters, setFilters] = useState({});
  const { products, isLoading, error } = useBrandProducts(brandId, filters);

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
