import { Backend_Base_Url } from "@/config";
import Image from "next/image";
import Link from "next/link";

// Base64 encoded SVG for blur placeholder
const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;

export default function ProductCard({ item }) {
  if (!item) {
    return (
      <div className="flex flex-col gap-y-2 items-center text-center w-full animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-md" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 items-center text-center w-full">
      <div className="relative w-full aspect-square rounded-md overflow-hidden">
        <Image
          src={Backend_Base_Url + '/' + item.otherimage}
          alt={item.meta_title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={blurSvg}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <Link href={`/product/${item.slug}`}>
        <h3 className="font-medium">{item.name}</h3>
      </Link>
      <p className="text-sm text-gray-500">{item.brand?.name}</p>
      <p className="font-semibold">{item.price}</p>
    </div>
  );
}
