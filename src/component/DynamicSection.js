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
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-2 py-10 sm:grid-cols-2 md:gap-10 md:px-0 md:py-16 lg:grid-cols-3">
      {data.map((item) => (
        <article
          key={item.id}
          className="group/card [perspective:1200px]"
        >
          <div
            className="relative aspect-[3/4] w-full origin-center transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform [transform-style:preserve-3d] group-hover/card:[transform:rotateY(180deg)] group-hover/card:shadow-2xl"
          >
            {/* Front */}
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md [backface-visibility:hidden] [transform:translate3d(0,0,1px)]"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <div className="relative h-full w-full bg-gray-100">
                <Image
                  src={imageSrc(item.image)}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover/card:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pb-5 pt-16">
                  <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                    Hover to explore
                  </p>
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 px-6 py-8 text-center shadow-inner [backface-visibility:hidden] [transform:rotateY(180deg)_translate3d(0,0,1px)]"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <span className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-amber-200/90">
                Collection
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-300">
                {item.description}
              </p>
              <div
                className="mt-8 h-px w-12 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
                aria-hidden
              />
              <p className="mt-4 text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">
                Premium selection
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
