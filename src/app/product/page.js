import ProductCard2 from '@/component/ProductCard2';
import { getAllProducts } from '@/stores/ProductAPI';
import React from 'react'

export default async function page() {
    const {data: products} = await getAllProducts();
  return (
    <div className='max-w-7xl mx-auto py-5'>
        <h1 className='title'>All Products</h1>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10'>
            {products?.map((product, index) => (
                <ProductCard2 key={index} item={product} />
            ))}
        </div>
        <div className='flex items-center justify-center my-3'>
          <button className='px-8 py-2 border border-gray-500 rounded mx-auto text-base md:text-lg font-medium'>See More</button>
        </div>
    </div>
  )
}