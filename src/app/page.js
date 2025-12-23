import { productList } from '@/_lib/productList';
import { topBrands } from '@/_lib/tobBrands';
import BigButton from '@/component/BigButton';
import HeroSlider from '@/component/HeroSlider';
import ProductCard from '@/component/ProductCard';
import SecoundaryProductSlider from '@/component/SecoundaryProductSlider';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function page() {
  return (
    <div>
      <HeroSlider/>
      <div className='py-10 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl md:text-4xl font-bold mb-8'>Top Watch Brands</h2>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 justify-items-center'>
            {topBrands.map((brand, index) => (
              <div key={index} className='flex flex-col items-center p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 w-full'>
                <div className='relative w-full h-16 md:h-20'>
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className='object-contain p-2'
                    // sizes='(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 10vw'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='py-10 bg-black text-white'>
        <div className='max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between'>
          <p>Important</p>
          <div>
            <p>Important Notice regarding Counterfeit and Modified SEIKO watches</p>
            <p>Notice Concerning Succession of Clock Sales Business from Seiko Time Creation Inc.</p>
            <p>[About the "fake accounts" on our official SNS]</p>
          </div>
          <a href="#">More</a>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <SecoundaryProductSlider/>
        <div className='text-center p-5'>
          <h1 className='title'>Recommend</h1>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10'>
              {productList.map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
          </div>
          <div className='flex items-center justify-center'>
            <BigButton label="View All Watches" className='mt-10'/>
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto'>
        <h1 className='title'>Category</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10'>
          <Link href={'#'}>hello</Link>
        </div>
      </div>
    </div>
  )
}
