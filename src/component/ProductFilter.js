"use client";

import React, { useState } from "react";

/** Merge checkbox into { [type]: { [value]: true } } for lifted state in parent */
function patchFilters(prev, type, value, checked) {
  const next = { ...prev };
  const bucket = { ...(next[type] || {}) };
  if (checked) bucket[value] = true;
  else delete bucket[value];
  if (Object.keys(bucket).length === 0) delete next[type];
  else next[type] = bucket;
  return next;
}

export default function ProductFilter({
  brandId,
  filters: filtersProp,
  setFilters: setFiltersProp,
}) {
  const [open, setOpen] = useState("gender");
  const [localFilters, setLocalFilters] = useState({});
  const isLifted = typeof setFiltersProp === "function";
  const filters = isLifted ? filtersProp ?? {} : localFilters;
  const setFilters = isLifted ? setFiltersProp : setLocalFilters;

  const toggle = (key) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  return (
    <div
      className="border border-gray-200 p-5 rounded-xl shadow-md flex flex-col gap-y-4 max-h-screen overflow-y-auto sticky top-0"
      data-brand-id={brandId ?? undefined}
    >
      <h2 className="text-lg font-semibold text-gray-800">Filters</h2>

      {/* Gender */}
      <div className="border border-gray-200 p-3 rounded-md">
        <button
          type="button"
          className={`text-xl flex items-center justify-between w-full text-left ${
            open === "gender" ? "border-b border-gray-300" : ""
          }`}
          onClick={() => toggle("gender")}
        >
          <span>Gender</span>
          <span className="text-gray-500">{open === "gender" ? "-" : "+"}</span>
        </button>

        {open === "gender" && (
          <div className="mt-2 ml-4 flex flex-col gap-y-2">
            <label className="flex items-center gap-x-1">
              <input
                type="checkbox"
                checked={!!filters?.gender?.mens}
                onChange={(e) =>
                  setFilters((prev) =>
                    patchFilters(prev, "gender", "mens", e.target.checked)
                  )
                }
              />
              <span>Mens Watch</span>
            </label>
            <label className="flex items-center gap-x-1">
              <input
                type="checkbox"
                checked={!!filters?.gender?.ladies}
                onChange={(e) =>
                  setFilters((prev) =>
                    patchFilters(prev, "gender", "ladies", e.target.checked)
                  )
                }
              />
              <span>Ladies Watch</span>
            </label>
          </div>
        )}
      </div>

      {/* Available Product */}
      <div className="border border-gray-200 p-3 rounded-md">
        <button
          type="button"
          className={`text-xl flex items-center justify-between w-full text-left ${
            open === "available" ? "border-b border-gray-300" : ""
          }`}
          onClick={() => toggle("available")}
        >
          <span>Available Product</span>
          <span className="text-gray-500">{open === "available" ? "-" : "+"}</span>
        </button>

        {open === "available" && (
          <div className="mt-2 ml-4 flex flex-col gap-y-2">
            <label className="flex items-center gap-x-1">
              <input
                type="checkbox"
                checked={!!filters?.availability?.in_stock}
                onChange={(e) =>
                  setFilters((prev) =>
                    patchFilters(prev, "availability", "in_stock", e.target.checked)
                  )
                }
              />
              <span>In Stock</span>
            </label>
            <label className="flex items-center gap-x-1">
              <input
                type="checkbox"
                checked={!!filters?.availability?.out_of_stock}
                onChange={(e) =>
                  setFilters((prev) =>
                    patchFilters(
                      prev,
                      "availability",
                      "out_of_stock",
                      e.target.checked
                    )
                  )
                }
              />
              <span>Out of Stock</span>
            </label>
          </div>
        )}
      </div>

      {/* Movement */}
      <div className="border border-gray-200 p-3 rounded-md">
        <button
          type="button"
          className={`text-xl flex items-center justify-between w-full text-left ${
            open === "movement" ? "border-b border-gray-300" : ""
          }`}
          onClick={() => toggle("movement")}
        >
          <span>Movement</span>
          <span className="text-gray-500">{open === "movement" ? "-" : "+"}</span>
        </button>

        {open === "movement" && (
          <div className="mt-2 ml-4 flex flex-col gap-y-2">
            <label className="flex items-center gap-x-1">
              <input
                type="checkbox"
                checked={!!filters?.movement?.automatic}
                onChange={(e) =>
                  setFilters((prev) =>
                    patchFilters(prev, "movement", "automatic", e.target.checked)
                  )
                }
              />
              <span>Automatic</span>
            </label>
            <label className="flex items-center gap-x-1">
              <input
                type="checkbox"
                checked={!!filters?.movement?.quartz}
                onChange={(e) =>
                  setFilters((prev) =>
                    patchFilters(prev, "movement", "quartz", e.target.checked)
                  )
                }
              />
              <span>Quartz</span>
            </label>
            <label className="flex items-center gap-x-1">
              <input
                type="checkbox"
                checked={!!filters?.movement?.solar}
                onChange={(e) =>
                  setFilters((prev) =>
                    patchFilters(prev, "movement", "solar", e.target.checked)
                  )
                }
              />
              <span>Solar</span>
            </label>
          </div>
        )}
      </div>

      {/* Band Type */}
      <div className="border border-gray-200 p-3 rounded-md">
        <button
          type="button"
          className={`text-xl flex items-center justify-between w-full text-left ${
            open === "band" ? "border-b border-gray-300" : ""
          }`}
          onClick={() => toggle("band")}
        >
          <span>Band Type</span>
          <span className="text-gray-500">{open === "band" ? "-" : "+"}</span>
        </button>

        {open === "band" && (
          <div className="mt-2 ml-4 flex flex-col gap-y-2">
            {[
              ["stainless_steel", "Stainless Steel"],
              ["leather", "Leather"],
              ["rubber", "Rubber"],
              ["calfskin", "Calfskin"],
              ["nylon", "Nylon"],
              ["silicone", "Silicone"],
              ["canvas", "Canvas"],
              ["calfskin_silicone", "Calfskin + Silicone"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-x-1">
                <input
                  type="checkbox"
                  checked={!!filters?.band?.[value]}
                  onChange={(e) =>
                    setFilters((prev) =>
                      patchFilters(prev, "band", value, e.target.checked)
                    )
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
