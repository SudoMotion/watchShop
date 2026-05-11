import { Backend_Base_Url } from "@/config";
import { formatPriceView } from "@/lib/formatPriceView";
import Image from "next/image";
import Link from "next/link";
import ProductCardWishlistOverlay from "@/component/ProductCardWishlistOverlay";

// Base64 encoded SVG for blur placeholder
const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;

/** API returns image as filename (e.g. "Fossil_ES4093 (1).webp") or path ("uploads/product/..."). */
function productImagePath(path) {
  if (!path || path.startsWith("http")) return path;
  return path.includes("/") ? path : `uploads/product/${path}`;
}

function getRoundedDiscountLabel(discount) {
  const n = Number(discount);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${Math.round(n)}% Off`;
}

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

  const mainImage = item.image || item.otherimage || "";
  const hoverImage = item.image2 || item.otherimage || item.image || "";
  const mainImageSrc = mainImage.startsWith("http") ? mainImage : Backend_Base_Url + "/" + productImagePath(mainImage);
  const hoverImageSrc = hoverImage.startsWith("http") ? hoverImage : Backend_Base_Url + "/" + productImagePath(hoverImage);
  const hasHoverSwap = Boolean(hoverImage && hoverImage !== mainImage);

  return (
    <div className="flex flex-col gap-y-2 items-center text-center">
      <div className="group relative w-full aspect-square min-h-64 overflow-hidden rounded-md bg-white">
        <Link
          href={`/product/${item.slug}`}
          className="absolute inset-0 z-0 block"
          aria-label={item.name || item.meta_title || "View product"}
        >
          {mainImage && (
            <Image
              src={mainImageSrc}
              alt={item.meta_title || item.name || "Product"}
              fill
              className={
                hasHoverSwap
                  ? "absolute inset-0 scale-100 object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-0"
                  : "absolute inset-0 scale-100 object-cover transition-all duration-300 group-hover:scale-105"
              }
              placeholder="blur"
              blurDataURL={blurSvg}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          )}
          {hasHoverSwap && (
            <Image
              src={hoverImageSrc}
              alt={item.meta_title || item.name || "Product"}
              fill
              className="absolute inset-0 scale-100 object-cover opacity-0 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100"
              placeholder="blur"
              blurDataURL={blurSvg}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          )}
          {!mainImage && (
            <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
              No image
            </div>
          )}
        </Link>
        {getRoundedDiscountLabel(item.discount) && (
          <div className="absolute top-2 left-1 z-5 rounded-br-xl rounded-tl-xl bg-red-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
            {getRoundedDiscountLabel(item.discount)}
          </div>
        )}
        {item.brand?.name && (
          <div className="absolute bottom-1 left-1/2 z-5 truncate -translate-x-1/2 text-base font-medium text-gray-600">
            {item.brand.name}
          </div>
        )}
        {mainImage && (
          <ProductCardWishlistOverlay
            item={item}
            mainImageUrl={mainImageSrc}
            hoverImageUrl={hoverImageSrc}
          />
        )}
      </div>
      <Link href={`/product/${item.slug}`} className="font-semibold text-base md:text-lg line-clamp-2">{item.name}</Link>
      <div className="flex items-center justify-center gap-x-2 text-base md:text-lg font-semibold">
      <p className="line-through text-gray-500">{formatPriceView(item.price)}</p>
      <p className="text-red-600">{formatPriceView(item.discount_price)}</p>
      </div>
    </div>
  );
}
