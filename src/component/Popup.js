"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPopup } from "@/stores/HomeAPI";
import { NEXT_PUBLIC_API_URL } from "@/config";

const STORAGE_KEY = "watchshop_popup_dismissed";

function getSessionDismissed() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .some((c) => c === `${STORAGE_KEY}=1`);
}

function setSessionDismissed() {
  if (typeof document === "undefined") return;
  // Session cookie: cleared when browser session ends.
  document.cookie = `${STORAGE_KEY}=1; path=/; SameSite=Lax`;
}

function popupImageSrc(path) {
  if (!path || typeof path !== "string") return "";
  const t = path.trim();
  if (!t) return "";
  if (t.startsWith("http")) return t;
  const base = (NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const p = t.startsWith("/") ? t : `/${t}`;
  return `${base}${p}`;
}

function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function Popup() {
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const dismiss = useCallback(() => {
    try {
      setSessionDismissed();
    } catch (_) {}
    setOpen(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (getSessionDismissed()) return;
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
  const hasImage = Boolean(imageSrc);

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
        className="popup-backdrop-animate absolute inset-0 bg-neutral-950/65 backdrop-blur-[6px] transition-colors hover:bg-neutral-950/70"
        onClick={dismiss}
        aria-label="Close dialog"
      />

      <div
        className="popup-panel-animate relative z-10 w-full max-w-[min(100%,26rem)] overflow-hidden rounded-[1.35rem] bg-white shadow-[0_25px_80px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.06)] sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute left-0 right-0 top-0 z-30 h-[3px] bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900"
          aria-hidden
        />

        <button
          type="button"
          onClick={dismiss}
          className={`absolute z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-600 shadow-[0_4px_14px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white hover:text-neutral-900 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
            hasImage ? "right-3 top-3" : "right-4 top-4"
          }`}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {hasImage ? (
          <div className="relative aspect-[5/3] w-full bg-gradient-to-b from-neutral-100 to-neutral-200/80 sm:aspect-[16/10]">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 28rem) 100vw, 28rem"
              unoptimized
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent"
              aria-hidden
            />
          </div>
        ) : null}

        <div
          className={`relative px-6 sm:px-8 ${hasImage ? "pb-7 pt-6 sm:pb-8 sm:pt-7" : "py-9 sm:py-10"}`}
        >
          {label ? (
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              {label}
            </p>
          ) : null}
          {title ? (
            <h2
              id={titleId}
              className="pr-10 font-light tracking-tight text-neutral-900 text-[1.65rem] leading-snug sm:text-[1.85rem]"
            >
              {title}
            </h2>
          ) : null}
          {description ? (
            <p
              id={!title ? messageId : undefined}
              className={`whitespace-pre-line text-neutral-600 leading-relaxed ${
                title
                  ? "mt-3 text-[0.9375rem] sm:text-base"
                  : "pr-10 text-[1.0625rem] font-normal text-neutral-800 sm:text-lg"
              }`}
            >
              {description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:items-stretch sm:gap-3">
            <Link
              href={href}
              onClick={dismiss}
              className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-xl bg-neutral-900 px-5 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:scale-[0.99]"
            >
              {btnText}
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-xl border border-neutral-200/90 bg-neutral-50/80 px-5 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 sm:max-w-[9.5rem] sm:flex-none"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
