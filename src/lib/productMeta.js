import { NEXT_PUBLIC_API_URL, SITE_URL } from "@/config";

function productImagePath(path) {
  if (!path || String(path).startsWith("http")) return path || "";
  const s = String(path);
  return s.includes("/") ? s : `uploads/product/${s}`;
}

function imgUrl(path) {
  if (!path) return "";
  return `${NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/${productImagePath(path).replace(/^\//, "")}`;
}

function pickMeta(...candidates) {
  for (const v of candidates) {
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (s.length > 0) return s;
  }
  return "";
}

/** Resolve product from getProductBySlug / similar API payloads. */
export function extractProductFromPayload(data) {
  if (!data || typeof data !== "object") return null;
  return data.product ?? data?.data?.product ?? null;
}

export function buildProductOgImage(product) {
  if (!product) return "";
  const first =
    product.product_image?.[0]?.multiimage ||
    product.product_image?.[0]?.image ||
    product.productImages?.[0]?.multiimage ||
    product.productImages?.[0]?.image ||
    product.thumb_image ||
    product.image ||
    "";
  return imgUrl(first);
}

/** Unique absolute image URLs for JSON-LD `image` array (thumb + gallery). */
export function buildProductImageUrls(product) {
  if (!product) return [];
  const seen = new Set();
  const out = [];
  const push = (path) => {
    const u = imgUrl(path);
    if (u && !seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  };
  push(product.thumb_image || product.image);
  const gallery = product.product_image || product.productImages || [];
  for (const img of gallery) {
    push(img?.multiimage || img?.image);
  }
  return out;
}

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Description for SEO / JSON-LD: CMS meta first, then plain text from HTML body.
 */
export function buildProductDescriptionForSchema(product) {
  if (!product) return "";
  const fromMeta = pickMeta(
    product.on_page_meta_description,
    product.meta_description,
    product.short_desc
  );
  if (fromMeta) return fromMeta;
  const fromHtml = stripHtml(product.description || "");
  return fromHtml.slice(0, 5000);
}

/**
 * Next.js Metadata for product detail — uses on_page_* first, then meta_* fallbacks.
 */
export function buildProductMetadata(apiData, productSlug) {
  const p = extractProductFromPayload(apiData);

  if (!p) {
    return {
      title: "Product",
      robots: { index: true, follow: true },
    };
  }

  const title = pickMeta(
    p.on_page_meta_title,
    p.meta_title,
    p.name,
    "Product"
  );

  const description = buildProductDescriptionForSchema(p);

  const keywords = pickMeta(p.on_page_meta_keywords, p.meta_keywords);

  const canonical = `${SITE_URL}/product/${encodeURIComponent(productSlug)}`;
  const ogImage = buildProductOgImage(p);

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
                alt: pickMeta(p.name, title),
                width: 1200,
                height: 630,
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
 * schema.org Product JSON-LD — aligned with Google examples; meta fields drive text.
 *
 * - name: product title (display name)
 * - description: on_page_meta_description → meta_description → short_desc → stripped description
 * - image: gallery URLs (≥1)
 * - sku: model or slug
 * - offers.url: canonical product URL (not homepage)
 * - offers.price: string BDT amount; itemCondition: NewCondition
 */
export function buildProductJsonLd(product, productSlug) {
  if (!product) return null;
  const pageUrl = `${SITE_URL}/product/${encodeURIComponent(productSlug)}`;
  let images = buildProductImageUrls(product);
  if (!images.length) {
    const fallback = buildProductOgImage(product);
    if (fallback) images = [fallback];
  }
  const description = buildProductDescriptionForSchema(product);
  const name = pickMeta(product.name, product.meta_title, product.on_page_meta_title);
  const priceNum = Number(
    product.selling_price || product.discount_price || product.price || 0
  );
  const priceString =
    priceNum > 0 ? String(Math.round(priceNum * 100) / 100) : "";

  const payload = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    ...(description ? { description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(product.model || product.slug
      ? { sku: String(product.model || product.slug) }
      : {}),
    ...(product.brand?.name
      ? { brand: { "@type": "Brand", name: product.brand.name } }
      : {}),
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "BDT",
      ...(priceString ? { price: priceString } : {}),
      availability:
        Number(product.quantity) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return payload;
}
