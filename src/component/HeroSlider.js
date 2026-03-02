"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { getHome } from "@/stores/HomeAPI";
import { getMobileSliders, getSliders } from "@/stores/homeSpecification";
import { NEXT_PUBLIC_API_URL } from "@/config";

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);
  const [sliders, setSliders] = useState([]);
  const [mobileSliders, setMobileSliders] = useState([]);
  // 🔑 Prevent Swiper from initializing during hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch sliders data
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await getSliders();
        const mobileData = await getMobileSliders();
        setSliders(data);
        setMobileSliders(mobileData);
      } catch (error) {
        console.error('Failed to fetch sliders:', error);
      }
    };
    fetchSliders();
  }, []);

  if (!mounted) {
    return <section className="relative w-full h-[60vh] md:h-screen bg-black" />;
  }

  const desktopSlides = sliders;
  const phoneSlides = mobileSliders.length ? mobileSliders : sliders;

  return (
    <section className="relative w-full h-[60vh] md:h-screen overflow-hidden">
      {/* Desktop / large screens */}
      <div className="hidden md:block h-full">
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
          {desktopSlides.map((slide, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <div className="relative w-full h-full overflow-hidden">
                <div
                  className="hero-bg absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${NEXT_PUBLIC_API_URL}/${slide.image})` }}
                />
                <div className="absolute inset-0 bg-black/30" />
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
      </div>

      {/* Mobile / small screens */}
      <div className="block md:hidden h-full">
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
          {phoneSlides.map((slide, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <div className="relative w-full h-full overflow-hidden">
                <div
                  className="hero-bg absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${NEXT_PUBLIC_API_URL}/${slide.image})` }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex h-full items-center px-6">
                  <div className="text-white max-w-md">
                    <h1 className="text-3xl font-light tracking-wide mb-3">
                      {slide.title}
                    </h1>
                    <p className="text-xs tracking-widest uppercase mb-6">
                      {slide.subtitle}
                    </p>
                    <a
                      href={slide.link}
                      className="inline-block border border-white px-6 py-2 text-[11px] tracking-widest uppercase hover:bg-white hover:text-black transition"
                    >
                      Discover
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="swiper-pagination" />
      </div>
    </section>
  );
}
