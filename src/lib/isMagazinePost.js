/**
 * Blog API: only treat as magazine when explicitly flagged as 1 (not null / empty).
 */
export function isMagazinePost(post) {
  if (!post || typeof post !== "object") return false;
  const v = post.is_magazine ?? post.isMagazine;
  if (v === null || v === undefined || v === "") return false;
  if (v === 1 || v === "1") return true;
  if (typeof v === "string" && v.trim() === "1") return true;
  return false;
}
