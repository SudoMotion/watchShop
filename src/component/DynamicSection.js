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
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-2 py-10 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 md:px-0 md:py-16 lg:grid-cols-3">
      {data.map((item) => (
        <article
          key={item.id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:border-gray-200 hover:shadow-md"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            <Image
              src={imageSrc(item.image)}
              alt={item.title}
              fill
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
            <h5 className="text-lg font-semibold text-gray-900 md:text-xl">
              {item.title}
            </h5>
            <p className="text-sm leading-relaxed text-gray-600 line-clamp-4">
              {item.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
