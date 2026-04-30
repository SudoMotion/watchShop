import { Backend_Base_Url } from "@/config";
import { getNewDynamicSection } from "@/stores/HomeAPI";
import { getTopBrands } from "@/stores/homeSpecification";
import Image from "next/image";
import React from "react";

export default async function DynamicSection() {
  const topBrands = await getTopBrands();
  const {sections : newDynamicSection} = await getNewDynamicSection();
  const hasDynamicSection =
    Array.isArray(newDynamicSection) && newDynamicSection.length > 0;

  return (
    <div>
      {hasDynamicSection && (
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-2 py-10 md:gap-8 md:px-0 md:py-16 lg:grid-cols-4">
        {newDynamicSection.map((item) => (
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
                    src={Backend_Base_Url + '/' + item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover/card:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2 pb-2 pt-8 md:px-4 md:pb-4 md:pt-12">
                    <h2 className="text-xs font-semibold leading-tight tracking-tight text-white md:text-base">
                      {item.name}
                    </h2>
                    <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-white/80 md:text-[11px]">
                      Hover to explore
                    </p>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 px-6 py-8 text-center shadow-inner [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)_translate3d(0,0,1px)]"
              >
                <span className="mb-1 text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-amber-200/90 md:mb-2 md:text-[0.6rem]">
                  Collection
                </span>
                <h3 className="text-xs font-semibold leading-tight tracking-tight text-white md:text-base">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-[10px] text-neutral-300 md:mt-2 md:text-xs">
                  {item.description}
                </p>
                <div
                  className="mt-3 h-px w-8 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent md:mt-4 md:w-10"
                  aria-hidden
                />
                <p className="text-[0.52rem] uppercase tracking-[0.14em] text-neutral-500 md:mt-2 md:text-[0.62rem]">
                  Premium selection
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      )}
      {!hasDynamicSection && (
      <div className='py-10 bg-gray-50 px-2'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold mb-8'>Top Watch Brands</h2>
          <div className='grid grid-cols-5 md:grid-cols-10 items-center justify-center'>
            {topBrands.slice(0, 10).map((brand, index) => (
              <div key={index} className='flex flex-col items-center p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 w-full'>
                <div className='relative w-full h-10 md:h-20'>
                  <Image
                    src={Backend_Base_Url + '/' + brand.image}
                    alt={brand.name}
                    fill
                    className='object-contain p-2'
                    // sizes='(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 10vw'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
