import { getDiscountProducts } from '@/stores/ProductAPI'
import Link from 'next/link';
import React from 'react'
import BigButton from './BigButton';
import ProductCard from './ProductCard';

export default async function RecomendedProducts() {
    const {products, brands, categories    } = await getDiscountProducts();
    const items = products.data.slice(0, 9);
  return (
    <div className='text-center p-5'>
        <h1 className='title'>recomended Products</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10'>
            {items.map((item, index) => (
            <ProductCard item={item} key={index} />
            ))}
        </div>
        <Link href={"/product"} className='flex items-center justify-center'>
        <BigButton label="View All Watches" className='mt-10'/>
        </Link>
    </div>
  )
}