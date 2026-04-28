import { getSections } from '@/stores/sectionsAPI';
import React from 'react'
import ProductCard2 from './ProductCard2';
import Link from 'next/link';
import ProductSlider from './ProductSlider';

export default async function SectionArea({ sections: sectionProp, className = '' }) {
    const fetchedResponse = sectionProp ? null : await getSections();
    const sections = Array.isArray(sectionProp)
        ? sectionProp
        : (fetchedResponse?.sections ?? []);
    
    const isSliderEnabled = (section) => {
        const flag = section?.is_slider ?? section?.is_slide;
        if (typeof flag === "boolean") return flag;
        if (typeof flag === "number") return flag === 1;
        const normalized = String(flag ?? "").trim().toLowerCase();
        return normalized === "yes" || normalized === "true" || normalized === "1";
    };
    if (sections.length === 0) return null;
  return (
    <div className={`max-w-7xl mx-auto px-2 md:px-0 flex flex-col gap-y-16 md:gap-y-20 py-10 md:py-16 ${className}`.trim()}>
        {
            sections?.map((section) => (
                <div key={section.id}>
                    <h1 className='title font-semibold md:mb-5'>{section.name}</h1>
                    {isSliderEnabled(section) ? (
                        <ProductSlider
                            items={section?.products ?? []}
                            sliderId={`section-${section.id}`}
                        />
                    ) : (
                        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-x-5 gap-y-10'>
                            {(section?.products ?? []).slice(0, 16).map((product) => (
                                <ProductCard2 key={product.id} item={product} />
                            ))}
                        </div>
                    )}
                    <div className='flex items-center justify-end mt-5'>
                        <Link href={`/section?sectionId=${section.id}`} className='px-8 py-2 border border-gray-500 mx-auto text-base md:text-lg font-medium'>See More</Link>
                    </div>
                </div>
            ))
        }
    </div>
  )
}