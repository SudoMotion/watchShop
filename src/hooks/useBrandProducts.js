import { useState, useEffect } from 'react';
import { getProductsByBrand } from '@/stores/ProductAPI';

export const BRAND_SORT_VALUES = new Set([
  'priceLowtoHigh',
  'priceHightoLow',
  'nameAtoZ',
  'nameZtoA',
]);

export function buildBrandFilterParams(filters) {
  const out = {};
  if (!filters || typeof filters !== 'object') return out;

  const q = filters.quantity;
  if (q && typeof q === 'object') {
    if (q.in) out.stock_in = '1';
    if (q.out) out.stock_out = '1';
  }

  if (filters.movement && typeof filters.movement === 'object') {
    const keys = Object.keys(filters.movement).filter((k) => filters.movement[k]);
    if (keys.length) out.movement = keys.join(',');
  }

  if (filters.band_type && typeof filters.band_type === 'object') {
    const keys = Object.keys(filters.band_type).filter((k) => filters.band_type[k]);
    if (keys.length) out.band_type = keys.join(',');
  }

  if (Array.isArray(filters.brands) && filters.brands.length) {
    out.brands = filters.brands.join(',');
  }

  if (Array.isArray(filters.subcategories) && filters.subcategories.length) {
    out.sub_category = filters.subcategories.join(',');
  }

  return out;
}

function normalizeBrandProductsResponse(products) {
  const productItems = Array.isArray(products)
    ? products
    : products?.data ?? products?.products ?? products?.brand?.product ?? [];
  return Array.isArray(productItems) ? productItems : [];
}

function extractBrandBannerImage(raw) {
  if (!raw || typeof raw !== 'object') return '';
  return (
    raw.banner_img ??
    raw.data?.banner_img ??
    raw.brand?.banner_img ??
    raw.data?.brand?.banner_img ??
    ''
  );
}

function applyQuantityFilter(products, filters) {
  const quantity = filters?.quantity;
  if (!quantity || typeof quantity !== 'object') return products;

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

export function useBrandProducts(brandId, filters, sortBy = '') {
  const filtersKey = JSON.stringify(filters ?? {});

  const [products, setProducts] = useState([]);
  const [response, setResponse] = useState(null);
  const [banner_img, setBannerImage] = useState('');
  const [stockCounts, setStockCounts] = useState({ in: 0, out: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!brandId) {
      setProducts([]);
      setResponse(null);
      setBannerImage('');
      setStockCounts({ in: 0, out: 0 });
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
        setResponse(null);
        setBannerImage('');
        setStockCounts({ in: 0, out: 0 });
        setError('Could not load products.');
        setIsLoading(false);
        return;
      }
      setResponse(raw);
      setBannerImage(extractBrandBannerImage(raw));
      const normalized = normalizeBrandProductsResponse(raw);
      const inStockCount = normalized.filter((item) => {
        const qty = Number(item?.quantity ?? item?.stock ?? 0);
        return Number.isFinite(qty) ? qty > 0 : false;
      }).length;
      setStockCounts({
        in: inStockCount,
        out: Math.max(0, normalized.length - inStockCount),
      });
      setProducts(applyQuantityFilter(normalized, parsedFilters));
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [brandId, filtersKey, sortBy]);

  return { products, response, banner_img, stockCounts, isLoading, error };
}
