import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <nav className="bg-white text-gray-600 py-4 text-lg font-medium flex items-center justify-center gap-x-5">
        <Link href="/">Men's Watch</Link>
    </nav>
  )
}
