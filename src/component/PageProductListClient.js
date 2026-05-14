"use client";

import { EmptyProducts } from "@/component/EmptyProducts";
import FilterIndicator, { getActiveFilterChipCount } from "@/component/FilterIndicator";
import { Pagination } from "@/component/Pagination";
import ProductCard2 from "@/component/ProductCard2";
import ProductFilter from "@/component/ProductFilter";
import { ProductGridSkeleton } from "@/component/ProductGridSkeleton";
import { BRAND_SORT_VALUES, buildBrandFilterParams } from "@/hooks/useBrandProducts";
import { getBestDeals, getLimitedEdition } from "@/stores/ProductAPI";
import { useEffect, useMemo, useState } from "react";

const SORT_OPTIONS = [
  { value: "", label: "Default (newest / stock first)" },
  { value: "priceLowtoHigh", label: "Price: Low to High" },
  { value: "priceHightoLow", label: "Price: High to Low" },
  { value: "nameAtoZ", label: "Name: A → Z" },
  { value: "nameZtoA", label: "Name: Z → A" },
];

const FETCHERS = {
  "best-deal": getBestDeals,
  "limited-edition": getLimitedEdition,
};

function getQuantityAgnosticFilters(rawFilters) {
  if (!rawFilters || typeof rawFilters !== "object") return {};
  return {
    ...rawFilters,
    quantity: { in: false, out: false },
  };
}

function applyQuantityFilter(products, filters) {
  const quantity = filters?.quantity;
  if (!quantity || typeof quantity !== "object") return products;
  const wantsIn = !!quantity.in;
  const wantsOut = !!quantity.out;
  if (!wantsIn && !wantsOut) return products;
  if (wantsIn && wantsOut) return products;
  return products.filter((item) => {
    const qty = Number(item?.quantity ?? item?.stock ?? 0);
    const isInStock = Number.isFinite(qty) ? qty > 0 : false;
    return wantsIn ? isInStock : !isInStock;
  });
}

function extractListPayload(response) {
  if (!response || typeof response !== "object") {
    return { items: [], lastPage: 1, total: 0, pageName: "" };
  }
  const pageName =
    typeof response.page_name === "string" && response.page_name.trim()
      ? response.page_name.trim()
      : "";
  const p = response.products;
  if (Array.isArray(p)) {
    return {
      items: p,
      lastPage: 1,
      total: p.length,
      pageName,
    };
  }
  if (p && typeof p === "object") {
    const items = Array.isArray(p.data) ? p.data : [];
    return {
      items,
      lastPage: Math.max(1, Number(p.last_page ?? 1)),
      total: Number(p.total ?? items.length),
      pageName,
    };
  }
  const data = response.data;
  if (Array.isArray(data)) {
    return { items: data, lastPage: 1, total: data.length, pageName };
  }
  return { items: [], lastPage: 1, total: 0, pageName };
}

/**
 * Best Deal & Limited Edition listing with the same filter / sort / pagination pattern as category & brand pages.
 */
export default function PageProductListClient({ listType, defaultTitle }) {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stockCounts, setStockCounts] = useState({ in: 0, out: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [heading, setHeading] = useState(defaultTitle || "");
  const filtersKey = JSON.stringify(filters ?? {});

  const activeFilterCount = getActiveFilterChipCount(filters);

  useEffect(() => {
    const fetchList = FETCHERS[listType];
    if (!fetchList) {
      setError("Invalid list type.");
      setIsLoading(false);
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

      const params = {
        ...buildBrandFilterParams(parsedFilters),
        page: currentPage,
      };
      if (sortBy && BRAND_SORT_VALUES.has(sortBy)) {
        params.sortBy = sortBy;
      }

      const baseCountParams = buildBrandFilterParams(
        getQuantityAgnosticFilters(parsedFilters),
      );

      try {
        const [response, stockInResponse, stockOutResponse] = await Promise.all([
          fetchList(params),
          fetchList({ ...baseCountParams, stock_in: "1", page: 1 }),
          fetchList({ ...baseCountParams, stock_out: "1", page: 1 }),
        ]);

        if (!mounted) return;

        if (response == null) {
          setError("Could not load products.");
          setProducts([]);
          setLastPage(1);
          setTotal(0);
          setStockCounts({ in: 0, out: 0 });
          setIsLoading(false);
          return;
        }

        const { items, lastPage: lp, total: tot, pageName } = extractListPayload(response);
        const inStockCount = Number(stockInResponse?.products?.total ?? 0);
        const outStockCount = Number(stockOutResponse?.products?.total ?? 0);

        setProducts(applyQuantityFilter(Array.isArray(items) ? items : [], parsedFilters));
        setLastPage(lp);
        setTotal(tot);
        setStockCounts({
          in: Number.isFinite(inStockCount) ? inStockCount : 0,
          out: Number.isFinite(outStockCount) ? outStockCount : 0,
        });
        if (pageName) setHeading(pageName);
        else if (defaultTitle) setHeading(defaultTitle);
      } catch {
        if (!mounted) return;
        setError("Could not load products.");
        setProducts([]);
        setStockCounts({ in: 0, out: 0 });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [listType, currentPage, filtersKey, sortBy, defaultTitle]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtersKey, sortBy]);

  const displayTitle = useMemo(() => heading || defaultTitle || "Products", [heading, defaultTitle]);

  const emptyDescription =
    listType === "best-deal"
      ? "Try adjusting filters or sort. You can also browse the home page for more watches."
      : "Try adjusting filters or sort. You can also explore other collections from the home page.";

  return (
    <div className="w-full mx-2 px-2 md:px-0 py-6 md:py-10">
      <h1 className="title font-semibold mb-2 md:mb-4">{displayTitle}</h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:mt-2">
        <ProductFilter
          filters={filters}
          setFilters={setFilters}
          stockCounts={stockCounts}
        />
        <div className="md:col-span-5">
          <div
            className={`mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 ${
              activeFilterCount > 0 ? "sm:justify-between" : "sm:justify-end"
            }`}
          >
            <FilterIndicator filters={filters} setFilters={setFilters} />
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-56 sm:shrink-0 sm:flex-row sm:items-center">
              <label
                htmlFor={`${listType}-sort`}
                className="text-sm font-medium text-gray-700 shrink-0"
              >
                Sort by
              </label>
              <select
                id={`${listType}-sort`}
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
            </div>
          </div>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          {isLoading && <ProductGridSkeleton />}
          {!isLoading && !error && products.length === 0 && (
            <EmptyProducts
              title="No products found"
              description={emptyDescription}
              actionLabel="Continue shopping"
              actionHref="/"
            />
          )}
          {!isLoading && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-x-5 gap-y-10">
                {products.map((product, index) => (
                  <ProductCard2 key={product?.id ?? index} item={product} />
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Showing page {currentPage} of {lastPage}
                  {total > 0 ? ` (${total} products)` : ""}
                </p>
              </div>
              <div className="flex justify-center items-center my-4">
                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
