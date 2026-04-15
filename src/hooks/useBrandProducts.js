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
  if (q != null && String(q).trim() !== '') {
    const n = Number(String(q).trim());
    if (Number.isFinite(n) && n >= 0) out.quantity = String(n);
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

export function useBrandProducts(brandId, filters, sortBy = '') {
  const filtersKey = JSON.stringify(filters ?? {});

  const [products, setProducts] = useState([]);
  const [response, setResponse] = useState(null);
  const [banner_img, setBannerImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!brandId) {
      setProducts([]);
      setResponse(null);
      setBannerImage('');
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
        setError('Could not load products.');
        setIsLoading(false);
        return;
      }
      setResponse(raw);
      setBannerImage(extractBrandBannerImage(raw));
      setProducts(normalizeBrandProductsResponse(raw));
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [brandId, filtersKey, sortBy]);

  return { products, response, banner_img, isLoading, error };
}
