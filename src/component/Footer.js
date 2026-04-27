"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Footer() {
  const [openSections, setOpenSections] = useState({
    companyUs: false,
    companyInfo: false,
    helpCenter: false,
    returnsWarranty: false,
    customerService: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="bg-black text-white pt-10 px-2 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className='flex flex-col md:flex-row justify-between gap-y-5'>
          <div>
            <h1 className="text-4xl font-bold">Watch Shop BD</h1>
            <p className="mt-3 text-sm">Since 2014</p>
            <p className="mt-2 text-sm font-semibold">Never pay Retail ®</p>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full hover:opacity-80 transition-opacity" aria-label="Facebook">
                <img src="/social-media/facebook.png" alt="" className="w-8 h-8" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-full hover:opacity-80 transition-opacity" aria-label="Instagram">
                <img src="/social-media/instagram.png" alt="" className="w-8 h-8" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="rounded-full hover:opacity-80 transition-opacity" aria-label="X (Twitter)">
                <img src="/social-media/x.png" alt="" className="w-8 h-8" />
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="rounded-full hover:opacity-80 transition-opacity" aria-label="WhatsApp">
                <img src="/social-media/whatsapp.png" alt="WhatsApp" className="w-8 h-8 rounded-full" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="rounded-full overflow-hidden hover:opacity-80 transition-opacity" aria-label="YouTube">
                <img src="/social-media/youtube.jpeg" alt="YouTube" className="h-10" />
              </a>
            </div>

            {/* App Buttons */}
            <div className="flex space-x-3 mt-5">
              <Image src="/images/app-store.png" alt="App Store" height={30} width={100} className="w-28" />
              <Image src="/images/google-play.png" alt="Google Play" height={30} width={100} className="w-28" />
            </div>
          </div>
          {/* Newsletter */}
          <div className="md:text-right my-5">
            <p className="text-sm">
              Subscribe for exclusive offers
            </p>

            <div className="flex bg-white mt-3 rounded-full overflow-hidden w-full md:w-[380px] ml-auto">
              <input
                type="text"
                placeholder="Enter your email or phone"
                className="px-4 py-2 w-full text-black outline-none"
              />
              <button className="bg-black px-5 text-sm">
                Subscribe
              </button>
            </div>

            <p className="text-xs mt-2 text-gray-300">
              By subscribing you agree with our Privacy Policy
            </p>
          </div>

        </div>
        {/* Top Main Grid */}
        <div className="grid md:grid-cols-6 gap-10 my-8">

          {/* Logo + Social */}

          {/* Column 1 */}
          <div>
            <div className="flex items-center justify-between md:block">
              <h3 className="font-semibold text-lg tracking-wide">
                COMPANY US
              </h3>
              <button
                type="button"
                onClick={() => toggleSection('companyUs')}
                className="md:hidden text-gray-300 hover:text-white"
                aria-label="Toggle COMPANY US links"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${openSections.companyUs ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <ul
              className={`
                space-y-2 text-sm
                overflow-hidden transition-all duration-300 ease-in-out
                ${openSections.companyUs ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'}
                md:max-h-none md:opacity-100 md:mt-3 md:block
              `}
            >
              <li>
                <Link href="/customer-service">Customer Service</Link>
              </li>
              <li>Order Status</li>
              <li>Update Your Email Preference</li>
              <li>Trade-In Your Watch</li>
              <li>Sell My Ready</li>
              <li>Sell My Watch</li>
              <li>Become a Vendor</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <div className="flex items-center justify-between md:block">
              <h3 className="font-semibold text-lg tracking-wide">
                COMPANY INFO
              </h3>
              <button
                type="button"
                onClick={() => toggleSection('companyInfo')}
                className="md:hidden text-gray-300 hover:text-white"
                aria-label="Toggle COMPANY INFO links"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${openSections.companyInfo ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <ul
              className={`
                space-y-2 text-sm
                overflow-hidden transition-all duration-300 ease-in-out
                ${openSections.companyInfo ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'}
                md:max-h-none md:opacity-100 md:mt-3 md:block
              `}
            >
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/authenticity">Authenticity</Link>
              </li>
              <li>
                <Link href="/physical-store">Physical Store</Link>
              </li>
              <li>Coupon Code</li>
              <li>Wholesale</li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">Terms And Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <div className="flex items-center justify-between md:block">
              <h3 className="font-semibold text-lg tracking-wide">
                HELP CENTER
              </h3>
              <button
                type="button"
                onClick={() => toggleSection('helpCenter')}
                className="md:hidden text-gray-300 hover:text-white"
                aria-label="Toggle HELP CENTER links"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${openSections.helpCenter ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <ul
              className={`
                space-y-2 text-sm
                overflow-hidden transition-all duration-300 ease-in-out
                ${openSections.helpCenter ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'}
                md:max-h-none md:opacity-100 md:mt-3 md:block
              `}
            >
              <li>
                <Link href="/order-information">Order Information</Link>
              </li>
              <li>
                <Link href="/shipping-information">Shipping Information</Link>
              </li>
              <li>
                <Link href="/fastest-delivery">Fastest Delivery</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>International Shipping</li>
              <li>Payment Options</li>
              <li>Pay With BD Taka</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <div className="flex items-center justify-between md:block">
              <h3 className="font-semibold text-lg tracking-wide">
                RETURNS & WARRANTY
              </h3>
              <button
                type="button"
                onClick={() => toggleSection('returnsWarranty')}
                className="md:hidden text-gray-300 hover:text-white"
                aria-label="Toggle RETURNS & WARRANTY links"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${openSections.returnsWarranty ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <ul
              className={`
                space-y-2 text-sm
                overflow-hidden transition-all duration-300 ease-in-out
                ${openSections.returnsWarranty ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'}
                md:max-h-none md:opacity-100 md:mt-3 md:block
              `}
            >
              <li>
                <Link href="/return-policy">Returns & Exchange Policy</Link>
              </li>
              <li>
                <Link href="/return-policy">Returns Center</Link>
              </li>
              <li>
                <Link href="/warranty-policy">Warranty Policy</Link>
              </li>
              <li>Warranty Repair Center</li>
            </ul>
          </div>
          {/* Customer Service */}
          <div className='md:col-span-2'>
            <div className="flex items-center justify-between md:block">
              <h3 className="font-semibold text-lg mb-3">
                CUSTOMER SERVICE
              </h3>
              <button
                type="button"
                onClick={() => toggleSection('customerService')}
                className="md:hidden text-gray-300 hover:text-white"
                aria-label="Toggle CUSTOMER SERVICE content"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${openSections.customerService ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${openSections.customerService ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}
                md:max-h-none md:opacity-100 md:mt-0 md:block
              `}
            >
            <p className="text-sm">
              💬 Chat or Call :- +88 01720392824 /
            </p>
            <p className="text-sm mb-3">
              +88 01939418800
            </p>

            <p className="font-semibold text-sm">Branch-1</p>
            <p className="text-sm">
              📍 Shyamoli Square Shopping Mall Level-4, Shop
              No- 438, 439 Shyamoli, Dhaka ,Bangladesh.( Click
              Here For Map )
            </p>

            <p className="font-semibold mt-3 text-sm">Branch-2</p>
            <p className="text-sm">
              📍 Police Plaza Concord Shopping Mall Level-2, shop
              No- 261, 262 Gulshan-1, Dhaka ,Bangladesh.( Click
              Here For Map )
            </p>

            <p className="font-semibold mt-3 text-sm">Branch-3</p>
            <p className="text-sm">
              📍 Shimanto Square shopping Mall Level-2, Shop
              No- 203 Dhanmondi, Dhaka ,Bangladesh.( Click
              Here For Map )
            </p>
            </div>
          </div>
        </div>


        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-4 flex flex-wrap justify-between text-sm text-gray-300">

          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms And Conditions</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <span>Careers</span>
          </div>

          <p>
            Copyright © 2014 - 2025 WATCHSHOP BD
          </p>
        </div>

      </div>
    </footer>
  )
}
