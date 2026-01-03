import Link from 'next/link';
import React from 'react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">About Us</span>
        </nav>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          ABOUT US
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          About Watch Shop BD
        </h2>

        {/* Introductory Paragraph */}
        <p className="text-gray-900 mb-8 leading-relaxed">
          <span className='font-semibold text-lg'>Md Mahbubur Rahman</span> that mean's me as a Owner and CEO of watch Shop-BD. Watch Shop-BD is number one retail watch business company of watches in Bangladesh. A business passion by trade and I turned my passion for watches into a new career in 2010 by founding watchshop-bd, originally beginning with only a modest selection of Swiss wristwatches. Those first watches ranged in price from only 800 taka to 20,000 taka at a time when the market for fine timepieces was not well understood or avidly followed. Yet I always made the decision to not follow fashion and to avoid trends, remaining devoted to exquisite design and timeless craftsmanship by the most prestigious manufacturers.
        </p>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1: Discover Quality Timepieces */}
          <section>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Discover Quality Timepieces and Financial Services at Watch Shop BD and Shymoli Square</h3>
            <p className="text-gray-900 leading-relaxed mb-4">
              At Watch Shop BD, we pride ourselves on offering a premier selection of watches to suit every taste and budget. Our online store is dedicated to providing customers with a diverse range of timepieces, from luxury brands to affordable everyday options. Whether you're searching for a classic Rolex, a trendy Michael Kors, or a functional Casio, our extensive collection ensures that you'll find the perfect watch to complement your style. We prioritize customer satisfaction by offering a seamless shopping experience with detailed product descriptions, high-resolution images, and secure payment options. Enjoy the convenience of browsing and purchasing from the comfort of your home, with prompt delivery and exceptional customer service to enhance your shopping journey.
            </p>
          </section>

          {/* Section 2: Physical Store at Shymoli Square */}
          <section>
            <p className="text-gray-900 leading-relaxed mb-4">
              In addition to our online presence, we also have a physical store located at Shymoli Square, Dhaka. Shymoli Square is not just a financial hub but also a bustling commercial area known for its variety of shops and services. Our physical store in this vibrant location offers the same quality and selection as our online shop, with the added benefit of in-person assistance. Here, you can experience the watches firsthand, receive personalized advice from our knowledgeable staff, and enjoy a more interactive shopping experience. Whether you're looking to make a significant investment in a high-end watch or simply exploring options, our team at Shymoli Square is ready to help you find exactly what you need.
            </p>
          </section>
        </div>

        {/* Concluding Paragraph */}
        <p className="text-gray-900 mt-8 leading-relaxed">
          Both Watch Shop BD online and our Shymoli Square location are committed to delivering excellence in both products and service. Explore our offerings today and find out why we are a trusted name in the watch industry and beyond.
        </p>
      </div>
    </div>
  );
}

