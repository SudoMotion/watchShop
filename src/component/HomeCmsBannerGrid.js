"use client";

import Image from "next/image";
import Link from "next/link";
import {
  resolveBannerImageUrl,
  normalizeBannerLink,
  blockBannerContextMenu,
} from "@/lib/bannerSlides";

function isVideoAsset(path) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(String(path || ""));
}

/**
 * Renders CMS banner rows (image or video) wrapped in Link using API `link` as-is.
 */
export default function HomeCmsBannerGrid({
  title,
  banners = [],
  columns = 2,
  className = "",
}) {
  if (!Array.isArray(banners) || banners.length === 0) return null;
  console.log('banners', banners);
  const effectiveColumns = banners.length === 1 ? 1 : columns;
  const gridCols =
    effectiveColumns === 1
      ? "grid-cols-1"
      : "grid-cols-1 md:grid-cols-2";

  const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;

  return (
    <div className={`max-w-7xl mx-auto my-10 px-2 ${className}`.trim()}>
      <h2 className="title mb-0 md:mb-5">{banners[0]?.title ?? title}</h2>
      <div className={`grid ${gridCols} gap-5`}>
        {banners.map((item, index) => {
          const href = normalizeBannerLink(item?.link);
          const rawPath = item?.image ?? "";
          const src = resolveBannerImageUrl(rawPath);
          const alt = String(item?.title ?? item?.description ?? "Banner").trim() || "Banner";
          const video = isVideoAsset(rawPath);

          return (
            <Link
              key={item?.id ?? index}
              href={href}
              onContextMenu={blockBannerContextMenu}
              className="block overflow-hidden rounded-lg bg-gray-50 ring-1 ring-gray-100 transition hover:opacity-95 select-none"
            >
              {video && src ? (
                <video
                  src={src}
                  className="h-auto w-full object-contain md:max-h-[28rem]"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  onContextMenu={blockBannerContextMenu}
                />
              ) : src ? (
                <Image
                  src={src}
                  alt={alt}
                  width={1200}
                  height={675}
                  className="h-auto w-full object-contain md:max-h-[28rem]"
                  placeholder="blur"
                  blurDataURL={blurSvg}
                  unoptimized
                  onContextMenu={blockBannerContextMenu}
                />
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
