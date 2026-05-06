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
      <section className="w-full aspect-[2/3] md:aspect-[1920/796] bg-black animate-pulse" />
    );
  }

  const desktopSlides = sliders;
  const phoneSlides = mobileSliders.length ? mobileSliders : sliders;

  return (
    <section className="relative w-full overflow-hidden">
      
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="w-full aspect-[1920/796]">
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
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="w-full aspect-[2/3]">
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
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/20" />
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