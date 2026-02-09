import { Backend_Base_Url } from "@/config";
import Image from "next/image";
import Link from "next/link";

// Base64 encoded SVG for blur placeholder
const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;

export default function ProductCard2({ item }) {
  if (!item) {
    return (
      <div className="flex flex-col gap-y-2 items-center text-center animate-pulse">
        <div className="w-[200px] h-[200px] bg-gray-200 rounded-md" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 items-center text-center">
      <div className="h-80 group relative rounded-md overflow-hidden bg-gray-200 w-full flex items-center justify-center py-5">
        {item.discount && <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-br-md">{item.discount}</div>}
        <Image
          src={Backend_Base_Url +'/'+ item.otherimage}
          alt={item.meta_title}
          width={200}
          height={200}
          className="object-cover scale-100 group-hover:scale-105 transition-all duration-300 group-hover:hidden"
          placeholder="blur"
          blurDataURL={blurSvg}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <Image
          src={item.image2}
          alt={item.title}
          width={200}
          height={200}
          className="absolute object-cover scale-100 group-hover:scale-125 transition-all duration-[1000ms] group-hover:opacity-100 opacity-0"
          placeholder="blur"
          blurDataURL={blurSvg}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <Link href={`/product/${item.slug}`} className="font-semibold text-base md:text-lg">{item.name}</Link>
      <div className="flex items-center justify-center gap-x-2 text-base md:text-lg font-semibold">
      <p className="line-through text-gray-500">{item.price}</p>
      <p className="text-red-600">{item.discount_price}</p>
      </div>
    </div>
  );
}
