"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { getMobileSliders, getSliders } from "@/stores/homeSpecification";
import { NEXT_PUBLIC_API_URL } from "@/config";
import Image from "next/image";

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
        setSliders(data || []);
        setMobileSliders(mobileData || []);
      } catch (error) {
        console.error("Failed to fetch sliders:", error);
      }
    };
    fetchSliders();
  }, []);

  if (!mounted) {
    return (
      <section className="w-full aspect-720/1080 md:aspect-1920/796 bg-black animate-pulse" />
    );
  }

  const desktopSlides = sliders;
  const phoneSlides = mobileSliders.length ? mobileSliders : sliders;

  return (
    <section className="relative w-full overflow-hidden">
      
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="w-full aspect-1920/796">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            speed={1200}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: ".hero-pagination",
              clickable: true,
              bulletClass: "hero-bullet",
              bulletActiveClass: "hero-bullet-active",
            }}
            className="w-full h-full"
          >
            {desktopSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full overflow-hidden">
                  
                  {/* Zoom Effect Wrapper */}
                  <div className="absolute inset-0 hero-zoom">
                    <Image
                      src={`${NEXT_PUBLIC_API_URL}/${slide.image}`}
                      alt={slide.title || "slider image"}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Optional Overlay */}
                  <div className="absolute inset-0 bg-black/20" />
                  {slide?.title && slide?.link && (
                    <div className="relative z-10 flex h-full items-end px-6 pb-12 md:px-20 md:pb-16">
                      <div className="text-white">
                        <h2 className="mb-4 text-3xl font-light tracking-wide md:text-5xl">
                          {slide.title}
                        </h2>
                        <a
                          href={slide.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block border border-white px-8 py-3 text-xs font-semibold tracking-widest uppercase text-white hover:bg-white hover:text-black transition"
                        >
                          Show More
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="w-full aspect-720/1080">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            speed={1200}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: ".hero-pagination",
              clickable: true,
              bulletClass: "hero-bullet",
              bulletActiveClass: "hero-bullet-active",
            }}
            className="w-full h-full"
          >
            {phoneSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full overflow-hidden">
                  
                  <div className="absolute inset-0 hero-zoom">
                    <Image
                      src={`${NEXT_PUBLIC_API_URL}/${slide.image}`}
                      alt={slide.title || "slider image"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/20" />
                  {slide?.title && slide?.link && (
                    <div className="relative z-10 flex h-full items-end px-4 pb-8">
                      <div className="text-white">
                        <h2 className="mb-3 text-xl font-light tracking-wide">
                          {slide.title}
                        </h2>
                        <a
                          href={slide.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block border border-white px-5 py-2 text-[10px] font-semibold tracking-widest uppercase text-white hover:bg-white hover:text-black transition"
                        >
                          Show More
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Pagination */}
      <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" />

      {/* Styles */}
      <style jsx global>{`
        /* Pagination bullets */
        .hero-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 9999px;
          transition: all 0.3s ease;
        }

        .hero-bullet-active {
          width: 24px;
          background: white;
        }

        /* Zoom animation */
        .hero-zoom {
          animation: heroZoom 6s ease-in-out forwards;
        }

        @keyframes heroZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}