import { getDiscountProducts } from '@/stores/ProductAPI'
import Link from 'next/link';
import React from 'react'
import BigButton from './BigButton';
import ProductCard from './ProductCard';

export default async function RecomendedProducts() {
    const result = await getDiscountProducts();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Recomended-Products.js:RecomendedProducts',message:'getDiscountProducts result',data:{resultIsNull:result==null,hasProducts:result?.products!=null,hasProductsData:result?.products?.data!=null},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    const {products, brands, categories    } = result || {};
    const items = (products?.data ?? (Array.isArray(products) ? products : [])).slice(0, 9);
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