const WISHLIST_KEY = "watchshop_wishlist";

export function getWishlist() {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function setWishlist(items) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.isArray(items) ? items : []));
  } catch (_) {}
}
