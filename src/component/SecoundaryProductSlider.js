"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    image: "/images/1.jpg",
    title: "Prospex",
    subtitle: "Keep Going Forward",
    link: "/prospex",
  },
  {
    image: "/images/2.jpg",
    title: "Presage",
    subtitle: "The Beauty of Japanese Craftsmanship",
    link: "/presage",
  },
  {
    image: "/images/3.jpg",
    title: "Astron",
    subtitle: "The World’s First GPS Solar Watch",
    link: "/astron",
  },
];

export default function SecoundaryProductSlider() {
  const [mounted, setMounted] = useState(false);

  // 🔑 Prevent Swiper from initializing during hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative w-full h-screen bg-black" />
    );
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
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
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            <div className="relative w-full h-screen overflow-hidden">
              {/* Background image */}
              <div
                className="hero-bg absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
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
