"use client";

import { useEffect, useId, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import ProductCard2 from "@/component/ProductCard2";
import "swiper/css";
import "swiper/css/navigation";

export default function ProductSlider({
  items = [],
  sliderId,
  autoplayDelay = 3000,
  slidesPerView = 2,
  spaceBetween = 12,
  breakpoints = {
    640: { slidesPerView: 2, spaceBetween: 16 },
    768: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
  },
  showNavigation = true,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const id = sliderId ?? useId().replace(/:/g, "");
  const prevEl = `${id}-prev`;
  const nextEl = `${id}-next`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!items?.length) return null;
  if (!isMounted) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`${id}-skeleton-${index}`}
            className="rounded-xl border border-gray-200 bg-white p-3"
          >
            <div className="aspect-square w-full rounded-lg bg-gray-200 animate-pulse" />
            <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay]}
        loop
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: `.${prevEl}`,
          nextEl: `.${nextEl}`,
        }}
        breakpoints={breakpoints}
        className="product-slider"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id ?? item.slug}>
            <ProductCard2 item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
      {showNavigation && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            className={`${prevEl} rounded-full border border-gray-300 p-2 hover:bg-gray-100 disabled:opacity-40`}
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className={`${nextEl} rounded-full border border-gray-300 p-2 hover:bg-gray-100 disabled:opacity-40`}
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
