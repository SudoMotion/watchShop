"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "@/lib/auth";
import {
  useCustomerProfile,
  useUpdateCustomerProfile,
  useCustomerOrders,
} from "@/hooks/useCustomerProfile";
import { formatBdt } from "@/lib/formatPriceView";
import { Pagination } from "@/component/Pagination";

const BD_PHONE = /^01[13-9][0-9]{8}$/;

export default function AccountPage() {
  const router = useRouter();
  const { customer, setCustomer, loading, error, refetch } = useCustomerProfile();
  const { updateProfile, updating, error: updateError, clearError } =
    useUpdateCustomerProfile();

  const [ordersPage, setOrdersPage] = useState(1);
  const {
    list: orders,
    loading: ordersLoading,
    error: ordersError,
    current_page: ordersCurrentPage,
    last_page: ordersLastPage,
    total: ordersTotal,
    refetch: refetchOrders,
  } = useCustomerOrders(ordersPage, 15);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!getAuthToken()) {
      router.replace("/login");
      return;
    }
    if (!customer) {
      router.replace("/login");
    }
  }, [loading, customer, router]);

  useEffect(() => {
    if (editOpen && customer) {
      setForm({
        name: customer.name ?? "",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        address: customer.address ?? "",
      });
      clearError();
    }
  }, [editOpen, customer, clearError]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("watchshop_auth");
      document.cookie = "watchshop_logged_in=; path=/; max-age=0";
    } catch (_) {}
    router.replace("/login");
  };

  const openEdit = () => {
    clearError();
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    clearError();
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const name = String(form.name || "").trim();
    const email = String(form.email || "").trim();
    const phone = String(form.phone || "").trim();
    const address = String(form.address || "").trim();

    if (!name && !email && !phone && !address) {
      toast.error("Fill at least one field to update.");
      return;
    }
    if (phone && !BD_PHONE.test(phone)) {
      toast.error("Enter a valid 11-digit Bangladesh mobile (01…).");
      return;
    }

    const body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (phone) body.phone = phone;
    if (address) body.address = address;

    const result = await updateProfile(body);
    if (result.ok) {
      setCustomer(result.customer);
      toast.success("Profile updated successfully.");
      closeEdit();
      await refetch();
      await refetchOrders();
    } else {
      toast.error(result.error || "Update failed");
    }
  };

  if (loading && !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">
          {error || "Could not load account."}
        </div>
      </div>
    );
  }

  const initials = (customer.name || customer.email || "?")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fields = [
    {
      label: "Name",
      value: customer.name,
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      label: "Email",
      value: customer.email,
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      label: "Phone",
      value: customer.phone,
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    },
    {
      label: "Address",
      value: customer.address,
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2500} newestOnTop />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            My Account
          </h1>
          <p className="mt-1 text-gray-600 text-sm">
            Your profile, orders, and contact details
          </p>
          {error && (
            <p className="mt-2 text-amber-700 text-sm" role="status">
              {error} (showing last saved details)
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-6 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl sm:text-3xl font-semibold text-white border-2 border-white/40 shadow-inner">
                {initials}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {customer.name || "Account"}
                </h2>
                <p className="text-teal-100 text-sm mt-0.5">{customer.email}</p>
                {customer.id != null && (
                  <p className="text-teal-200/90 text-xs mt-1">ID #{customer.id}</p>
                )}
              </div>
            </div>
          </div>

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

          <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={openEdit}
              className="inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex justify-center items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </button>
          </div>
        </div>

        {/* Order history */}
        <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">My orders</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {ordersTotal > 0
                  ? `${ordersTotal} order${ordersTotal === 1 ? "" : "s"} total`
                  : ordersLoading
                    ? "Loading…"
                    : "No orders yet"}
              </p>
            </div>
          </div>

          {ordersError && (
            <div className="px-6 py-3 text-sm text-amber-800 bg-amber-50 border-b border-amber-100">
              {ordersError}
            </div>
          )}

          {ordersLoading && orders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 text-sm">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 text-sm">
              You have no orders to show.{" "}
              <Link href="/" className="text-teal-600 font-medium hover:text-teal-700">
                Continue shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-600 border-b border-gray-100">
                      <th className="px-6 py-3 font-medium">Order</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/80">
                        <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                          {row.order_number ?? `#${row.id}`}
                        </td>
                        <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
                          {row.order_date ?? "—"}
                        </td>
                        <td className="px-6 py-3 text-gray-700">{row.status ?? "—"}</td>
                        <td className="px-6 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                          {formatBdt(row.total_amount ?? row.amount ?? 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y divide-gray-100">
                {orders.map((row) => (
                  <div key={row.id} className="px-6 py-4 space-y-1">
                    <div className="flex justify-between gap-2">
                      <span className="font-semibold text-gray-900">
                        {row.order_number ?? `#${row.id}`}
                      </span>
                      <span className="font-medium text-gray-900 tabular-nums">
                        {formatBdt(row.total_amount ?? row.amount ?? 0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{row.order_date ?? "—"}</p>
                    <p className="text-sm text-gray-700">{row.status ?? "—"}</p>
                    {(row.payment_type || row.online_payment_status) && (
                      <p className="text-xs text-gray-500">
                        {[row.payment_type, row.online_payment_status].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {ordersLastPage > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-sm text-gray-600 text-center mb-2">
                    Page {ordersCurrentPage} of {ordersLastPage}
                    {ordersTotal > 0 ? ` (${ordersTotal} orders)` : ""}
                  </p>
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={ordersCurrentPage}
                      lastPage={ordersLastPage}
                      onPageChange={(page) => setOrdersPage(page)}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">
            ← Back to home
          </Link>
        </p>
      </div>

      {editOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 id="edit-profile-title" className="text-lg font-semibold text-gray-900">
                Edit profile
              </h2>
              <button
                type="button"
                onClick={closeEdit}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitEdit} className="px-5 py-4 space-y-4">
              <p className="text-sm text-gray-600">
                Update your details below. At least one field must be filled.
              </p>
              {updateError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{updateError}</p>
              )}
              <div>
                <label htmlFor="profile-name" className="block text-xs font-medium text-gray-500 mb-1">
                  Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="profile-phone" className="block text-xs font-medium text-gray-500 mb-1">
                  Phone
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="01712345678"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="profile-address" className="block text-xs font-medium text-gray-500 mb-1">
                  Address
                </label>
                <textarea
                  id="profile-address"
                  rows={3}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none resize-y"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
                >
                  {updating ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
