import { cache } from "react";
import { getProductsByCategory } from "@/stores/ProductAPI";
import { NEXT_PUBLIC_API_URL, SITE_URL } from "@/config";

function pickMeta(...candidates) {
  for (const v of candidates) {
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (s.length > 0) return s;
  }
  return "";
}

function categoryAssetUrl(path) {
  if (!path) return "";
  const s = String(path).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/${s.replace(/^\//, "")}`;
}

/** Single cached request for category listing (minimal page) — used for metadata + page props. */
export const getCategoryListingPayload = cache(async (categorySlug, categoryId = "") => {
  if (!categorySlug) return null;
  const params = { page: 1, limit: 1 };
  const id = categoryId != null && String(categoryId).trim() !== "" ? String(categoryId).trim() : "";
  if (id) params.category_id = id;
  return getProductsByCategory(categorySlug, params);
});

export function extractCategoryFromListingPayload(raw) {
  if (!raw || typeof raw !== "object") return null;
  return raw.cat ?? raw?.data?.cat ?? null;
}

export function buildCategoryMetadata(listingPayload, categorySlug, categoryId = "") {
  const cat = extractCategoryFromListingPayload(listingPayload);
  const id = categoryId != null && String(categoryId).trim() !== "" ? String(categoryId).trim() : "";
  const canonical =
    id !== ""
      ? `${SITE_URL}/category/${encodeURIComponent(categorySlug)}?category_id=${encodeURIComponent(id)}`
      : `${SITE_URL}/category/${encodeURIComponent(categorySlug)}`;

  if (!cat) {
    return {
      title: "Category",
      alternates: { canonical },
      robots: { index: true, follow: true },
    };
  }

  const title = pickMeta(cat.meta_title, cat.name, categorySlug);
  const description = pickMeta(cat.meta_description);
  const keywords = pickMeta(cat.meta_keywords);
  const ogImage = categoryAssetUrl(cat.image || "");

  return {
    title: title ? { absolute: title } : undefined,
    description: description || undefined,
    keywords: keywords || undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description: description || undefined,
      url: canonical,
      type: "website",
      siteName: "Watch Shop BD",
      locale: "en_BD",
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                alt: pickMeta(cat.name, title),
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description: description || undefined,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: { index: true, follow: true },
  };
}
