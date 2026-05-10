"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyProducts } from "@/component/EmptyProducts";
import FilterIndicator, { getActiveFilterChipCount } from "@/component/FilterIndicator";
import ProductCard2 from "@/component/ProductCard2";
import ProductFilter from "@/component/ProductFilter";
import { ProductGridSkeleton } from "@/component/ProductGridSkeleton";
import { BRAND_SORT_VALUES, buildBrandFilterParams } from "@/hooks/useBrandProducts";
import { postSearchProducts } from "@/stores/ProductAPI";

const SORT_OPTIONS = [
  { value: "", label: "Default (newest / stock first)" },
  { value: "priceLowtoHigh", label: "Price: Low to High" },
  { value: "priceHightoLow", label: "Price: High to Low" },
  { value: "nameAtoZ", label: "Name: A -> Z" },
  { value: "nameZtoA", label: "Name: Z -> A" },
];

function parseSearchPayload(response) {
  if (response == null) return { products: [], relatedKeywords: [] };
  const payload = response?.data ?? response ?? {};
  let products = [];
  if (Array.isArray(payload?.products)) products = payload.products;
  else if (Array.isArray(payload?.data)) products = payload.data;
  else if (Array.isArray(payload?.products?.data)) products = payload.products.data;
  const relatedKeywords = Array.isArray(payload?.related_keywords)
    ? payload.related_keywords
    : [];
  return { products, relatedKeywords };
}

function getQuantityAgnosticFilters(rawFilters) {
  if (!rawFilters || typeof rawFilters !== "object") return {};
  return {
    ...rawFilters,
    quantity: { in: false, out: false },
  };
}

function sortSearchProducts(items, sortBy) {
  if (!sortBy || !BRAND_SORT_VALUES.has(sortBy)) return items;
  const list = [...items];
  const price = (p) =>
    Number(p?.selling_price ?? p?.discount_price ?? p?.after_discount_price ?? p?.price ?? 0);
  const name = (p) => String(p?.name ?? p?.meta_title ?? "").toLowerCase();
  switch (sortBy) {
    case "priceLowtoHigh":
      return list.sort((a, b) => price(a) - price(b));
    case "priceHightoLow":
      return list.sort((a, b) => price(b) - price(a));
    case "nameAtoZ":
      return list.sort((a, b) => name(a).localeCompare(name(b)));
    case "nameZtoA":
      return list.sort((a, b) => name(b).localeCompare(name(a)));
    default:
      return list;
  }
}

export default function SearchPageClient({ keyword }) {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [rawProducts, setRawProducts] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [stockCounts, setStockCounts] = useState({ in: 0, out: 0 });
  const [isLoading, setIsLoading] = useState(!!keyword.trim());
  const [error, setError] = useState("");

  const activeFilterCount = getActiveFilterChipCount(filters);
  const filtersKey = JSON.stringify(filters ?? {});

  const trimmed = keyword.trim();

  const products = useMemo(
    () => sortSearchProducts(rawProducts, sortBy),
    [rawProducts, sortBy]
  );

  useEffect(() => {
    if (!trimmed) {
      setRawProducts([]);
      setRelatedKeywords([]);
      setStockCounts({ in: 0, out: 0 });
      setIsLoading(false);
      setError("");
      return;
    }

    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setError("");
      let parsedFilters = {};
      try {
        parsedFilters = filtersKey ? JSON.parse(filtersKey) : {};
      } catch {
        parsedFilters = {};
      }

      const filterParams = buildBrandFilterParams(parsedFilters);
      const baseCountParams = buildBrandFilterParams(getQuantityAgnosticFilters(parsedFilters));

      const listBody = { search: trimmed, ...filterParams };
      const countBody = { search: trimmed, ...baseCountParams };

      const [listRes, countRes] = await Promise.all([
        postSearchProducts(listBody),
        postSearchProducts(countBody),
      ]);

      if (!mounted) return;

      if (listRes == null) {
        setError("Could not load search results.");
        setRawProducts([]);
        setRelatedKeywords([]);
        setStockCounts({ in: 0, out: 0 });
        setIsLoading(false);
        return;
      }

      const { products: rawList, relatedKeywords: kw } = parseSearchPayload(listRes);
      const { products: countList } = parseSearchPayload(countRes);

      let inC = 0;
      for (const item of Array.isArray(countList) ? countList : []) {
        const qty = Number(item?.quantity ?? item?.stock ?? 0);
        if (Number.isFinite(qty) && qty > 0) inC += 1;
      }
      const totalC = Array.isArray(countList) ? countList.length : 0;

      setRawProducts(Array.isArray(rawList) ? rawList : []);
      setRelatedKeywords(Array.isArray(kw) ? kw : []);
      setStockCounts({ in: inC, out: Math.max(0, totalC - inC) });
      setIsLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [trimmed, filtersKey]);

  const title = useMemo(() => trimmed || "-", [trimmed]);

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-0 py-10 md:py-16">
      <h1 className="title font-semibold">Search by: {title}</h1>

   

      {!trimmed ? (
        <p className="text-sm text-gray-500 mt-6">Enter a search term to see products.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:mt-6 mt-4">
          <ProductFilter filters={filters} setFilters={setFilters} stockCounts={stockCounts} />
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
            <div
              className={`mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 ${
                activeFilterCount > 0 ? "sm:justify-between" : "sm:justify-end"
              }`}
            >
              <FilterIndicator filters={filters} setFilters={setFilters} />
              {/* <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-56 sm:shrink-0 sm:flex-row sm:items-center">
                <label htmlFor="search-sort" className="text-sm font-medium text-gray-700 shrink-0">
                  Sort by
                </label>
                <select
                  id="search-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-black focus:border-transparent sm:w-64"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value || "default"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            {isLoading && <ProductGridSkeleton />}
            {!isLoading && !error && products.length === 0 && (
              <EmptyProducts
                title="No products found"
                description="Try a different keyword or adjust filters."
                actionLabel="Continue shopping"
                actionHref="/"
              />
            )}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-x-5 gap-y-10">
                {products.map((product) => (
                  <ProductCard2 key={product.id} item={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
