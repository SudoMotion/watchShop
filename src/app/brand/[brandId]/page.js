import { productList } from '@/_lib/productList';
import ProductCard2 from '@/component/ProductCard2';
import ProductFilter from '@/component/ProductFilter';
import React from 'react'

export default async function page() {
  const data = productList;
  return (
    <div>
      <div className="py-24 flex items-center justify-center" style={{backgroundImage: "url('/images/brand-banner.webp')",}}>
        <div className="text-5xl font-bold bg-gray-400/40 text-white rounded-2xl backdrop-blur-md p-5">
          <span className="capitalize">Param</span>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 mt-2 md:mt-4 px-2'>
        <ProductFilter/>
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 max-h-screen overflow-y-auto">
          {/* Products will be loaded here */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.map((product) => (
              <ProductCard2 item={product}/>
            ))}
            {data.map((product) => (
              <ProductCard2 item={product}/>
            ))}

            {data.map((product) => (
              <ProductCard2 item={product}/>
            ))}
            {data.map((product) => (
              <ProductCard2 item={product}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
