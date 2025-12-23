import { productList } from '@/_lib/productList';
import { topBrands } from '@/_lib/tobBrands';
import BigButton from '@/component/BigButton';
import HeroSlider from '@/component/HeroSlider';
import ProductCard from '@/component/ProductCard';
import ProductSection from '@/component/ProductSection';
import SecoundaryProductSlider from '@/component/SecoundaryProductSlider';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function page() {
  const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;
  return (
    <div>
      <HeroSlider/>
      <div className='py-10 bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
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
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-7 gap-5 mb-10 md:h-[400px]'>
        <div className='col-span-1 md:col-span-4 rounded-md md:rounded-lg overflow-hidden'>
          <video preload autoPlay loop muted playsInline>
            <source src="/intro.mp4" type="video/mp4" />            
            Your browser does not support the video.
          </video>
        </div>
        <div className='col-span-1 md:col-span-3 rounded-md md:rounded-lg overflow-hidden'>
          <Image src="/images/beside-video.avif" alt="beside-video" width={500} height={500} className='w-full'/>
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
      <ProductSection products={productList} title="New Arrival"/>
      <div className='max-w-7xl mx-auto my-10'>
        <h1 className='title'>Trending Now</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <Image placeholder="blur" blurDataURL={blurSvg} src="/images/offer1.webp" className='w-full h-96 object-cover' alt="offer1" width={500} height={500}/>
          <Image placeholder="blur" blurDataURL={blurSvg} src="/images/offer2.webp" className='w-full h-96 object-cover' alt="offer2" width={500} height={500}/>
        </div>
      </div>
      <ProductSection products={productList} title="MEN'S BEST SELLER"/>
      <div className='max-w-7xl mx-auto my-10'>
        <Image placeholder="blur" blurDataURL={blurSvg} src="/images/offer3.webp" className='w-full h-96 object-cover' alt="offer1" width={1500} height={1500}/>
      </div>
    </div>
  )
}
