"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/stores/AuthAPI";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);
    const response = await useLoginMutation({
      phone: phone.trim(),
      password,
    });
    setLoading(false);
    if (response?.status >= 200 && response?.status < 300) {
      const { token, customer } = response?.data ?? {};
      if (token != null && customer) {
        try {
          localStorage.setItem("watchshop_auth", JSON.stringify({ token, customer }));
        } catch (_) {}
      }
      setMessage({ type: "success", text: "Signed in successfully." });
      setPhone("");
      setPassword("");
      router.push("/account");
    } else {
      const errorMsg =
        response?.data?.message || response?.data?.error || "Invalid phone or password. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-medium text-teal-600 hover:text-teal-500">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
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
    </div>
  );
}
