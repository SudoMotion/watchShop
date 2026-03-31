"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart, setCart } from "@/lib/cartStorage";
import { getAuthToken, getCustomer, isLoggedIn } from "@/lib/auth";
import { NEXT_PUBLIC_API_URL } from "@/config";
import { couponApply } from "@/stores/CartAPI";
import { getCheckoutData, getShipAmount, checkoutStore } from "@/stores/CustomerAPI";

const cartImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = NEXT_PUBLIC_API_URL || "";
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
};

const getNumericPrice = (priceStr) => {
  if (priceStr == null) return 0;
  if (typeof priceStr === "number") return priceStr;
  return parseInt(String(priceStr).replace(/[৳,]/g, ""), 10) || 0;
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    district: "",
    order_note: "",
    payment_type: "cod",
  });

  const [districtId, setDistrictId] = useState("");
  const [shipCharge, setShipCharge] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const customer = typeof window !== "undefined" ? getCustomer() : null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getNumericPrice(item.price) * item.quantity,
    0
  );
  const itemDiscount = cartItems.reduce(
    (sum, item) =>
      sum +
      (getNumericPrice(item.originalPrice) - getNumericPrice(item.price)) *
        item.quantity,
    0
  );
  const orderTotal = subtotal;
  const totalAmount = Math.max(
    0,
    orderTotal - itemDiscount - couponDiscount + shipCharge
  );

  useEffect(() => {
    setCartItems(getCart());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) return;
    getCheckoutData({}, getAuthToken())
      .then((res) => {
        const data = res?.data;
        if (data?.districts && Array.isArray(data.districts)) {
          setDistricts(data.districts);
        }
      })
      .catch(() => {});
  }, [cartItems.length]);

  useEffect(() => {
    if (customer?.name) setFormData((f) => ({ ...f, name: customer.name }));
    if (customer?.phone) setFormData((f) => ({ ...f, phone: customer.phone }));
    if (customer?.email) setFormData((f) => ({ ...f, email: customer.email || "" }));
    if (customer?.address) setFormData((f) => ({ ...f, address: customer.address || "" }));
  }, [customer]);

  useEffect(() => {
    if (!districtId) {
      setShipCharge(0);
      return;
    }
    getShipAmount(districtId)
      .then((res) => {
        const data = res?.data;
        if (data?.amount != null) setShipCharge(Number(data.amount));
        else setShipCharge(0);
      })
      .catch(() => setShipCharge(0));
  }, [districtId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponMessage("Enter a coupon code");
      return;
    }
    setCouponMessage("");
    try {
      const res = await couponApply(code);
      const data = res?.data;
      if (data?.validity === true || data?.success === "success") {
        const discount = Number(data?.coupon_discount) || 0;
        setCouponDiscount(discount);
        setCouponApplied(true);
        setCouponMessage(data?.message || "Coupon applied.");
      } else {
        setCouponDiscount(0);
        setCouponApplied(false);
        setCouponMessage(data?.error || data?.message || "Invalid coupon.");
      }
    } catch {
      setCouponDiscount(0);
      setCouponApplied(false);
      setCouponMessage("Could not apply coupon.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    const district = districts.find((d) => String(d.id) === String(districtId));
    const area = district?.name || formData.area || formData.district || "";

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      order_total: orderTotal,
      total_amount: totalAmount,
      area,
      district: formData.district || area,
      order_note: formData.order_note || undefined,
      payment_type: formData.payment_type || "cod",
      ship_charge: shipCharge,
      couponDiscount: couponDiscount || undefined,
      email: formData.email?.trim() || undefined,
    };

    setSubmitting(true);
    try {
      const res = await checkoutStore(payload, token);
      const data = res?.data;

      if (res?.status === 201 && data?.success && data?.order) {
        const orderId = data.order?.id;
        setCart([]);
        if (data.payment_type === "bkash" && data.payment_redirect_url) {
          window.location.href = data.payment_redirect_url;
          return;
        }
        if (orderId) {
          window.location.href = `/order/success?id=${orderId}`;
        } else {
          window.location.href = "/order/success";
        }
        return;
      }

      const msg =
        data?.message ||
        (res?.status === 401 ? "Please log in to place an order." : null) ||
        (res?.status === 422 ? "Invalid form data." : null) ||
        "Could not place order.";
      setError(msg);
    } catch (err) {
      setError("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-gray-500">Loading checkout...</div>
      </div>
    );
  }

  if (cartItems.length === 0 && !submitting) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <Link
            href="/cart"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            View Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="md:text-3xl text-2xl font-bold mb-6">Checkout</h1>

        {!isLoggedIn() && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            You may need to{" "}
            <Link href="/login" className="font-semibold underline">
              log in
            </Link>{" "}
            to place an order. Some servers require customer authentication.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Contact &amp; Delivery</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      maxLength={60}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (11 digits) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      maxLength={191}
                      placeholder="House/Flat, Road, Area"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District / Area <span className="text-red-600">*</span>
                    </label>
                    {districts.length > 0 ? (
                      <select
                        name="area"
                        value={districtId}
                        onChange={(e) => {
                          setDistrictId(e.target.value);
                          const d = districts.find(
                            (x) => String(x.id) === String(e.target.value)
                          );
                          setFormData((f) => ({
                            ...f,
                            area: d?.name || "",
                            district: d?.name || "",
                          }));
                        }}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="">Select district</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} {d.amount != null ? `(৳${d.amount})` : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Dhaka"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order note
                    </label>
                    <textarea
                      name="order_note"
                      value={formData.order_note}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment_type"
                      value="cod"
                      checked={formData.payment_type === "cod"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-black focus:ring-black"
                    />
                    <span className="ml-3 font-medium">Cash on Delivery (COD)</span>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment_type"
                      value="bkash"
                      checked={formData.payment_type === "bkash"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-black focus:ring-black"
                    />
                    <span className="ml-3 font-medium">Online Payment (SSL Commerz)</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="flex items-start cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-black focus:ring-black" />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to the{" "}
                    <Link href="/terms-conditions" className="text-red-600 hover:underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-red-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 border-b pb-4 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {cartImageUrl(item.image) ? (
                          <Image
                            src={cartImageUrl(item.image)}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-red-600">
                          ৳{(getNumericPrice(item.price) * item.quantity).toLocaleString("en-BD")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">৳{orderTotal.toLocaleString("en-BD")}</span>
                  </div>
                  {shipCharge > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-medium">৳{shipCharge.toLocaleString("en-BD")}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon</span>
                      <span className="font-medium">-৳{couponDiscount.toLocaleString("en-BD")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-red-600">৳{totalAmount.toLocaleString("en-BD")}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponMessage("");
                      }}
                      placeholder="SAVE20"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`mt-1 text-sm ${
                        couponApplied ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {couponMessage}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {submitting ? "Placing order…" : "Place Order"}
                </button>

                <Link
                  href="/cart"
                  className="block text-center text-sm text-gray-600 hover:text-red-600"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
