"use client";

import { useCallback, useEffect, useState } from "react";
import { getWishlist, setWishlist } from "@/lib/wishlistStorage";
import { toast } from "react-toastify";

function isProductInStock(item) {
  const q = item?.quantity ?? item?.stock;
  if (q === undefined || q === null || q === "") return true;
  return Number(q) > 0;
}

function buildWishlistEntry(item, mainImageUrl, hoverImageUrl) {
  const slug = item.slug ?? "";
  const title = item.name || item.meta_title || item.title || "Product";
  const brand =
    typeof item.brand === "string"
      ? item.brand
      : item.brand?.name ?? item.brand_name ?? "";
  const priceStr =
    item.discount_price != null && String(item.discount_price).trim() !== ""
      ? String(item.discount_price)
      : item.price != null
        ? String(item.price)
        : "৳0";
  const originalStr =
    item.originalPrice != null
      ? String(item.originalPrice)
      : item.price != null
        ? String(item.price)
        : priceStr;
  const discount =
    typeof item.discount === "string"
      ? item.discount
      : item.discount != null
        ? String(item.discount)
        : "";
  const stock = Number(item.quantity ?? item.stock ?? 0);
  return {
    id: item.id,
    image: mainImageUrl,
    image2: hoverImageUrl || mainImageUrl,
    title,
    slug,
    brand,
    price: priceStr,
    originalPrice: originalStr,
    discount,
    stock: Math.max(0, stock),
    inStock: stock > 0,
  };
}

/**
 * Out-of-stock badge or wishlist heart on product card images (same behavior as product page).
 */
export default function ProductCardWishlistOverlay({
  item,
  mainImageUrl,
  hoverImageUrl,
  compact = true,
}) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const inStock = isProductInStock(item);

  useEffect(() => {
    if (!item?.id) return;
    setIsInWishlist(getWishlist().some((w) => w.id === item.id));
  }, [item?.id]);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!item?.id || !mainImageUrl) return;
      try {
        const list = getWishlist();
        if (list.some((w) => w.id === item.id)) {
          setWishlist(list.filter((w) => w.id !== item.id));
          setIsInWishlist(false);
          toast.info("Removed from wishlist");
          return;
        }
        const entry = buildWishlistEntry(item, mainImageUrl, hoverImageUrl);
        setWishlist([...list, entry]);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      } catch {
        toast.error("Could not update wishlist");
      }
    },
    [item, mainImageUrl, hoverImageUrl]
  );

  if (!item?.id || !mainImageUrl) return null;

  const btnSize = compact ? "h-9 w-9" : "h-11 w-11";
  const iconSize = compact ? "h-5 w-5" : "h-6 w-6";

  if (!inStock) {
    return (
      <div className="pointer-events-none absolute right-2 top-2 z-20 max-w-[calc(100%-1rem)]">
        <span className="inline-block rounded-full bg-red-600 px-2.5 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:px-3 sm:text-xs">
          Out of stock
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`absolute right-2 top-2 z-20 flex ${btnSize} items-center justify-center rounded-full shadow-md ring-1 ring-black/10 transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 ${
        isInWishlist
          ? "bg-red-50 text-red-600"
          : "bg-white/95 text-gray-700 hover:bg-white"
      }`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={iconSize}
          aria-hidden
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.003.001a.75.75 0 01-.704 0l-.003-.001z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
          className={iconSize}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      )}
    </button>
  );
}
