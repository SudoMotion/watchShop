
import ProductCard2 from '@/component/ProductCard2';
import ProductFilter from '@/component/ProductFilter';
import { useCategoryStore } from '@/stores/categoryStore';
import { getProductsByBrand } from '@/stores/ProductAPI';
import React from 'react'

export async function generateStaticParams() {
  // Minimal static params to satisfy `output: export` build.
  // Add more known brand slugs here if needed.
  return [
    { brandId: 'seiko' },
    { brandId: 'casio' },
    { brandId: 'tissot' },
  ];
}

export default async function page({ params }) {
  const { brandId } = await params;
  const products = await getProductsByBrand(brandId);
  
  const productItems = Array.isArray(products)
  ? products
  : products?.data ?? products?.products ?? [];
  
  console.log('products', products);
  return (
    <div>
      <div className="py-16 flex items-center justify-center" style={{backgroundImage: "url('/images/brand-banner.webp')",}}>
        <div className="text-5xl font-bold bg-gray-400/40 text-white rounded-2xl backdrop-blur-md p-5">
          <span className="capitalize">{brandId}</span>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 mt-2 md:mt-4 px-2'>
        <ProductFilter/>
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 max-h-screen overflow-y-auto">
          {/* Products will be loaded here */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {productItems.map((product, index) => (
              <ProductCard2 item={product} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
