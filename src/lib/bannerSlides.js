import { Backend_Base_Url } from "@/config";

function encodePathSegment(segment) {
  try {
    return encodeURIComponent(decodeURIComponent(segment));
  } catch {
    return encodeURIComponent(segment);
  }
}

export function resolveBannerImageUrl(path) {
  if (!path) return "";
  const s = String(path).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const relative = s.replace(/^\//, "");
  const encodedPath = relative
    .split("/")
    .filter(Boolean)
    .map((segment) => encodePathSegment(segment))
    .join("/");
  return `${Backend_Base_Url.replace(/\/$/, "")}/${encodedPath}`;
}

/** Uses the CMS link exactly as saved (trimmed only). Empty → # — no rewriting. */
export function normalizeBannerLink(link) {
  const s = String(link ?? "").trim();
  return s || "#";
}

/**
 * Map an array of CMS banner rows (e.g. recommended_banner[]) to slider slides.
 */
export function mapBannerItemsToSlides(items) {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items
    .map((item) => {
      const imgRaw = item?.image ?? item?.banner_image ?? item?.thumb;
      const image = resolveBannerImageUrl(imgRaw) || item?.image_url || "";
      if (!image) return null;
      return {
        id: item?.id,
        image,
        title: String(item?.title ?? item?.name ?? "").trim() || "Featured",
        subtitle: String(item?.subtitle ?? item?.description ?? "").trim(),
        link: normalizeBannerLink(item?.link ?? item?.page_link),
      };
    })
    .filter(Boolean);
}

/**
 * Map /api/banner-contents to hero-style slides.
 * CMS keys (see banners_by_type): recommended_banner (secondary slider + RecomendedProducts row),
 * plus legacy fallbacks.
 */
export function mapBannerResponseToSlides(raw) {
  if (raw == null) return [];
  const payload = raw?.data ?? raw ?? {};
  const byType =
    payload?.banners_by_type ?? payload?.data?.banners_by_type ?? {};
  const list =
    byType.recommended_banner ??
    byType.secondary_slider ??
    byType.secondary_banner ??
    byType.mid_slider ??
    byType.home_secondary ??
    (Array.isArray(payload?.banners) ? payload.banners : null);

  const arr = Array.isArray(list) ? list : [];
  return mapBannerItemsToSlides(arr);
}
