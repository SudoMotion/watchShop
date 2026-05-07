'use client'

import { Backend_Base_Url } from '@/config'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function BannerSection({ data = [], gifBanner = [] }) {
  const stickyBanner = data?.[0];
  const stickyBannerImage = stickyBanner?.image
    ? (stickyBanner.image.startsWith('http') ? stickyBanner.image : `${Backend_Base_Url}/${stickyBanner.image}`)
    : '/images/beside-video.avif';
  const stickyBannerLink = stickyBanner?.link || '#';
  const gifBannerItem = gifBanner?.[0];
  const gifBannerVideo = gifBannerItem?.image
    ? (gifBannerItem.image.startsWith('http') ? gifBannerItem.image : `${Backend_Base_Url}/${gifBannerItem.image}`)
    : '/intro.mp4';
  const gifBannerLink = gifBannerItem?.link || '#';

  return (
    <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-7 gap-5 mb-10 md:h-[400px] px-2'>
        <div className='col-span-1 md:col-span-4 rounded-md md:rounded-lg overflow-hidden'>
            <Link href={gifBannerLink} className='block h-full w-full'>
              <video preload='true' autoPlay loop muted playsInline className='h-full w-full object-cover'>
              <source src={gifBannerVideo} type="video/mp4" />
              Your browser does not support the video.
              </video>
            </Link>
        </div>
        <div className='col-span-1 md:col-span-3 rounded-md md:rounded-lg overflow-hidden'>
            <Link href={stickyBannerLink} className='block h-full w-full'>
              <Image
                src={stickyBannerImage}
                alt={stickyBanner?.title || 'sticky-banner'}
                width={500}
                height={500}
                className='w-full h-full object-cover'
              />
            </Link>
        </div>
    </div>
  )
}