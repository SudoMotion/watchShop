"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AUTH_KEY = "watchshop_auth";

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) {
        router.replace("/login");
        return;
      }
      const { customer: c } = JSON.parse(raw);
      if (c && (c.id != null || c.phone)) {
        setCustomer(c);
      } else {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
      document.cookie = "watchshop_logged_in=; path=/; max-age=0";
    } catch (_) {}
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const initials = (customer.name || customer.email || "?")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fields = [
    { label: "Name", value: customer.name, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { label: "Email", value: customer.email, icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Phone", value: customer.phone, icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
    { label: "Address", value: customer.address, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            My Account
          </h1>
          <p className="mt-1 text-gray-600 text-sm">
            Your profile and contact details
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Avatar + name strip */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-6 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl sm:text-3xl font-semibold text-white border-2 border-white/40 shadow-inner">
                {initials}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {customer.name || "Account"}
                </h2>
                <p className="text-teal-100 text-sm mt-0.5">
                  {customer.email}
                </p>
                {customer.id != null && (
                  <p className="text-teal-200/90 text-xs mt-1">
                    ID #{customer.id}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="divide-y divide-gray-100">
            {fields.map(({ label, value, icon }) => (
              <div
                key={label}
                className="flex items-start gap-4 px-6 py-4 sm:py-5 hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-gray-900 font-medium mt-0.5 break-words">
                    {value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="inline-flex justify-center items-center gap-2 px-5 py-2.5 border border-teal-600 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
              Dashboard
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex justify-center items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
