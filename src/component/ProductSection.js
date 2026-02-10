import React from 'react'
import ProductCard2 from './ProductCard2'
import Link from 'next/link'

export default function ProductSection({title, products}) {
  return (
    <div className='max-w-7xl mx-auto'>
        <h1 className='title'>{title}</h1>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10'>
            {products?.map((product, index) => (
                <ProductCard2 key={index} item={product} />
            ))}
        </div>
        <div className='flex items-center justify-center my-3'> 
          <Link href={`/product`} className='px-8 py-2 border border-gray-500 rounded mx-auto text-base md:text-lg font-medium'>See More</Link>
        </div>
    </div>
  )
}