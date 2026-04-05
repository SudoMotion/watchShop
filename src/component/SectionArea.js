import { getSections } from '@/stores/sectionsAPI';
import React from 'react'
import ProductCard2 from './ProductCard2';
import Link from 'next/link';

export default async function SectionArea() {
    const {sections :sections} = await getSections();
    console.log('sections', sections);
  return (
    <div className='max-w-7xl mx-auto px-2 md:px-0 flex flex-col gap-y-16 md:gap-y-20 py-10 md:py-16'>
        {
            sections.map((section) => (
                <div key={section.id}>
                    <h1 className='title font-semibold md:mb-5'>{section.name}</h1>
                    <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-x-5 gap-y-10'>
                        {section.products.map((product) => (
                            <ProductCard2 key={product.id} item={product} />
                        ))}
                    </div>
                    <div className='flex items-center justify-end mt-5'>
                        <Link href={`/section?sectionId=${section.id}`} className='px-8 py-2 border border-gray-500 mx-auto text-base md:text-lg font-medium'>See More</Link>
                    </div>
                </div>
            ))
        }
    </div>
  )
}