"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { getOrderSuccess } from "@/stores/CustomerAPI";
import { formatTaka } from "@/lib/formatPriceView";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") ?? null;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    const token = getAuthToken();
    setLoading(true);
    getOrderSuccess(id, {}, token)
      .then((res) => {
        if (res?.data?.order) setOrder(res.data.order);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading order...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Order Has Been Placed Successfully And Full Invoice For Details
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We will process it shortly.
          </p>
          {order?.order_number && (
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Order number: <span className="text-red-600">{order.order_number}</span>
            </p>
          )}
          {order?.total_amount != null && (
            <p className="text-gray-600 mb-6">
              Total: {formatTaka(Number(order.total_amount))}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
            <Link
              href="/dashboard"
              className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
