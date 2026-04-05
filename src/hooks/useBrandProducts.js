import { useState, useEffect } from 'react';
import { getProductsByBrand } from '@/stores/ProductAPI';

/** Matches Laravel: $request->get('sortBy') */
export const BRAND_SORT_VALUES = new Set([
  'priceLowtoHigh',
  'priceHightoLow',
  'nameAtoZ',
  'nameZtoA',
]);

/** Turn ProductFilter nested state into GET query params for /api/products/brand/:brand */
function buildBrandFilterParams(filters) {
  const out = {};
  if (!filters || typeof filters !== 'object') return out;
  for (const [group, map] of Object.entries(filters)) {
    if (!map || typeof map !== 'object') continue;
    const keys = Object.keys(map).filter((k) => map[k]);
    if (keys.length) out[group] = keys.join(',');
  }
  return out;
}

function normalizeBrandProductsResponse(products) {
  const productItems = Array.isArray(products)
    ? products
    : products?.data ?? products?.products ?? products?.brand?.product ?? [];
  return Array.isArray(productItems) ? productItems : [];
}

/**
 * @param {string} brandId
 * @param {Record<string, Record<string, boolean>>} filters — from ProductFilter
 * @param {string} [sortBy] — '' = backend default (quantity DESC, id DESC). Else one of BRAND_SORT_VALUES.
 */
export function useBrandProducts(brandId, filters, sortBy = '') {
  const filtersKey = JSON.stringify(filters ?? {});

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!brandId) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    let parsedFilters = {};
    try {
      parsedFilters = filtersKey ? JSON.parse(filtersKey) : {};
    } catch {
      parsedFilters = {};
    }
    const params = buildBrandFilterParams(parsedFilters);
    if (sortBy && BRAND_SORT_VALUES.has(sortBy)) {
      params.sortBy = sortBy;
    }

    (async () => {
      const raw = await getProductsByBrand(brandId, params);
      if (cancelled) return;
      if (raw == null) {
        setProducts([]);
        setError('Could not load products.');
        setIsLoading(false);
        return;
      }
      setProducts(normalizeBrandProductsResponse(raw));
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [brandId, filtersKey, sortBy]);

  return { products, isLoading, error };
}
