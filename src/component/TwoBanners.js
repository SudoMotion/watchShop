'use client';

import React, { useEffect } from 'react';
import { getTwoBanners } from '@/stores/homeSpecification';
import Image from 'next/image';
import { Backend_Base_Url } from '@/config';
import useHomeStore from '@/stores/useHomeStore';

export default function TwoBanners() {
    const twoBanners = useHomeStore((state) => state.twoBanners);
    const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;
    useEffect(() => {
      if (twoBanners.length > 0) return;
      getTwoBanners().catch(() => {});
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TwoBanners.js:useEffect',message:'requested two banners load',data:{currentCount:twoBanners.length},timestamp:Date.now(),hypothesisId:'H-Z2'})}).catch(()=>{});
      // #endregion
    }, [twoBanners.length]);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TwoBanners.js:render',message:'render with zustand data',data:{count:twoBanners.length},timestamp:Date.now(),hypothesisId:'H-Z3'})}).catch(()=>{});
    // #endregion

  return (
    <div className='max-w-7xl mx-auto my-10 px-2'>
        <h1 className='title'>Trending Now</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {
            twoBanners?.map((item, index)=>(
              <Image key={index} placeholder="blur" blurDataURL={blurSvg} src={Backend_Base_Url +'/'+ item?.image} className='w-full md:h-96 object-contain' alt={item.title || ''} width={500} height={500}/>
            ))
          }
        </div>
      </div>
  )
}