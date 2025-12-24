"use client";
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Header() {
    const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 bg-black/40 backdrop-blur-md shadow-md w-full text-gray-100 py-4 text-lg font-medium z-50">
        <div className='flex items-center justify-between gap-x-5 md:px-10'>
            <div className='flex items-center gap-x-6 text-xs md:text-sm font-semibold'>
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={120} height={120} />
                </Link>
                <div className={`flex flex-col md:flex-row gap-x-6 gap-y-3 whitespace-nowrap absolute top-[101%] bg-white text-gray-600 md:text-gray-100 backdrop-blur-md md:bg-transparent md:backdrop-blur-none w-full ${open ? 'left-0' : '-left-[500px]'} transition-all duration-150 p-3 shadow-md md:shadow-none md:static bg-white`} style={{zIndex: 998}}>
                    <Link href="/">Collections</Link>
                    <Link href="/">Watch Finder</Link>
                    <Link href="/">Learn about SEIKO</Link>
                    <Link href="/">Customer Service</Link>
                    <Link href="/">Stores</Link>
                </div>
                
            </div>
            <div className='hidden'>
                <Link href={'#'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
                </Link>
                <Link href={'#'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </Link>
            </div>
            <button onClick={() => setOpen(!open)} className='md:hidden'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
            </button>
            <div className='md:flex items-center gap-x-3 hidden'>
                <label className='flex items-center border rounded pl-2 text-xs md:text-sm overflow-hidden'>
                    <input type="text" name="" id="" placeholder='Search' className='py-1 bg-transparent border-none focus:outline-none' />
                    <button className='px-2 py-1 bg-gray-200'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
                    </button>
                </label>
                <Link href={'#'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
                </Link>
                <Link href={'#'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </Link>
            </div>
        </div>
    </nav>
  )
}
