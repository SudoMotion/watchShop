import React from 'react'
import { getTwoBanners } from '@/stores/homeSpecification';
import Image from 'next/image';
import { Backend_Base_Url } from '@/config';
import Link from 'next/link';

export default async function TwoBanners() {
    const two_banners = await getTwoBanners();
    const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;

  return (
    <div className='max-w-7xl mx-auto my-10 px-2'>
        <h1 className='title'>Trending Now</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {
            two_banners?.map((item, index)=>(
              <Link href={item?.page_link ?? '#'}>
                <Image key={index} placeholder="blur" blurDataURL={blurSvg} src={Backend_Base_Url +'/'+ item?.image} className='w-full md:h-96 object-contain' alt={item.title || ''} width={500} height={500}/>
              </Link>
            ))
          }
        </div>
      </div>
  )
}