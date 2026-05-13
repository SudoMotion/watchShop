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
import { getCheckoutData, checkoutStore } from "@/stores/CustomerAPI";
import { ToastContainer, toast } from "react-toastify";
import { formatTaka } from "@/lib/formatPriceView";
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

function normalizeBdPhone(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  return d.length >= 11 ? d.slice(-11) : d;
}

const SHIPPING_INSIDE_DHAKA = 70;
const SHIPPING_OUTSIDE_DHAKA = 130;

/** First Laravel validation message from `errors` object, if any. */
function firstLaravelValidationMessage(errors) {
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return null;
  for (const val of Object.values(errors)) {
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
      return val[0];
    }
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return null;
}

/** SSL Commerz / gateways may expose the redirect URL under different keys. */
function pickPaymentRedirectUrl(data) {
  if (!data || typeof data !== "object") return "";
  const nested = data.data && typeof data.data === "object" ? data.data : {};
  const candidates = [
    data.payment_redirect_url,
    data.payment_url,
    data.gateway_url,
    data.GatewayPageURL,
    nested.payment_redirect_url,
    nested.GatewayPageURL,
    nested.gateway_url,
  ];
  for (const u of candidates) {
    if (typeof u === "string" && u.trim()) return u.trim();
  }
  return "";
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  /** Must be true to place order (submit or OTP verify → place). */
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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
  });

  const [shippingMethod, setShippingMethod] = useState("inside_dhaka");
  const [shipCharge, setShipCharge] = useState(SHIPPING_INSIDE_DHAKA);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getNumericPrice(item.price) * item.quantity,
    0
  );
  const orderTotal = subtotal;
  /** Customer pays sale subtotal + shipping − coupon (`orderTotal` already uses discounted line prices). */
  const totalAmount = Math.max(0, orderTotal - couponDiscount + shipCharge);

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
      })
      .catch(() => {});
  }, [cartItems.length]);

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
    const password = "123456789";

    if (!name || !email || !phone || !address) {
      toast.error("Name, Email, Phone and Address are required.");
      return;
    }
    if (phone.length !== 11) {
      toast.error("Enter a valid 11-digit mobile number.");
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

  const validateNewCustomerRegistration = () => {
    const name = String(formData.name || "").trim();
    const email = String(formData.email || "").trim();
    const phone = String(formData.phone || "").replace(/\D/g, "");
    const address = String(formData.address || "").trim();
    if (!name || !email || !phone || !address) {
      return "Name, Email, Phone and Address are required.";
    }
    if (phone.length !== 11) {
      return "Enter a valid 11-digit mobile number.";
    }
    return null;
  };

  const validateCheckoutShipping = () => {
    if (formData.ship_to_different_address) {
      if (
        !String(formData.s_name || "").trim() ||
        !String(formData.s_phone || "").trim() ||
        !String(formData.s_address || "").trim()
      ) {
        return "Please complete the shipping address (name, phone, and address).";
      }
    }
    return null;
  };

  const validateOnlinePaymentFields = () => {
    if (formData.payment_type !== "sslcommerz") return null;
    const email = String(formData.email || "").trim();
    if (!email) {
      return "Email is required for SSL Commerz payment.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address for online payment.";
    }
    return null;
  };

  const buildOrderPayload = () => {
    const isNewSignupMode = !isLoggedIn() && !existingCustomerMode;
    const billingAreaName =
      String(formData.area || formData.district || "").trim() ||
      (isNewSignupMode ? String(formData.address || "").trim() : "");

    const shippingAreaName = String(
      formData.s_area || formData.s_district || ""
    ).trim();

    let deliveryAddress = formData.address.trim();
    let deliveryArea = billingAreaName;
    let deliveryDistrict = (formData.district || billingAreaName || "").trim();

    if (formData.ship_to_different_address) {
      deliveryAddress = String(formData.s_address || "").trim();
      deliveryArea = String(shippingAreaName);
      deliveryDistrict = (formData.s_district || shippingAreaName || "").trim();
    }

    const lineRows = cartItems
      .map((item) => {
        const rawId = item.id ?? item.product_id;
        if (rawId == null || rawId === "") return null;
        const numeric = typeof rawId === "number" ? rawId : Number(rawId);
        const id = Number.isFinite(numeric) ? numeric : rawId;
        const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
        return { id, quantity };
      })
      .filter(Boolean);

    const productIds = lineRows.map((r) => r.id);
    const quantities = lineRows.map((r) => r.quantity);

    const paymentType = formData.payment_type || "cod";

    let areaOut = String(deliveryArea || "").trim();
    let districtOut = String(deliveryDistrict || "").trim();
    const emailTrim = String(formData.email || "").trim();
    const phoneOut = normalizeBdPhone(formData.phone);

    const payload = {
      name: formData.name.trim(),
      phone: phoneOut,
      address: deliveryAddress,
      order_total: Number(orderTotal),
      total_amount: Number(totalAmount),
      area: areaOut,
      district: districtOut,
      order_note: formData.order_note?.trim() || undefined,
      payment_type: paymentType,
      ship_charge: Number(shipCharge) || 0,
      email:
        paymentType === "sslcommerz"
          ? emailTrim
          : formData.email?.trim() || undefined,
      customer_pickup: Boolean(formData.customer_pickup),
      shipping_method: shippingMethod,
      product_ids: productIds,
      quantities,
    };

    if (formData.ship_to_different_address) {
      payload.shipping_name = String(formData.s_name || "").trim();
      payload.shipping_phone = normalizeBdPhone(formData.s_phone);
      payload.b_address = formData.address.trim();
      payload.b_district = (formData.district || billingAreaName || "").trim();
    }

    if (couponDiscount > 0) {
      const d = Number(couponDiscount);
      payload.couponDiscount = d;
      payload.coupon_discount = d;
    }
    const codeTrim = String(couponCode || "").trim();
    if (couponApplied && codeTrim) {
      payload.coupon_code = codeTrim;
    }

    if (!String(payload.area || "").trim()) {
      payload.area =
        shippingMethod === "inside_dhaka" ? "Dhaka" : "Bangladesh";
    }
    if (!String(payload.district || "").trim()) {
      payload.district = payload.area;
    }

    payload.pathao_city_id = 1;
    payload.pathao_zone_id = 1;
    payload.pathao_area_id = 1;

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

    return payload;
  };

  const placeOrder = async () => {
    if (!acceptedTerms) {
      const msg = "Please accept the terms and conditions to place your order.";
      setError(msg);
      toast.error(msg);
      return false;
    }
    const payload = buildOrderPayload();
    setSubmitting(true);
    try {
      const token = typeof window !== "undefined" ? getAuthToken() : null;
      const res = await checkoutStore(payload, token);
      const status = res?.status ?? 0;
      const data = res?.data;
      const ok = status >= 200 && status < 300;

      if (ok && data) {
        const redirectUrl = pickPaymentRedirectUrl(data);
        if (redirectUrl) {
          setCart([]);
          window.location.href = redirectUrl;
          return true;
        }
        if (data.success && data.order) {
          setCart([]);
          setCartItems([]);
          const orderId = data.order?.id;
          toast.success(
            orderId
              ? `Order #${orderId} placed successfully.`
              : "Order placed successfully."
          );
          return true;
        }
      }

      const msg =
        firstLaravelValidationMessage(
          typeof data === "object" && data !== null ? data.errors : undefined
        ) ||
        (typeof data === "object" && data !== null ? data.message : null) ||
        (status === 401 ? "Please log in to place an order." : null) ||
        (status === 422 ? "Invalid form data." : null) ||
        (status === 502 || status === 503 || status === 504
          ? "The checkout server did not respond in time or is restarting. Wait a minute and retry, try Cash on Delivery, or contact support if it continues."
          : null) ||
        (status >= 500
          ? "Server error while placing your order. Please try again shortly."
          : null) ||
        "Could not place order.";
      setError(msg);
      toast.error(msg);
      return false;
    } catch {
      const msg = "Could not place order. Please try again.";
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
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

      const tokenAuth = payload?.token ?? payload?.access_token;
      const customer = payload?.customer ?? payload?.user;
      const token_type = payload?.token_type ?? "Bearer";

      if (tokenAuth == null || !customer) {
        toast.error("Could not complete sign-in. Missing token or profile.");
        return;
      }

      try {
        localStorage.setItem(
          "watchshop_auth",
          JSON.stringify({ token: tokenAuth, customer, token_type })
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
      const welcomeMsg = payload?.message ?? raw?.message;
      if (typeof welcomeMsg === "string" && welcomeMsg.trim()) {
        toast.success(welcomeMsg);
      }

      const shipErr = validateCheckoutShipping();
      if (shipErr) {
        toast.info("Signed in. " + shipErr);
        return;
      }
      const payErr = validateOnlinePaymentFields();
      if (payErr) {
        toast.error(payErr);
        setError(payErr);
        return;
      }
      await placeOrder();
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

    if (!isLoggedIn() && existingCustomerMode && !otpVerified) {
      const msg = otpSent
        ? "Verify OTP to continue."
        : "Send OTP to your phone first.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!isLoggedIn() && !existingCustomerMode && !otpVerified) {
      if (!otpSent) {
        const regErr = validateNewCustomerRegistration();
        if (regErr) {
          setError(regErr);
          toast.error(regErr);
          return;
        }
        const shipErr = validateCheckoutShipping();
        if (shipErr) {
          setError(shipErr);
          toast.error(shipErr);
          return;
        }
        await handleSignupAndSendOtp();
        return;
      }
      const msg =
        "Enter and verify the OTP sent to your phone.";
      setError(msg);
      toast.error(msg);
      return;
    }

    const shipErr = validateCheckoutShipping();
    if (shipErr) {
      setError(shipErr);
      toast.error(shipErr);
      return;
    }
    const payErr = validateOnlinePaymentFields();
    if (payErr) {
      setError(payErr);
      toast.error(payErr);
      return;
    }
    await placeOrder();
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

  /** Guest user is on the OTP step — hide delivery/shipping fields, show only OTP UI. */
  const guestAwaitingOtp = !isLoggedIn() && otpSent && !otpVerified;
  const showFullCheckoutFields =
    isLoggedIn() ||
    (!guestAwaitingOtp &&
      (!existingCustomerMode || (existingCustomerMode && otpVerified)));
  const showAdvancedCheckoutFields =
    isLoggedIn() ||
    (!guestAwaitingOtp &&
      (!existingCustomerMode || (existingCustomerMode && otpVerified)));

  return (
    <div className="bg-gray-50 py-4">
      <div className="w-full sm:max-w-7xl mx-auto px-4">
        <h1 className="md:text-3xl text-2xl font-bold mb-6 text-center">Order Page</h1>

        {/* {!isLoggedIn() && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            You may need to{" "}
            <Link href="/login" className="font-semibold underline">
              log in
            </Link>{" "}
            to place an order. Some servers require customer authentication.
          </div>
        )} */}
        {!isLoggedIn() && !guestAwaitingOtp && (
          <label className="flex items-start gap-3 cursor-pointer select-none mb-2">
            <input
              type="checkbox"
              checked={existingCustomerMode}
              onChange={(e) =>
                handleExistingCustomerToggle(e.target.checked)
              }
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="font-bold text-lg text-gray-900">
              Click only for existing or old Customer
            </span>
          </label>
          )}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="min-w-0 lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {guestAwaitingOtp
                    ? "Verify your phone"
                    : isLoggedIn()
                      ? "Billing Address"
                      : existingCustomerMode
                        ? "Existing Customer Verification"
                        : "Billing Address For New Customer"}
                </h2>
                {/* {!isLoggedIn() && !existingCustomerMode && !guestAwaitingOtp && (
                  <p className="mb-4 text-sm text-gray-600">
                    Fill in all details below. Use <span className="font-semibold">Continue to verification</span>{" "}
                    to create your account and receive an OTP. After you confirm the code, we sign you in and place your order.
                  </p>
                )} */}
                <div className="space-y-4">

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

                  {!isLoggedIn() && otpSent && !otpVerified && (
                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
                      <p className="text-sm text-gray-600">
                        {existingCustomerMode && hasExistingCode ? (
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
                            . We will sign you in and complete your order.
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
                      {!acceptedTerms ? (
                        <p className="text-xs text-amber-800">
                          In the <span className="font-semibold">Order Summary</span>, check{" "}
                          <span className="font-semibold">Terms and Conditions</span> to enable placing your order.
                        </p>
                      ) : null}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={otpVerifying || submitting || !acceptedTerms}
                          className="w-full sm:w-auto rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {otpVerifying || submitting
                            ? "Processing…"
                            : "Confirm OTP & place order"}
                        </button>
                        <button
                          type="button"
                          onClick={handleOtpBackToPhone}
                          disabled={otpVerifying || submitting}
                          className="text-sm font-medium text-gray-600 underline hover:text-gray-900"
                        >
                          ← Edit details / change phone
                        </button>
                      </div>
                    </div>
                  )}

                  {showFullCheckoutFields && (
                    <>
                  {/* name */}
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
                  {/* phone */}
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
                  {/* email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email{" "}
                      {/* {!isLoggedIn() && !existingCustomerMode ? (
                        <span className="text-red-600">*</span>
                      ) : null} */}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly={apiReadOnly.email}
                      required={!isLoggedIn() && !existingCustomerMode}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        apiReadOnly.email ? readOnlyInputClass : ""
                      }`}
                    />
                  </div>

                  {/* address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      maxLength={191}
                      placeholder="House/Flat, Road, Area"
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-y min-h-[5.5rem] ${
                        apiReadOnly.address ? readOnlyInputClass : ""
                      }`}
                    />
                  </div>
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
                    <div className="grid grid-cols-2 gap-2">
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
                          {formatTaka(70)}
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
                          {formatTaka(130)}
                        </span>
                      </label>
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
                        <textarea
                          name="s_address"
                          value={formData.s_address}
                          onChange={handleInputChange}
                          required={formData.ship_to_different_address}
                          rows={3}
                          maxLength={191}
                          placeholder="House/Flat, Road, Area"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-y min-h-[5.5rem]"
                        />
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
                          {formatTaka(getNumericPrice(item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatTaka(orderTotal)}</span>
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
                      <span className="font-medium">{formatTaka(shipCharge)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon</span>
                      <span className="font-medium">-{formatTaka(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-red-600">{formatTaka(totalAmount)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-sm font-semibold text-gray-900">Payment method</p>
                  <div className="space-y-2">
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:ring-offset-1 ${
                        formData.payment_type === "cod"
                          ? "border-blue-500 bg-sky-50"
                          : "border-gray-200 bg-white hover:bg-gray-50/80"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_type"
                        value="cod"
                        checked={formData.payment_type === "cod"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          formData.payment_type === "cod"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 bg-white"
                        }`}
                        aria-hidden
                      >
                        {formData.payment_type === "cod" ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Cash on delivery (COD)
                      </span>
                    </label>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:ring-offset-1 ${
                        formData.payment_type === "bkash"
                          ? "border-blue-500 bg-sky-50"
                          : "border-gray-200 bg-white hover:bg-gray-50/80"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_type"
                        value="bkash"
                        checked={formData.payment_type === "bkash"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          formData.payment_type === "bkash"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 bg-white"
                        }`}
                        aria-hidden
                      >
                        {formData.payment_type === "bkash" ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <span className="text-sm font-medium text-gray-900">bKash</span>
                      <Image
                        src="/icons/bKash.png"
                        alt=""
                        width={80}
                        height={28}
                        className="h-5 w-auto shrink-0 object-contain"
                      />
                    </label>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:ring-offset-1 ${
                        formData.payment_type === "sslcommerz"
                          ? "border-blue-500 bg-sky-50"
                          : "border-gray-200 bg-white hover:bg-gray-50/80"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_type"
                        value="sslcommerz"
                        checked={formData.payment_type === "sslcommerz"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          formData.payment_type === "sslcommerz"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 bg-white"
                        }`}
                        aria-hidden
                      >
                        {formData.payment_type === "sslcommerz" ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Online Payment (SSL Commerz)
                      </span>
                      <Image
                        src="/icons/ssl.webp"
                        alt=""
                        width={120}
                        height={36}
                        className="h-6 w-auto max-w-28 shrink-0 object-contain sm:max-w-34"
                      />
                    </label>
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

                <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/80 p-3 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      setError(null);
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link
                      href="/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-black underline underline-offset-2 hover:text-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms and Conditions
                    </Link>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    registering ||
                    !acceptedTerms ||
                    (!isLoggedIn() &&
                      existingCustomerMode &&
                      !otpVerified) ||
                    (!isLoggedIn() &&
                      !existingCustomerMode &&
                      otpSent &&
                      !otpVerified)
                  }
                  className={
                    formData.payment_type === "bkash"
                      ? "w-full bg-[#df156a] text-white py-3 rounded-lg font-semibold hover:bg-[#c4125f] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                      : "w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  }
                >
                  {submitting
                    ? "Placing order…"
                    : registering
                      ? "Sending OTP…"
                      : !isLoggedIn() &&
                          !existingCustomerMode &&
                          !otpVerified &&
                          !otpSent
                        ? "Confirm Your Order"
                        : "Place Your Order"}
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
