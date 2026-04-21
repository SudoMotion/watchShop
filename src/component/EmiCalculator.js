"use client";

import { useMemo, useState } from "react";

export default function EmiCalculator() {
  const [priceInput, setPriceInput] = useState("");
  const [tenure, setTenure] = useState("3");

  const price = Number(priceInput || 0);
  const months = Number(tenure || 3);
  const monthlyEmi = useMemo(() => {
    if (!price || price <= 0 || !months) return 0;
    return price / months;
  }, [price, months]);

  return (
    <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">EMI Calculator</h2>
      <p className="mt-1 text-sm text-gray-700">
        Enter product price and select tenure (3, 4, or 6 months) to get
        estimated monthly EMI.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="emi-price"
            className="mb-1 block text-sm font-medium text-gray-800"
          >
            Product price (BDT)
          </label>
          <input
            id="emi-price"
            type="number"
            min="0"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            placeholder="e.g. 12000"
            className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label
            htmlFor="emi-tenure"
            className="mb-1 block text-sm font-medium text-gray-800"
          >
            Tenure (months)
          </label>
          <select
            id="emi-tenure"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="3">3 months</option>
            <option value="4">4 months</option>
            <option value="6">6 months</option>
          </select>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-indigo-200 bg-white px-4 py-3">
        <p className="text-sm text-gray-600">Estimated monthly EMI</p>
        <p className="mt-1 text-xl font-bold text-indigo-700">
          BDT{" "}
          {monthlyEmi > 0
            ? monthlyEmi.toLocaleString("en-BD", {
                maximumFractionDigits: 2,
              })
            : "0"}
        </p>
      </div>

      <p className="mt-2 text-xs text-gray-600">
        This is an estimated value. Final EMI amount may vary by bank fees,
        interest, and processing charges.
      </p>
    </div>
  );
}

