const CART_KEY = "watchshop_cart";
const CART_EVENT = "watchshop:cart-updated";

export function getCart() {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  if (typeof sessionStorage === "undefined") return;
  try {
    const nextItems = Array.isArray(items) ? items : [];
    sessionStorage.setItem(CART_KEY, JSON.stringify(nextItems));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(CART_EVENT, {
          detail: { count: nextItems.length },
        })
      );
    }
  } catch (_) {}
}
