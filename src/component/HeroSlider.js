"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { getHome } from "@/stores/HomeAPI";
import { getSliders } from "@/stores/homeSpecification";
import { NEXT_PUBLIC_API_URL } from "@/config";

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);
  const [sliders, setSliders] = useState([]);

  // 🔑 Prevent Swiper from initializing during hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch sliders data
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await getSliders();
        setSliders(data);
      } catch (error) {
        console.error('Failed to fetch sliders:', error);
      }
    };
    fetchSliders();
  }, []);

  if (!mounted) {
    return (
      <section className="relative w-full h-screen bg-black" />
    );
  }
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        speed={1200}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
        }}
        className="h-full w-full"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            <div className="relative w-full h-screen overflow-hidden">
              {/* Background image */}
              <div
                className="hero-bg absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${NEXT_PUBLIC_API_URL}/${slide.image})` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Content */}
              <div className="relative z-10 flex h-full items-center px-6 md:px-24">
                <div className="text-white max-w-xl">
                  <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base tracking-widest uppercase mb-8">
                    {slide.subtitle}
                  </p>
                  <a
                    href={slide.link}
                    className="inline-block border border-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition"
                  >
                    Discover
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="swiper-pagination" />
      </div>
    </section>
  );
}
