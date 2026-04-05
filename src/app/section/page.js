import ProductCard2 from '@/component/ProductCard2';
import { getSectionDetail } from '@/stores/sectionsAPI';
import React from 'react'

export default async function page({searchParams}) {
    const {sectionId} = await searchParams;
    const {section :section} = await getSectionDetail(sectionId);
    const {name, products} = section;
  return (
    <div className='max-w-7xl mx-auto px-2 md:px-0 flex flex-col py-10 md:py-16'>
        <h1 className='title font-semibold'>{name}</h1>
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-x-5 gap-y-10'>
            {products?.map((product) => (
                <ProductCard2 key={product.id} item={product} />
            ))}
        </div>
    </div>
  )
}