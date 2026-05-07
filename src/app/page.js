import { productList } from '@/_lib/productList';
import { topBrands } from '@/_lib/tobBrands';
import BigButton from '@/component/BigButton';
import HeroSlider from '@/component/HeroSlider';
import ProductCard from '@/component/ProductCard';
import RecomendedProducts from '@/component/Recomended-Products';
import SecoundaryProductSlider from '@/component/SecoundaryProductSlider';
import HomeSeoExpandable from '@/component/HomeSeoExpandable';
import SectionArea from '@/component/SectionArea';
import TwoBanners from '@/component/TwoBanners';
import { Backend_Base_Url } from '@/config';
import { getBannerContent, getHome } from '@/stores/HomeAPI';
import { getTopBrands } from '@/stores/homeSpecification';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import DynamicSection from '@/component/DynamicSection';
import { getNotice, getSections } from '@/stores/sectionsAPI';
import BannerSection from '@/component/BannerSection';

export const dynamic = 'force-dynamic';

export default async function page() {
  const home = await getHome() || {};
  const bannerResponse = await getBannerContent();
  const bannersByType =
    bannerResponse?.banners_by_type ??
    bannerResponse?.data?.banners_by_type ??
    {};
  const stickyBanner = bannersByType?.sticky_banner ?? [];
  const gifBanner = bannersByType?.gif_banner ?? [];
  const {trending_banners, two_banners, discount_products, mens_products, ladies_products, new_arrival} = home;
  const sectionsResponse = await getSections();
  const sections = sectionsResponse?.sections ?? [];
  const firstSection = sections.slice(0, 1);
  const secondSection = sections.slice(1, 2);
  const thirdSection = sections.slice(2, 3);
  const fourthSection = sections.slice(3, 4);
  const remainingSections = sections.slice(4);
  const {notices :notice} = await getNotice();
  const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;
  return (
    <div>
      <HeroSlider/>
      <DynamicSection/>
      
      <BannerSection data={stickyBanner} gifBanner={gifBanner}/>
      <div className='py-5 bg-black text-white px-2'>
        <div className='max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between'>
          <p>Important</p>
          <div>
            {
              notice?.map((item, index)=>(
                <Link className='hover:underline transition-all duration-200' key={index} href={item?.page_link ?? '#'}>{item?.name}</Link>
              ))
            }
          </div>
          <Link href="#" className='text-blue-500 hover:text-blue-700 transition-all duration-200'>More</Link>
        </div>
      </div>
      <SectionArea sections={firstSection} />
      <div className='grid grid-cols-1 md:grid-cols-2 px-2'>
        <SecoundaryProductSlider/>
        <RecomendedProducts/>
      </div>
      <div className='max-w-7xl mx-auto my-10 px-2'>
        <Image placeholder="blur" blurDataURL={blurSvg} src="/images/offer3.webp" className='w-full object-contain' alt="offer1" width={1500} height={1500}/>
      </div>
      <SectionArea sections={secondSection} className="py-0 md:py-0" />
      {/* <div className='max-w-7xl mx-auto my-10 px-2'>
        <h1 className='title'>Trending Now</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {
            two_banners?.map((item, index)=>(
              <Image key={index} placeholder="blur" blurDataURL={blurSvg} src={Backend_Base_Url +'/'+ item?.image} className='w-full md:h-96 object-contain' alt={item.title || ''} width={500} height={500}/>
            ))
          }
        </div>
      </div> */}
      <TwoBanners/>
      <SectionArea sections={thirdSection} className="py-0 md:py-0" />
      <div className='max-w-7xl mx-auto my-10 px-2'>
        <Image placeholder="blur" blurDataURL={blurSvg} src="/images/offer3.webp" className='w-full object-contain' alt="offer1" width={1500} height={1500}/>
      </div>
      <SectionArea sections={fourthSection} className="py-0 md:py-0" />
      <SectionArea sections={remainingSections} className="py-0 md:py-0" />
      <div className='max-w-7xl mx-auto my-10 px-2'>
        <h1 className='title'>Trending Now</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {
            trending_banners?.map((item, index)=>(
              <Image key={index} placeholder="blur" blurDataURL={blurSvg} src={Backend_Base_Url +'/'+ item?.image} className='w-full md:h-96 object-contain' alt={item.title || ''} width={500} height={500}/>
            ))
          }
        </div>
      </div>
      <div className='max-w-7xl mx-auto mb-10 px-2'>
        <h1 className='text-2xl md:text-3xl font-semibold'>WATCHSHOPBD: <Link href="#" className='hover:text-red-600 transition-all duration-200'>LATEST MAGAZINE OF WATCH INDUSTRY</Link></h1>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
          <div className='flex flex-col gap-y-1'>
            <div className='rounded-md overflow-hidden'>
              <Image placeholder="blur" blurDataURL={blurSvg} src="/images/magazine1.jpg" className='w-full object-contain rounded-md hover:scale-110 transition-all duration-300' alt="offer1" width={500} height={400}/>
            </div>
              <p className='text-lg font-medium'>Watch Water Resistance</p>
              <p className='text-xl'>Water Resistance watches in Bangladesh</p>
              <p className='line-clamp-3'>Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w</p>
          </div>
          <div className='flex flex-col gap-y-1'>
            <div className='rounded-md overflow-hidden'>
              <Image placeholder="blur" blurDataURL={blurSvg} src="/images/magazine2.jpg" className='w-full object-contain rounded-md hover:scale-110 transition-all duration-300' alt="offer1" width={500} height={400}/>
            </div>
              <p className='text-lg font-medium'>Watch Water Resistance</p>
              <p className='text-xl'>Water Resistance watches in Bangladesh</p>
              <p className='line-clamp-3'>Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w</p>
          </div>
          <div className='flex flex-col gap-y-1'>
            <div className='rounded-md overflow-hidden'>
              <Image placeholder="blur" blurDataURL={blurSvg} src="/images/magazine3.jpg" className='w-full object-contain rounded-md hover:scale-110 transition-all duration-300' alt="offer1" width={500} height={400}/>
            </div>
              <p className='text-lg font-medium'>Watch Water Resistance</p>
              <p className='text-xl'>Water Resistance watches in Bangladesh</p>
              <p className='line-clamp-3'>Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w</p>
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto mb-10 px-2'>
        <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-[21/9]">
          <iframe className="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/YXCApv8CbzY?si=pSTVmkm-iQnDOu60" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-2'>
        <Image src="/images/payment-method.png" alt="payment-method" width={3000} height={800}/>
      </div>
      <HomeSeoExpandable />
    </div>
  )
}
