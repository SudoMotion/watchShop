"use client";

import Image from "next/image";
import { useCallback } from "react";
import { WHATSAPP_CHAT_URL } from "@/config";

export default function FixedFloatingActions() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:bottom-6 sm:right-5">
      <button
        type="button"
        onClick={scrollToTop}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-lg transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:h-12 sm:w-12"
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>

      <a
        href={WHATSAPP_CHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative border block h-8 w-8 overflow-hidden rounded-full shadow-lg ring-2 ring-white/30 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:h-12 sm:w-12"
        aria-label="Chat on WhatsApp"
      >
        <Image
          src="/images/sticky-whatsApp-button.jpg"
          alt=""
          fill
          className="object-cover h-10 w-10"
        />
      </a>
    </div>
  );
}
