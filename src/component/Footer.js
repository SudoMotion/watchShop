import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
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
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
                <img src="/social-media/sns-facebook.svg" alt="" className="w-8 h-8" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                <img src="/social-media/sns-instagram.svg" alt="" className="w-8 h-8" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="X (Twitter)">
                <img src="/social-media/sns-twitter.svg" alt="" className="w-8 h-8" />
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="WhatsApp">
                <img src="/social-media/whatsapp.png" alt="WhatsApp" className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
                <img src="/social-media/sns-youtube.svg" alt="YouTube" className="h-10" />
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
            <h3 className="font-semibold text-lg mb-4 tracking-wide">
              COMPANY US
            </h3>

            <ul className="space-y-2 text-sm">
              <li>Customer Service</li>
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
            <h3 className="font-semibold text-lg mb-4 tracking-wide">
              COMPANY INFO
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>Blog</li>
              <li>Authenticity</li>
              <li>Coupon Code</li>
              <li>Wholesale</li>
              <li>Privacy Policy</li>
              <li>Terms And Conditions</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-wide">
              HELP CENTER
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/order-information">Order Information</Link>
              </li>
              <li>Shipping Information</li>
              <li>International Shipping</li>
              <li>Payment Options</li>
              <li>Pay With BD Taka</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-wide">
              RETURNS & WARRANTY
            </h3>

            <ul className="space-y-2 text-sm">
              <li>Returns & Exchange Policy</li>
              <li>Returns Center</li>
              <li>Warranty Policy</li>
              <li>Warranty Repair Center</li>
            </ul>
          </div>
          {/* Customer Service */}
          <div className='md:col-span-2'>
            <h3 className="font-semibold text-lg mb-3">
              CUSTOMER SERVICE
            </h3>

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


        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-4 flex flex-wrap justify-between text-sm text-gray-300">

          <div className="flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms And Conditions</span>
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
