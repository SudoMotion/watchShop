"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPopup } from "@/stores/HomeAPI";
import { NEXT_PUBLIC_API_URL } from "@/config";

const STORAGE_KEY = "watchshop_popup_dismissed";

function popupImageSrc(path) {
  if (!path || typeof path !== "string") return "";
  const t = path.trim();
  if (!t) return "";
  if (t.startsWith("http")) return t;
  const base = (NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const p = t.startsWith("/") ? t : `/${t}`;
  return `${base}${p}`;
}

export default function Popup() {
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (_) {}
    setOpen(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
        const data = await getPopup();
        if (cancelled || !data) return;
        if (data.active === false || data.enabled === false || data.status === false) return;
        const hasContent =
          data.message ||
          data.title ||
          data.name ||
          data.heading ||
          data.description ||
          data.body ||
          data.content ||
          data.image ||
          data.image_url ||
          data.photo;
        if (!hasContent) return;
        setPopupData(data);
        setOpen(true);
      } catch (_) {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  if (!open || !popupData) return null;

  const title =
    popupData.title ?? popupData.name ?? popupData.heading ?? null;
  const description =
    popupData.message ??
    popupData.description ??
    popupData.body ??
    popupData.content ??
    "";
  const href = String(
    popupData.link ?? popupData.url ?? popupData.button_link ?? "/"
  ).trim() || "/";
  const btnText =
    popupData.button_text ??
    popupData.button_label ??
    popupData.cta ??
    "Continue shopping";
  const label = popupData.label?.trim() ? popupData.label : null;
  const imagePath =
    popupData.image ?? popupData.image_url ?? popupData.photo ?? null;
  const imageSrc = imagePath ? popupImageSrc(String(imagePath)) : "";
  const titleId = "popup-title";
  const messageId = "popup-message";
  const hasText = Boolean(title || description);
  const ariaLabelledBy = title ? titleId : messageId;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={hasText ? ariaLabelledBy : undefined}
      aria-label={hasText ? undefined : "Announcement"}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
        onClick={dismiss}
        aria-label="Close dialog"
      />
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-white/90 hover:text-gray-900"
          aria-label="Close"
        >
          <span className="text-2xl leading-none" aria-hidden>
            ×
          </span>
        </button>

        {imageSrc ? (
          <div className="relative aspect-[21/9] w-full bg-gray-100 sm:aspect-[2/1]">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 32rem) 100vw, 32rem"
              unoptimized
            />
          </div>
        ) : null}

        <div className="p-6 sm:p-8">
          {label ? (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              {label}
            </p>
          ) : null}
          {title ? (
            <h2
              id={titleId}
              className="pr-8 text-2xl font-light tracking-wide text-gray-900 sm:text-3xl"
            >
              {title}
            </h2>
          ) : null}
          {description ? (
            <p
              id={!title ? messageId : undefined}
              className={`text-sm leading-relaxed text-gray-600 whitespace-pre-line ${
                title ? "mt-4" : "pr-8 text-lg text-gray-900"
              }`}
            >
              {description}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={href}
              onClick={dismiss}
              className="inline-flex justify-center rounded-lg bg-black px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gray-800"
            >
              {btnText}
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="text-center text-sm font-medium text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
