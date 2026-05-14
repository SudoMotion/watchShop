'use client';

import { EmptyProducts } from '@/component/EmptyProducts';
import FilterIndicator, { getActiveFilterChipCount } from '@/component/FilterIndicator';
import { Pagination } from '@/component/Pagination';
import ProductCard2 from '@/component/ProductCard2';
import ProductFilter from '@/component/ProductFilter';
import { ProductGridSkeleton } from '@/component/ProductGridSkeleton';
import { NEXT_PUBLIC_API_URL } from '@/config';
import { getSubcategoryByCategoryId } from '@/stores/HomeAPI';
import { getProductsByCategory } from '@/stores/ProductAPI';
import { useEffect, useMemo, useState } from 'react';
import { BRAND_SORT_VALUES, buildBrandFilterParams, PRODUCT_LIST_PER_PAGE } from '@/hooks/useBrandProducts';

const SORT_OPTIONS = [
  { value: '', label: 'Default (newest / stock first)' },
  { value: 'priceLowtoHigh', label: 'Price: Low to High' },
  { value: 'priceHightoLow', label: 'Price: High to Low' },
  { value: 'nameAtoZ', label: 'Name: A -> Z' },
  { value: 'nameZtoA', label: 'Name: Z -> A' },
];

export default function CategoryPageClient({ categorySlug, categoryId = "", description = null }) {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stockCounts, setStockCounts] = useState({ in: 0, out: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryImageUrl, setCategoryImageUrl] = useState('/images/brand-banner.webp');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  /** When URL has no ?category_id=, filled from GET /products/category response cat.id */
  const [categoryIdFromApi, setCategoryIdFromApi] = useState('');
  const activeFilterCount = getActiveFilterChipCount(filters);
  const filtersKey = JSON.stringify(filters ?? {});

  const getQuantityAgnosticFilters = (rawFilters) => {
    if (!rawFilters || typeof rawFilters !== 'object') return {};
    return {
      ...rawFilters,
      quantity: { in: false, out: false },
    };
  };

  const resolveImageUrl = (path) => {
    if (!path) return '/images/brand-banner.webp';
    if (String(path).startsWith('http')) return path;
    return `${NEXT_PUBLIC_API_URL}/${String(path).replace(/^\//, '')}`;
  };

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError('');

      let parsedFilters = {};
      try {
        parsedFilters = filtersKey ? JSON.parse(filtersKey) : {};
      } catch {
        parsedFilters = {};
      }

      const params = {
        ...buildBrandFilterParams(parsedFilters),
        page: currentPage,
        per_page: PRODUCT_LIST_PER_PAGE,
      };
      if (sortBy && BRAND_SORT_VALUES.has(sortBy)) {
        params.sortBy = sortBy;
      }
      const catParam = categoryId || categoryIdFromApi;
      if (catParam) {
        params.category_id = catParam;
      }

      const baseCountParams = buildBrandFilterParams(getQuantityAgnosticFilters(parsedFilters));
      if (catParam) {
        baseCountParams.category_id = catParam;
      }
      const [response, stockInResponse, stockOutResponse] = await Promise.all([
        getProductsByCategory(categorySlug, params),
        getProductsByCategory(categorySlug, {
          ...baseCountParams,
          stock_in: '1',
          page: 1,
          per_page: 1,
        }),
        getProductsByCategory(categorySlug, {
          ...baseCountParams,
          stock_out: '1',
          page: 1,
          per_page: 1,
        }),
      ]);
      if (!mounted) return;
      const paginated = response?.products;
      const items = paginated?.data ?? [];
      const catImage = response?.cat?.image ?? '';
      const catName = response?.cat?.name ?? '';

      if (response == null) {
        setError('Could not load products.');
      }

      const inStockCount = Number(stockInResponse?.products?.total ?? 0);
      const outStockCount = Number(stockOutResponse?.products?.total ?? 0);

      setProducts(Array.isArray(items) ? items : []);
      setLastPage(Math.max(1, Number(paginated?.last_page ?? 1)));
      setTotal(Number(paginated?.total ?? 0));
      setStockCounts({
        in: inStockCount,
        out: outStockCount,
      });
      setCategoryImageUrl(resolveImageUrl(catImage));
      setCategoryTitle(catName || '');
      const cid = response?.cat?.id;
      if (cid != null && cid !== '') {
        setCategoryIdFromApi(String(cid));
      }
      setIsLoading(false);
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [categorySlug, categoryId, currentPage, filtersKey, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug, categoryId, filtersKey, sortBy]);

  useEffect(() => {
    setCategoryIdFromApi('');
  }, [categorySlug]);

  useEffect(() => {
    setFilters((prev) => ({
      ...(prev && typeof prev === "object" ? prev : {}),
      subcategories: [],
    }));
  }, [categorySlug]);

  useEffect(() => {
    const id = categoryId || categoryIdFromApi;
    if (!id) {
      setSubcategoryOptions([]);
      return;
    }
    let cancelled = false;
    getSubcategoryByCategoryId(id).then((result) => {
      if (cancelled) return;
      const list = result?.subcategories ?? result?.data?.subcategories;
      setSubcategoryOptions(Array.isArray(list) ? list : []);
    });
    return () => {
      cancelled = true;
    };
  }, [categoryId, categoryIdFromApi]);

  const categoryNameFromSlug = useMemo(
    () =>
      categorySlug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    [categorySlug]
  );
  const categoryName = categoryTitle || categoryNameFromSlug;
  const resolvedCategoryId = categoryId || categoryIdFromApi;

  return (
    <div>
      <div
        className="py-7 md:py-10 flex items-center justify-center bg-center bg-cover"
        style={{ backgroundImage: `url('${categoryImageUrl}')` }}
      >
        <div className="text-xl md:text-5xl font-bold bg-gray-400/40 text-white rounded-lg md:rounded-2xl backdrop-blur-md py-2 px-8 md:p-5">
          <span className="capitalize">{categoryName}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:mt-4 px-2 mt-2">
        <ProductFilter
          filters={filters}
          setFilters={setFilters}
          stockCounts={stockCounts}
          subcategoryOptions={subcategoryOptions}
          categoryName={categoryName}
          category_id={resolvedCategoryId || undefined}
        />
        <div className="md:col-span-5">
          <div
            className={`mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 ${
              activeFilterCount > 0 ? 'sm:justify-between' : 'sm:justify-end'
            }`}
          >
            <FilterIndicator
              filters={filters}
              setFilters={setFilters}
              subcategoryOptions={subcategoryOptions}
            />
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-56 sm:shrink-0 sm:flex-row sm:items-center">
              <label htmlFor="category-sort" className="text-sm font-medium text-gray-700 shrink-0">
                Sort by
              </label>
              <select
                id="category-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-black focus:border-transparent sm:w-64"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value || 'default'} value={opt.value}>
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
              description="Try adjusting filters or sort. You can also explore other categories from the home page."
              actionLabel="Continue shopping"
              actionHref="/"
            />
          )}
          {!isLoading && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product, index) => (
                  <ProductCard2 key={product?.id ?? index} item={product} />
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Showing page {currentPage} of {lastPage}
                  {total > 0 ? ` (${total} products)` : ''}
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
      <div className="max-w-7xl mx-auto px-2 md:px-0 py-6 md:py-10 border-t mt-2">
        <p>{description}</p>
      </div>
    </div>
  );
}
