import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='bg-black'>
        <div className='bg-[#1a1a1a] w-full py-5 md:py-16 flex items-center justify-center'>
            <Link href={'/'} className='border px-32 py-4 border-white text-white hover:bg-[#193c72]'>Contact</Link>
        </div>
        <div className='max-w-6xl mx-auto text-white py-3 md:py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
            <div className='flex flex-col gap-y-3 border-r border-gray-600'>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>COMPANY</Link>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>NEWS</Link>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>For the Media</Link>
            </div>
            <div className='flex flex-col gap-y-3'>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Accessibility</Link>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Requirement</Link>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Internet Purchase</Link>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Warning</Link>
            </div>
            <div className='flex flex-col gap-y-3'>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Modern Slavery Act</Link>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Transparency Statement</Link>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Privacy Policy</Link>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Cookie Policy</Link>
            </div>
            <div className='flex flex-col gap-y-3'>
                <Link href={'/'} className='font-semibold hover:text-gray-300'>Sitemap</Link>
            </div>
        </div>
        <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-end gap-5'>
                <a href="#">
                    <img src="/social-media/sns-youtube.svg" alt="" className='h-10' />
                </a>
            </div>
        </div>
    </div>
  )
}
