"use client";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ProductPage() {
  const [mainImg, setMainImg] = useState("/images/mockProduct/1.png");
  const scrollRef = useRef(null);


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

          <p className="text-sm mt-1">Model: XXXXX</p>

          <div className="mt-3">
            <span className="line-through text-sm mr-3">৳56,000.00</span>
            <span className="text-red-600 font-bold text-lg">৳42,000.00</span>
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
            <h2 className="font-semibold mb-3">Product Specifications</h2>

            <div className="grid grid-cols-2 text-sm gap-y-2">
              <p className="font-medium">Brand</p>
              <p>Sample Brand</p>

              <p className="font-medium">Movement</p>
              <p>Automatic</p>

              <p className="font-medium">Case Material</p>
              <p>Stainless Steel</p>

              <p className="font-medium">Water Resistance</p>
              <p>200m</p>

              {/* Add remaining rows the same way */}
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border rounded-xl p-3 text-center">
              <Image
                src="/watch1.png"
                width={160}
                height={160}
                alt="Watch"
                className="mx-auto"
              />
              <p className="mt-2 text-sm font-medium">
                Product Title
              </p>
              <p className="text-red-600 text-sm font-semibold">
                ৳25,000
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
