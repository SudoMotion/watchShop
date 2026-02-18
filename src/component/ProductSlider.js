"use client";

import { useId } from "react";
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
    1280: { slidesPerView: 5, spaceBetween: 24 },
  },
  showNavigation = true,
}) {
  const id = sliderId ?? useId().replace(/:/g, "");
  const prevEl = `${id}-prev`;
  const nextEl = `${id}-next`;

  if (!items?.length) return null;

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
