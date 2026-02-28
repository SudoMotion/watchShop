import Link from "next/link";
import Image from "next/image";
import React from "react";

const OUTLETS = [
  {
    title: "Branch-1",
    content:
      "Shyamoli Square Shopping Mall Level-4, Shop No- 438, 439 Shyamoli, Dhaka, Bangladesh.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=400&fit=crop",
    mapLink: "https://www.google.com/maps/search/Shyamoli+Square+Shopping+Mall+Shyamoli+Dhaka+Bangladesh",
  },
  {
    title: "Branch-2",
    content:
      "Police Plaza Concord Shopping Mall Level-2, Shop No- 261, 262 Gulshan-1, Dhaka, Bangladesh.",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=400&fit=crop",
    mapLink: "https://www.google.com/maps/search/Police+Plaza+Concord+Shopping+Mall+Gulshan+1+Dhaka+Bangladesh",
  },
  {
    title: "Branch-3",
    content:
      "Shimanto Square Shopping Mall Level-2, Shop No- 203 Dhanmondi, Dhaka, Bangladesh.",
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&h=400&fit=crop",
    mapLink: "https://www.google.com/maps/search/Shimanto+Square+Shopping+Mall+Dhanmondi+Dhaka+Bangladesh",
  },
];

export default function OutletsPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">Outlets</span>
        </nav>

        <header className="mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Our Outlets
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Visit us in person to try on watches and get expert advice. All outlets stock authentic timepieces with full warranty.
          </p>
        </header>

        <div className="grid gap-8 md:gap-5 sm:grid-cols-1 lg:grid-cols-3">
          {OUTLETS.map((outlet, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-2 hover:border-teal-200/60"
            >
              <div className="relative aspect-[16/10] w-full bg-gray-200 overflow-hidden">
                <Image
                  src={outlet.image}
                  alt={outlet.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <h2 className="absolute bottom-4 left-4 right-4 text-xl md:text-2xl font-bold text-white drop-shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:scale-[1.02]">
                  {outlet.title}
                </h2>
              </div>
              <div className="p-6 md:p-7 transition-colors duration-300">
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  {outlet.content}
                </p>
                <a
                  href={outlet.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 hover:gap-3 active:scale-100"
                >
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Click Here For Map
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
