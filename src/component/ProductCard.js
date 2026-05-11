import { Backend_Base_Url } from "@/config";
import { formatPriceView } from "@/lib/formatPriceView";
import Image from "next/image";
import Link from "next/link";
import ProductCardWishlistOverlay from "@/component/ProductCardWishlistOverlay";

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

  const mainImageUrl = item.otherimage
    ? item.otherimage.startsWith("http")
      ? item.otherimage
      : `${Backend_Base_Url}/${item.otherimage}`
    : "";

  return (
    <div className="flex flex-col gap-y-2 items-center text-center w-full">
      <div className="relative w-full aspect-square rounded-md overflow-hidden">
        {mainImageUrl ? (
          <>
            <Link
              href={`/product/${item.slug}`}
              className="absolute inset-0 z-0 block"
              aria-label={item.name || item.meta_title || "View product"}
            >
              <Image
                src={mainImageUrl}
                alt={item.meta_title}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurSvg}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </Link>
            <ProductCardWishlistOverlay
              item={item}
              mainImageUrl={mainImageUrl}
              hoverImageUrl={mainImageUrl}
            />
          </>
        ) : (
          <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
            No image
          </div>
        )}
      </div>
      <Link href={`/product/${item.slug}`}>
        <h3 className="font-medium line-clamp-2">{item.name}</h3>
      </Link>
      <p className="text-sm text-gray-500">{item.brand?.name}</p>
      <p className="font-semibold">{formatPriceView(item.price)}</p>
    </div>
  );
}
