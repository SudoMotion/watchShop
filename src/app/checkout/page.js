"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart, setCart } from "@/lib/cartStorage";
import { getAuthToken, getCustomer, isLoggedIn } from "@/lib/auth";
import { NEXT_PUBLIC_API_URL } from "@/config";
import { couponApply } from "@/stores/CartAPI";
import {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/stores/AuthAPI";
import {
  getCheckoutData,
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

const SHIPPING_INSIDE_DHAKA = 70;
const SHIPPING_OUTSIDE_DHAKA = 130;

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
    ship_to_different_address: false,
    s_name: "",
    s_phone: "",
    s_address: "",
    s_area: "",
    s_district: "",
    b_name: "",
    b_email: "",
    b_phone: "",
    b_district: "",
    b_address: "",
    password: "",
  });

  const [districtId, setDistrictId] = useState("");
  const [shippingDistrictId, setShippingDistrictId] = useState("");
  const [shippingMethod, setShippingMethod] = useState("inside_dhaka");
  const [shipCharge, setShipCharge] = useState(SHIPPING_INSIDE_DHAKA);
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
  const [existingCustomerMode, setExistingCustomerMode] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [registering, setRegistering] = useState(false);
  /** User chose to enter a code without requesting a new OTP via SMS. */
  const [hasExistingCode, setHasExistingCode] = useState(false);
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
    if (typeof window === "undefined") return;
    if (!isLoggedIn()) return;
    setExistingCustomerMode(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpCode("");
    setHasExistingCode(false);
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
    if (formData.customer_pickup) {
      setShipCharge(0);
      return;
    }
    if (shippingMethod === "inside_dhaka") {
      setShipCharge(SHIPPING_INSIDE_DHAKA);
    } else if (shippingMethod === "outside_dhaka") {
      setShipCharge(SHIPPING_OUTSIDE_DHAKA);
    } else {
      setShipCharge(0);
    }
  }, [shippingMethod, formData.customer_pickup]);

  const readOnlyInputClass =
    "bg-gray-50 text-gray-800 cursor-not-allowed border-gray-200";

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (apiReadOnly[name]) return;
    const next = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
    setError(null);
  };

  const handleExistingCustomerToggle = (checked) => {
    setExistingCustomerMode(checked);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpCode("");
    setHasExistingCode(false);
    setError(null);
  };

  const handleOtpBackToPhone = () => {
    setOtpSent(false);
    setOtpCode("");
    setHasExistingCode(false);
    setError(null);
  };

  const handleHaveExistingCode = () => {
    const phone = String(formData.phone || "").replace(/\D/g, "");
    if (phone.length !== 11) {
      toast.error("Enter a valid 11-digit mobile number first.");
      return;
    }
    setFormData((prev) => ({ ...prev, phone }));
    setHasExistingCode(true);
    setOtpSent(true);
    setOtpCode("");
    setError(null);
  };

  const handleSignupAndSendOtp = async () => {
    const name = String(formData.name || "").trim();
    const email = String(formData.email || "").trim();
    const phone = String(formData.phone || "").replace(/\D/g, "");
    const address = String(formData.address || "").trim();
    const password = String(formData.password || "");

    if (!name || !email || !phone || !address || !password) {
      toast.error("Name, Email, Phone, Address and Password are required.");
      return;
    }
    if (phone.length !== 11) {
      toast.error("Enter a valid 11-digit mobile number.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setRegistering(true);
    try {
      const registerRes = await useRegisterMutation({
        name,
        email,
        phone,
        address,
        password,
        privacy_policy: 1,
      });
      if (!(registerRes?.status >= 200 && registerRes?.status < 300)) {
        const msg =
          registerRes?.data?.message ||
          registerRes?.data?.error ||
          "Registration failed.";
        toast.error(msg);
        return;
      }

      const otpRes = await useSendOtpMutation({ phone });
      if (otpRes?.status >= 200 && otpRes?.status < 300) {
        setHasExistingCode(false);
        setOtpSent(true);
        toast.success(
          otpRes?.data?.message ||
            "Account created. OTP sent. Verify OTP to continue."
        );
      } else {
        const msg =
          otpRes?.data?.message ||
          otpRes?.data?.error ||
          "Account created but OTP send failed.";
        toast.error(msg);
      }
    } catch {
      toast.error("Could not complete signup and OTP send.");
    } finally {
      setRegistering(false);
    }
  };

  const handleSendOtp = async () => {
    const phone = String(formData.phone || "").replace(/\D/g, "");
    if (phone.length !== 11) {
      toast.error("Enter a valid 11-digit mobile number.");
      return;
    }
    setOtpSending(true);
    try {
      const response = await useSendOtpMutation({ phone });
      if (response?.status >= 200 && response?.status < 300) {
        setFormData((prev) => ({ ...prev, phone }));
        setHasExistingCode(false);
        setOtpSent(true);
        const msg = response?.data?.message;
        toast.success(
          typeof msg === "string" && msg.trim()
            ? msg
            : "OTP sent. Enter the code below to verify."
        );
      } else {
        const errMsg =
          response?.data?.message ||
          response?.data?.error ||
          "Could not send OTP. Try again.";
        toast.error(typeof errMsg === "string" ? errMsg : "Could not send OTP.");
      }
    } catch {
      toast.error("Could not send OTP. Try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const phone = String(formData.phone || "").replace(/\D/g, "");
    const otp = String(otpCode || "").trim();
    if (phone.length !== 11) {
      toast.error("Invalid phone number. Go back and enter your number.");
      return;
    }
    if (!otp) {
      toast.error("Enter the OTP code.");
      return;
    }
    setOtpVerifying(true);
    try {
      const response = await useVerifyOtpMutation({ phone, otp });
      const status = response?.status ?? 0;
      if (status < 200 || status >= 300) {
        const errMsg =
          response?.data?.message ||
          response?.data?.error ||
          "Invalid OTP. Try again.";
        toast.error(typeof errMsg === "string" ? errMsg : "Invalid OTP.");
        return;
      }

      const raw = response?.data ?? {};
      const payload =
        raw?.data &&
        typeof raw.data === "object" &&
        !Array.isArray(raw.data) &&
        (raw.data.token != null ||
          raw.data.access_token != null ||
          raw.data.customer != null ||
          raw.data.user != null)
          ? raw.data
          : raw;

      if (payload?.success === false) {
        const failMsg = payload?.message;
        toast.error(
          typeof failMsg === "string" && failMsg.trim()
            ? failMsg
            : "Verification failed."
        );
        return;
      }

      const token = payload?.token ?? payload?.access_token;
      const customer = payload?.customer ?? payload?.user;
      const token_type = payload?.token_type ?? "Bearer";

      if (token == null || !customer) {
        toast.error("Could not complete sign-in. Missing token or profile.");
        return;
      }

      try {
        localStorage.setItem(
          "watchshop_auth",
          JSON.stringify({ token, customer, token_type })
        );
        document.cookie =
          "watchshop_logged_in=1; path=/; max-age=2592000";
      } catch (_) {
        toast.error("Could not save your session. Check browser storage.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        name: customer.name ?? prev.name,
        phone:
          String(customer.phone ?? prev.phone)
            .replace(/\D/g, "")
            .slice(0, 11) || prev.phone,
        email: customer.email ?? prev.email,
        address: customer.address ?? prev.address,
      }));

      setOtpVerified(true);
      setOtpCode("");
      const msg = payload?.message ?? raw?.message;
      toast.success(
        typeof msg === "string" && msg.trim()
          ? msg
          : "Signed in. Complete your delivery details below."
      );
    } catch {
      toast.error("Could not verify OTP. Try again.");
    } finally {
      setOtpVerifying(false);
    }
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
    if (!isLoggedIn() && !otpVerified) {
      const msg =
        !otpSent
          ? existingCustomerMode
            ? "Send OTP to your phone first."
            : "Sign up and send OTP first."
          : "Enter and verify the OTP code first.";
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
    if (formData.ship_to_different_address) {
      if (
        !String(formData.s_name || "").trim() ||
        !String(formData.s_phone || "").trim() ||
        !String(formData.s_address || "").trim()
      ) {
        const msg = "Please complete the shipping address (name, phone, and address).";
        setError(msg);
        toast.error(msg);
        return;
      }
      if (districts.length > 0) {
        if (!shippingDistrictId) {
          const msg = "Please select a shipping district.";
          setError(msg);
          toast.error(msg);
          return;
        }
      } else if (!String(formData.s_area || "").trim()) {
        const msg = "Please enter the shipping district or area.";
        setError(msg);
        toast.error(msg);
        return;
      }
    }

    const billingDistrict = districts.find((d) => String(d.id) === String(districtId));
    const isNewSignupMode = !isLoggedIn() && !existingCustomerMode;
    const billingAreaName =
      billingDistrict?.name ||
      formData.area ||
      formData.district ||
      (isNewSignupMode ? String(formData.address || "").trim() : "");

    const shippingDistrict = districts.find(
      (d) => String(d.id) === String(shippingDistrictId)
    );
    const shippingAreaName = shippingDistrict
      ? shippingDistrict.name
      : String(formData.s_area || formData.s_district || "").trim();

    let deliveryAddress = formData.address.trim();
    let deliveryArea = billingAreaName;
    let deliveryDistrict = (formData.district || billingAreaName || "").trim();

    if (formData.ship_to_different_address) {
      deliveryAddress = String(formData.s_address || "").trim();
      deliveryArea = String(shippingAreaName);
      deliveryDistrict = (formData.s_district || shippingAreaName || "").trim();
    }

    const productIds = cartItems
      .map((item) => item.id ?? item.product_id)
      .filter((id) => id != null && id !== "");

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: deliveryAddress,
      order_total: Number(orderTotal),
      total_amount: Number(totalAmount),
      area: String(deliveryArea),
      district: deliveryDistrict,
      order_note: formData.order_note?.trim() || undefined,
      payment_type: formData.payment_type || "cod",
      ship_charge: Number(shipCharge) || 0,
      email: formData.email?.trim() || undefined,
      customer_pickup: Boolean(formData.customer_pickup),
      shipping_method: shippingMethod,
      product_ids: productIds,
    };

    if (formData.ship_to_different_address) {
      payload.shipping_name = String(formData.s_name || "").trim();
      payload.shipping_phone = String(formData.s_phone || "").trim();
      payload.b_address = formData.address.trim();
      payload.b_district = (formData.district || billingAreaName || "").trim();
    }

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
    if (!formData.ship_to_different_address) {
      if (bDistrict) payload.b_district = bDistrict;
      if (bAddress) payload.b_address = bAddress;
    }

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

  const showFullCheckoutFields =
    isLoggedIn() ||
    !existingCustomerMode ||
    (existingCustomerMode && otpVerified);
  const showAdvancedCheckoutFields = isLoggedIn() || existingCustomerMode;

  return (
    <div className="bg-gray-50 py-4">
      <div className="w-full sm:max-w-7xl mx-auto px-4">
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
            {/* <div className="lg:col-span-2 space-y-6">
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
                  {!isLoggedIn() && !existingCustomerMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        placeholder="Create a password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  )}
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

                  {showAdvancedCheckoutFields && (
                  {isLoggedIn() && (
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
                  )}
                  )}

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
            </div> */}
            <div className="min-w-0 lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isLoggedIn()
                    ? "Billing Address"
                    : existingCustomerMode
                      ? "Existing Customer Verification"
                      : "Create Account"}
                </h2>
                {!isLoggedIn() && (
                  <p className="mb-4 text-sm text-gray-600">
                    New customer: complete signup details, then verify OTP to continue checkout.
                  </p>
                )}
                <div className="space-y-4">
                  {!isLoggedIn() && (
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={existingCustomerMode}
                      onChange={(e) =>
                        handleExistingCustomerToggle(e.target.checked)
                      }
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Click Only For Existing/Old Customer
                    </span>
                  </label>
                  )}

                  {!isLoggedIn() && existingCustomerMode && !otpSent && (
                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          readOnly={apiReadOnly.phone}
                          placeholder="01XXXXXXXXX"
                          maxLength={11}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                            apiReadOnly.phone ? readOnlyInputClass : ""
                          }`}
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpSending}
                          className="w-full rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          {otpSending ? "Sending…" : "Send OTP"}
                        </button>
                        <span className="hidden text-gray-400 sm:inline sm:px-1" aria-hidden>
                          |
                        </span>
                        <button
                          type="button"
                          onClick={handleHaveExistingCode}
                          disabled={otpSending}
                          className="w-full rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          I already have a code
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Choose <span className="font-medium">Send OTP</span> to get a new code by SMS, or{" "}
                        <span className="font-medium">I already have a code</span> if you already received one.
                      </p>
                    </div>
                  )}

                  {!isLoggedIn() && existingCustomerMode && otpSent && !otpVerified && (
                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
                      <p className="text-sm text-gray-600">
                        {hasExistingCode ? (
                          <>
                            Enter the code you received for{" "}
                            <span className="font-medium text-gray-900">
                              {formData.phone || "your number"}
                            </span>
                            .
                          </>
                        ) : (
                          <>
                            Enter the OTP sent to{" "}
                            <span className="font-medium text-gray-900">
                              {formData.phone || "your number"}
                            </span>
                            .
                          </>
                        )}
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          OTP code <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={otpCode}
                          onChange={(e) => {
                            setOtpCode(e.target.value);
                            setError(null);
                          }}
                          placeholder="Enter 6-digit code"
                          maxLength={12}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent tracking-widest"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={otpVerifying}
                          className="w-full sm:w-auto rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {otpVerifying ? "Verifying…" : "Confirm OTP"}
                        </button>
                        <button
                          type="button"
                          onClick={handleOtpBackToPhone}
                          disabled={otpVerifying}
                          className="text-sm font-medium text-gray-600 underline hover:text-gray-900"
                        >
                          ← Change phone number
                        </button>
                      </div>
                    </div>
                  )}

                  {!isLoggedIn() && !existingCustomerMode && otpSent && !otpVerified && (
                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
                      <p className="text-sm text-gray-600">
                        Enter the OTP sent to{" "}
                        <span className="font-medium text-gray-900">
                          {formData.phone || "your number"}
                        </span>
                        .
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          OTP code <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={otpCode}
                          onChange={(e) => {
                            setOtpCode(e.target.value);
                            setError(null);
                          }}
                          placeholder="Enter 6-digit code"
                          maxLength={12}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent tracking-widest"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpVerifying}
                        className="w-full sm:w-auto rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {otpVerifying ? "Verifying…" : "Confirm OTP"}
                      </button>
                    </div>
                  )}

                  {showFullCheckoutFields && (
                    <>
                  {!isLoggedIn() && !existingCustomerMode && !otpSent && !otpVerifying && (
                    <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-sm font-semibold text-blue-900">Register Form</p>
                      <p className="mt-1 text-xs text-blue-800">
                        Fill Name, Email, Phone, Address and Password, then press
                        {" "}
                        <span className="font-semibold">Sign up & Send OTP</span>.
                      </p>
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength={6}
                          placeholder="Create a password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                        />
                      </div>
                      {!otpSent && (
                        <button
                          type="button"
                          onClick={handleSignupAndSendOtp}
                          disabled={registering}
                          className="w-full rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {registering ? "Creating account…" : "Sign up & Send OTP"}
                        </button>
                      )}
                    </div>
                  )}
                  {/* name */}
                  {(!isLoggedIn() && !existingCustomerMode) ? null : (
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
                  )}
                  {/* phone */}
                  {(!isLoggedIn() && !existingCustomerMode) ? null : (
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
                  )}
                  {/* email */}
                  {(!isLoggedIn() && !existingCustomerMode) ? null : (
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
                  )}

                  {/* address */}
                  {(!isLoggedIn() && !existingCustomerMode) ? null : (
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
                  )}
                  {/* <div className="pt-2 border-t border-gray-100">
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
                  </div> */}

                  {isLoggedIn() && (
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
                  )}

                  {/* <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
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
                  </label> */}
                  
                  {showAdvancedCheckoutFields && (
                  <div>
                    <p className="text-base font-bold text-gray-900 mb-3">Shipping method</p>
                    <div className="space-y-2">
                      <label
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border-2 px-4 py-3.5 transition-colors focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:ring-offset-2 ${
                          shippingMethod === "inside_dhaka"
                            ? "border-blue-500 bg-sky-50"
                            : "border-gray-200 bg-white hover:bg-gray-50/80"
                        }`}
                      >
                        <span className="flex min-w-0 flex-1 items-center gap-3">
                          <input
                            type="radio"
                            name="shipping_method"
                            value="inside_dhaka"
                            checked={shippingMethod === "inside_dhaka"}
                            onChange={() => setShippingMethod("inside_dhaka")}
                            className="sr-only"
                          />
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              shippingMethod === "inside_dhaka"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 bg-white"
                            }`}
                            aria-hidden
                          >
                            {shippingMethod === "inside_dhaka" ? (
                              <span className="h-2 w-2 rounded-full bg-white" />
                            ) : null}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            Inside Dhaka City
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-medium text-gray-900 tabular-nums">
                          ৳70.00
                        </span>
                      </label>
                      <label
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border-2 px-4 py-3.5 transition-colors focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:ring-offset-2 ${
                          shippingMethod === "outside_dhaka"
                            ? "border-blue-500 bg-sky-50"
                            : "border-gray-200 bg-white hover:bg-gray-50/80"
                        }`}
                      >
                        <span className="flex min-w-0 flex-1 items-center gap-3">
                          <input
                            type="radio"
                            name="shipping_method"
                            value="outside_dhaka"
                            checked={shippingMethod === "outside_dhaka"}
                            onChange={() => setShippingMethod("outside_dhaka")}
                            className="sr-only"
                          />
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              shippingMethod === "outside_dhaka"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 bg-white"
                            }`}
                            aria-hidden
                          >
                            {shippingMethod === "outside_dhaka" ? (
                              <span className="h-2 w-2 rounded-full bg-white" />
                            ) : null}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            Outside Dhaka City
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-medium text-gray-900 tabular-nums">
                          ৳130.00
                        </span>
                      </label>
                    </div>
                  </div>
                  )}

                  {showAdvancedCheckoutFields && pathaoEnabled && (
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

                  {/* note */}
                  {showAdvancedCheckoutFields && (
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
                  )}

                  {showAdvancedCheckoutFields && (
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      name="ship_to_different_address"
                      checked={!!formData.ship_to_different_address}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (!checked) {
                          setShippingDistrictId("");
                        }
                        setFormData((prev) => ({
                          ...prev,
                          ship_to_different_address: checked,
                          ...(!checked
                            ? {
                                s_name: "",
                                s_phone: "",
                                s_address: "",
                                s_area: "",
                                s_district: "",
                              }
                            : {}),
                        }));
                        setError(null);
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span>Ship to a different address</span>
                  </label>
                  )}

                  {showAdvancedCheckoutFields && formData.ship_to_different_address && (
                    <div className="pt-4 border-t border-gray-200 space-y-4">
                      <p className="text-sm font-medium text-gray-800">
                        Shipping address
                      </p>
                      <p className="text-xs text-gray-500">
                        Your details above are the billing address. Enter where we should deliver below.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="s_name"
                          value={formData.s_name}
                          onChange={handleInputChange}
                          required={formData.ship_to_different_address}
                          maxLength={60}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping phone (11 digits) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="tel"
                          name="s_phone"
                          value={formData.s_phone}
                          onChange={handleInputChange}
                          required={formData.ship_to_different_address}
                          placeholder="01XXXXXXXXX"
                          maxLength={11}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping address <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="s_address"
                          value={formData.s_address}
                          onChange={handleInputChange}
                          required={formData.ship_to_different_address}
                          maxLength={191}
                          placeholder="House/Flat, Road, Area"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping district / area <span className="text-red-600">*</span>
                        </label>
                        {districts.length > 0 ? (
                          <select
                            value={shippingDistrictId}
                            onChange={(e) => {
                              setShippingDistrictId(e.target.value);
                              const d = districts.find(
                                (x) => String(x.id) === String(e.target.value)
                              );
                              setFormData((f) => ({
                                ...f,
                                s_area: d?.name || "",
                                s_district: d?.name || "",
                              }));
                            }}
                            required={formData.ship_to_different_address}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          >
                            <option value="">Select district</option>
                            {districts.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}{" "}
                                {d.amount != null ? `(৳${d.amount})` : ""}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            name="s_area"
                            value={formData.s_area}
                            onChange={handleInputChange}
                            required={formData.ship_to_different_address}
                            placeholder="e.g. Dhaka"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        )}
                      </div>
                    </div>
                  )}
                    </>
                  )}

                </div>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-1">
              <div className="min-w-0 bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8">
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
                  disabled={
                    submitting ||
                    (!isLoggedIn() && !otpVerified)
                  }
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
