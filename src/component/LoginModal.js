"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/stores/AuthAPI";
import { isLoggedIn } from "@/lib/auth";

const TOAST_CONTAINER_ID = "login-modal-toast";

export default function LoginModal({
  open,
  onClose,
  onSuccess,
  title = "Sign in",
  description = "Enter your mobile number. We will send a one-time code to sign you in.",
}) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [hasExistingCode, setHasExistingCode] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const notify = useCallback((type, message) => {
    const opts = { containerId: TOAST_CONTAINER_ID };
    if (type === "success") toast.success(message, opts);
    else toast.error(message, opts);
  }, []);

  const resetForm = useCallback(() => {
    setPhone("");
    setOtpCode("");
    setOtpSent(false);
    setHasExistingCode(false);
    setOtpSending(false);
    setOtpVerifying(false);
  }, []);

  const prevOpenRef = useRef(false);

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;

    if (!open) {
      if (wasOpen) resetForm();
      return;
    }
    if (!wasOpen) {
      resetForm();
      if (isLoggedIn()) {
        onSuccess?.();
        onClose();
      }
    }
  }, [open, onClose, onSuccess, resetForm]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const normalizePhone = (value) => String(value || "").replace(/\D/g, "");

  const handleSendOtp = async (e) => {
    e?.preventDefault?.();
    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length !== 11) {
      notify("error", "Enter a valid 11-digit mobile number.");
      return;
    }

    setOtpSending(true);
    try {
      const response = await useSendOtpMutation({ phone: cleanPhone });
      if (response?.status >= 200 && response?.status < 300) {
        setPhone(cleanPhone);
        setOtpSent(true);
        setHasExistingCode(false);
        notify(
          "success",
          response?.data?.message || "OTP sent. Enter the code below to continue.",
        );
      } else {
        const errMsg =
          response?.data?.message ||
          response?.data?.error ||
          "Could not send OTP. Try again.";
        notify("error", errMsg);
      }
    } catch {
      notify("error", "Could not send OTP. Try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault?.();
    const cleanPhone = normalizePhone(phone);
    const otp = String(otpCode || "").trim();

    if (cleanPhone.length !== 11) {
      notify("error", "Invalid phone number. Please enter your number again.");
      return;
    }
    if (!otp) {
      notify("error", "Enter the OTP code.");
      return;
    }

    setOtpVerifying(true);
    try {
      const response = await useVerifyOtpMutation({ phone: cleanPhone, otp });
      const status = response?.status ?? 0;

      if (status < 200 || status >= 300) {
        const errMsg =
          response?.data?.message ||
          response?.data?.error ||
          "Invalid OTP. Try again.";
        notify("error", errMsg);
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
        notify("error", payload?.message || "Verification failed.");
        return;
      }

      const token = payload?.token ?? payload?.access_token;
      const customer = payload?.customer ?? payload?.user;
      const token_type = payload?.token_type ?? "Bearer";

      if (token == null || !customer) {
        notify("error", "Could not complete sign-in. Missing token or profile.");
        return;
      }

      localStorage.setItem(
        "watchshop_auth",
        JSON.stringify({ token, customer, token_type }),
      );
      document.cookie = "watchshop_logged_in=1; path=/; max-age=2592000";

      notify("success", payload?.message || raw?.message || "Signed in successfully.");
      setOtpCode("");
      onClose();
      if (typeof onSuccess === "function") {
        onSuccess();
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch {
      notify("error", "Could not verify OTP. Try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  if (!open) return null;

  const onSubmitForm = (e) => {
    if (otpSent || hasExistingCode) handleVerifyOtp(e);
    else handleSendOtp(e);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <ToastContainer
        containerId={TOAST_CONTAINER_ID}
        position="top-center"
        className="mt-16"
        autoClose={2500}
        newestOnTop
        limit={4}
      />
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close sign in"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="login-modal-title" className="text-lg font-semibold text-gray-900 sm:text-xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <form onSubmit={onSubmitForm} className="mt-6 space-y-5">
          {!hasExistingCode && (
            <div>
              <label htmlFor="login-modal-phone" className="mb-2 block text-sm font-medium text-gray-700">
                Mobile number
              </label>
              <input
                id="login-modal-phone"
                type="text"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-teal-500"
                required
                disabled={otpSent}
              />
            </div>
          )}

          {(otpSent || hasExistingCode) && (
            <div>
              <label htmlFor="login-modal-otp" className="mb-2 block text-sm font-medium text-gray-700">
                OTP code
              </label>
              <input
                id="login-modal-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter the OTP code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            {otpSent ? (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setHasExistingCode(false);
                  setOtpCode("");
                }}
                className="text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                Change number
              </button>
            ) : (
              <span className="text-sm text-gray-500">
                {hasExistingCode
                  ? "Enter the OTP you already received"
                  : "OTP will be sent to your number"}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={otpSent || hasExistingCode ? otpVerifying : otpSending}
            className="w-full rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
          >
            {otpSent || hasExistingCode
              ? otpVerifying
                ? "Verifying…"
                : "Verify & sign in"
              : otpSending
                ? "Sending…"
                : "Send OTP"}
          </button>

          {!otpSent && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={hasExistingCode}
                onChange={(e) => setHasExistingCode(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              I already have an OTP code
            </label>
          )}

          {otpSent && (
            <button
              type="button"
              onClick={(e) => handleSendOtp(e)}
              disabled={otpSending}
              className="w-full rounded-lg border border-teal-600 py-3 font-semibold text-teal-600 transition-colors hover:bg-teal-50 disabled:opacity-60"
            >
              {otpSending ? "Resending…" : "Resend OTP"}
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-teal-600 hover:text-teal-500" onClick={onClose}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
