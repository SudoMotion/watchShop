const WISHLIST_KEY = "watchshop_wishlist";
const WISHLIST_EVENT = "watchshop:wishlist-updated";

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
    const nextItems = Array.isArray(items) ? items : [];
    sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(nextItems));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(WISHLIST_EVENT, {
          detail: { count: nextItems.length },
        })
      );
    }
  } catch (_) {}
}
