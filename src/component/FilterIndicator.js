"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrands } from "@/stores/homeSpecification";
import { getMovements, normalizeMovementsList } from "@/stores/ProductAPI";

const BAND_LABELS = new Map([
  ["stainless_steel", "Stainless steel"],
  ["leather", "Leather"],
  ["rubber", "Rubber"],
  ["silicone", "Silicone"],
  ["nylon", "Nylon"],
  ["canvas", "Canvas"],
  ["calfskin", "Calfskin"],
]);

function mergeDefaults(f) {
  const x = f && typeof f === "object" ? f : {};
  const quantityObj =
    x.quantity && typeof x.quantity === "object"
      ? x.quantity
      : { in: false, out: false };
  return {
    quantity: {
      in: !!quantityObj.in,
      out: !!quantityObj.out,
    },
    movement: x.movement && typeof x.movement === "object" ? x.movement : {},
    band_type: x.band_type && typeof x.band_type === "object" ? x.band_type : {},
    brands: Array.isArray(x.brands) ? x.brands : [],
  };
}

/** For layout (e.g. align sort row) without duplicating filter rules. */
export function getActiveFilterChipCount(filters) {
  const f = mergeDefaults(filters);
  let n = 0;
  if (f.quantity?.in) n += 1;
  if (f.quantity?.out) n += 1;
  n += Object.keys(f.movement || {}).filter((k) => f.movement[k]).length;
  n += Object.keys(f.band_type || {}).filter((k) => f.band_type[k]).length;
  n += (f.brands || []).length;
  return n;
}

function brandSlug(b) {
  return b?.slug ?? b?.brand_slug ?? b?.id ?? String(b?.name ?? "");
}

function brandLabel(b) {
  return b?.name ?? brandSlug(b);
}

/**
 * Shows active product filters as removable chips (brand page & anywhere ProductFilter state is lifted).
 */
export default function FilterIndicator({ filters, setFilters }) {
  const [brandList, setBrandList] = useState([]);
  const [movementOptions, setMovementOptions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getBrands()
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return;
        setBrandList(list);
      })
      .catch(() => setBrandList([]));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getMovements({})
      .then((res) => {
        if (cancelled) return;
        setMovementOptions(normalizeMovementsList(res));
      })
      .catch(() => setMovementOptions([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const movementLabel = useMemo(() => {
    const map = new Map();
    movementOptions.forEach(({ value, label }) => {
      if (value != null) map.set(String(value), label || String(value));
    });
    return (key) => map.get(String(key)) ?? String(key);
  }, [movementOptions]);

  const brandNameBySlug = useMemo(() => {
    const map = new Map();
    brandList.forEach((b) => {
      const s = brandSlug(b);
      if (s) map.set(String(s), brandLabel(b));
    });
    return (slug) => map.get(String(slug)) ?? String(slug);
  }, [brandList]);

  const f = mergeDefaults(filters);

  const chips = [];

  if (f.quantity?.in) {
    chips.push({
      key: "quantity",
      id: "quantity:in",
      text: "Stock in",
      aria: "Remove stock in filter",
    });
  }
  if (f.quantity?.out) {
    chips.push({
      key: "quantity",
      id: "quantity:out",
      text: "Stock out",
      aria: "Remove stock out filter",
    });
  }

  Object.keys(f.movement || {})
    .filter((k) => f.movement[k])
    .forEach((key) => {
      chips.push({
        key: "movement",
        id: `movement:${key}`,
        text: `Movement: ${movementLabel(key)}`,
        aria: `Movement ${movementLabel(key)}`,
      });
    });

  Object.keys(f.band_type || {})
    .filter((k) => f.band_type[k])
    .forEach((key) => {
      const lab = BAND_LABELS.get(key) ?? key;
      chips.push({
        key: "band_type",
        id: `band_type:${key}`,
        text: `Band type: ${lab}`,
        aria: `Remove band type filter ${lab}`,
      });
    });

  (f.brands || []).forEach((slug) => {
    const name = brandNameBySlug(slug);
    chips.push({
      key: "brand",
      id: `brand:${slug}`,
      text: `Watch brand: ${name}`,
      aria: `Remove watch brand filter ${name}`,
    });
  });

  const removeChip = (chip) => {
    if (typeof setFilters !== "function") return;
    setFilters((prev) => {
      const cur = mergeDefaults(prev);
      if (chip.key === "quantity") {
        if (chip.id === "quantity:in") {
          return { ...cur, quantity: { ...cur.quantity, in: false } };
        }
        if (chip.id === "quantity:out") {
          return { ...cur, quantity: { ...cur.quantity, out: false } };
        }
        return { ...cur, quantity: { in: false, out: false } };
      }
      if (chip.key === "movement") {
        const sub = chip.id.replace("movement:", "");
        const m = { ...cur.movement };
        delete m[sub];
        return { ...cur, movement: m };
      }
      if (chip.key === "band_type") {
        const sub = chip.id.replace("band_type:", "");
        const b = { ...cur.band_type };
        delete b[sub];
        return { ...cur, band_type: b };
      }
      if (chip.key === "brand") {
        const sub = chip.id.replace("brand:", "");
        const arr = (cur.brands || []).filter((s) => String(s) !== String(sub));
        return { ...cur, brands: arr };
      }
      return cur;
    });
  };

  const clearAll = () => {
    if (typeof setFilters !== "function") return;
    setFilters({
      quantity: { in: false, out: false },
      movement: {},
      band_type: {},
      brands: [],
    });
  };

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 shrink-0">
          Active filters
        </span>
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-gray-200 bg-gray-50 pl-3 pr-1 py-1 text-xs text-gray-800 shadow-sm"
          >
            <span className="truncate" title={chip.text}>
              {chip.text}
            </span>
            <button
              type="button"
              onClick={() => removeChip(chip)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
              aria-label={`Remove filter: ${chip.aria}`}
            >
              <span className="text-lg leading-none" aria-hidden>
                ×
              </span>
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
