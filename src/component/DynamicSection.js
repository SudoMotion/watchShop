import Image from "next/image";
import React from "react";

export default function DynamicSection() {
  const data = [
    {
      id: 1,
      title: "Mens Watch",
      description: "Mens Watch Description",
      image: "images/men.jpg",
    },
    {
      id: 2,
      title: "Ladies Watch",
      description: "Mens Watch Description",
      image: "images/ladies.jpg",
    },
    {
      id: 3,
      title: "Watch Accessories",
      description: "Watch Accessories Description",
      image: "images/accessories.jpg",
    },
  ];

  const imageSrc = (path) =>
    path.startsWith("/") ? path : `/${path}`;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-2 py-10 md:gap-8 md:px-0 md:py-16 lg:grid-cols-4">
      {data.map((item) => (
        <article
          key={item.id}
          tabIndex={0}
          className="group/card rounded-2xl [perspective:1200px] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
        >
          <div
            className="relative aspect-[466/244] w-full origin-center transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform [transform-style:preserve-3d] group-hover/card:[transform:rotateY(180deg)] group-focus-within/card:[transform:rotateY(180deg)] group-hover/card:shadow-2xl group-focus-within/card:shadow-2xl"
          >
            {/* Front */}
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translate3d(0,0,1px)]"
            >
              <div className="relative h-full w-full bg-gray-100">
                <Image
                  src={imageSrc(item.image)}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover/card:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pb-3 pt-10 md:px-4 md:pb-4 md:pt-12">
                  <h2 className="text-sm font-semibold leading-tight tracking-tight text-white md:text-base">
                    {item.title}
                  </h2>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/80 md:text-[11px]">
                    Hover to explore
                  </p>
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 px-6 py-8 text-center shadow-inner [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)_translate3d(0,0,1px)]"
            >
              <span className="mb-2 text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-amber-200/90 md:text-[0.6rem]">
                Collection
              </span>
              <h3 className="text-sm font-semibold leading-tight tracking-tight text-white md:text-base">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[14rem] text-[11px] leading-snug text-neutral-300 md:text-xs">
                {item.description}
              </p>
              <div
                className="mt-4 h-px w-10 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
                aria-hidden
              />
              <p className="mt-2 text-[0.58rem] uppercase tracking-[0.18em] text-neutral-500 md:text-[0.62rem]">
                Premium selection
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
