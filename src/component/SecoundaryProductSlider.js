"use client";

import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import {
  mapBannerItemsToSlides,
  mapBannerResponseToSlides,
} from "@/lib/bannerSlides";
import { getBannerContent } from "@/stores/HomeAPI";

export default function SecoundaryProductSlider({ data }) {
  const [mounted, setMounted] = useState(false);
  const [fetchedSlides, setFetchedSlides] = useState([]);

  const fromProps = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return mapBannerItemsToSlides(data);
  }, [data]);

  useEffect(() => {
    if (fromProps.length > 0) return;
    let cancelled = false;
    getBannerContent()
      .then((raw) => {
        if (cancelled) return;
        const mapped = mapBannerResponseToSlides(raw);
        if (mapped.length > 0) setFetchedSlides(mapped);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [fromProps.length]);

  const resolvedSlides = fromProps.length > 0 ? fromProps : fetchedSlides;

  useEffect(() => {
    setMounted(true);
  }, []);

  const loopEnabled = resolvedSlides.length > 1;

  if (!mounted) {
    return (
      <section className="relative w-full h-screen lg:h-[120vh] 2xl:h-[120vh] bg-black" />
    );
  }

  if (resolvedSlides.length === 0) {
    return (
      <section className="relative flex min-h-[280px] w-full items-center justify-center bg-neutral-900 px-6 text-center text-sm text-neutral-400">
        No recommended banners configured.
      </section>
    );
  }

  return (
    <section className="relative h-[700px] w-full overflow-hidden lg:h-[800px] 2xl:h-[880px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={loopEnabled}
        speed={1200}
        autoplay={
          loopEnabled
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }
            : false
        }
        pagination={{
          clickable: true,
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
        }}
        className="h-full w-full"
      >
        {resolvedSlides.map((slide, index) => (
          <SwiperSlide
            key={slide.id ?? `${slide.image}-${index}`}
            className="h-full w-full"
          >
            <div className="relative h-full w-full overflow-hidden">
              <div
                className="hero-bg absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              <div className="absolute inset-0 bg-black/30" />

              <div className="relative z-10 flex h-full items-center px-6 md:px-24">
                <div className="max-w-xl text-white">
                  <h1 className="mb-4 text-4xl font-light tracking-wide md:text-6xl">
                    {slide.title}
                  </h1>
                  {slide.subtitle ? (
                    <p className="mb-8 text-sm uppercase tracking-widest md:text-base">
                      {slide.subtitle}
                    </p>
                  ) : null}
                  <a
                    href={slide.link}
                    className="inline-block border border-white px-8 py-3 text-xs uppercase tracking-widest transition hover:bg-white hover:text-black"
                  >
                    Discover
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
        <div className="swiper-pagination" />
      </div>
    </section>
  );
}
