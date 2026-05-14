"use client";

import React, { useState, useEffect } from "react";
import {
  getCategoryLabels,
  getbrandLabels,
  normalizeBrandLabelsList,
  normalizeMovementsList,
} from "@/stores/ProductAPI";

function patchMap(prev, key, value, checked) {
  const next = { ...prev };
  const bucket = { ...(next[key] || {}) };
  if (checked) bucket[value] = true;
  else delete bucket[value];
  if (Object.keys(bucket).length === 0) delete next[key];
  else next[key] = bucket;
  return next;
}

function toggleBrandSlug(brands, slug) {
  const arr = Array.isArray(brands) ? [...brands] : [];
  const i = arr.indexOf(slug);
  if (i >= 0) arr.splice(i, 1);
  else arr.push(slug);
  return arr;
}

const BAND_TYPE_OPTIONS = [
  ["stainless_steel", "Stainless steel"],
  ["leather", "Leather"],
  ["rubber", "Rubber"],
  ["silicone", "Silicone"],
  ["nylon", "Nylon"],
  ["canvas", "Canvas"],
  ["calfskin", "Calfskin"],
];

export default function ProductFilter({
  brandId,
  filters: filtersProp,
  setFilters: setFiltersProp,
  stockCounts,
  /** Category page: subcategories from API; omit or empty = hide Subcategory block */
  subcategoryOptions = null,
  category_id,
  brand_id
}) {
  const [open, setOpen] = useState("quantity");
  const [localFilters, setLocalFilters] = useState({
    quantity: { in: false, out: false },
    movement: {},
    band_type: {},
    brands: [],
    subcategories: [],
  });
  const [brandList, setBrandList] = useState([]);
  const [movementOptions, setMovementOptions] = useState([]);

  const isLifted = typeof setFiltersProp === "function";
  const filters = isLifted ? mergeDefaults(filtersProp) : localFilters;
  const setFilters = isLifted ? setFiltersProp : setLocalFilters;

  useEffect(() => {
    let cancelled = false;
    const params =
      brand_id != null && String(brand_id).trim() !== ""
        ? { brand_id }
        : {};
    getbrandLabels(params)
      .then((res) => {
        if (cancelled) return;
        const list = normalizeBrandLabelsList(res);
        setBrandList(list);
      })
      .catch(() => setBrandList([]));
    return () => {
      cancelled = true;
    };
  }, [brand_id]);

  useEffect(() => {
    let cancelled = false;
    getCategoryLabels({ category_id })
      .then((res) => {
        if (cancelled) return;
        setMovementOptions(normalizeMovementsList(res, category_id));
      })
      .catch(() => setMovementOptions([]));
    return () => { cancelled = true; };
  }, [category_id]);

  const toggle = (key) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  const brandSlug = (b) =>
    b?.slug ?? b?.brand_slug ?? b?.id ?? String(b?.name ?? "");

  const brandLabel = (b) => b?.name ?? brandSlug(b);

  const expandIcon = (sectionKey) => (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center text-3xl font-light leading-none text-gray-500 sm:h-9 sm:w-9 sm:text-[2rem]"
      aria-hidden
    >
      {open === sectionKey ? "-" : "+"}
    </span>
  );

  return (
    <div
      className="border border-gray-200 p-3 rounded-xl shadow-md flex flex-col gap-y-2 max-h-screen overflow-y-auto md:sticky top-0"
      data-brand-id={brandId ?? undefined}
    >
      <h2 className="text-base font-semibold text-gray-800">Filters</h2>

      <div className="border border-gray-200 p-2 rounded-md">
        <button
          type="button"
          className={`flex w-full items-center justify-between gap-2 text-left text-base font-medium text-gray-900 ${
            open === "quantity" ? "border-b border-gray-300 pb-1.5" : ""
          }`}
          onClick={() => toggle("quantity")}
        >
          <span>Available quantity</span>
          {expandIcon("quantity")}
        </button>
        {open === "quantity" && (
          <div className="mt-2 ml-0.5 space-y-1.5">
            <label className="flex items-center gap-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={!!filters?.quantity?.in}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...mergeDefaults(prev),
                    quantity: {
                      ...mergeDefaults(prev).quantity,
                      in: e.target.checked,
                    },
                  }))
                }
              />
              <span>
                Stock in
                {" "}
                <span className="text-gray-500">({Number(stockCounts?.in || 0)})</span>
              </span>
            </label>
            <label className="flex items-center gap-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={!!filters?.quantity?.out}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...mergeDefaults(prev),
                    quantity: {
                      ...mergeDefaults(prev).quantity,
                      out: e.target.checked,
                    },
                  }))
                }
              />
              <span>
                Stock out
                {" "}
                <span className="text-gray-500">({Number(stockCounts?.out || 0)})</span>
              </span>
            </label>
          </div>
        )}
      </div>

      {Array.isArray(subcategoryOptions) && subcategoryOptions.length > 0 ? (
        <div className="border border-gray-200 p-2 rounded-md">
          <button
            type="button"
            className={`flex w-full items-center justify-between gap-2 text-left text-base font-medium text-gray-900 ${
              open === "subcategory" ? "border-b border-gray-300 pb-1.5" : ""
            }`}
            onClick={() => toggle("subcategory")}
          >
            <span>Subcategory</span>
            {expandIcon("subcategory")}
          </button>
          {open === "subcategory" && (
            <div className="mt-2 ml-0.5 max-h-56 overflow-y-auto flex flex-col gap-y-1.5">
              {subcategoryOptions.map((sub) => {
                const slug =
                  sub?.slug ?? sub?.subcategory_slug ?? String(sub?.id ?? "");
                if (!slug) return null;
                const checked =
                  Array.isArray(filters.subcategories) &&
                  filters.subcategories.includes(slug);
                return (
                  <label key={slug} className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...mergeDefaults(prev),
                          subcategories: toggleBrandSlug(
                            mergeDefaults(prev).subcategories,
                            slug
                          ),
                        }))
                      }
                    />
                    <span className="text-sm">{sub?.name ?? slug}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      <div className="border border-gray-200 p-2 rounded-md">
        <button
          type="button"
          className={`flex w-full items-center justify-between gap-2 text-left text-base font-medium text-gray-900 ${
            open === "movement" ? "border-b border-gray-300 pb-1.5" : ""
          }`}
          onClick={() => toggle("movement")}
        >
          <span>Movement</span>
          {expandIcon("movement")}
        </button>
        {open === "movement" && (
          <div className="mt-2 ml-2 flex flex-col gap-y-1.5">
            {movementOptions.length === 0 ? (
              <p className="text-sm text-gray-500">No movement available</p>
            ) : (
              movementOptions.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    checked={!!filters?.movement?.[value]}
                    onChange={(e) =>
                      setFilters((prev) =>
                        patchMap(
                          mergeDefaults(prev),
                          "movement",
                          value,
                          e.target.checked
                        )
                      )
                    }
                  />
                  <span>{label}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      <div className="border border-gray-200 p-2 rounded-md">
        <button
          type="button"
          className={`flex w-full items-center justify-between gap-2 text-left text-base font-medium text-gray-900 ${
            open === "band_type" ? "border-b border-gray-300 pb-1.5" : ""
          }`}
          onClick={() => toggle("band_type")}
        >
          <span>Band type</span>
          {expandIcon("band_type")}
        </button>
        {open === "band_type" && (
          <div className="mt-2 ml-2 flex flex-col gap-y-1.5">
            {BAND_TYPE_OPTIONS.map(([value, label]) => (
              <label key={value} className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  checked={!!filters?.band_type?.[value]}
                  onChange={(e) =>
                    setFilters((prev) =>
                      patchMap(
                        mergeDefaults(prev),
                        "band_type",
                        value,
                        e.target.checked
                      )
                    )
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border border-gray-200 p-2 rounded-md">
        <button
          type="button"
          className={`flex w-full items-center justify-between gap-2 text-left text-base font-medium text-gray-900 ${
            open === "brands" ? "border-b border-gray-300 pb-1.5" : ""
          }`}
          onClick={() => toggle("brands")}
        >
          <span>Brands</span>
          {expandIcon("brands")}
        </button>
        {open === "brands" && (
          <div className="mt-2 ml-0.5 max-h-56 overflow-y-auto flex flex-col gap-y-1.5">
            {brandList.length === 0 ? (
              <p className="text-sm text-gray-500">No brands available</p>
            ) : (
              brandList.map((b) => {
                const slug = brandSlug(b);
                if (!slug) return null;
                return (
                  <label key={slug} className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      checked={Array.isArray(filters.brands) && filters.brands.includes(slug)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...mergeDefaults(prev),
                          brands: toggleBrandSlug(mergeDefaults(prev).brands, slug),
                        }))
                      }
                    />
                    <span className="text-sm">{brandLabel(b)}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
    subcategories: Array.isArray(x.subcategories) ? x.subcategories : [],
  };
}
