import React from "react";
import Link from "next/link";
import { Backend_Base_Url } from "@/config";

export default function DesktopSearch({
  open,
  setOpen,
  onTransparent,
  searchRef,
  searchQuery,
  setSearchQuery,
  searchResults = [],
  onResultClick,
}) {
  const hasQuery = String(searchQuery || "").trim().length > 0;
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const productImage = (item) => {
    const candidates = [item?.image, item?.thumb_image, item?.otherimage].filter(Boolean);
    const raw =
      candidates.find((value) => {
        const s = String(value || "").trim();
        if (!s) return false;
        // Ignore unresolved template placeholders from API like "${image}".
        return !s.includes("${") && !s.includes("%7B") && !s.includes("%7D");
      }) || "";
    if (!raw) return "";
    if (String(raw).startsWith("http")) return raw;
    const normalized = raw.includes("/") ? raw : `uploads/product/${raw}`;
    return `${Backend_Base_Url}/${normalized}`;
  };

  const priceMeta = (item) => {
    const original = toNum(item?.price);
    const discounted = toNum(
      item?.discount_price ?? item?.selling_price ?? item?.after_discount_price ?? item?.price
    );
    const rawDiscount = toNum(item?.discount);
    const discountPercent =
      rawDiscount > 0
        ? rawDiscount
        : original > discounted && original > 0
          ? ((original - discounted) / original) * 100
          : 0;
    return { original, discounted, discountPercent };
  };

  return (
    <div className="relative hidden md:block w-10" ref={searchRef}>
      <div className="flex items-center justify-center w-10">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close search" : "Open search"}
          className={`flex items-center justify-center p-2 ${
            onTransparent ? "md:md:text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"
          }`}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </div>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-[min(92vw,28rem)] md:w-[min(92vw,58rem)] 2xl:w-[min(92vw,83rem)] rounded-md border border-gray-200 bg-white p-2 shadow-lg">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-x-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products"
              className="w-full outline-none text-gray-900"
            />
            <svg
              className="w-5 h-5 shrink-0 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>

          {hasQuery && (
            <div className="mt-2 overflow-hidden rounded border border-gray-100">
              <div className="flex flex-col md:flex-row">
                <div className="w-full border-b border-gray-100 bg-gray-50 p-3 md:w-1/3 md:border-b-0 md:border-r">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Keyword suggestions
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    No keyword found with this keyword:
                    {" "}
                    <span className="font-medium text-gray-700">{searchQuery}</span>
                  </p>
                </div>

                <div className="w-full max-h-80 overflow-y-auto md:w-2/3">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => {
                      const { original, discounted, discountPercent } = priceMeta(item);
                      return (
                        <Link
                          key={item.id}
                          href={`/product/${item.slug}`}
                          onClick={onResultClick}
                          className="flex items-center gap-2 border-b border-gray-100 p-2 hover:bg-gray-50"
                        >
                          {productImage(item) ? (
                            <img
                              src={productImage(item)}
                              alt={item?.name || "Product"}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-gray-100" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-800">
                              {item?.name || item?.meta_title || "Product"}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="font-semibold text-gray-800">
                                BDT {discounted.toLocaleString("en-BD")}
                              </span>
                              {discountPercent > 0 && (
                                <>
                                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                                    {Math.round(discountPercent)}% OFF
                                  </span>
                                  <span className="text-gray-400 line-through">
                                    BDT {original.toLocaleString("en-BD")}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <p className="p-3 text-sm text-gray-500">No products found.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
