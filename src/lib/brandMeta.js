import { cache } from "react";
import { getProductsByBrand } from "@/stores/ProductAPI";
import { NEXT_PUBLIC_API_URL, SITE_URL } from "@/config";

function pickMeta(...candidates) {
  for (const v of candidates) {
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (s.length > 0) return s;
  }
  return "";
}

function brandAssetUrl(path) {
  if (!path) return "";
  const s = String(path).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/${s.replace(/^\//, "")}`;
}

export function extractBrandFromListingPayload(raw) {
  if (!raw || typeof raw !== "object") return null;
  return raw.brand ?? raw?.data?.brand ?? null;
}

/** Single cached request for metadata + page props (brand meta + minimal products payload). */
export const getBrandListingPayload = cache(async (brandSlug) => {
  if (!brandSlug) return null;
  return getProductsByBrand(brandSlug, { page: 1, limit: 1 });
});

/**
 * Next.js metadata from API brand row: meta_title, meta_description, meta_keywords.
 */
export function buildBrandMetadata(listingPayload, brandSlug) {
  const brand = extractBrandFromListingPayload(listingPayload);
  const canonical = `${SITE_URL}/brand/${encodeURIComponent(brandSlug)}`;

  if (!brand) {
    return {
      title: "Brand",
      alternates: { canonical },
      robots: { index: true, follow: true },
    };
  }

  const title = pickMeta(brand.meta_title, brand.name, brandSlug);
  const description = pickMeta(brand.meta_description);
  const keywords = pickMeta(brand.meta_keywords);
  const ogImage = brandAssetUrl(brand.banner_img || brand.image || "");

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
                alt: pickMeta(brand.name, title),
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

/**
 * CollectionPage + Brand — uses same meta text as <head>.
 */
export function buildBrandJsonLd(brand, brandSlug) {
  if (!brand) return null;
  const pageUrl = `${SITE_URL}/brand/${encodeURIComponent(brandSlug)}`;
  const img = brandAssetUrl(brand.banner_img || brand.image || "");
  const pageName = pickMeta(brand.meta_title, brand.name, brandSlug);
  const description = pickMeta(brand.meta_description);

  return {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    name: pageName,
    ...(description ? { description } : {}),
    url: pageUrl,
    ...(img ? { image: [img] } : {}),
    mainEntity: {
      "@type": "Brand",
      name: pickMeta(brand.name, brandSlug),
      ...(img ? { logo: img } : {}),
    },
  };
}
