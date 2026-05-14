import { getRecommendedProducts } from '@/stores/ProductAPI'
import Link from 'next/link';
import React from 'react'
import BigButton from './BigButton';
import ProductCard2 from './ProductCard2';

export default async function RecomendedProducts({ sectionTitle = 'Recommended' }) {
    // const result = await getDiscountProducts();
    const {page_name, products} = await getRecommendedProducts();
    console.log('Hello world',  await getRecommendedProducts())
    // const {products, brands, categories    } = result || {};
    const items = (products ?? (Array.isArray(products) ? products : [])).slice(0, 6);
  return (
    <div className='text-center p-5 pt-0'>
        <h2 className='title leading-7'>{page_name}</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10'>
            {items.map((item, index) => (
            <ProductCard2 item={item} key={index} />
            ))}
        </div>
        <Link href={"/product"} className='flex items-center justify-center'>
        <BigButton label="View All Watches" className='mt-10'/>
        </Link>
    </div>
  )
}