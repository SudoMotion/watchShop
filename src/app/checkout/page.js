"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart, setCart } from "@/lib/cartStorage";
import { getAuthToken, getCustomer, isLoggedIn } from "@/lib/auth";
import { NEXT_PUBLIC_API_URL } from "@/config";
import { couponApply } from "@/stores/CartAPI";
import {
  getCheckoutData,
  getShipAmount,
  checkoutStore,
  getPathaoCities,
  getPathaoZones,
  getPathaoAreas,
} from "@/stores/CustomerAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function strFilled(v) {
  return v != null && String(v).trim() !== "";
}

function normalizePathaoList(res) {
  const raw = res?.data;
  const arr = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.cities)
          ? raw.cities
          : Array.isArray(raw?.zones)
            ? raw.zones
            : Array.isArray(raw?.areas)
              ? raw.areas
              : [];
  return arr
    .map((item) => ({
      id: item.id ?? item.city_id ?? item.zone_id ?? item.area_id,
      name:
        item.name ??
        item.city_name ??
        item.zone_name ??
        item.area_name ??
        (item.id != null ? String(item.id) : ""),
    }))
    .filter((x) => x.id != null && x.name !== "");
}

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
    customer_pickup: false,
    b_name: "",
    b_email: "",
    b_phone: "",
    b_district: "",
    b_address: "",
  });

  const [districtId, setDistrictId] = useState("");
  const [shipCharge, setShipCharge] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const [pathaoEnabled, setPathaoEnabled] = useState(false);
  const [pathaoLocationsRequired, setPathaoLocationsRequired] = useState(false);
  const [pathaoCities, setPathaoCities] = useState([]);
  const [pathaoZones, setPathaoZones] = useState([]);
  const [pathaoAreas, setPathaoAreas] = useState([]);
  const [pathaoCityId, setPathaoCityId] = useState("");
  const [pathaoZoneId, setPathaoZoneId] = useState("");
  const [pathaoAreaId, setPathaoAreaId] = useState("");
  const [pathaoLoading, setPathaoLoading] = useState(false);
  const [apiReadOnly, setApiReadOnly] = useState({
    name: false,
    phone: false,
    email: false,
    address: false,
  });
  const token = typeof window !== "undefined" ? getAuthToken() : null;

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
        const apiCustomer = data?.customer;
        if (apiCustomer && typeof apiCustomer === "object") {
          setFormData((f) => ({
            ...f,
            name: strFilled(apiCustomer.name) ? String(apiCustomer.name) : f.name,
            phone: strFilled(apiCustomer.phone) ? String(apiCustomer.phone) : f.phone,
            email:
              apiCustomer.email != null
                ? String(apiCustomer.email)
                : f.email,
            address: strFilled(apiCustomer.address) ? String(apiCustomer.address) : f.address,
          }));
          setApiReadOnly({
            name: strFilled(apiCustomer.name),
            phone: strFilled(apiCustomer.phone),
            email: apiCustomer.email != null && String(apiCustomer.email).trim() !== "",
            address: strFilled(apiCustomer.address),
          });
        } else {
          const c = typeof window !== "undefined" ? getCustomer() : null;
          if (c) {
            setFormData((f) => ({
              ...f,
              ...(strFilled(c.name) ? { name: String(c.name) } : {}),
              ...(strFilled(c.phone) ? { phone: String(c.phone) } : {}),
              ...(c.email != null ? { email: String(c.email || "") } : {}),
              ...(strFilled(c.address) ? { address: String(c.address) } : {}),
            }));
          }
          setApiReadOnly({
            name: false,
            phone: false,
            email: false,
            address: false,
          });
        }
        const pe = !!data?.pathao_enabled;
        const pr = !!data?.pathao_locations_required;
        setPathaoEnabled(pe);
        setPathaoLocationsRequired(pr);
        if (pe) {
          setPathaoLoading(true);
          getPathaoCities()
            .then((r) => setPathaoCities(normalizePathaoList(r)))
            .catch(() => setPathaoCities([]))
            .finally(() => setPathaoLoading(false));
        } else {
          setPathaoCities([]);
          setPathaoZones([]);
          setPathaoAreas([]);
          setPathaoCityId("");
          setPathaoZoneId("");
          setPathaoAreaId("");
        }
      })
      .catch(() => {});
  }, [cartItems.length]);

  useEffect(() => {
    if (!pathaoCityId) {
      setPathaoZones([]);
      setPathaoAreas([]);
      setPathaoZoneId("");
      setPathaoAreaId("");
      return;
    }
    setPathaoLoading(true);
    getPathaoZones(pathaoCityId)
      .then((r) => setPathaoZones(normalizePathaoList(r)))
      .catch(() => setPathaoZones([]))
      .finally(() => setPathaoLoading(false));
  }, [pathaoCityId]);

  useEffect(() => {
    if (!pathaoZoneId) {
      setPathaoAreas([]);
      setPathaoAreaId("");
      return;
    }
    setPathaoLoading(true);
    getPathaoAreas(pathaoZoneId)
      .then((r) => setPathaoAreas(normalizePathaoList(r)))
      .catch(() => setPathaoAreas([]))
      .finally(() => setPathaoLoading(false));
  }, [pathaoZoneId]);

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

  const readOnlyInputClass =
    "bg-gray-50 text-gray-800 cursor-not-allowed border-gray-200";

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (apiReadOnly[name]) return;
    const next = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
    setError(null);
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponMessage("Enter a coupon code");
      toast.error("Enter a coupon code");
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
        toast.success(data?.message || "Coupon applied.");
      } else {
        setCouponDiscount(0);
        setCouponApplied(false);
        const msg = data?.error || data?.message || "Invalid coupon.";
        setCouponMessage(msg);
        toast.error(msg);
      }
    } catch {
      setCouponDiscount(0);
      setCouponApplied(false);
      setCouponMessage("Could not apply coupon.");
      toast.error("Could not apply coupon.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (cartItems.length === 0) {
      const msg = "Your cart is empty.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (
      pathaoEnabled &&
      pathaoLocationsRequired &&
      (!pathaoCityId || !pathaoZoneId || !pathaoAreaId)
    ) {
      const msg = "Please select Pathao city, zone, and area for delivery.";
      setError(msg);
      toast.error(msg);
      return;
    }
    const district = districts.find((d) => String(d.id) === String(districtId));
    const area = district?.name || formData.area || formData.district || "";

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      order_total: Number(orderTotal),
      total_amount: Number(totalAmount),
      area: String(area),
      district: (formData.district || area || "").trim(),
      order_note: formData.order_note?.trim() || undefined,
      payment_type: formData.payment_type || "cod",
      ship_charge: Number(shipCharge) || 0,
      email: formData.email?.trim() || undefined,
      customer_pickup: Boolean(formData.customer_pickup),
    };

    if (couponDiscount > 0) {
      payload.couponDiscount = Number(couponDiscount);
    }

    if (pathaoEnabled && pathaoCityId && pathaoZoneId && pathaoAreaId) {
      payload.pathao_city_id = Number(pathaoCityId) || pathaoCityId;
      payload.pathao_zone_id = Number(pathaoZoneId) || pathaoZoneId;
      payload.pathao_area_id = Number(pathaoAreaId) || pathaoAreaId;
    }

    const bName = formData.b_name?.trim();
    const bEmail = formData.b_email?.trim();
    const bPhone = formData.b_phone?.trim();
    const bDistrict = formData.b_district?.trim();
    const bAddress = formData.b_address?.trim();
    if (bName) payload.b_name = bName;
    if (bEmail) payload.b_email = bEmail;
    if (bPhone) payload.b_phone = bPhone;
    if (bDistrict) payload.b_district = bDistrict;
    if (bAddress) payload.b_address = bAddress;

    setSubmitting(true);
    try {
      const res = await checkoutStore(payload, token);
      const data = res?.data;

      if (res?.status === 201 && data?.success && data?.order) {
        const orderId = data.order?.id;
        setCart([]);
        if (data.payment_redirect_url) {
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
      toast.error(msg);
    } catch (err) {
      const msg = "Could not place order. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-gray-500">Loading checkout...</div>
      </div>
    );
  }

  if (cartItems.length === 0 && !submitting) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-gray-50 to-gray-100/80 py-12 md:py-16">
        <div className="max-w-lg mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
            Checkout
          </h1>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 text-center">
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              aria-hidden
            >
              <svg
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nothing to check out yet
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
              Add items to your cart first, then return here to review your order
              and complete payment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link
                href="/cart"
                className="inline-flex justify-center items-center bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-sm"
              >
                Go to cart
              </Link>
              <Link
                href="/"
                className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold text-gray-800 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-4">
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
                      readOnly={apiReadOnly.name}
                      required
                      maxLength={60}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        apiReadOnly.name ? readOnlyInputClass : ""
                      }`}
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
                      readOnly={apiReadOnly.phone}
                      required
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        apiReadOnly.phone ? readOnlyInputClass : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly={apiReadOnly.email}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        apiReadOnly.email ? readOnlyInputClass : ""
                      }`}
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
                      readOnly={apiReadOnly.address}
                      required
                      maxLength={191}
                      placeholder="House/Flat, Road, Area"
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        apiReadOnly.address ? readOnlyInputClass : ""
                      }`}
                    />
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-800 mb-3">Billing address (optional)</p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="b_name"
                        value={formData.b_name}
                        onChange={handleInputChange}
                        placeholder="Billing name"
                        maxLength={60}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <input
                        type="email"
                        name="b_email"
                        value={formData.b_email}
                        onChange={handleInputChange}
                        placeholder="Billing email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <input
                        type="tel"
                        name="b_phone"
                        value={formData.b_phone}
                        onChange={handleInputChange}
                        placeholder="Billing phone"
                        maxLength={11}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="b_district"
                        value={formData.b_district}
                        onChange={handleInputChange}
                        placeholder="Billing district"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="b_address"
                        value={formData.b_address}
                        onChange={handleInputChange}
                        placeholder="Billing address"
                        maxLength={191}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
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

                  <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="customer_pickup"
                      checked={!!formData.customer_pickup}
                      onChange={handleInputChange}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-800">
                      <span className="font-medium">Customer pickup</span>
                      <span className="block text-gray-600 mt-0.5">
                        I will collect my order from the store (not home delivery).
                      </span>
                    </span>
                  </label>

                  {pathaoEnabled && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        Pathao delivery location
                        {pathaoLocationsRequired && (
                          <span className="text-red-600"> *</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Select city, zone, and area for courier delivery.
                      </p>
                      <div className="space-y-3">
                        <select
                          value={pathaoCityId}
                          onChange={(e) => {
                            const v = e.target.value;
                            setPathaoCityId(v);
                            setPathaoZoneId("");
                            setPathaoAreaId("");
                          }}
                          required={pathaoLocationsRequired}
                          disabled={pathaoLoading && pathaoCities.length === 0}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="">Select city</option>
                          {pathaoCities.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={pathaoZoneId}
                          onChange={(e) => {
                            setPathaoZoneId(e.target.value);
                            setPathaoAreaId("");
                          }}
                          required={pathaoLocationsRequired}
                          disabled={!pathaoCityId}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="">Select zone</option>
                          {pathaoZones.map((z) => (
                            <option key={z.id} value={z.id}>
                              {z.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={pathaoAreaId}
                          onChange={(e) => setPathaoAreaId(e.target.value)}
                          required={pathaoLocationsRequired}
                          disabled={!pathaoZoneId}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="">Select area</option>
                          {pathaoAreas.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

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
                      value="sslcommerz"
                      checked={formData.payment_type === "sslcommerz"}
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
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span>Customer pickup</span>
                    <span className="font-medium">
                      {formData.customer_pickup ? "Yes" : "No"}
                    </span>
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
      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}
