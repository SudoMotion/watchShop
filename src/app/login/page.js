"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/stores/AuthAPI";
import { isLoggedIn } from "@/lib/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [hasExistingCode, setHasExistingCode] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/account");
    }
  }, [router]);

  const normalizePhone = (value) => String(value || "").replace(/\D/g, "");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length !== 11) {
      toast.error("Enter a valid 11-digit mobile number.");
      return;
    }

    setOtpSending(true);
    try {
      const response = await useSendOtpMutation({ phone: cleanPhone });
      if (response?.status >= 200 && response?.status < 300) {
        setPhone(cleanPhone);
        setOtpSent(true);
        setHasExistingCode(false);
        toast.success(
          response?.data?.message || "OTP sent. Enter the code below to continue."
        );
      } else {
        const errMsg =
          response?.data?.message ||
          response?.data?.error ||
          "Could not send OTP. Try again.";
        toast.error(errMsg);
      }
    } catch {
      toast.error("Could not send OTP. Try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = normalizePhone(phone);
    const otp = String(otpCode || "").trim();

    if (cleanPhone.length !== 11) {
      toast.error("Invalid phone number. Please enter your number again.");
      return;
    }
    if (!otp) {
      toast.error("Enter the OTP code.");
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
        toast.error(errMsg);
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
        toast.error(payload?.message || "Verification failed.");
        return;
      }

      const token = payload?.token ?? payload?.access_token;
      const customer = payload?.customer ?? payload?.user;
      const token_type = payload?.token_type ?? "Bearer";

      if (token == null || !customer) {
        toast.error("Could not complete sign-in. Missing token or profile.");
        return;
      }

      localStorage.setItem(
        "watchshop_auth",
        JSON.stringify({ token, customer, token_type })
      );
      document.cookie = "watchshop_logged_in=1; path=/; max-age=2592000";

      toast.success(payload?.message || raw?.message || "Signed in successfully.");
      setOtpCode("");
      router.push("/account");
    } catch {
      toast.error("Could not verify OTP. Try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form
          onSubmit={otpSent || hasExistingCode ? handleVerifyOtp : handleSendOtp}
          className="space-y-6"
        >
          {!hasExistingCode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                required
                disabled={otpSent}
              />
            </div>
          )}


          {(otpSent || hasExistingCode) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP Code
              </label>
              <input
                type="text"
                placeholder="Enter the OTP code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-between">
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
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
            {otpSent || hasExistingCode
              ? otpVerifying
              ? "Verifying…"
              : "Verify OTP"
              : otpSending
              ? "Sending…"
              : "Send OTP"}
          </button>
              {!otpSent && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
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
              className="w-full border border-teal-600 text-teal-600 hover:bg-teal-50 disabled:opacity-60 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {otpSending ? "Resending…" : "Resend OTP"}
            </button>
          )}
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Don&apos;t have an account?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/signup"
              className="w-full flex justify-center py-3 px-4 border border-teal-600 rounded-lg text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors duration-200"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}
