"use client";
import { productList } from "@/_lib/productList";
import ProductCard2 from "@/component/ProductCard2";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ProductPage() {
  const [mainImg, setMainImg] = useState("/images/mockProduct/1.png");
  const scrollRef = useRef(null);
  
  // Product price (in Taka) - replace with actual product data
  const productPrice = 42000; // ৳42,000.00
  const isEmiAvailable = true; // Set based on product data
  
  // Calculate EMI amounts
  const calculateEMI = (price, months, interestRate = 0) => {
    if (interestRate === 0) {
      return Math.round(price / months);
    }
    const monthlyRate = interestRate / 100 / 12;
    const emi = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };
  
  const emi3Months = calculateEMI(productPrice, 3);
  const emi6Months = calculateEMI(productPrice, 6);


  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -120, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 120, behavior: "smooth" });
  };

  const images = [
    "/images/mockProduct/1.png",
    "/images/mockProduct/2.png",
    "/images/mockProduct/3.png",
    "/images/mockProduct/4.png",
    "/images/mockProduct/1.png",
    "/images/mockProduct/2.png",
    "/images/mockProduct/3.png",
    "/images/mockProduct/4.png",
    "/images/mockProduct/1.png",
    "/images/mockProduct/2.png",
    "/images/mockProduct/3.png",
    "/images/mockProduct/4.png",
  ];

  return (
    <div className="w-full bg-white text-gray-800">

      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-10">

        {/* LEFT: IMAGES */}
        <div>
          <div className="border rounded-xl p-5 flex justify-center">
            <Image
              src={mainImg}
              width={400}
              height={400}
              alt="Watch"
              className="object-contain"
            />
          </div>

          <div className="flex items-center gap-3 mt-4">

            {/* LEFT ARROW */}
            <button
                onClick={scrollLeft}
                className="p-2 border rounded-lg hover:bg-gray-100"
            >
                ◀
            </button>

            {/* THUMB ROW */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-hidden"
            >
                {images.map((img, i) => (
                <button
                    key={i}
                    onClick={() => setMainImg(img)}
                    className={`border rounded-lg p-2 min-w-20 ${
                    mainImg === img ? "border-red-500" : "border-gray-300"
                    }`}
                >
                    <Image
                    src={img}
                    width={90}
                    height={90}
                    alt="Thumb"
                    className="w-20 h-20 object-contain"
                    />
                </button>
                ))}
            </div>

            {/* RIGHT ARROW */}
            <button
                onClick={scrollRight}
                className="p-2 border rounded-lg hover:bg-gray-100"
            >
                ▶
            </button>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div>
          <h1 className="text-xl font-semibold">
            Product Title Goes Here
          </h1>

          <div className="mt-3">
            <span className="line-through text-sm mr-3">৳56,000.00</span>
            <span className="text-red-600 font-bold text-lg">৳42,000.00</span>
          </div>

          <p className="text-sm mt-1">Model: XXXXX</p>
          
          {/* EMI Section */}
          <div className="mt-4 border rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            {isEmiAvailable ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-sm text-gray-800">EMI Available</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {/* 3 Months EMI */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="text-xs text-gray-600 mb-1">3 Months EMI</div>
                    <div className="text-lg font-bold text-indigo-600">
                      ৳{emi3Months.toLocaleString('en-US')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per month</div>
                  </div>
                  
                  {/* 6 Months EMI */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="text-xs text-gray-600 mb-1">6 Months EMI</div>
                    <div className="text-lg font-bold text-indigo-600">
                      ৳{emi6Months.toLocaleString('en-US')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per month</div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mt-3 text-center">
                  Interest rate: 0% | Terms & conditions apply
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="font-semibold text-sm text-gray-600">EMI Not Available</span>
              </div>
            )}
          </div>

          <p className="mt-2 text-sm font-medium text-red-500">
            OUT OF STOCK
          </p>

          <div className="mt-6 grid grid-cols-3 gap-5 text-center">
            <div>
              <div className="font-semibold text-sm">100% Authentic</div>
            </div>
            <div>
              <div className="font-semibold text-sm">Fast Delivery</div>
            </div>
            <div>
              <div className="font-semibold text-sm">Secure Checkout</div>
            </div>
          </div>

          {/* SPECS */}
          <div className="mt-8 border rounded-xl p-5">
            <h2 className="text-xl md:text-2xl font-semibold mb-3">To speak an Expert 24/7</h2>
            <h2 className="font-semibold mb-3">WhatsApp us at +8801000000000</h2>

            <div className="grid grid-cols-2 md:grid-cols-2 text-sm gap-2">
              <div className="border rounded-lg overflow-hidden flex items-center justify-center border p-3">
                <Image src="/images/cycle.jpg" alt="Cycle" width={100} height={100} />
              </div>
              <div className="border rounded-lg overflow-hidden flex items-center justify-center border p-3">
                <Image src="/images/cycle.jpg" alt="Cycle" width={100} height={100} />
              </div>
              <div className="border rounded-lg overflow-hidden flex items-center justify-center border p-3">
                <Image src="/images/busket.jpg" alt="Cycle" width={100} height={100} />
              </div>
              <div className="border rounded-lg overflow-hidden flex items-center justify-center border p-3">
                <Image src="/images/warrenty.png" alt="Cycle" width={100} height={100} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-sm leading-relaxed">
          This is placeholder content describing the product. Replace this text
          with your own original description.
        </p>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 mt-10 mb-16">
        <h3 className="font-semibold mb-4 text-center">
          Related Products
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {productList.map((item) => (
            <ProductCard2 item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
