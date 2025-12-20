import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <nav className="fixed top-0 bg-white/10 backdrop-blur-md shadow-md w-full text-gray-600 py-4 text-lg font-medium">
        <div className='flex items-center justify-between gap-x-5 px-10'>
            <div className='flex gap-x-4 text-xs md:text-sm'>
                <Link href="/">Collections</Link>
                <Link href="/">Watch Finder</Link>
                <Link href="/">Learn about SEIKO</Link>
                <Link href="/">Customer Service</Link>
                <Link href="/">Stores</Link>

            </div>
        </div>
    </nav>
  )
}
