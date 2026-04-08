'use client';

import Link from 'next/link';
import { useState } from 'react';

const WHY_ITEMS = [
  {
    n: '1',
    title: 'Diverse Selection',
    text: 'From luxury to budget-friendly, we offer the widest selection of authentic watches in Bangladesh.',
  },
  {
    n: '2',
    title: 'Authenticity Guaranteed',
    text: 'Every watch we sell is 100% genuine, sourced directly from authorized dealers and manufacturers.',
  },
  {
    n: '3',
    title: 'Competitive Pricing',
    text: 'We offer the most competitive prices in Bangladesh, with regular promotions and discounts.',
  },
  {
    n: '4',
    title: 'Expert Customer Service',
    text: 'Our knowledgeable team is always ready to assist you in finding the perfect watch.',
  },
  {
    n: '5',
    title: 'Secure and Convenient Shopping',
    text: 'Enjoy a seamless online shopping experience with secure payment options and fast delivery across Bangladesh.',
  },
];

export default function HomeSeoExpandable() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-2 pb-8">
      <h1>Find the Best Watch Price in Bangladesh – 100% Genuine Watches</h1>
      <p>
        Welcome to{' '}
        <Link href="/" className="font-semibold text-blue-800">
          WatchShop BD
        </Link>
        , your ultimate destination for premium timepieces in Bangladesh.
        Whether you&apos;re looking for a sophisticated accessory for a formal
        event, a casual watch for everyday wear, or a special gift for a loved
        one, we have the perfect collection to meet your needs. Our goal is to
        bring you a diverse range of high-quality, authentic watches from
        renowned international brands, offering unparalleled value, style, and
        reliability.
      </p>
      <Link href="/" className="font-semibold text-blue-800 inline-block mt-2">
        The Best Place to Find Your Ideal Watch
      </Link>
      <p className="mt-4">
        At WatchShop BD, we understand that a{' '}
        <Link href="/best-deal" className="font-semibold">
          watch
        </Link>{' '}
        is more than just a tool for telling time. It is a statement of personal
        style, a reflection of your character, and often a lifelong companion.
        That&apos;s why we take great pride in offering a wide variety of
        watches, ensuring that everyone can find the perfect timepiece,
        whether you&apos;re a connoisseur of fine watches or just beginning to
        explore the world of horology.
      </p>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`pt-2 transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h2 className="text-2xl font-semibold mt-8">
              Dive into Adventure with Premium Divers Watches
            </h2>
            <p className="mt-4">
              Discover the perfect blend of functionality and style with premium
              divers&apos; watches from renowned brands like Omega, Oris, Seiko,
              Citizen, TAG Heuer, Tudor, Longines, and Casio G-shock. Engineered
              for underwater exploration, these timepieces offer water resistance
              up to impressive depths, luminous dials for low-light visibility,
              and rugged durability for extreme conditions. Ideal for professional
              divers and enthusiasts alike, our collection features watches
              renowned for precision and innovation. Elevate your adventures with
              a diver&apos;s watch that&apos;s built to perform and designed to
              impress. The{' '}
              <Link href="/best-deal" className="font-semibold text-blue-800">
                top 10 watch brands in Bangladesh
              </Link>{' '}
              are available now at WatchShop BD.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              Luxury Watches and Premium Brands
            </h2>
            <p className="mt-4">
              For those seeking luxury and exclusivity, explore collections from
              Rado, Tissot, Hamilton, Tudor, Oris, Frederique Constant, and many
              more. These brands represent the pinnacle of Swiss-made craftsmanship
              and timeless elegance. Whether it&apos;s the intricate details of a
              RADO or the bold designs of TISSOT, our premium and luxury watch
              selection offers something extraordinary for watch connoisseurs.
              On the other hand, unlike most brands, the{' '}
              <Link href="/brand/seiko" className="font-semibold text-blue-800">
                Seiko watch price in Bangladesh
              </Link>{' '}
              has spread much more conveniently, accessible for a wide range of
              customers.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              Sports Watches and Durable Timepieces
            </h2>
            <p className="mt-4">
              Our sports watch and top brand watch collections include
              shock-resistant models like G-Shock G-Steel, rugged dive watches,
              and more designed for active lifestyles. These timepieces combine
              reliability, durability, and cutting-edge design. Perfect for
              outdoor adventures, sports, or everyday wear, these{' '}
              <span className="font-semibold">Watch Shop BD</span> watches offer
              unparalleled functionality.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              More Than Just Watches
            </h2>
            <p className="mt-4">
              At WatchShop BD, we&apos;re more than a watch retailer. Explore our
              range of men&apos;s and ladies&apos; fashion, gift items, and
              special deals for every occasion.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              Affordable and Stylish Watch Options
            </h2>
            <p className="mt-4">
              At{' '}
              <Link href="/" className="font-semibold text-blue-800">
                WatchShop BD
              </Link>
              , we believe that style and quality should be accessible to
              everyone. Our collection includes a wide range of affordable yet
              stylish watches that don&apos;t compromise on quality or design.
              Whether you&apos;re looking for a classic timepiece or a modern
              smartwatch, we have options to suit every budget.
            </p>

            <h3 className="text-xl font-semibold mt-6">
              Watch for Men: Style, Functionality, and Durability
            </h3>
            <p className="mt-2">
              Our men&apos;s watch collection combines style, functionality, and
              durability. From sleek dress watches to rugged sports models, each
              timepiece is designed to complement the modern man&apos;s lifestyle.
              Features like water resistance, chronograph functions, and premium
              materials ensure that our watches are as practical as they are
              stylish.
            </p>

            <h3 className="text-xl font-semibold mt-6">
              Ladies Watch Collection: Elegance and Sophistication
            </h3>
            <p className="mt-2">
              Discover our exquisite collection of ladies&apos; watches that
              blend elegance with modern design. From delicate minimalist pieces
              to bold statement watches, our collection features timepieces that
              reflect your unique style. Many of our women&apos;s watches also
              include practical features like date displays and water resistance.
            </p>

            <h2 className="text-2xl font-semibold mt-8">
              Why Choose WatchShop BD?
            </h2>
            <div className="space-y-6 mt-6">
              {WHY_ITEMS.map((item) => (
                <div key={item.n} className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 font-medium">
                    {item.n}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mt-12">
              Shop with Confidence at WatchShop BD
            </h2>
            <p className="mt-4">
              Your satisfaction is our top priority. We offer a comprehensive
              warranty on all our watches, easy returns, and excellent after-sales
              service. Whether you&apos;re shopping for yourself or looking for
              the perfect gift, you can trust WatchShop BD to provide quality,
              style, and value.
            </p>
            <p className="mt-4">
              Explore our collections today and discover why we&apos;re the
              preferred destination for watch enthusiasts across Bangladesh.
              Experience the perfect blend of tradition and innovation with every
              timepiece from WatchShop BD.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-6 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-expanded={expanded}
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}
