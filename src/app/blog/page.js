import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Pagination } from '@/component/Pagination';

// Mock blog data array
const blogPosts = [
  {
    id: 1,
    title: "Solar powered watches",
    excerpt: "Best solar powered watches Brands? In an era where sustainability meets innovation, solar-powered watches are fast becoming the go-to choice for watch enthusiasts and eco-conscious consumers alike. Combining cutting-edge technology with environmental responsibility, these timepieces harness the power of light to keep running indefinitely...",
    image: "/images/1.jpg",
    slug: "solar-powered-watches",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Timeless Innovation: The Legacy and Future of Citizen Watch",
    excerpt: "When it comes to wristwatches that balance cutting-edge technology with timeless design, Citizen stands out as a true pioneer. For over a century, Citizen Watch Co., Ltd. has been at the forefront of horological innovation, creating timepieces that combine precision engineering with elegant aesthetics...",
    image: "/images/2.jpg",
    slug: "citizen-watch-legacy",
    date: "2024-01-10"
  },
  {
    id: 3,
    title: "Automatic Watches",
    excerpt: "Top 10 Automatic Watch Brands 2025. In today's fast-paced digital world, where time is often checked through smartphones or digital screens, automatic watches remain an enduring symbol of precision craftsmanship and mechanical artistry. These self-winding timepieces represent the pinnacle of traditional watchmaking...",
    image: "/images/3.jpg",
    slug: "automatic-watches",
    date: "2024-01-08"
  },
  {
    id: 4,
    title: "Top 10 Luxury Watches-2025",
    excerpt: "Rado, Longines, Hamilton? Top 10 Luxury Watches Brand in Bangladesh 2025. The luxury watch market in Bangladesh continues to evolve, with discerning customers seeking timepieces that combine exceptional craftsmanship, prestigious heritage, and timeless elegance. From Swiss precision to Japanese innovation...",
    image: "/images/4.jpg",
    slug: "top-10-luxury-watches-2025",
    date: "2024-01-05"
  },
  {
    id: 5,
    title: "Seiko Watches",
    excerpt: "Seiko Watch Price in Bangladesh - Latest Collection 2025. Seiko, a name synonymous with Japanese watchmaking excellence, has been producing exceptional timepieces for over a century. Known for their innovation, precision, and outstanding value, Seiko watches have become a favorite among watch enthusiasts in Bangladesh...",
    image: "/images/1.jpg",
    slug: "seiko-watches",
    date: "2024-01-03"
  },
  {
    id: 6,
    title: "Tissot PRX Powermatic 80",
    excerpt: "Why the Tissot PRX Powermatic 80 Is a Must-Have for Watch Lovers. The Tissot PRX Powermatic 80 represents a perfect fusion of retro design aesthetics and modern watchmaking technology. Inspired by the bold, integrated bracelet designs of the 1970s, this timepiece has captured the hearts of watch enthusiasts worldwide...",
    image: "/images/2.jpg",
    slug: "tissot-prx-powermatic-80",
    date: "2024-01-01"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Blog</span>
        </nav>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Blog
        </h1>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full flex flex-col">
                {/* Image */}
                <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="text-xs text-gray-500 mt-auto">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <div>
            <Pagination/>
        </div>
      </div>
    </div>
  );
}

