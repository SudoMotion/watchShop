"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { getMobileSliders, getSliders } from "@/stores/homeSpecification";
import { NEXT_PUBLIC_API_URL } from "@/config";

function slideImageSrc(path) {
  if (path == null || path === "") return "";
  const p = String(path).trim();
  if (!p) return "";
  if (p.startsWith("http")) return p;
  const base = (NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  return `${base}/${p.replace(/^\//, "")}`;
}

const swiperBase = {
  modules: [Autoplay, Pagination],
  slidesPerView: 1,
  loop: true,
  speed: 1200,
  autoHeight: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
  pagination: {
    clickable: true,
    bulletClass: "hero-bullet",
    bulletActiveClass: "hero-bullet-active",
  },
};

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);
  const [sliders, setSliders] = useState([]);
  const [mobileSliders, setMobileSliders] = useState([]);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await getSliders();
        const mobileData = await getMobileSliders();
        setSliders(data);
        setMobileSliders(mobileData);
      } catch (error) {
        console.error("Failed to fetch sliders:", error);
      }
    };
    fetchSliders();
  }, []);

  if (!mounted) {
    return <section className="relative w-full min-h-[12rem] bg-neutral-100 md:min-h-[16rem]" />;
  }

  const desktopSlides = sliders;
  const phoneSlides = mobileSliders.length ? mobileSliders : sliders;

  const slideShell = (slide, index, isMobile) => (
    <div className="relative w-full overflow-hidden">
      <img
        src={slideImageSrc(slide.image)}
        alt={slide.title ? String(slide.title) : ""}
        className="hero-bg block h-auto w-full max-w-full origin-center will-change-transform"
        width={undefined}
        height={undefined}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black/30"
        aria-hidden
      />
      <div
        className={`absolute inset-0 z-10 flex items-center ${
          isMobile ? "px-6" : "px-6 md:px-24"
        }`}
      >
        <div
          className={`text-white ${isMobile ? "max-w-md" : "max-w-xl"} pointer-events-auto`}
        >
          <h1
            className={`font-light tracking-wide text-white ${
              isMobile
                ? "mb-3 text-3xl"
                : "mb-4 text-4xl md:mb-4 md:text-6xl"
            }`}
          >
            {slide.title}
          </h1>
          <p
            className={`tracking-widest uppercase text-white ${
              isMobile
                ? "mb-6 text-xs"
                : "mb-8 text-sm md:text-base"
            }`}
          >
            {slide.subtitle}
          </p>
          <a
            href={slide.link}
            className={`inline-block border border-white text-white transition hover:bg-white hover:text-black ${
              isMobile
                ? "px-6 py-2 text-[11px] tracking-widest uppercase"
                : "px-8 py-3 text-xs tracking-widest uppercase"
            }`}
          >
            Discover
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden">
      <div className="hidden md:block w-full">
        <Swiper {...swiperBase} className="w-full">
          {desktopSlides.map((slide, index) => (
            <SwiperSlide key={index} className="!h-auto">
              {slideShell(slide, index, false)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="block md:hidden w-full">
        <Swiper {...swiperBase} className="w-full">
          {phoneSlides.map((slide, index) => (
            <SwiperSlide key={index} className="!h-auto">
              {slideShell(slide, index, true)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
        <div className="swiper-pagination" />
      </div>
    </section>
  );
}
