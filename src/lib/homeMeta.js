import { cache } from "react";
import { getHomeMetaContents } from "@/stores/HomeAPI";

/**
 * Normalizes /api/home-page-content payloads for metadata + optional body HTML.
 */
export function normalizeHomeMetaResponse(raw) {
  if (raw == null || typeof raw !== "object") return null;
  const m = raw?.data?.data ?? raw?.data ?? raw;
  if (!m || typeof m !== "object") return null;
  if (m.success === false) return null;

  return {
    meta_title: String(m.meta_title ?? "").trim(),
    meta_description: String(m.meta_description ?? "").trim(),
    meta_keywords: String(m.meta_keywords ?? "").trim(),
    canonical_url: String(m.canonical_url ?? "").trim(),
    content: typeof m.content === "string" ? m.content : "",
    long_description: String(m.long_description ?? "").trim(),
  };
}

/** Deduped fetch for page + generateMetadata in one request. */
export const getHomePageSeo = cache(async () => {
  const raw = await getHomeMetaContents();
  return normalizeHomeMetaResponse(raw);
});
