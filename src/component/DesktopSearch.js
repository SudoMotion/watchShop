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

  const productImage = (item) => {
    const raw = item?.thumb_image || item?.image || item?.otherimage || "";
    if (!raw) return "";
    if (String(raw).startsWith("http")) return raw;
    const normalized = raw.includes("/") ? raw : `uploads/product/${raw}`;
    return `${Backend_Base_Url}/${normalized}`;
  };

  return (
    <div className="relative" ref={searchRef}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`hidden md:flex items-center justify-center p-2 ${
            onTransparent ? "md:md:text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"
          }`}
        >
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
        </button>
      )}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-[min(92vw,26rem)] rounded-md border border-gray-200 bg-white p-2 shadow-lg">
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
            <div className="mt-2 max-h-80 overflow-y-auto rounded border border-gray-100">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
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
                      <p className="text-xs text-gray-500">
                        BDT {Number(item?.selling_price || item?.discount_price || item?.price || 0).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="p-3 text-sm text-gray-500">No products found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
